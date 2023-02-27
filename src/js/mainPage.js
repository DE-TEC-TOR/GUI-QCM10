/**
 *  MAIN JS FILE
 *  Contains the main page logic, initializes all needed components
 *
 * @author : MattF
 * @company : DE.TEC.TOR.srl
 * @version : 1.0.0
 *
 */
import { initPageStyle } from "./core/Helpers";
import { default as MonitorPage } from "./pages/monitor/MonitorPage";
import { default as MainSectionGraphs } from "./pages/monitor/mainSection/MainSectionGraph";
import { default as MainSectionCalibration } from "./pages/monitor/mainSection/MainSectionCalibration";
import { default as Sidebar } from "./pages/shared/sidebar/Sidebar";
import { default as Navbar } from "./pages/shared/navbar/Navbar";
import { default as Modal } from "./components/modal/Modal";
//

export default function initMonitor(detector, notifier, ws) {
  initPageStyle(detector.favicon);
  //Create and Load modals
  let modalBig = new Modal("modalBig", "big", true);
  modalBig.draw("body");
  let modalDefault = new Modal("modalDefault", "default", true);
  modalDefault.draw("body");
  //CREATE PAGE
  let page = new MonitorPage(detector.devName);
  //CREATE PAGE ELEMENTS
  let mainSection = new MainSectionGraphs(detector, notifier, ws);
  mainSection.build();
  let mainSectionCalib = new MainSectionCalibration(detector, notifier, ws);
  mainSectionCalib.build();
  let calibFields = {
    posXchannels: [],
    posYchannels: [],
    intChannels: [],
    rngChannels: [],
  };
  if (mainSectionCalib) {
    calibFields = mainSectionCalib.getCalibFields();
  }
  let sidebar = new Sidebar(
    detector,
    modalBig,
    notifier,
    ws,
    mainSection.getGraphs(),
    mainSection.getProfileGraphs(),
    calibFields
  );
  sidebar.build();
  ws.registerComponent("sidebar", sidebar);
  ws.registerComponent("mainSectionGraphs", mainSection);
  const deviceImg = require(`../images/image_${detector.devName}.png`);
  let navbar = new Navbar(
    detector,
    modalDefault,
    notifier,
    ws,
    page,
    deviceImg
  );
  navbar.draw();
  //RENDER PAGE
  page.build(detector, sidebar, mainSection, mainSectionCalib);
  page.init();
}
