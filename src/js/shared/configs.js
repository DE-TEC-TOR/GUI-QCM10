/**
 *  MAIN JS FILE
 *  Contains the main page logic, initializes all needed components
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 *
 */
import favicon from "../../images/QCM10.png";
//---------------------------------------------DETECTOR CONFIGS----------------------------------//

// let IP_addr = "192.168.0.31";
let IP_addr = "localhost";
let files_path = "http://" + IP_addr + "/files/media/mmcblk0p1/";

const device_configs = {
  devName: "QCM10",
  devID: "10",
  ws_address: IP_addr,
  ws_port: "6123",
  hasPos: true,
  hasInt: true,
  hasRng: false,
  hasAnalysis: false,
  hasHV: true,
  hasDots: false,
  nChX: 128,
  nChY: 168,
  nChZ: 0,
  nChInt: 1,
  posPitch: 2.5,
  rngPitch: 0,
  posResolution: 2.5,
  rngResolution: 0,
  favicon: favicon,
  dataFolder: files_path + "data/",
  calibFolder: files_path + "calib/",
  zipFolder: files_path + "zip/",
  bkgFolder: files_path + "bkg/",
  manualPath: files_path + "UserManual.pdf",
};

export default device_configs;
