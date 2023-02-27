/**
 * WebSocket main component -> to/from-device communication handling .
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import Util from "../core/Util";
import WebsocketController from "./WebSocketController";
import wsActions from "./webSocketActions";

class WebSocketDevice extends WebsocketController {
  constructor(detector, notifier) {
    super(detector.ws_address, detector.ws_port, true, notifier);
    this.detector = detector;
    this.components = {};
    this.ntf = notifier;
  }

  registerComponent(cat, comp) {
    //give websocket access to drawn components
    this.components[cat] = comp;
  }

  messageParse(message) {
    let msg = super.messageParse(message);
    if (Util.isDefined(msg.action)) {
      switch (msg.action) {
        //----------------------------------------connection messages
        case "watchdog": //polling connection check
          this.watchdogUpdate(); // update last received watchdog time to keep connection open
          break;
        case "connected": //initialization connection check
          wsActions.connected(this.components.sidebar, msg.type);
          break;
        //----------------------------------------DAQ messages
        case "DAQ_end": //programmatic daq stop
          this.ntf.notify(
            "Acquisition completed, processing data files... Please wait",
            "i",
            1000
          );
          // wsActions.stopAndSave(this.components.sidebar);
          break;
        case "saveDAQ":
          this.ntf.dismissAll();
          wsActions.stopAndSave(this.components.sidebar);
          break;
        //----------------------------------------plot messages
        //POSITION PROFILE section
        case "graph_profile_x_int": //update profile x
          wsActions.updateProfiles(
            this.components.mainSectionGraphs,
            "x",
            "int",
            msg.value
          );
          break;
        case "graph_profile_x_diff": //update profile x differential plot
          wsActions.updateProfiles(
            this.components.mainSectionGraphs,
            "x",
            "diff",
            {
              axis: "X",
              value: msg.value,
            }
          );
          break;
        case "graph_profile_y_int": //update profile y
          wsActions.updateProfiles(
            this.components.mainSectionGraphs,
            "y",
            "int",
            msg.value
          );
          break;
        case "graph_profile_y_diff": //update profile y differential
          wsActions.updateProfiles(
            this.components.mainSectionGraphs,
            "y",
            "diff",
            {
              axis: "Y",
              value: msg.value,
            }
          );
          break;
        //INTEGRAL section
        case "graph_int_1": //update integral plot
          wsActions.updateIntegrals(
            this.components.mainSectionGraphs,
            "1",
            "int",
            msg.value
          );
          break;
        case "graph_int_1_diff": //update integral plot differential
          wsActions.updateIntegrals(
            this.components.mainSectionGraphs,
            "1",
            "diff",
            msg.value
          );
          break;
        case "graph_int_2": //update integral plot
          wsActions.updateIntegrals(
            this.components.mainSectionGraphs,
            "2",
            "int",
            msg.value
          );
          break;
        case "graph_int_2_diff": //update integral plot differential
          wsActions.updateIntegrals(
            this.components.mainSectionGraphs,
            "2",
            "diff",
            msg.value
          );
          break;
        case "load_int_1": //load on screen integral ch data
          wsActions.loadIntData(
            this.components.mainSectionGraphs,
            "1",
            "int",
            msg.value
          );
          break;
        case "load_int_2": //load on screen integral ch data
          wsActions.loadIntData(
            this.components.mainSectionGraphs,
            "2",
            "int",
            msg.value
          );
          break;
        case "load_int_1_diff": //load on screen integral ch differential data
          wsActions.loadIntData(
            this.components.mainSectionGraphs,
            "1",
            "diff",
            msg.value
          );
          break;
        case "load_int_2_diff": //load on screen integral ch differential data
          wsActions.loadIntData(
            this.components.mainSectionGraphs,
            "2",
            "diff",
            msg.value
          );
          break;
        //----------------------------------------system status messages
        case "fpga_hv": //update HV level status
          wsActions.updateHVStatus(this.components.sidebar, msg.type);
          break;
        case "device_status": //update control unit status
          wsActions.updateDeviceStatus(this.components.sidebar, msg.type);
          break;
        case "alarms_reset_done":
          wsActions.updateDeviceStatus(this.components.sidebar, 0);
          this.ntf.notify("Alarms cleared", "s");
          break;
        case "memory_update": //update control unit memory status
          wsActions.updateMemoryStatus(this.components.sidebar, msg.value);
          break;
        case "error_list":
          Util.trig("error_list", "update", msg.value);
          break;
        //----------------------------------------system settings messages
        case "fpga_sampling_mode": //update sampling mode setting options
          wsActions.updateSamplingMode(this.components.sidebar, msg.value);
          break;
        case "fpga_sampling_rate": //update sampling rate setting options
          wsActions.updateSamplingRate(this.components.sidebar, msg.value);
          break;
        //----------------------------------------DAQ PAGE calibration messages
        case "update_profile_calib_list_hidden": //update position calib file list
          wsActions.updateCalibList(
            this.components.sidebar,
            msg.value,
            "posCalib",
            "",
            this.ntf
          );
          break;
        case "update_profile_calib_list_init": //update position calib file list and controller at page initialization
          wsActions.updateCalibList(
            this.components.sidebar,
            msg.value,
            "posCalib",
            "init",
            this.ntf
          );
          break;
        //----------------------------------------CALIBRATION PAGE messages
        case "update_profile_calib_list": //update position calib file list and open modal
          wsActions.updateCalibList(
            this.components.sidebar,
            msg.value,
            "posCalib",
            "modal",
            this.ntf
          );
          break;
        case "load_profile_calib": //load profile calibration factors from file on screen
          wsActions.loadCalibFile(
            this.components.sidebar,
            JSON.parse(msg.value),
            "posCalib"
          );
          break;
        //----------------------------------------background messages
        case "save_background":
          this.ntf.notify("Background acquisition completed", "s");
          wsActions.saveBackground(this.components.sidebar, msg.value);
          break;
        case "background_files_saved": //feedback after successful saving of background files
          this.ntf.notify("Background acquisition successfully saved", "s");
          break;
        case "update_background_list": //update background file list and open modal
          wsActions.updateBackgroundList(
            this.components.sidebar,
            msg.value,
            "modal",
            this.ntf
          );
          break;
        case "update_background_list_hidden": //update background file list
          wsActions.updateBackgroundList(
            this.components.sidebar,
            msg.value,
            "hidden",
            this.ntf
          );
          break;
        case "update_background_list_init": //update background file list and controller at the page initialization
          wsActions.updateBackgroundList(
            this.components.sidebar,
            msg.value,
            "init",
            this.ntf
          );
          break;
        case "update_sensors":
          wsActions.updateSensors(
            this.components.sidebar,
            JSON.parse(msg.value)
          );
          break;
        //----------------------------------------operation messages
        case "counters_reset_done": //feedback of reset performed from control unit -> reset plots on page
          wsActions.resetAllPlots(this.components.sidebar);
          this.ntf.notify("Counters reset completed", "s");
          break;
        case "download_files": //automatic download of zip files created in the device CU
          $("#sidebar").append(
            $("<a>", {
              href: msg.value,
              target: "_blank",
              id: "download_zip",
            })
          );
          Util.trig("main_content", "start_download");
          this.ntf.dismissAll();
          this.ntf.notify("Download ongoing ... Please wait", "i", 3);
          break;
        case "message":
          Util.trig("message", "update", msg.value);
          break;
        case "update_error_list": //adding error to the GUI list and notify user
          wsActions.updateErrorList(this.components.sidebar, msg);
          break;
        case "trigger_warning": //trigger a warning and update the GUI error list
          wsActions.warning(this.components.sidebar, msg.value);
          break;
        case "trigger_error": //trigger an error and update the GUI error list
          wsActions.error(this.components.sidebar, msg.value, this.ntf);
          break;
        //----------------------------------------logbook/data-calib storage messages
        case "profile_run_list": //open profile files modal
          this.ntf.dismissAll();
          wsActions.updateRunList(
            this.components.sidebar,
            msg.value,
            "posData",
            this.ntf
          );
          break;
        case "integral_run_list":
          this.ntf.dismissAll();
          wsActions.updateRunList(
            this.components.sidebar,
            msg.value,
            "intData",
            this.ntf
          );
          break;
        case "run_saved": //feedback after succesful data file saving
          this.ntf.notify("Run successfully saved", "s");
          break;
        case "notes_file_edited": //feedback after succesful notes file editing
          this.ntf.notify("Notes file successfully edited", "s");
          break;
        case "file_deleted": //feedback after succesful data file removal
          this.ntf.notify("Data deleted from memory", "e");
          break;
        case "load_completed":
          this.ntf.dismissAll();
          this.ntf.notify("Data correctly loaded", "s");
          break;
        case "calibration_saved": //feedback after succesful calibration file saving
          this.ntf.notify("Calibration successfully saved", "s");
          break;
        //----------------------------------------default case - message not recognized
        default:
          break;
      }
    } else {
      console.log("Undefined!");
    }
  }
}

export default WebSocketDevice;
