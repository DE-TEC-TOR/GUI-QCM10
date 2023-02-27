/**
 * DAQ page main file
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import Page from "../../core/Page";
import create_daq_ui from "../layouts/LayoutDAQ";
import {
  create_calibration_ui,
  create_range_calibration_ui,
} from "../layouts/LayoutCalibration";
import * as actions from "../events/monitorPageEvents";

class MonitorPage extends Page {
  constructor() {
    super("");
    this.created = false;
  }
  //Building page components
  build(detConfig, sidebar, mainSection, mainSectionCalib = null) {
    super.init();
    this.detConfig = detConfig;
    this.sidebar = sidebar;
    this.mainSection = mainSection;
    this.mainSectionCalib = mainSectionCalib;
    this.activePage = "daq";
    this.loadComps("daq");
    this.loadEvents();
    this.draw("daq");
  }

  //DAQ page initialization function
  init() {
    this.sidebar.initConfig(); //Retrieve device current config and update GUI accordingly
  }
  //end of initialization function

  //Switch between pages -> mode = 'daq' / 'posCalib' / 'rngCalib'
  show(mode) {
    this.loadComps(mode);
    this.draw(mode);
    if (mode == "daq") {
      this.sidebar.initConfig(); //Retrieve device current config and update GUI accordingly
    }
    this.activePage = mode;
  }

  //--------------------------------------DAQ page load components function--------------------------------------//
  loadComps(subpage) {
    /**
     * LINK COMPONENTS TO PAGE
     **/
    switch (subpage) {
      case "daq":
        //-----Plots-----// -> from mainSection instance
        let graph_array = this.mainSection.getGraphs();
        graph_array.map((x) => this.pushComp(x.getId(), x));
        //-----Controls-----// -> from mainSection instance
        let main_controls = this.mainSection.getControls();
        Object.values(main_controls).forEach((el) => {
          Object.values(el).forEach((subEl) =>
            this.pushComp(subEl.getId(), subEl)
          );
        });
        break;
      case "posCalib":
        // INITIALIZE CALIBRATION FACTORS FIELDS FOR POS MODULES
        let posX_factors = this.mainSectionCalib.getXfactors();
        posX_factors.map((x) => this.pushComp(x.getId(), x));
        let posY_factors = this.mainSectionCalib.getYfactors();
        posY_factors.map((x) => this.pushComp(x.getId(), x));
        let int_factors = this.mainSectionCalib.getIntFactors();
        int_factors.map((x) => this.pushComp(x.getId(), x));
        break;
      default:
        console.log("Unknown page config!");
        break;
    }
    //-----Sidebar-----//
    let side_panels = this.sidebar.getPanels(subpage);
    for (const value of Object.values(side_panels)) {
      this.pushComp(value.getId(), value);
    }
  }

  //--------------------------------------MONITOR page load events function--------------------------------------//
  loadEvents() {
    //Register all simple page actions
    for (const [target, action] of Object.entries(actions.list)) {
      this.handlerEvent(target, action);
    }
    let th = this;
    //------------------------REGISTERING MAIN ACTIONS------------------------//
    //Handle file upload
    $(document).on("change", ":file", function () {
      let input = $(this);
      actions.load_calib_file(input, th.sidebar, th.activePage);
    });
    // Handle user disconnection
    this.handlerEvent("disconnected", function () {
      actions.disconnected(th.sidebar);
    });
  }

  draw(subpage) {
    switch (subpage) {
      case "daq":
        create_daq_ui(this.detConfig.devName, this.detConfig.hasPos);
        //------------------------------------Plots layout------------------------------------//
        let graph_array = this.mainSection.getGraphs();
        graph_array.map((gr) => {
          this.getComp(gr.getId()).draw("#area_" + gr.getId());
        });
        let controls_obj = this.mainSection.getControls();
        Object.values(controls_obj).forEach((entry) => {
          Object.values(entry).forEach((ctr) =>
            this.getComp(ctr.getId()).draw("#area_" + ctr.getId())
          );
        });
        if (!this.created) {
          $("#switch_HI_anode").trigger("click");
          this.created = true;
        }
        break;
      case "posCalib":
        // DRAW POS CALIBRATION PAGE COMPONENTS
        create_calibration_ui(this.detConfig.devName);
        let int_factors = this.mainSectionCalib.getIntFactors();
        int_factors.map((x, idx) => {
          this.getComp(x.getId()).draw("#area_calib_int" + (idx + 1));
        });
        let posX_factors = this.mainSectionCalib.getXfactors();
        let posY_factors = this.mainSectionCalib.getYfactors();
        posX_factors.map((x, idx) => {
          if (idx % 2 == 0) {
            this.getComp(x.getId()).draw("#area_calib_x_odd");
          } else {
            this.getComp(x.getId()).draw("#area_calib_x_even");
          }
        });
        posY_factors.map((y, idx) => {
          if (idx % 2 == 0) {
            this.getComp(y.getId()).draw("#area_calib_y_odd");
          } else {
            this.getComp(y.getId()).draw("#area_calib_y_even");
          }
        });
        break;
      default:
        console.log("Unknown page config!");
        break;
    }
    //------------------------------------Sidebar layout------------------------------------//
    let panels = this.sidebar.getPanels(subpage);
    Object.values(panels).forEach((pan) =>
      this.getComp(pan.getId()).draw("#sidebar")
    );

    this.attachEvents();
  }
}

export default MonitorPage;
