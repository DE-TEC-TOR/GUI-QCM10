/**
 * Device main section for calibration pages -> for device integrated software
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import { NumberBox } from "../../components/controllers/TextBoxes";
import { validateNumInput } from "../../core/Helpers";

class MainSectionCalibration {
  constructor(detConfig, webSock) {
    this.devName = detConfig.devName;
    this.hasPos = detConfig.hasPos;
    this.hasRng = detConfig.hasRng;
    this.has2D = detConfig.has2D;
    this.hasInt = detConfig.hasInt;
    this.nChX = detConfig.nChX;
    this.nChY = detConfig.nChY;
    this.nChZ = detConfig.nChZ;
    this.nChInt = detConfig.nChInt;
    this.components = {
      xFactors: [],
      yFactors: [],
      zFactors: [],
      intFactors: [],
    };
    this.ws = webSock; //reference to the main page socket
  }

  build() {
    if (this.hasPos || this.hasInt) {
      this.createPosCalibFields();
    }
    if (this.hasRng) {
      this.createRngCalibFields();
    }
  }

  createPosCalibFields() {
    if (this.hasPos) {
      for (let i = 0; i < this.nChX; i++) {
        this.components.xFactors.push(
          new NumberBox("calib_chX" + i, "CH " + i)
        );
      }
      for (let j = 0; j < this.nChY; j++) {
        this.components.yFactors.push(
          new NumberBox("calib_chY" + j, "CH " + j)
        );
      }
    }
    if (this.hasInt) {
      for (let int = 0; int < this.nChInt; int++) {
        this.components.intFactors.push(
          new NumberBox("calib_IntCh" + int, "IntCH " + int)
        );
      }
    }
    if (this.devName == "QPlus") {
      this.components.xFactors[(this.nChX - 1) / 2].handlerEvent(
        "change",
        function () {
          let xval = !isNaN(
            validateNumInput(
              this.components.xFactors[(this.nChX - 1) / 2].getId(true)
            )
          )
            ? validateNumInput(
                this.components.xFactors[(this.nChX - 1) / 2].getId(true)
              )
            : 1;
          this.components.xFactors[(this.nChX - 1) / 2].updateContent(xval);
          this.components.yFactors[(this.nChY - 1) / 2].update(xval);
        }
      );
      this.components.yFactors[(this.nChY - 1) / 2].handlerEvent(
        "change",
        function () {
          let yval = !isNaN(
            validateNumInput(
              this.components.yFactors[(this.nChY - 1) / 2].getId(true)
            )
          )
            ? validateNumInput(
                this.components.yFactors[(this.nChY - 1) / 2].getId(true)
              )
            : 1;
          this.components.yFactors[(this.nChY - 1) / 2].updateContent(yval);
          this.components.xFactors[(this.nChX - 1) / 2].update(yval);
        }
      );
    }
  }

  createRngCalibFields() {
    for (let i = 0; i < this.nChZ; i++) {
      this.components.zFactors.push(new NumberBox("calib_chZ" + i, "CH " + i));
    }
  }

  getXfactors() {
    return this.components.xFactors;
  }
  getYfactors() {
    return this.components.yFactors;
  }
  getIntFactors() {
    return this.components.intFactors;
  }
  getRngFactors() {
    return this.components.zFactors;
  }

  getCalibFields() {
    let calibFields = {
      posXchannels: this.getXfactors(),
      posYchannels: this.getYfactors(),
      intChannels: this.getIntFactors(),
      rngChannels: this.getRngFactors(),
    };
    return calibFields;
  }
}

export default MainSectionCalibration;
