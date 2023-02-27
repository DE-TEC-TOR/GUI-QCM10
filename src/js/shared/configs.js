/**
 *  MAIN JS FILE
 *  Contains the main page logic, initializes all needed components
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 *
 */
import favicon from "../../images/LightQ.png";
//---------------------------------------------DETECTOR CONFIGS----------------------------------//
let IP_addr = "192.168.0.40";
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
  nChX: 256,
  nChY: 256,
  nChZ: 0,
  nChInt: 2,
  posPitch: 0.5,
  rngPitch: 0,
  posResolution: 0.5,
  rngResolution: 0,
  favicon: favicon,
  dataFolder: files_path + "data/",
  calibFolder: files_path + "calib/",
  zipFolder: files_path + "zip/",
  bkgFolder: files_path + "bkg/",
  manualPath: files_path + "UserManual.pdf",
};

export default device_configs;
