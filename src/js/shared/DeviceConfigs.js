/**
 * Device configuration class
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */

import favicon from "../../images/QCM10.png";

class DeviceConfigs {
  constructor(IP_addr = "10.232.20.151") {
    this.IP_addr = IP_addr;
    this.files_path = "http://" + this.IP_addr + "/files/media/mmcblk0p1/";
    this.manufacturer = "De.Tec.Tor. srl";
    this.soft_release = "sw036.rev00";
    this.soft_date = "05/2023";
    this.rev = "01";

    this.configs = {
      devName: "QCM10",
      devID: "10",
      ws_address: this.IP_addr,
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
      dataFolder: this.files_path + "data/",
      calibFolder: this.files_path + "calib/",
      zipFolder: this.files_path + "zip/",
      bkgFolder: this.files_path + "bkg/",
      manualPath: this.files_path + "UserManual.pdf",
      productInfo: {
        manufacturer: this.manufacturer,
        software: this.soft_release,
        release: this.soft_date,
        product: "",
        manual: "",
      },
    };
    this.prod_name = this.configs.devName;
    this.prod_manual = "QCM" + this.configs.devID + "-R&D-UM-" + this.rev;
  }

  init() {
    this.configs.productInfo.product = "PinQ";
    this.configs.productInfo.manual = this.prod_manual;
  }

  setIP(IP) {
    this.IP_addr = IP;
    this.files_path = "http://" + this.IP_addr + "/files/media/mmcblk0p1/";
    this.configs.ws_address = this.IP_addr;
    this.configs.dataFolder = this.files_path + "data/";
    this.configs.calibFolder = this.files_path + "calib/";
    this.configs.zipFolder = this.files_path + "zip/";
    this.configs.bkgFolder = this.files_path + "bkg/";
    this.configs.manualPath = this.files_path + "UserManual.pdf";
  }

  getConfigs() {
    return this.configs;
  }
  getProdInfo() {
    //PRODUCT/SOFTWARE VERSION//
    return this.configs.productInfo;
  }
}

export default DeviceConfigs;
