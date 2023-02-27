/**
 * Device sidebar menu for monitor pages (DAQ, calibration) -> for device integrated software
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import latinize from "latinize";
import Util from "../../../core/Util";
import Button from "../../../components/controllers/Button";
import {
  FreeTextBox,
  TextBoxBig,
  NumberBox,
} from "../../../components/controllers/TextBoxes";
import { FileIn } from "../../../components/controllers/FileUploads";
import Switch from "../../../components/controllers/Switch";
import SelectBox from "../../../components/controllers/SelectBox";
import CircleIndicator from "../../../components/indicators/CircleIndicator";
import { GraphRound } from "../../../components/graphics/Graphs";
import { Panel } from "../../../components/graphics/Panels";
import {
  formatDate,
  validateNumInput,
  getDeltaDate,
  sortRuns,
  resizeText,
  treatNotes,
} from "../../../core/Helpers";
import Loader from "../../../components/indicators/Loader";
import { default as configs } from "../../../shared/configs";

const DEF_INPUT_CALIB = {
  posXchannels: [],
  posYchannels: [],
  intChannels: [],
  rngChannels: [],
};

class Sidebar {
  constructor(
    detConfig,
    modal,
    notifier,
    webSock,
    pageGraphs,
    profileGraphs,
    inputCalib = DEF_INPUT_CALIB
  ) {
    this.ntf = notifier;
    this.detConfig = detConfig;
    this.devName = detConfig.devName;
    this.hasPos = detConfig.hasPos;
    this.hasRng = detConfig.hasRng;
    this.hasInt = detConfig.hasInt;
    this.hasHV = detConfig.hasHV;
    this.dataBaseURL = "http://" + detConfig.ws_address + detConfig.data_path;
    this.calibBaseURL = "http://" + detConfig.ws_address + detConfig.calib_path;
    this.controlUnitStatus = 99;
    this.HVStatus = 99;
    this.modalOpen = false;
    this.sensors = {
      T1: 0,
      T2: 0,
      P1: 0,
      P2: 0,
    };
    this.calibSensors = {
      kT1: 1,
      kT2: 1,
      kP1: 1,
      kP2: 1,
      cT1: 0,
      cT2: 0,
      cP1: 0,
      cP2: 0,
    };
    this.daqStatus = 0; //0 -> idle - 1 -> daqRunning - 2 -> streamingRunning - 3 -> aQuracyDaqRunning - 4 -> backgroundDaqRunning
    this.settings = {
      sampling_rate: "",
      sampling_mode: "",
      first_channel: "",
      use_pos_calib: "",
      pos_calib_filename: "",
      use_rng_calib: "",
      rng_calib_filename: "",
      use_bkg: "",
      bkg_filename: "",
      enable_range: this.hasRng.toString(),
      enable_profiles: this.hasPos.toString(),
      datetime: "",
    };
    this.bkg_settings = {
      sampling_rate: "1000",
      sampling_mode: "0",
      first_channel: "1",
      use_pos_calib: "false",
      pos_calib_filename: "",
      use_rng_calib: "false",
      rng_calib_filename: "",
      use_bkg: "",
      bkg_filename: "",
      enable_range: this.hasRng.toString(),
      enable_profiles: this.hasPos.toString(),
      datetime: "",
    };
    this.components = {
      status: {},
      settings: {},
      calibration: {},
      background: {},
      acquisition: {},
      logbook: {},
      managePosCalib: {},
      manageRngCalib: {},
    };
    this.configs_array = [];
    this.graph_array = pageGraphs;
    this.profile_graph_array = profileGraphs;
    this.calibFields = inputCalib;
    this.panels = { shared: {}, daq: {}, posCalib: {}, rngCalib: {} };
    this.modal = modal; //reference to the main page shared modal
    this.ws = webSock; //reference to the main page socket
    this.errorList = [];
    this.filesList = {
      posDataFiles: [],
      intDataFiles: [],
      rngDataFiles: [],
      posCalibFiles: [],
      rngCalibFiles: [],
      backgroundFiles: [],
    }; //stored data, calibration, and background files
    this.calib_param = {
      filename: "",
      X_calib: [],
      Y_calib: [],
      INT_calib: [],
      filename_Z: "",
      Z_calib: [],
    };
  }

  initConfig() {
    let th = this;
    if (this.ws.isConnected()) {
      //if WS connected, proceed with initial configuration
      this.ws.send("updateConfig", "init");
    } else {
      //if WS not yet connected, timeout before initial configuration to give time for connecting
      setTimeout(function () {
        if (th.ws.isConnected()) {
          th.ws.send("updateConfig", "init");
        } else {
          //alert if no connection and circular indicator set to 99 state
          th.ntf.conn_error();
          th.components.status.hvStatus_ind.update(99);
          th.components.status.cuStatus_ind.update(99);
        }
      }, 1100);
    }
  }

  build() {
    this.createIndicators();
    this.createControls();
    this.createButtons();
    this.fillPanels();
  }

  createIndicators() {
    let th = this;
    //------------------------------------------------STATUS INDICATORS
    //Control unit status indicator
    let circ_device = new CircleIndicator("device_status", "Control Unit");
    circ_device.handlerEvent("click", function () {
      if (th.ws.isConnected()) {
        if (circ_device.getState() == 0 && th.errorList.length == 0) {
          th.ntf.notify("Everything is fine!", "s");
          return;
        }
        if (circ_device.getState() == 99) {
          th.ntf.notify("No connection to the device", "e");
          return;
        }
        th.fillErrorModal();
        th.toggleModal(th.modal);
      } else {
        th.ntf.conn_error();
      }
    });
    this.components.status.cuStatus_ind = circ_device;
    //HV control indicator
    if (this.hasHV) {
      let circ_hv = new CircleIndicator("hv_status", "HV");
      circ_hv.handlerEvent("updateHV", function (x, state) {
        circ_hv.updateHV(state);
      });
      circ_hv.handlerEvent("click", function () {
        if (th.ws.isConnected()) {
          switch (circ_hv.getState()) {
            case 0:
              th.ntf.notify("HV OFF", "e");
              break;
            case 1:
              th.ntf.notify("HV ON and in range", "s");
              break;
            case 2:
              th.ntf.notify("HV out of range", "e");
              break;
            case 99:
              th.ntf.notify("No connection to the device", "e");
              break;
            default:
              th.ntf.notify("Internal anomaly. Call the manufacturer.", "e");
              break;
          }
        } else {
          th.ntf.conn_error();
        }
      });
      this.components.status.hvStatus_ind = circ_hv;
    }
    //------------------------------------------------MEMORY INDICATOR
    let memory_ind = new GraphRound("memory_status", "Memory Usage");
    this.components.status.memory_ind = memory_ind;
    //-----------------------------------------DAQ GIF LOADER
    let loader = new Loader("daq_loader");
    this.components.acquisition.loader = loader;
    //----------------------------------------------CALIBRATION PAGES
    //----------------------------------------------UPLOADED POS CALIB FILE
    if (this.hasPos) {
      let uploaded_posCalib = new FreeTextBox("uploaded_posCalib", "File");
      this.components.managePosCalib.uploaded_file = uploaded_posCalib;
    }
    //----------------------------------------------UPLOADED RNG CALIB FILE
    if (this.hasRng) {
      let uploaded_rngCalib = new FreeTextBox("uploaded_rngCalib", "File");
      this.components.manageRngCalib.uploaded_file = uploaded_rngCalib;
    }
  }

  createControls() {
    let th = this;
    //------------------------------------------------DAQ SETTINGS
    //******Sampling mode
    let sampl_mode = new SelectBox("sampling_mode", "S. Mode");
    sampl_mode.handlerEvent("updateSM", function (ref, data) {
      sampl_mode.updateSM(data);
    });
    this.components.settings.samplMode = sampl_mode;
    this.configs_array.push(sampl_mode);
    //******Sampling rate
    let sampl_rate = new SelectBox("sampling_rate", "S. Rate [ms]");
    sampl_rate.handlerEvent("change", function () {
      th.settings.sampling_rate = $(sampl_rate.getId(true)).val();
    });
    sampl_rate.handlerEvent("updateSR", function (ref, data) {
      sampl_rate.updateSR(data);
    });
    this.components.settings.samplRate = sampl_rate;
    this.configs_array.push(sampl_rate);
    this.components.settings.samplMode.handlerEvent("change", function () {
      th.settings.sampling_mode = $(
        th.components.settings.samplMode.getId(true)
      ).val();
      if ($(th.components.settings.samplMode.getId(true)).val() != "0") {
        th.components.settings.samplRate.disable();
      } else {
        th.components.settings.samplRate.enable();
      }
    });
    if (this.devName == "QUBENext" || this.devName == "QEye") {
      //******First channel selection - QUBENext and QEye only
      let firstCh = new SelectBox("first_channel", "1st Channel");
      firstCh.handlerEvent("change", function () {
        th.settings.first_channel = $(firstCh.getId(true)).val();
      });
      this.components.settings.firstCh = firstCh;
      this.configs_array.push(firstCh);
    }
    //------------------CALIBRATION CONTROLS
    if (this.hasPos) {
      let sel_text = this.hasRng ? "Pos calib file" : "Calib file";
      let switch_text = this.hasRng
        ? "Apply pos calibration"
        : "Apply calibration";
      //POS CALIBRATION SELECTION box and switch
      let select_pos_calib = new SelectBox("select_pos_calibration", sel_text);
      select_pos_calib.handlerEvent("change", function () {
        th.settings.pos_calib_filename = $(select_pos_calib.getId(true)).val();
      });
      let pos_calib_switch = new Switch("pos_calib_switch", switch_text);
      pos_calib_switch.handlerEvent("click", function () {
        if (th.daqStatus == 1 || th.daqStatus == 2) {
          th.ntf.notify("Data streaming or DAQ ongoing. Stop before!", "w");
          return;
        } else {
          if (pos_calib_switch.getState()) {
            pos_calib_switch.switch_state();
            // use_calib = pos_calib_switch.getState();
            th.settings.use_pos_calib = pos_calib_switch.getState().toString();
          } else if ($(select_pos_calib.getId(true)).val()) {
            pos_calib_switch.switch_state();
            // use_calib = calib_switch.getState();
            th.settings.use_pos_calib = pos_calib_switch.getState().toString();
          } else {
            th.ntf.notify("No calibration file selected", "w");
          }
        }
      });
      this.components.calibration.select_pos_calib = select_pos_calib;
      this.components.calibration.switch_pos_calib = pos_calib_switch;
    }
    if (this.hasRng) {
      //RNG CALIBRATION SELECTION box and switch
      let select_rng_calib = new SelectBox(
        "select_rng_calibration",
        "Z calib file"
      );
      select_rng_calib.handlerEvent("change", function () {
        // calib_file = $(select_mlic_calib.getId(true)).val();
        if ($(select_rng_calib.getId(true)).val()) {
          th.settings.rng_calib_filename = $(
            select_rng_calib.getId(true)
          ).val();
        } else {
          th.settings.rng_calib_filename = "";
        }
      });
      let rng_calib_switch = new Switch(
        "rng_calib_switch",
        "Apply Z calibration"
      );
      rng_calib_switch.handlerEvent("click", function () {
        if (th.daqStatus == 1 || th.daqStatus == 2) {
          th.ntf.notify("Data streaming or DAQ ongoing. Stop before!", "w");
          return;
        } else {
          if (rng_calib_switch.getState()) {
            rng_calib_switch.switch_state();
            // use_mlic_calib = rng_calib_switch.getState();
            th.settings.use_rng_calib = rng_calib_switch.getState().toString();
          } else if ($(select_rng_calib.getId(true)).val()) {
            rng_calib_switch.switch_state();
            // use_mlic_calib = rng_calib_switch.getState();
            th.settings.use_rng_calib = rng_calib_switch.getState().toString();
          } else {
            th.ntf.notify("No calibration file selected", "w");
          }
        }
      });
      this.components.calibration.select_rng_calib = select_rng_calib;
      this.components.calibration.switch_rng_calib = rng_calib_switch;
    }
    //------------------BACKGROUND CONTROLS
    let select_bkg = new SelectBox("select_background", "Bkg file");
    select_bkg.handlerEvent("change", function () {
      if ($(select_bkg.getId(true)).val()) {
        th.settings.bkg_filename = $(select_bkg.getId(true)).val();
      } else {
        th.settings.bkg_filename = "";
      }
    });
    this.components.background.select_bkg = select_bkg;
    //BACKGROUND ACTIVATION switch
    let bkg_switch = new Switch("bkg_switch", "Subtract background");
    bkg_switch.handlerEvent("click", function () {
      if (th.daqStatus != 0) {
        th.ntf.notify("Data streaming or DAQ ongoing. Stop before!", "w");
        return;
      } else {
        if (bkg_switch.getState()) {
          bkg_switch.switch_state();
          // use_bkg = bkg_switch.getState();
          th.settings.use_bkg = bkg_switch.getState().toString();
        } else if ($(select_bkg.getId(true)).val()) {
          bkg_switch.switch_state();
          // use_bkg = bkg_switch.getState();
          th.settings.use_bkg = bkg_switch.getState().toString();
        } else {
          th.ntf.notify("No background source selected", "w");
        }
      }
    });
    this.components.background.bkg_switch = bkg_switch;
    //------------------------------------MODULE SWITCHES
    if (this.hasPos && this.hasRng) {
      let switch_profiles = new Switch("switch_profiles", "Enable pos");
      let switch_range = new Switch("switch_range", "Enable rng");
      switch_profiles.handlerEvent("click", function () {
        if (th.daqStatus == 1 || th.daqStatus == 2) {
          th.ntf.notify("Data streaming or DAQ ongoing. Stop before!");
          return;
        } else {
          switch_profiles.switch_state();
          th.settings.enable_profiles = switch_profiles.getState().toString();
        }
      });
      switch_range.handlerEvent("click", function () {
        if (th.daqStatus == 1 || th.daqStatus == 2) {
          th.ntf.notify("Data streaming or DAQ ongoing. Stop before!", "w");
          return;
        } else {
          switch_range.switch_state();
          th.settings.enable_range = switch_range.getState().toString();
        }
      });
      this.components.settings.switchPos = switch_profiles;
      this.components.settings.switchRng = switch_range;
    }
    //------------------------------------CALIBRATION PAGES CONTROLS
    if (this.hasPos) {
      let upload_posCalib = new FileIn("upload_posCalib", "Upload file");
      this.components.managePosCalib.form_upload_file = upload_posCalib;
    }
    if (this.hasRng) {
      let upload_rngCalib = new FileIn("upload_rngCalib", "Upload file");
      this.components.manageRngCalib.form_upload_file = upload_rngCalib;
    }
  }

  createButtons() {
    let th = this;
    //--------------------------------------CHECK SENSORS BUTTON-------------------------------------//
    let btn_check_sensors = new Button("btn_check_sensors", "T/P Sensors", 1);
    btn_check_sensors.addClickAction(function () {
      if (th.ws.isConnected()) {
        th.fillSensorsModal();
        th.toggleModal(th.modal);
      } else {
        th.ntf.conn_error();
      }
    });
    this.components.status.btnCheckSensors = btn_check_sensors;
    //--------------------------------------RESET ALARMS BUTTON--------------------------------------//
    let btn_reset_alarms = new Button("btn_reset_alarms", "Clear Alarms", 1);
    btn_reset_alarms.addClickAction(function () {
      if (th.ws.isConnected()) {
        th.ws.send("reset_alarms");
        // Util.trig("device_status", "update", 0);
        th.setControlUnitStatus(0);
        th.controlUnitStatus = 0;
        th.errorList = [];
      } else {
        th.ntf.conn_error();
      }
    });
    this.components.status.btnResetAlarms = btn_reset_alarms;
    //--------------------------------------RESET COUNTERS BUTTON--------------------------------------//
    let btn_reset_counters = new Button(
      "btn_reset_counters",
      "Reset Counters",
      1
    );
    btn_reset_counters.addClickAction(function () {
      if (th.ws.isConnected()) {
        if (th.daqStatus == 1 || th.daqStatus == 4) {
          th.ntf.notify(
            "DAQ ongoing. Stop data streaming before performing a counter reset!",
            "w"
          );
          return;
        }
        if (th.daqStatus == 2) {
          th.ws.send("reset_counters", "restart");
          return;
        }
        th.ws.send("reset_counters");
      } else {
        th.ntf.conn_error();
      }
    });
    this.components.settings.btnResetCounters = btn_reset_counters;
    //--------------------------------------SELECT MEASURE BUTTONS - LOGBOOK--------------------------------------//
    if (this.hasPos) {
      let meas_text =
        this.hasInt || this.hasRng ? "Select pos measure" : "Select measure";
      let btn_select_pos_measure = new Button(
        "btn_select_measure",
        meas_text,
        1
      );
      btn_select_pos_measure.addClickAction(function () {
        // console.log("Opening data modal");
        // th.fillLogbookDataModal("posData");
        // th.toggleModal(th.modal);
        if (th.ws.isConnected()) {
          if (th.daqStatus != 0) {
            th.ntf.notify("DAQ ongoing. Stop data streaming before!", "w");
            return;
          } else {
            th.ntf.notify("Retrieving file list... Please wait", "i", 1000);
            th.ws.send_to_logger("log_scan_profile_files");
          }
        } else {
          th.ntf.conn_error();
        }
      });
      this.components.logbook.btnSelectPosFile = btn_select_pos_measure;
    }
    if (this.hasRng) {
      let meas_z_text =
        this.hasInt || this.hasPos ? "Select rng measure" : "Select measure";
      let btn_select_rng_measure = new Button(
        "btn_select_range_measure",
        meas_z_text,
        1
      );
      btn_select_rng_measure.addClickAction(function () {
        if (th.ws.isConnected()) {
          if (th.daqStatus != 0) {
            th.ntf.notify("DAQ ongoing. Stop data streaming before!", "w");
            return;
          } else {
            th.ws.send_to_logger("log_scan_range_files");
          }
        } else {
          th.ntf.conn_error();
        }
      });
      this.components.logbook.btnSelectRngFile = btn_select_rng_measure;
    }
    if (this.hasInt) {
      let meas_int_text =
        this.hasRng || this.hasPos ? "Select int measure" : "Select measure";
      let btn_select_int_measure = new Button(
        "btn_select_int_measure",
        meas_int_text,
        1
      );
      btn_select_int_measure.addClickAction(function () {
        if (th.ws.isConnected()) {
          if (th.daqStatus != 0) {
            th.ntf.notify("DAQ ongoing. Stop data streaming before!", "w");
            return;
          } else {
            th.ntf.notify("Retrieving file list... Please wait", "i", 1000);
            th.ws.send_to_logger("log_scan_int_files");
          }
        } else {
          th.ntf.conn_error();
        }
      });
      this.components.logbook.btnSelectIntFile = btn_select_int_measure;
    }
    //--------------------------------------ACQUISITION BUTTON--------------------------------------//
    let btn_acq = new Button(
      "btn_acq",
      '<span id="measurePlaySpan" class="mdi mdi-play"></span>',
      2
    );
    btn_acq.addClickAction(function () {
      th.toggleDaq();
    });
    this.components.acquisition.btnDAQ = btn_acq;
    //--------------------------------------DATA STREAM BUTTON--------------------------------------//
    let btn_data_stream = new Button("btn_data_stream", "Start data stream", 1);
    btn_data_stream.addClickAction(function () {
      th.toggleDataStream();
    });
    this.components.acquisition.btnDataStream = btn_data_stream;
    //--------------------------------------BACKGROUND ACQUISITION BUTTON--------------------------------------//
    let btn_bkg_acq = new Button("btn_bkg_acq", "Record background", 1);
    btn_bkg_acq.addClickAction(function () {
      th.recordBackground();
    });
    this.components.background.btnBkgDaq = btn_bkg_acq;
    //-------------------------------------BACKGROUND LOGBOOK BUTTON------------------------------------------//
    let btn_bkg_logbook = new Button("btn_bkg_logbook", "Background files", 1);
    btn_bkg_logbook.addClickAction(function () {
      if (th.ws.isConnected()) {
        if (th.daqStatus != 0) {
          th.ntf.notify("DAQ ongoing. Stop data streaming before!", "w");
          return;
        } else {
          th.ws.send_to_logger("log_scan_background_files");
        }
      } else {
        console.log("Device not connected!");
        th.ntf.conn_error();
      }
    });
    this.components.background.btnBkgLogbook = btn_bkg_logbook;
    //-------------------------------------------CALIBRATION PAGES BUTTONS------------------------------------//
    if (this.hasPos) {
      //-------------------------------------------SELECT CALIB BUTTON - to select a calibration file (the reply from the device will open a modal)-------------------------------------//
      let select_posCalib = new Button(
        "select_posCalib",
        "Select Calibration File",
        1
      );
      select_posCalib.addClickAction(function () {
        if (th.ws.isConnected()) {
          th.ws.send_to_logger("log_scan_profile_calib_files");
        } else {
          console.log("Device not connected!");
          th.ntf.conn_error();
        }
      });
      this.components.managePosCalib.select_posCalib = select_posCalib;
      //-------------------------------------------RESET BUTTON - to reset all calib fields to 1.0-------------------------------------//
      let reset_posCalib = new Button(
        "reset_posCalib",
        "Reset Calibration Factors",
        1
      );
      reset_posCalib.addClickAction(function () {
        th.ntf.confirm(
          "Reset?",
          "Are you sure to reset all the calibration factors to 1?",
          function () {
            th.calibFields.posXchannels.map((x) => x.update(1));
            th.calibFields.posYchannels.map((y) => y.update(1));
            th.calibFields.intChannels.map((int) => int.update(1));
            th.components.managePosCalib.uploaded_file.update("");
            th.components.managePosCalib.form_upload_file.reset();
          },
          function () {
            th.ntf.notify("Aborted", "e");
            return;
          }
        );
      });
      this.components.managePosCalib.reset_posCalib = reset_posCalib;
      //-------------------------------------------SAVE CALIB BUTTON - to save to text file the calibration factors on screen-------------------------------------/ /
      let save_posCalib = new Button(
        "save_posCalib",
        "Save Calibration to File",
        1
      );
      save_posCalib.addClickAction(function () {
        if (th.ws.isConnected()) {
          th.ws.send_to_logger("log_scan_profile_calib_files", "hidden");
          th.fillSaveCalibrationModal("pos");
          th.toggleModal(th.modal);
        } else {
          console.log("Device not connected!");
          th.ntf.conn_error();
        }
      });
      this.components.managePosCalib.save_posCalib = save_posCalib;
    }
    if (this.hasRng) {
      //-------------------------------------------SELECT CALIB BUTTON - to select a calibration file (the reply from the device will open a modal)-------------------------------------//
      let select_rngCalib = new Button(
        "select_rngCalib",
        "Select Calibration File",
        1
      );
      select_rngCalib.addClickAction(function () {
        if (th.ws.isConnected()) {
          th.ws.send_to_logger("log_scan_range_calib_files");
        } else {
          console.log("Device not connected!");
          th.ntf.conn_error();
        }
      });
      this.components.manageRngCalib.select_rngCalib = select_rngCalib;
      //-------------------------------------------RESET BUTTON - to reset all calib fields to 1.0-------------------------------------//
      let reset_rngCalib = new Button(
        "reset_rngCalib",
        "Reset Calibration Factors",
        1
      );
      reset_rngCalib.addClickAction(function () {
        th.ntf.confirm(
          "Reset?",
          "Are you sure to reset all the calibration factors to 1?",
          function () {
            th.calibFields.rngChannels.map((x) => x.update(1));
            th.components.manageRngCalib.uploaded_file.update("");
            th.components.manageRngCalib.form_upload_file.reset();
          },
          function () {
            th.ntf.notify("Aborted", "e");
            return;
          }
        );
      });
      this.components.manageRngCalib.reset_rngCalib = reset_rngCalib;
      //-------------------------------------------SAVE CALIB BUTTON - to save to text file the calibration factors on screen-------------------------------------/ /
      let save_rngCalib = new Button(
        "save_rngCalib",
        "Save Calibration to File",
        1
      );
      save_rngCalib.addClickAction(function () {
        if (th.ws.isConnected()) {
          th.ws.send_to_logger("log_scan_range_calib_files", "hidden");
          th.fillSaveCalibrationModal("rng");
          th.toggleModal(th.modal);
        } else {
          console.log("Device not connected!");
          th.ntf.conn_error();
        }
      });
      this.components.manageRngCalib.save_rngCalib = save_rngCalib;
    }
  }

  fillPanels() {
    let th = this;
    /*
        ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
        //------------------------------------------ Panels setup ------------------------------------------//
        ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
        */
    //--------------------------------------STATUS PANEL--------------------------------------//
    let pan_status = new Panel("panel_status", "Device status");
    this.panels.shared.pan_status = pan_status;
    Object.values(this.components.status).forEach((val) => {
      th.panels.shared.pan_status.addComponent(val);
    });
    //--------------------------------------DAQ SETUP PANEL--------------------------------------//
    let pan_setup = new Panel("panel_setup", "Settings");
    this.panels.daq.pan_setup = pan_setup;
    Object.values(this.components.settings).forEach((val) => {
      th.panels.daq.pan_setup.addComponent(val);
    });
    //--------------------------------------CALIBRATION SELECTION PANEL--------------------------------------//
    let pan_calib = new Panel("panel_calibration", "Calibration");
    this.panels.daq.pan_calib = pan_calib;
    Object.values(this.components.calibration).forEach((val) => {
      th.panels.daq.pan_calib.addComponent(val);
    });
    //---------------------------------------BACKGROUND PANEL--------------------------------------//
    let pan_bkg = new Panel("panel_background", "Background");
    this.panels.daq.pan_bkg = pan_bkg;
    Object.values(this.components.background).forEach((val) => {
      th.panels.daq.pan_bkg.addComponent(val);
    });
    //--------------------------------------DAQ COMMAND PANEL--------------------------------------//
    let pan_reg = new Panel("panel_reg", "Acquisition");
    this.panels.daq.pan_reg = pan_reg;
    Object.values(this.components.acquisition).forEach((val) => {
      th.panels.daq.pan_reg.addComponent(val);
    });
    //--------------------------------------LOGBOOK PANEL--------------------------------------//
    let pan_logbook = new Panel("panel_logbook", "Logbook");
    this.panels.daq.pan_logbook = pan_logbook;
    Object.values(this.components.logbook).forEach((val) => {
      th.panels.daq.pan_logbook.addComponent(val);
    });

    //CALIBRATION PAGE(S)
    if (this.hasPos) {
      //--------------------------------------POSITION CALIBRATION MANAGER PANEL
      let pan_managePosCalib = new Panel(
        "panel_manage_posCalibration",
        "Calibration"
      );
      this.panels.posCalib.pan_managePosCalib = pan_managePosCalib;
      Object.values(this.components.managePosCalib).forEach((val) => {
        th.panels.posCalib.pan_managePosCalib.addComponent(val);
      });
    }
    if (this.hasRng) {
      //--------------------------------------RANGE CALIBRATION MANAGER PANEL
      let pan_manageRngCalib = new Panel(
        "panel_manage_rngCalibration",
        "Calibration"
      );
      this.panels.rngCalib.pan_manageRngCalib = pan_manageRngCalib;
      Object.values(this.components.manageRngCalib).forEach((val) => {
        th.panels.rngCalib.pan_manageRngCalib.addComponent(val);
      });
    }
  }

  fillErrorModal() {
    let th = this;
    this.modal.setTitle("Internal Errors / Warnings");
    this.modal.setBody(
      $("<table>", { class: "table" })
        .append(
          $("<thead>").append(
            $("<tr>")
              .append($("<th>", { scope: "col", html: "Timestamp" }))
              .append($("<th>", { scope: "col", html: "Message" }))
          )
        )
        .append($("<tbody>", { id: "errorList" }))
        .append(
          "<p>Click the CLEAR ALARMS button to reset errors and warnings. If the problem is not solved, contact the manufacturer.</p>"
        )
    );
    this.errorList.forEach(function (error, index) {
      $("#errorList").append(
        $("<tr>", { class: error.type == 0 ? "table-warning" : "table-danger" })
          .append($("<td>", { html: error.time.toLocaleString() }))
          .append($("<td>", { html: error.message }))
      );
    });
    this.modal.addButton("btn_close", "secondary", "Close", true, function () {
      th.toggleModal(th.modal);
    });
  }

  fillDAQModal() {
    let th = this;
    //--------------------------------SAVE/DISCARD MODAL--------------------------------//
    this.modal.setTitle("Save / Discard Run");
    this.modal.setBody(
      '<div class="input-group">\n' +
        '  <span class="input-group-text">Notes</span>\n' +
        '  <textarea id="notes" class="form-control" aria-label="With textarea"></textarea>\n' +
        "</div>"
    );
    //Delete button
    this.modal.addButton("btn_delete", "danger", "Discard", false, function () {
      th.ws.send_to_logger("discard_all_files");
      th.toggleModal(th.modal);
    });
    //Save button
    this.modal.addButton("btn_save", "success", "Save", false, function () {
      let get_html = $("#notes").val();
      let error_string = "";
      th.errorList.forEach(function (error, index) {
        error_string = error_string.concat(error.time.toLocaleString() + "  ");
        if (error.type == "0") {
          error_string = error_string.concat("WARNING: ");
        }
        if (error.type == "1") {
          error_string = error_string.concat("ERROR: ");
        }
        error_string = error_string.concat(error.message + "\n");
      });
      let notes_cluster = {
        notes: get_html,
        errors: error_string,
      };
      th.ws.send_to_logger("log_save_notes", JSON.stringify(notes_cluster));
      th.toggleModal(th.modal);
    });
  }

  fillSensorsModal() {
    let th = this;
    let T1field = new NumberBox(
      "T1_field",
      "T1",
      th.calibTPsensor(th.sensors.T1, th.calibSensors.kT1, th.calibSensors.cT1)
    );
    let T2field = new NumberBox(
      "T2_field",
      "T2",
      th.calibTPsensor(th.sensors.T2, th.calibSensors.kT2, th.calibSensors.cT2)
    );
    let P1field = new NumberBox(
      "P1_field",
      "P1",
      th.calibTPsensor(th.sensors.P1, th.calibSensors.kP1, th.calibSensors.cP1)
    );
    let P2field = new NumberBox(
      "P2_field",
      "P2",
      th.calibTPsensor(th.sensors.P2, th.calibSensors.kP2, th.calibSensors.cP2)
    );
    let kT1field = new NumberBox("kT1_field", "k(T1)", th.calibSensors.kT1);
    let kT2field = new NumberBox("kT2_field", "k(T2)", th.calibSensors.kT2);
    let kP1field = new NumberBox("kP1_field", "k(P1)", th.calibSensors.kP1);
    let kP2field = new NumberBox("kP2_field", "k(P2)", th.calibSensors.kP2);
    let cT1field = new NumberBox(
      "cT1_field",
      "offset(T1)",
      th.calibSensors.cT1
    );
    let cT2field = new NumberBox(
      "cT2_field",
      "offset(T2)",
      th.calibSensors.cT2
    );
    let cP1field = new NumberBox(
      "cP1_field",
      "offset(P1)",
      th.calibSensors.cT1
    );
    let cP2field = new NumberBox(
      "cP2_field",
      "offset(P2)",
      th.calibSensors.cP2
    );
    kT1field.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(kT1field.getId(true)))
        ? validateNumInput(kT1field.getId(true))
        : 1;
      kT1field.update(val);
      th.calibSensors.kT1 = kT1field.getValue();
      T1field.update(
        th.calibTPsensor(
          th.sensors.T1,
          th.calibSensors.kT1,
          th.calibSensors.cT1
        )
      );
    });
    cT1field.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(cT1field.getId(true)))
        ? validateNumInput(cT1field.getId(true))
        : 0;
      cT1field.update(val);
      th.calibSensors.cT1 = cT1field.getValue();
      T1field.update(
        th.calibTPsensor(
          th.sensors.T1,
          th.calibSensors.kT1,
          th.calibSensors.cT1
        )
      );
    });
    kT2field.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(kT2field.getId(true)))
        ? validateNumInput(kT2field.getId(true))
        : 1;
      kT2field.update(val);
      th.calibSensors.kT2 = kT2field.getValue();
      T2field.update(
        th.calibTPsensor(
          th.sensors.T2,
          th.calibSensors.kT2,
          th.calibSensors.cT2
        )
      );
    });
    cT2field.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(cT2field.getId(true)))
        ? validateNumInput(cT2field.getId(true))
        : 0;
      cT2field.update(val);
      th.calibSensors.cT2 = cT2field.getValue();
      T2field.update(
        th.calibTPsensor(
          th.sensors.T2,
          th.calibSensors.kT2,
          th.calibSensors.cT2
        )
      );
    });
    kP1field.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(kP1field.getId(true)))
        ? validateNumInput(kP1field.getId(true))
        : 1;
      kP1field.update(val);
      th.calibSensors.kP1 = kP1field.getValue();
      P1field.update(
        th.calibTPsensor(
          th.sensors.P1,
          th.calibSensors.kP1,
          th.calibSensors.cP1
        )
      );
    });
    cP1field.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(cP1field.getId(true)))
        ? validateNumInput(cP1field.getId(true))
        : 0;
      cP1field.update(val);
      th.calibSensors.cP1 = cP1field.getValue();
      P1field.update(
        th.calibTPsensor(
          th.sensors.P1,
          th.calibSensors.kP1,
          th.calibSensors.cP1
        )
      );
    });
    kP2field.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(kP2field.getId(true)))
        ? validateNumInput(kP2field.getId(true))
        : 1;
      kP2field.update(val);
      th.calibSensors.kP2 = kP2field.getValue();
      P2field.update(
        th.calibTPsensor(
          th.sensors.P2,
          th.calibSensors.kP2,
          th.calibSensors.cP2
        )
      );
    });
    cP2field.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(cP2field.getId(true)))
        ? validateNumInput(cP2field.getId(true))
        : 0;
      cP2field.update(val);
      th.calibSensors.cP2 = cP2field.getValue();
      P2field.update(
        th.calibTPsensor(
          th.sensors.P2,
          th.calibSensors.kP2,
          th.calibSensors.cP2
        )
      );
    });
    //--------------------------------SAVE/DISCARD MODAL--------------------------------//
    this.modal.setTitle("T/P sensors");
    this.modal.setBody(
      $("<div>", { class: "row", style: "padding-top: 20px;" })
        .append(
          $("<div>", {
            id: "spaceCalib",
            class: "align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12",
          }).append("<b> Check the calibration formulas on the user manual</b>")
        )
        .append(
          $("<div>", { class: "row", style: "padding-top: 20px;" })
            .append(
              $("<div>", {
                id: "spaceT1",
                class: "align-middle col-xl-6 col-lg-6 col-md-6 col-sm-12",
              })
            )
            .append(
              $("<div>", {
                id: "spacekT1",
                class: "align-middle col-xl-3 col-lg-3 col-md-3 col-sm-6",
              })
            )
            .append(
              $("<div>", {
                id: "spacecT1",
                class: "align-middle col-xl-3 col-lg-3 col-md-3 col-sm-6",
              })
            )
            .append(
              $("<div>", {
                id: "spaceT2",
                class: "align-middle col-xl-6 col-lg-6 col-md-6 col-sm-12",
              })
            )
            .append(
              $("<div>", {
                id: "spacekT2",
                class: "align-middle col-xl-3 col-lg-3 col-md-3 col-sm-6",
              })
            )
            .append(
              $("<div>", {
                id: "spacecT2",
                class: "align-middle col-xl-3 col-lg-3 col-md-3 col-sm-6",
              })
            )
            .append(
              $("<div>", {
                id: "spaceP1",
                class: "align-middle col-xl-6 col-lg-6 col-md-6 col-sm-12",
              })
            )
            .append(
              $("<div>", {
                id: "spacekP1",
                class: "align-middle col-xl-3 col-lg-3 col-md-3 col-sm-6",
              })
            )
            .append(
              $("<div>", {
                id: "spacecP1",
                class: "align-middle col-xl-3 col-lg-3 col-md-3 col-sm-6",
              })
            )
            .append(
              $("<div>", {
                id: "spaceP2",
                class: "align-middle col-xl-6 col-lg-6 col-md-6 col-sm-12",
              })
            )
            .append(
              $("<div>", {
                id: "spacekP2",
                class: "align-middle col-xl-3 col-lg-3 col-md-3 col-sm-6",
              })
            )
            .append(
              $("<div>", {
                id: "spacecP2",
                class: "align-middle col-xl-3 col-lg-3 col-md-3 col-sm-6",
              })
            )
        )
    );
    T1field.draw("#spaceT1");
    T2field.draw("#spaceT2");
    P1field.draw("#spaceP1");
    P2field.draw("#spaceP2");
    kT1field.draw("#spacekT1");
    kT2field.draw("#spacekT2");
    kP1field.draw("#spacekP1");
    kP2field.draw("#spacekP2");
    cT1field.draw("#spacecT1");
    cT2field.draw("#spacecT2");
    cP1field.draw("#spacecP1");
    cP2field.draw("#spacecP2");
    T1field.disable();
    T2field.disable();
    P1field.disable();
    P2field.disable();
    // DISMISS MODAL
    this.modal.addButton("btn_close", "secondary", "Close", true, function () {
      th.toggleModal(th.modal);
    });
  }

  fillLogbookDataModal(mode) {
    let th = this;
    let measuresList = [];
    let data = null;
    let modalTitle = null;
    if (mode == "posData") {
      data = this.filesList.posDataFiles;
      modalTitle = "Profile data file list";
    } else if (mode == "intData") {
      data = this.filesList.intDataFiles;
      modalTitle = "Integral data file list";
    }
    let apply = "";
    let calib_filename_modal = "";
    let select_calibration = new SelectBox("select_calibration_modal", "Calib");
    select_calibration.handlerEvent("change", function () {
      calib_filename_modal = $(select_calibration.getId(true)).val();
    });
    let switch_calibration = new Switch(
      "switch_calibration",
      "Apply calibration on load"
    );
    switch_calibration.handlerEvent("click", function () {
      if (switch_calibration.getState()) {
        switch_calibration.switch_state();
        apply = switch_calibration.getState().toString();
      } else if ($(select_calibration.getId(true)).val()) {
        switch_calibration.switch_state();
        apply = switch_calibration.getState().toString();
      } else {
        th.ntf.notify("No calibration file selected", "w");
      }
    });
    let edit_notes = new TextBoxBig("edit_notes", "Notes");
    if (data.length >= 0) {
      measuresList = sortRuns(data);
      //--------------------------------------LOGBOOK MODAL--------------------------------------//
      this.modal.setTitle(modalTitle);
      this.modal.setBody(
        $("<table>", { class: "table modal-table" })
          .append(
            $("<thead>")
              .append(
                $("<tr>")
                  .append($("<th>", { scope: "col", width: "10%", html: "#" }))
                  .append(
                    $("<th>", {
                      scope: "col",
                      width: "20%",
                      html: "Name",
                    })
                  )
                  .append(
                    $("<th>", {
                      scope: "col",
                      width: "60%",
                      html: "Notes",
                    })
                  )
                  .append(
                    $("<th>", {
                      scope: "col",
                      width: "10%",
                      html: "Select",
                    })
                  )
              )
              .append(
                $("<tr>")
                  .append($("<td>", { scope: "col", width: "10%", html: "" }))
                  .append($("<td>", { scope: "col", width: "20%", html: "" }))
                  .append(
                    $("<td>", {
                      scope: "col",
                      width: "60%",
                      html: "",
                    })
                  )
                  .append(
                    $("<td>", {
                      scope: "col",
                      width: "10%",
                      html: "",
                      class: "tdselect",
                    }).append(
                      $("<span>")
                        .append($("<p>", { class: "check-label", html: "All" }))
                        .append(
                          $("<input>", { type: "checkbox", id: "select_all" })
                        )
                        .append(
                          $("<label>", {
                            for: "select_all",
                            class: "select-all-container fas",
                          })
                        )
                    )
                  )
              )
          )
          .append($("<tbody>", { id: "measuresList" }))
      );
      this.modal.setBody(
        $("<table>", { class: "table modal-table" }).append(
          $("<thead>", { id: "download-head" })
        )
      );
      this.modal.setBody(
        $("<div>", { class: "row", style: "padding-top: 20px;" })
          .append(
            $("<div>", {
              id: "SpaceCal_inModal",
              class: "align-middle col-xl-4 col-lg-4 col-md-4 col-sm-4",
            })
          )
          .append(
            $("<div>", {
              id: "SelCal_inModal",
              class: "align-middle col-xl-4 col-lg-4 col-md-4 col-sm-4",
            })
          )
          .append(
            $("<div>", {
              id: "SwCal_inModal",
              class: "align-middle col-xl-4 col-lg-4 col-md-4 col-sm-4",
            })
          )
          .append("<div>", {
            class: "row",
            style: "padding-top: 10px;",
          })
          .append(
            $("<div>", {
              id: "EditNotes_inModal",
              class: "align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12",
              style: "display: none; height: 150px; width:100%",
            })
          )
      );
      select_calibration.draw("#SelCal_inModal");
      switch_calibration.draw("#SwCal_inModal");
      if (th.filesList.posCalibFiles.length > 0) {
        th.filesList.posCalibFiles.forEach(function (opt, index) {
          $("#select_calibration_modal").append(
            $("<option>", { value: opt, html: opt })
          );
        });
        Util.trig("select_calibration_modal", "change");
        // If there is at least one option, enable input
        select_calibration.enable();
      }
      edit_notes.draw("#EditNotes_inModal");
      if (data.length > 0) {
        data.forEach(function (meas, index) {
          let correctedNotes = treatNotes(meas.notes);
          $("#measuresList").append(
            $("<tr>", { class: "" })
              .append($("<th>", { scope: "row", html: index }))
              .append($("<td>", { class: "tdname", html: meas.name }))
              .append(
                $("<td>", {
                  class: "tdnotes",
                  html: correctedNotes,
                })
              )
              .append(
                $("<td>", { class: "tdselect" }).append(
                  $("<div>", { class: "form-check" }).append(
                    $("<p>")
                      .append(
                        $("<input>", {
                          class: "form-check-input selected-file",
                          type: "checkbox",
                          id: "select_" + index,
                          "data-name": meas.name,
                        })
                      )
                      .append(
                        $("<label>", {
                          for: "select_" + index,
                          class: "fas",
                        })
                      )
                  )
                )
              )
          );
        });
        Util.attachEvent("#select_all", "click", function (ref) {
          let newStatus = false;
          if (document.getElementById("select_all").checked) {
            newStatus = true;
          }
          data.forEach(function (data, index) {
            document.getElementById("select_" + index).checked = newStatus;
          });
        });
        // Select row behavior
        Util.attachEvent("#measuresList tr", "click", function (ref) {
          $(ref).addClass("selected").siblings().removeClass("selected");
          let get_html = $("#measuresList tr.selected td.tdname").html();
          let notes_html = $("#measuresList tr.selected td.tdnotes").html();
          Util.trig("edit_notes", "update", notes_html);
          $("#EditNotes_inModal").show();
          if ($("#download_titles").length) $("#download_titles").remove();
          if ($("#download_links_row").length)
            $("#download_links_row").remove();
          if (mode == "intData") {
            //DEVICES WITH ONLY INTEGRAL MODULE
            $("#download-head")
              .append(
                $("<tr>", { id: "download_titles" })
                  .append($("<th>", { scope: "col", html: "DOWNLOAD INT" }))
                  .append($("<th>", { scope: "col", html: "DOWNLOAD LOG" }))
                  .append($("<th>", { scope: "col", html: "" }))
                  .append($("<th>", { scope: "col", html: "DOWNLOAD NOTES" }))
              )
              .append(
                $("<tr>", { class: "download_links", id: "download_links_row" })
                  .append(
                    $("<td>", { class: "align-middle" }).append(
                      $("<div>", { class: "btn-success" }).append(
                        $("<a>", {
                          id: "link_d",
                          href:
                            configs.dataFolder + get_html + "_profileINT.csv",
                          target: "_blank",
                          download: get_html + "_profileINT.csv",
                          html: "INT file",
                        })
                      )
                    )
                  )
                  .append(
                    $("<td>", { class: "align-middle" }).append(
                      $("<div>", { class: "btn-success" }).append(
                        $("<a>", {
                          id: "link_n",
                          href: configs.dataFolder + get_html + "_log.csv",
                          target: "_blank",
                          download: get_html + "_log.csv",
                          html: "Log",
                        })
                      )
                    )
                  )
                  .append($("<td>", { scope: "col", class: "align-middle" }))
                  .append(
                    $("<td>", { class: "align-middle" }).append(
                      $("<div>", { class: "btn-success" }).append(
                        $("<a>", {
                          id: "link_n",
                          href: configs.dataFolder + get_html + "_notes.txt",
                          target: "_blank",
                          download: get_html + "_notes.txt",
                          html: "Notes",
                        })
                      )
                    )
                  )
              );
          } else if (mode == "posData") {
            $("#download-head")
              .append(
                $("<tr>", { id: "download_titles" })
                  .append($("<th>", { scope: "col", html: "DOWNLOAD X" }))
                  .append($("<th>", { scope: "col", html: "DOWNLOAD Y" }))
                  .append($("<th>", { scope: "col", html: "DOWNLOAD LOG" }))
                  .append($("<th>", { scope: "col", html: "DOWNLOAD NOTES" }))
              )
              .append(
                $("<tr>", {
                  class: "download_links",
                  id: "download_links_row",
                })
                  .append(
                    $("<td>", { class: "align-middle" }).append(
                      $("<div>", { class: "btn-success" }).append(
                        $("<a>", {
                          id: "link_d",
                          href: configs.dataFolder + get_html + "_profileX.csv",
                          target: "_blank",
                          download: get_html + "_profileX.csv",
                          html: "X file",
                        })
                      )
                    )
                  )
                  .append(
                    $("<td>", { scope: "col", class: "align-middle" }).append(
                      $("<div>", { class: "btn-success" }).append(
                        $("<a>", {
                          id: "link_d",
                          href: configs.dataFolder + get_html + "_profileY.csv",
                          target: "_blank",
                          download: get_html + "_profileY.csv",
                          html: "Y file",
                        })
                      )
                    )
                  )
                  .append(
                    $("<td>", { scope: "col", class: "align-middle" }).append(
                      $("<div>", { class: "btn-success" }).append(
                        $("<a>", {
                          id: "link_n",
                          href: configs.dataFolder + get_html + "_log.csv",
                          target: "_blank",
                          download: get_html + "_log.csv",
                          html: "Log",
                        })
                      )
                    )
                  )
                  .append(
                    $("<td>", { class: "align-middle" }).append(
                      $("<div>", { class: "btn-success" }).append(
                        $("<a>", {
                          id: "link_l",
                          href: configs.dataFolder + get_html + "_notes.txt",
                          target: "_blank",
                          download: get_html + "_notes.txt",
                          html: "Notes",
                        })
                      )
                    )
                  )
              );
          }
        });
      } else {
        $("#measuresList")
          .append($("<td>", { scope: "col", class: "align-middle" }))
          .append(
            $("<td>", { class: "align-middle" }).append(
              '<p style="padding: 10px;">No available files</p>'
            )
          );
      }
      //DOWNLOAD ALL SELECTED
      this.modal.addButton(
        "btn_download",
        "outline-success",
        '<span class="mdi mdi-briefcase-download">Download selected</span>',
        false,
        function () {
          let names = [];
          if (data.length > 0) {
            data.forEach(function (data, index) {
              if (document.getElementById("select_" + index).checked) {
                names.push(
                  document
                    .getElementById("select_" + index)
                    .getAttribute("data-name")
                );
              }
            });
          } else {
            console.log("No available files");
          }
          if (names.length == 0) {
            th.ntf.notify("No files selected", "w");
            return;
          }
          let confirm_text = "Are you sure to download this run ?";
          if (names.length > 1) {
            confirm_text =
              "Are you sure to download " + names.length + " runs? ";
          }
          th.ntf.confirm(
            "Download?",
            confirm_text,
            function () {
              let datetime = formatDate(new Date());
              let cluster = {
                datetime: datetime,
                file_list: names,
                include: "false",
                IP_addr: configs.ws_address,
              };
              if (mode == "posData") {
                th.ws.send_to_logger(
                  "download_profile_files",
                  JSON.stringify(cluster)
                );
              }
              if (mode == "intData") {
                th.ws.send_to_logger(
                  "download_int_files",
                  JSON.stringify(cluster)
                );
              }
              th.ntf.notify("Preparing download, please wait...", "w", 1000);
            },
            function () {
              th.ntf.notify("Cancelled", "e");
              return;
            }
          );
        }
      );
      // DELETE FILE
      this.modal.addButton(
        "btn_delete",
        "danger",
        "Delete",
        false,
        function () {
          let names = [];
          if (data.length > 0) {
            data.forEach(function (data, index) {
              if (document.getElementById("select_" + index).checked) {
                names.push(
                  document
                    .getElementById("select_" + index)
                    .getAttribute("data-name")
                );
              }
            });
          } else {
            console.log("No available files");
          }
          if (names.length == 0) {
            th.ntf.notify("No files selected", "w");
            return;
          }
          let confirm_text = "Are you sure to delete this run ?";
          if (names.length > 1) {
            confirm_text = "Are you sure to delete " + names.length + " runs? ";
          }
          th.ntf.confirm(
            "Delete?",
            confirm_text,
            function () {
              let cluster = {
                file_list: names,
              };
              if (mode == "posData") {
                th.ws.send_to_logger(
                  "delete_profile_files",
                  JSON.stringify(cluster)
                );
              }
              if (mode == "intData") {
                th.ws.send_to_logger(
                  "delete_int_files",
                  JSON.stringify(cluster)
                );
              }
              th.toggleModal(th.modal);
            },
            function () {
              th.ntf.notify("Cancelled", "e");
              return;
            }
          );
        }
      );
      // LOAD FILE
      this.modal.addButton("btn_load", "success", "Load", false, function () {
        let get_html = $("#measuresList tr.selected td.tdname").html();
        if (!Util.isDefined(get_html)) return;
        let file_to_load = {
          data_filename: get_html,
          use_calib: apply,
          calib_file: calib_filename_modal,
        };
        let load_msg = "";
        if (mode == "intData") {
          load_msg = "log_load_int_file";
        } else if (mode == "posData") {
          load_msg = "log_load_profile_files";
        }
        th.ws.send_to_logger(load_msg, JSON.stringify(file_to_load));
        th.ntf.notify("Loading run data... Please wait", "w", 1000);
        if (mode == "posData") {
          th.resetAllProfilePlots();
        }
        th.toggleModal(th.modal);
      });
      // EDIT NOTES FILE
      this.modal.addButton(
        "btn_edit",
        "warning",
        "Edit notes",
        false,
        function () {
          let get_html = $("#measuresList tr.selected td.tdnotes").html();
          let get_name = $("#measuresList tr.selected td.tdname").html();
          let modified_note = treatNotes(latinize($("#edit_notes").val()));
          if (!Util.isDefined(get_html)) return;
          let file_to_edit = {
            notes_filename: get_name,
            old_notes: get_html,
            new_notes: modified_note,
          };
          if (modified_note != get_html) {
            th.ws.send_to_logger(
              "log_edit_notes",
              JSON.stringify(file_to_edit)
            );
            $("#measuresList tr.selected td.tdnotes").html(modified_note);
          } else {
            th.ntf.notify("The notes have not been modified", "w");
          }
        }
      );
      // DISMISS MODAL
      this.modal.addButton(
        "btn_close",
        "secondary",
        "Close",
        true,
        function () {
          th.toggleModal(th.modal);
        }
      );
      resizeText({
        element: null,
        elements: document.querySelectorAll(".tdnotes"),
        step: 0.5,
      });
    } else {
      Util.log("No data stored on the device", 1);
    }
  }

  fillLogbookCalibrationModal(mode) {
    let th = this;
    let calibList = null;
    let suffix = "";
    switch (mode) {
      case "posCalib":
        calibList = this.filesList.posCalibFiles;
        suffix = "_calib.csv";
        break;
      case "rngCalib":
        calibList = this.filesList.posCalibFiles;
        suffix = "_Zcalib.csv";
        break;
      default:
        console.log("Case not recognized");
        break;
    }
    this.modal.setTitle("Calibration files list");
    this.modal.setBody(
      $("<table>", { class: "table" })
        .append(
          $("<thead>").append(
            $("<tr>")
              .append($("<th>", { scope: "col", width: "20%", html: "#" }))
              .append($("<th>", { scope: "col", width: "80%", html: "Name" }))
          )
        )
        .append($("<tbody>", { id: "calibsList" }))
    );
    if (calibList.length > 0) {
      calibList.forEach(function (calfile, index) {
        $("#calibsList").append(
          $("<tr>", { class: "" })
            .append($("<th>", { scope: "row", html: index }))
            .append($("<td>", { html: calfile }))
        );
      });
      // Select row behavior
      Util.attachEvent("#calibsList tr", "click", function (ref) {
        $(ref).addClass("selected").siblings().removeClass("selected");
        let get_html = $("#calibsList tr.selected td:first").html();
        if ($("#download_titles").length) $("#download_titles").remove();
        if ($("#download_links_row").length) $("#download_links_row").remove();
        $("#calibsList")
          .append(
            $("<tr>", { id: "download_titles" })
              .append($("<th>", { scope: "col", html: " " }))
              .append(
                $("<th>", { scope: "col", html: "DOWNLOAD Calibration file" })
              )
          )
          .append(
            $("<tr>", { class: "download_links", id: "download_links_row" })
              .append(
                $("<td>", { scope: "row", class: "align-middle" }).append(
                  $("<span>", { scope: "row", html: " " })
                )
              )
              .append(
                $("<td>", { scope: "row", class: "align-middle" }).append(
                  $("<div>", { class: "btn-success" }).append(
                    $("<a>", {
                      id: "link_calib",
                      href: configs.calibFolder + get_html + suffix,
                      target: "_blank",
                      download: get_html + suffix,
                      html: "Calibration",
                    })
                  )
                )
              )
          );
      });
    } else {
      $("#calibsList").append(
        '<p style="padding: 10px;">No available files</p>'
      );
    }
    // DELETE FILE
    this.modal.addButton("btn_delete", "danger", "Delete", false, function () {
      let get_html = $("#calibsList tr.selected td:first").html();
      if (!Util.isDefined(get_html)) return;
      th.ntf.confirm(
        "Delete?",
        "Are you sure to delete this calibration file?",
        function () {
          if (mode == "posCalib") {
            th.ws.send_to_logger("log_delete_profile_calib_file", get_html);
          }
          if (mode == "rngCalib") {
            th.ws.send_to_logger("log_delete_range_calib_file", get_html);
          }
          th.toggleModal(th.modal);
        },
        function () {
          th.ntf.notify("Cancelled", "e");
          return;
        }
      );
    });
    // LOAD FILE
    this.modal.addButton("btn_load", "success", "Load", false, function () {
      let get_html = $("#calibsList tr.selected td:first").html();
      if (!Util.isDefined(get_html)) return;
      if (mode == "posCalib") {
        th.ws.send_to_logger("log_load_profile_calib_file", get_html);
      }
      if (mode == "rngCalib") {
        th.ws.send_to_logger("log_load_range_calib_file", get_html);
      }
      th.toggleModal(th.modal);
    });
    // DISMISS MODAL
    this.modal.addButton("btn_close", "secondary", "Close", true, function () {
      th.toggleModal(th.modal);
    });
  }

  fillSaveCalibrationModal(mode) {
    let th = this;
    this.modal.setTitle("Save Calibration");
    this.modal.setBody(
      '<div class="input-group">\n' +
        '    <span class="input-group-text">File name</span>\n' +
        '  <textarea id="calib_name" class="form-control" aria-label="With textarea"></textarea>\n' +
        "</div>"
    );
    this.modal.addButton("btn_save", "success", "Save", false, function () {
      let get_html = $("#calib_name").val().split(" ").join("_");
      let calib_factors = {};
      let files = [];
      if (mode == "pos") {
        files = th.filesList.posCalibFiles;
      }
      if (mode == "rng") {
        files = th.filesList.rngCalibFiles;
      }
      if (files.includes(get_html)) {
        th.ntf.confirm(
          "Overwrite?",
          "A calibration file with the same name is already in memory. Proceed saving and overwrite the current file?",
          function () {
            if (mode == "pos") {
              calib_factors["posXchannels"] = [];
              calib_factors["posYchannels"] = [];
              calib_factors["intChannels"] = [];
              th.calibFields.posXchannels.map(
                (x, idx) =>
                  (calib_factors["posXchannels"][idx] = !isNaN(
                    validateNumInput(x.getId(true))
                  )
                    ? validateNumInput(x.getId(true))
                    : 1)
              );
              th.calibFields.posYchannels.map(
                (y, idx) =>
                  (calib_factors["posYchannels"][idx] = !isNaN(
                    validateNumInput(y.getId(true))
                  )
                    ? validateNumInput(y.getId(true))
                    : 1)
              );
              th.calibFields.intChannels.map(
                (int, idx) =>
                  (calib_factors["intChannels"][idx] = !isNaN(
                    validateNumInput(int.getId(true))
                  )
                    ? validateNumInput(int.getId(true))
                    : 1)
              );
              th.calib_param.X_calib = calib_factors["posXchannels"];
              th.calib_param.Y_calib = calib_factors["posYchannels"];
              th.calib_param.INT_calib = calib_factors["intChannels"];
              th.calib_param.filename = get_html;
              th.ws.send_to_logger(
                "log_save_profile_calibration",
                JSON.stringify(th.calib_param)
              );
            }
            if (mode == "rng") {
              calib_factors["rngChannels"] = [];
              th.calibFields.rngChannels.map(
                (x, idx) =>
                  (calib_factors["rngChannels"][idx] = !isNaN(
                    validateNumInput(x.getId(true))
                  )
                    ? validateNumInput(x.getId(true))
                    : 1)
              );
              th.calib_param.filename_Z = get_html;
              th.calib_param.Z_calib = calib_factors["rngChannels"];
              th.ws.send_to_logger(
                "log_save_range_calibration",
                JSON.stringify(th.calib_param)
              );
            }
            th.toggleModal(th.modal);
          },
          function () {
            th.ntf.notify("Change file name", "e");
            return;
          }
        );
      } else {
        if (mode == "pos") {
          calib_factors["posXchannels"] = [];
          calib_factors["posYchannels"] = [];
          calib_factors["intChannels"] = [];
          th.calibFields.posXchannels.map(
            (x, idx) =>
              (calib_factors["posXchannels"][idx] = !isNaN(
                validateNumInput(x.getId(true))
              )
                ? validateNumInput(x.getId(true))
                : 1)
          );
          th.calibFields.posYchannels.map(
            (y, idx) =>
              (calib_factors["posYchannels"][idx] = !isNaN(
                validateNumInput(y.getId(true))
              )
                ? validateNumInput(y.getId(true))
                : 1)
          );
          th.calibFields.intChannels.map(
            (int, idx) =>
              (calib_factors["intChannels"][idx] = !isNaN(
                validateNumInput(int.getId(true))
              )
                ? validateNumInput(int.getId(true))
                : 1)
          );
          th.calib_param.X_calib = calib_factors["posXchannels"];
          th.calib_param.Y_calib = calib_factors["posYchannels"];
          th.calib_param.INT_calib = calib_factors["intChannels"];
          th.calib_param.filename = get_html;
          th.ws.send_to_logger(
            "log_save_profile_calibration",
            JSON.stringify(th.calib_param)
          );
        }
        if (mode == "rng") {
          calib_factors["rngChannels"] = [];
          th.calibFields.rngChannels.map(
            (x, idx) =>
              (calib_factors["rngChannels"][idx] = !isNaN(
                validateNumInput(x.getId(true))
              )
                ? validateNumInput(x.getId(true))
                : 1)
          );
          th.calib_param.filename_Z = get_html;
          th.calib_param.Z_calib = calib_factors["rngChannels"];
          th.ws.send_to_logger(
            "log_save_range_calibration",
            JSON.stringify(th.calib_param)
          );
        }
        th.toggleModal(th.modal);
      }
    });
    this.modal.addButton("btn_close", "secondary", "Close", true, function () {
      th.toggleModal(th.modal);
    });
  }

  fillSaveBackgroundModal(data) {
    let th = this;
    this.modal.setTitle("Save / Discard Background Run");
    this.modal.setBody(
      '<div class="input-group">\n' +
        '  <span class="input-group-text">Filename</span>\n' +
        '  <textarea id="bkg_filename" class="form-control" aria-label="With textarea"></textarea>\n' +
        "</div>"
    );
    //Delete button
    this.modal.addButton("btn_delete", "danger", "Discard", false, function () {
      let cluster = {
        filename: data,
      };
      th.ws.send_to_logger("log_delete_background", JSON.stringify(cluster));
      th.toggleModal(th.modal);
    });
    //Save button
    this.modal.addButton("btn_save", "success", "Save", false, function () {
      let flag = false;
      let get_html = $("#bkg_filename").val();
      th.filesList.backgroundFiles.map((x) => {
        let check_string = x;
        if (get_html == check_string) {
          flag = true;
        }
      });
      let bkg_cluster = {
        old_name: data,
        new_name: get_html,
      };
      if (flag) {
        th.ntf.confirm(
          "Overwrite?",
          "A background file with the same name is already in memory. Proceed saving and overwrite the current file?",
          function () {
            th.ws.send_to_logger(
              "log_rename_background",
              JSON.stringify(bkg_cluster)
            );
            th.toggleModal(th.modal);
          },
          function () {
            th.ntf.notify("Change file name", "i");
            return;
          }
        );
      } else {
        th.ws.send_to_logger(
          "log_rename_background",
          JSON.stringify(bkg_cluster)
        );
        th.toggleModal(th.modal);
      }
    });
  }

  fillLogbookBackgroundModal() {
    let th = this;
    let bkgList = this.filesList.backgroundFiles;
    this.modal.setTitle("Background files list");
    this.modal.setBody(
      $("<table>", { class: "table" })
        .append(
          $("<thead>").append(
            $("<tr>")
              .append($("<th>", { scope: "col", width: "20%", html: "#" }))
              .append($("<th>", { scope: "col", width: "80%", html: "Name" }))
          )
        )
        .append($("<tbody>", { id: "bkgList" }))
    );
    if (bkgList.length > 0) {
      bkgList.forEach(function (file, index) {
        $("#bkgList").append(
          $("<tr>", { class: "" })
            .append($("<th>", { scope: "row", html: index }))
            .append($("<td>", { html: file }))
        );
      });
      // Select row behavior
      Util.attachEvent("#bkgList tr", "click", function (ref) {
        $(ref).addClass("selected").siblings().removeClass("selected");
        let get_html = $("#bkgList tr.selected td:first").html();
      });
    } else {
      $("#bkgList").append('<p style="padding: 10px;">No available files</p>');
    }
    // DELETE FILE
    this.modal.addButton("btn_delete", "danger", "Delete", false, function () {
      let get_html = $("#bkgList tr.selected td:first").html();
      if (!Util.isDefined(get_html)) {
        th.ntf.notify("No file selected", "w");
        return;
      }
      let file_to_delete = {
        filename: get_html,
      };
      th.ntf.confirm(
        "Delete?",
        "Are you sure to delete this background file?",
        function () {
          th.ws.send_to_logger("log_delete_background", get_html);
          th.toggleModal(th.modal);
        },
        function () {
          th.ntf.notify("Cancelled", "e");
          return;
        }
      );
    });
    // DOWNLOAD FILES
    this.modal.addButton(
      "btn_download",
      "success",
      "Download",
      false,
      function () {
        let get_html = $("#bkgList tr.selected td:first").html();
        if (!Util.isDefined(get_html)) {
          th.ntf.notify("No file selected", "w");
          return;
        }
        let cluster = {
          file_list: [get_html],
          include: "false",
          IP_addr: th.detConfig.ws_address,
          datetime: formatDate(new Date()),
        };
        th.ntf.confirm(
          "Download?",
          "Are you sure to download this background run?",
          function () {
            th.ws.send_to_logger(
              "log_download_background",
              JSON.stringify(cluster)
            );
            th.toggleModal(th.modal);
          },
          function () {
            th.ntf.notify("Cancelled", "e");
            return;
          }
        );
      }
    );
    // DISMISS MODAL
    this.modal.addButton("btn_close", "secondary", "Close", true, function () {
      th.toggleModal(th.modal);
    });
  }

  resetAllPlots() {
    this.graph_array.forEach((x) => {
      x.reset();
    });
  }

  resetAllProfilePlots() {
    this.profile_graph_array.forEach((x) => {
      x.reset();
    });
  }

  stopAllDaq() {
    this.toggleGUIinteractions("on");
    this.tuneSettings("stop");
    this.setDaqStatus(0);
    this.components.acquisition.loader.deactivate();
    $("#btn_acq").removeClass("btn-danger").addClass("btn-success");
    $("#measurePlaySpan").removeClass("mdi-stop").addClass("mdi-play");
    this.components.acquisition.btnDataStream.setName("Start data stream");
    $("#btn_data_stream")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-success");
    this.components.background.btnBkgDaq.setName("Record background");
    $("#btn_bkg_acq")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-success");
  }

  toggleDaq() {
    let th = this;
    if (this.ws.isConnected()) {
      if (this.controlUnitStatus != 0 && this.controlUnitStatus != 99) {
        this.ntf.notify("Internal error! CLEAR ALARMS and try again", "e");
        return;
      }
      if (this.daqStatus == 2) {
        //data streaming running
        this.ntf.notify(
          "Data streaming ongoing. Stop data streaming before starting an acquisition!",
          "w"
        );
        return;
      }
      if (this.daqStatus == 4) {
        //dbackground acquisition running
        this.ntf.notify(
          "Background acquisition ongoing. Wait the end before starting an acquisition!",
          "w"
        );
        return;
      }
      // Check if measure is running
      if (this.daqStatus == 1) {
        // MEASURE RUNNING -> stop command
        this.stopDAQ();
      } else {
        // MEASURE NOT RUNNING -> start command
        if (this.HVStatus == 0) {
          //HV off case
          this.ntf.confirm(
            "HV off or out of range",
            "HV is off or out of range. Are you sure to start DAQ?",
            function () {
              th.startDAQ();
            },
            function () {
              this.ntf.notify("Aborted", "e");
              return;
            }
          );
        } else {
          //HV on case
          this.startDAQ();
        }
      }
    } else {
      this.ntf.conn_error();
    }
  }

  toggleDataStream() {
    let th = this;
    if (this.ws.isConnected()) {
      if (this.controlUnitStatus != 0) {
        this.ntf.notify("Internal error! CLEAR ALARMS and try again", "e");
        return;
      }
      if (this.daqStatus == 1 || this.daqStatus == 4) {
        this.ntf.notify(
          "DAQ ongoing. Stop DAQ before starting data streaming!",
          "w"
        );
        return;
      }
      // Check if streaming is running
      if (this.daqStatus == 2) {
        // streaming running -> stop command
        this.stopDataStream();
      } else {
        if (this.HVStatus == 0) {
          //HV off case
          this.ntf.confirm(
            "HV off or out of range",
            "HV is off or out of range. Are you sure to start data streaming?",
            function () {
              th.startDataStream();
            },
            function () {
              this.ntf.notify("Aborted", "e");
              return;
            }
          );
        } else {
          this.startDataStream();
        }
      }
    } else {
      this.ntf.conn_error();
    }
  }

  tuneSettings(mode) {
    if (mode === "stop") {
      if ($(this.components.settings.samplMode.getId(true)).val() != "0") {
        this.components.settings.samplRate.disable();
      } else {
        this.components.settings.samplRate.enable();
      }
    } else if (mode === "start") {
      this.components.settings.samplRate.disable();
      this.components.settings.samplMode.disable();
    } else {
      console.log("Unknown mode!");
    }
  }

  toggleGUIinteractions(mode) {
    if (mode === "on") {
      this.graph_array.map((x) => {
        x.enable_tooltips();
      });
      this.configs_array.map((x) => {
        x.enable();
      });
    } else if (mode === "off") {
      this.configs_array.map((x) => {
        x.disable();
      });
      this.graph_array.map((x) => {
        x.reset();
        x.disable_tooltips();
      });
    }
  }

  stopDAQ(auto = false) {
    if (!auto) {
      this.ws.send("measure_stop");
    }
    this.toggleGUIinteractions("on");
    this.tuneSettings("stop");
    this.setDaqStatus(0);
    this.components.acquisition.loader.deactivate();
    $("#btn_acq").removeClass("btn-danger").addClass("btn-success");
    $("#measurePlaySpan").removeClass("mdi-stop").addClass("mdi-play");
  }

  saveData() {
    this.fillDAQModal();
    this.toggleModal(this.modal);
  }

  startDAQ() {
    this.ntf.notify("DAQ starting...", "i");
    this.settings.datetime = formatDate(new Date()); //updating the run timestamp
    this.ws.send("measure_start", JSON.stringify(this.settings));
    this.tuneSettings("start");
    this.setDaqStatus(1);
    this.toggleGUIinteractions("off");
    $("#btn_acq").removeClass("btn-success").addClass("btn-danger");
    $("#measurePlaySpan").removeClass("mdi-play").addClass("mdi-stop");
    this.components.acquisition.loader.activate();
  }

  stopDataStream() {
    this.ws.send("measure_stop");
    this.toggleGUIinteractions("on");
    this.tuneSettings("stop");
    this.setDaqStatus(0);
    this.components.acquisition.loader.deactivate();
    this.components.acquisition.btnDataStream.setName("Start data stream");
    $("#btn_data_stream")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-success");
  }

  startDataStream() {
    this.ntf.notify("Data stream starting...", "s");
    this.ws.send("start_data_stream", JSON.stringify(this.settings));
    this.setDaqStatus(2);
    this.tuneSettings("start");
    this.toggleGUIinteractions("off");
    this.components.acquisition.loader.activate();
    this.components.acquisition.btnDataStream.setName("Stop data stream");
    $("#btn_data_stream")
      .removeClass("btn-outline-success")
      .addClass("btn-outline-danger");
  }

  recordBackground() {
    // let th = this;
    if (this.ws.isConnected()) {
      if (this.controlUnitStatus != 0 && this.controlUnitStatus != 99) {
        this.ntf.notify("Internal error! CLEAR ALARMS and try again", "e");
        return;
      }
      if (this.daqStatus == 2) {
        this.ntf.notify(
          "Data streaming ongoing. Stop data streaming before starting a background acquisition!",
          "w"
        );
        return;
      }
      if (this.daqStatus == 1) {
        this.ntf.notify(
          "DAQ ongoing. Stop DAQ before starting a background acquisition!",
          "w"
        );
        return;
      }
      // Check if background acquisition is running
      if (this.daqStatus == 4) {
        this.ntf.notify(
          "Background acquisition ongoing. It will stop automatically!",
          "w"
        );
        return;
      }
      if (this.HVStatus == 0) {
        //HV off case
        this.ntf.confirm(
          "HV off or out of range",
          "HV is off or out of range. Are you sure to start background DAQ?",
          function () {
            th.startRecordBackground();
          },
          function () {
            this.ntf.notify("Aborted", "e");
            return;
          }
        );
      } else {
        //HV on case
        this.startRecordBackground();
      }
    } else {
      this.ntf.conn_error();
    }
  }

  startRecordBackground() {
    this.ntf.notify("Background DAQ starting...", "i");
    this.ws.send("bkg_measure_start", JSON.stringify(this.bkg_settings));
    this.setDaqStatus(4);
    this.tuneSettings("start");
    this.toggleGUIinteractions("off");
    this.configs_array.map((x) => x.disable());
    this.graph_array.map((x) => {
      x.disable_tooltips();
      x.reset();
    });
    this.components.background.btnBkgDaq.setName("Recording background ...");
    $("#btn_bkg_acq")
      .removeClass("btn-outline-success")
      .addClass("btn-outline-danger");
    this.components.acquisition.loader.activate();
  }

  stopRecordBackground(data) {
    this.configs_array.map((x) => x.enable());
    if ($(this.components.settings.samplMode.getId(true)).val() != "0") {
      this.components.settings.samplRate.disable();
    } else {
      this.components.settings.samplRate.enable();
    }
    this.setDaqStatus(0);
    this.tuneSettings("stop");
    this.toggleGUIinteractions("on");
    this.graph_array.map((x) => {
      x.enable_tooltips();
    });
    this.components.acquisition.loader.deactivate();
    this.components.background.btnBkgDaq.setName("Record background");
    $("#btn_bkg_acq")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-success");
    this.fillSaveBackgroundModal(data);
    this.toggleModal(this.modal);
  }

  getPanels(page) {
    let panels = {};
    for (const [key, value] of Object.entries(this.panels.shared)) {
      panels[key] = value;
    }
    switch (page) {
      case "daq":
        for (const [key, value] of Object.entries(this.panels["daq"])) {
          panels[key] = value;
        }
        break;
      case "posCalib":
        for (const [key, value] of Object.entries(this.panels["posCalib"])) {
          panels[key] = value;
        }
        break;
      case "rngCalib":
        for (const [key, value] of Object.entries(this.panels["rngCalib"])) {
          panels[key] = value;
        }
        break;
      default:
        console.log("No panel to add");
    }
    return panels;
  }

  getErrorList() {
    return this.errorList;
  }

  getModal() {
    return this.modal;
  }

  toggleModal(modal) {
    if (this.modalOpen) {
      modal.hide();
      this.modalOpen = false;
    } else {
      modal.show();
      this.modalOpen = true;
    }
  }

  getDaqStatus() {
    return this.daqStatus;
  }

  getControlUnitStatus() {
    return this.controlUnitStatus;
  }

  getHVStatus() {
    return this.hvStatus;
  }

  getSensors() {
    return this.sensors;
  }

  setControlUnitStatus(val) {
    this.controlUnitStatus = parseInt(val);
    this.components.status.cuStatus_ind.update(this.controlUnitStatus);
  }

  setDaqStatus(val) {
    this.daqStatus = parseInt(val);
  }

  setMemoryStatus(data) {
    this.components.status.memory_ind.updateData(data);
  }

  setSensors(data) {
    if (!this.modalOpen) {
      this.sensors = { ...data };
    }
  }

  calibTPsensor(val, k, c) {
    return val * k + c;
  }

  setHVStatus(val) {
    this.hvStatus = parseInt(val);
    this.components.status.hvStatus_ind.updateHV(this.hvStatus);
  }

  updateErrorList(data) {
    let error = {
      type: data.type,
      message: data.value,
      time: new Date(),
    };
    let delta_time = 0;
    let flag_push = true;
    let errN = this.errorList.length;
    if (errN != 0) {
      if (error.message != this.errorList[errN - 1].message) {
        flag_push = true;
        this.ntf.notifyError(error);
      } else {
        delta_time = getDeltaDate(
          this.errorList[this.errorList.length - 1].time,
          error.time
        );
        if (delta_time > 8) {
          flag_push = true;
          this.ntf.notifyError(error);
        } else {
          flag_push = false;
        }
      }
    } else {
      this.ntf.notifyError(error);
    }
    if (error.type == "99") {
      //WARNING CASE
      if (flag_push) {
        this.errorList.push(error);
      }
    } else {
      if (flag_push) {
        this.errorList.push(error);
        // this.ntf.notify(
        //   "INTERNAL ERROR! " +
        //     error.message +
        //     " DATA STREAM AUTOMATICALLY STOPPED",
        //   "e"
        // );
      }
      this.setControlUnitStatus(error.type);
      this.setDaqStatus(0);
      switch (this.daqStatus) {
        case 1:
          this.ws.send("measure_stop");
          $(this.components.acquisition.btnDAQ.getId(true))
            .removeClass("btn-danger")
            .addClass("btn-success");
          $("#measurePlaySpan").removeClass("mdi-stop").addClass("mdi-play");
          let error_string_stop = ""; // registering error list for notes file
          this.errorList.map((error) => {
            error_string_stop = error_string_stop.concat(
              error.time.toLocaleString() + " "
            );
            if (error.type == "99") {
              error_string_stop = error_string_stop.concat("WARNING: ");
            } else {
              error_string_stop = error_string_stop.concat("ERROR: ");
            }
            error_string_stop = error_string_stop.concat(error.message + "\n");
          });
          let notes_string = "RUN STOPPED BY INTERNAL ERROR: ".concat(
            error.message
          );
          let error_cluster_stop = {
            notes: notes_string,
            errors: error_string_stop,
          };
          this.ws.send_to_logger(
            "log_save_notes",
            JSON.stringify(error_cluster_stop)
          );
          break;
        case 2:
          this.ws.send("measure_stop");
          $(this.components.acquisition.btnDataStream.getId(true))
            .removeClass("btn-outline-danger")
            .addClass("btn-outline-success");
          $(this.components.acquisition.btnDataStream.getId(true)).html(
            "Start data stream"
          );
          break;
        case 4:
          this.ws.send("measure_stop");
          $(this.components.acquisition.btnBkgDaq.getId(true))
            .removeClass("btn-outline-danger")
            .addClass("btn-outline-success");
          $(this.components.acquisition.btnBkgDaq.getId(true)).html(
            "Record background"
          );
          break;
        default:
          break;
      }
      this.configs_array.map((x) => x.enable());
      if ($(this.components.settings.samplMode.getId(true)).val() != "0") {
        this.components.settings.samplRate.disable();
      } else {
        this.components.settings.samplRate.enable();
      }
      this.graph_array.map((x) => x.enable_tooltips());
      this.components.acquisition.loader.deactivate();
    }
  }

  updateCalibFileList(data, mode) {
    let unpacked = JSON.parse(data);
    let recList = unpacked.list;
    if (recList.length >= 0) {
      switch (mode) {
        case "posCalib":
          this.filesList.posCalibFiles = recList;
          break;
        case "rngCalib":
          this.filesList.rngCalibFiles = recList;
          break;
        default:
          console.log("Case not recognized");
          break;
      }
    } else {
      Util.log("Calibration files list not defined", 1);
    }
    return recList;
  }

  updateCalibController(mode) {
    switch (mode) {
      case "posCalib":
        this.components.calibration.select_pos_calib.update(
          JSON.stringify({ list: this.filesList.posCalibFiles })
        );
        break;
      case "rngCalib":
        this.components.calibration.select_rng_calib.update(
          JSON.stringify({ list: this.filesList.rngCalibFiles })
        );
        break;
      default:
        console.log("Case not recognized");
        break;
    }
  }

  updateBackgroundFileList(data) {
    let unpacked = JSON.parse(data);
    let recList = unpacked.list;
    if (recList.length >= 0) {
      this.filesList.backgroundFiles = recList;
    } else {
      Util.log("Background files list not defined", 1);
    }
    return recList;
  }

  updateBackgroundController() {
    this.components.background.select_bkg.update(
      JSON.stringify({ list: this.filesList.backgroundFiles })
    );
  }

  updateDataFileList(data, mode) {
    let unpacked = JSON.parse(data);
    let run_list = unpacked.run_list;
    let notes_list = unpacked.notes_list;
    let measuresList = [];
    if (run_list.length > 0) {
      let dt = { name: "", notes: "" };
      run_list.forEach(function (value, index) {
        dt = { name: "", notes: "" };
        dt.name = value;
        dt.notes = notes_list[index];
        measuresList.push({ name: value, notes: notes_list[index] });
      });
    }
    switch (mode) {
      case "posData":
        this.filesList.posDataFiles = measuresList;
        break;
      case "rngData":
        this.filesList.rngDataFiles = measuresList;
        break;
      case "intData":
        this.filesList.intDataFiles = measuresList;
        break;
      default:
        console.log("Case not recognized");
        break;
    }
    return measuresList;
  }

  updateSamplingMode(data) {
    this.components.settings.samplMode.updateSM(data);
  }

  updateSamplingRate(data) {
    this.components.settings.samplRate.updateSR(data);
  }

  loadCalibFile(data, mode) {
    if (mode == "rngCalib") {
      data.Z_calib.map((x, idx) => {
        this.calibFields.rngChannels[idx].update(x);
      });
    }
    if (mode == "posCalib") {
      data.X_calib.map((x, idx) => {
        this.calibFields.posXchannels[idx].update(x);
      });
      data.Y_calib.map((x, idx) => {
        this.calibFields.posYchannels[idx].update(x);
      });
      data.INT_calib.map((x, idx) => {
        if (idx < configs.nChInt) {
          this.calibFields.intChannels[idx].update(x);
        }
      });
    }
  }

  uploadCalibFile(input, mode) {
    let inputEl = null;
    let fileInput = null;
    let textBox = null;
    if (mode == "posCalib") {
      inputEl = this.components.managePosCalib.form_upload_file;
      fileInput = document.getElementById(inputEl.getId() + "_input");
      textBox = this.components.managePosCalib.uploaded_file;
    }
    if (mode == "rngCalib") {
      inputEl = this.components.manageRngCalib.form_upload_file;
      fileInput = document.getElementById(inputEl.getId() + "_input");
      textBox = this.components.manageRngCalib.uploaded_file;
    }
    let file = fileInput.files[0];
    let reader = new FileReader();
    reader.onload = (e) => this.validateLoadCalibUpload(e.target.result, mode);
    reader.onerror = (e) => this.ntf.notify("Error uploading the file", "e");
    reader.readAsBinaryString(file);
  }

  validateCalibUpload(content, mode) {
    let temp = [];
    let data = {
      X_calib: [],
      Y_calib: [],
      Z_calib: [],
      INT_calib: [],
    };
    let array_lines = content.split("\n");
    array_lines = array_lines.filter((line) => line); // removing all falsy values from lines array -> this removes the empty lines at the end of the file
    if (mode == "rngCalib") {
      if (array_lines.length != this.detConfig.nChZ + 1) {
        this.ntf.notify("Unrecognized file format", "w");
        return;
      } else {
        array_lines.map((x, idx) => {
          if (idx > 0) {
            temp = x.split("\t");
            data.Z_calib.push(parseFloat(temp[1]));
          }
        });
      }
    }
    if (mode == "posCalib") {
      if (
        array_lines.length != this.detConfig.nChX + 1 ||
        array_lines.length != this.detConfig.nChY + 1
      ) {
        this.ntf.notify("Unrecognized file format", "w");
        return;
      } else {
        array_lines.map((x, idx) => {
          if (idx > 0) {
            temp = x.split("\t");
            data.X_calib.push(parseFloat(temp[1]));
            data.Y_calib.push(parseFloat(temp[2]));
            if (temp[3]) {
              if (idx == 1) data.INT_calib.push(parseFloat(temp[3]));
              if (idx == 2) data.INT_calib.push(parseFloat(temp[3]));
            }
          }
        });
      }
    }
    return data;
  }

  validateLoadCalibUpload(content, mode) {
    let data = this.validateCalibUpload(content, mode);
    this.loadCalibFile(data, mode);
  }

  disconnect() {
    if (this.daqStatus == 1) {
      this.ntf.notify(
        "DAQ aborted by unexpected disconnection! The device will try to save the acquired data with comment <<Run aborted by unexpected client disconnection. CHECK THE DATA>>.",
        "e"
      );
      $("#btn_acq").removeClass("btn-danger").addClass("btn-success");
      $("#measurePlaySpan").removeClass("mdi-stop").addClass("mdi-play");
    }
    if (this.daqStatus == 2) {
      this.ntf.notify(
        "Data streaming aborted by unexpected disconnection!",
        "e"
      );
      Util.trig("btn_data_stream", "setName", "Start data stream");
      $("#btn_data_stream")
        .removeClass("btn-outline-danger")
        .addClass("btn-outline-success");
    }
    this.graph_array.map((x) => x.enable_tooltips());
    this.setDaqStatus(0);
    this.setControlUnitStatus(99);
    if (this.hasHV) this.setHVStatus(99);
    if (this.devName == "aQuracy") this.setCameraStatus(99);
  }
}

export default Sidebar;
