/**
 * Global utility class
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import alertify from "alertifyjs/build/alertify";
import { default as Util } from "./Util";

class Notifier {
  constructor() {
    alertify.defaults.transition = "slide";
    alertify.defaults.theme.ok = "btn btn-success btn-sm";
    alertify.defaults.theme.cancel = "btn btn-danger";
    alertify.defaults.theme.input = "form-control";
    alertify.defaults.notifier.position = "top-center";
  }
  /**
   * Notifier
   *
   * @param msg
   * @param type      (e: error, w: warning, i: info)
   * @param delay
   */
  notify(msg = "i", type = "i", delay = 2) {
    let _msg = Util.isValid(msg) ? msg : "";
    let _type = "";
    let _delay = Util.isValidNumber(delay) ? delay : 5;
    // Select color and icon
    switch (type) {
      case "e":
        _type = "error";
        break;
      case "w":
        _type = "warning";
        break;
      case "s":
        _type = "success";
        break;
      case "i":
      default:
        _type = "message";
        break;
    }
    alertify.notify(_msg, _type, _delay);
  }
  //Notify connection error (Device not connected)
  conn_error() {
    this.notify("CONNECTION ERROR: no connection to the target device", "e", 5);
  }
  //Notify error to user
  notifyError(error) {
    if (error.type == "99") {
      this.notify("WARNING! " + error.message, "w", 2);
    } else {
      this.notify("ERROR! " + error.message, "e", 2);
    }
  }
  /**
   * Ask for confirmation
   *
   * @param title
   * @param msg
   * @param callback success
   * @param callback cancel
   */
  confirm(
    title = "Confirm",
    msg = "Confirm?",
    success = () => {},
    cancel = () => {}
  ) {
    let _msg = Util.isValid(msg) ? msg : "Confirm?";
    let _title = Util.isValid(title) ? title : "Confirm";
    alertify.confirm(_title, _msg, success, cancel);
  }
  /**
   * Remove all pop-up notifications from screen
   *
   */
  dismissAll() {
    alertify.dismissAll();
  }
}

export default Notifier;
