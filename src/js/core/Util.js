/**
 * Global utility class
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import { DEBUG } from "./Globals";

class Util {
  /**
   * Check if element is valid
   * (Not undefined, not empty, not null)
   *
   * @param elem
   * @returns {boolean}
   */
  static isValid(elem) {
    if (typeof elem === "undefined") return false;
    if (elem == "") return false;
    if (elem == null) return false;
    return true;
  }

  /**
   * Check if element is not undefined
   *
   * @param elem
   * @returns {boolean}
   */
  static isDefined(elem) {
    if (typeof elem === "undefined") return false;
    return true;
  }

  /**
   * Check if element is a valid number
   *
   * @param elem
   * @returns {boolean}
   */
  static isValidNumber(elem) {
    if (Number(elem) == "NaN") return false;
    return true;
  }

  /**
   * Check if an object is null
   *
   * @param elem
   * @returns {boolean}
   */
  static isNull(elem) {
    if (elem == null) return true;
    return false;
  }

  /**
   * Log messages and errors
   * (0 = log, 1 = error, 2 = warning)
   *
   * @param msg
   * @param error
   */
  static log(msg, mod = 0) {
    if (!DEBUG) return;
    switch (mod) {
      case 0:
      default:
        console.log(msg);
        break;
      case 1:
        console.error(msg);
        break;
      case 2:
        console.warn(msg);
        break;
    }
  }

  /**
   * Load application modules
   *
   * @param modules
   * @param path
   */
  static loadModules(modules = [], path = "") {
    if (modules.length < 1) {
      Util.log("No modules to load!", 2);
      return;
    }

    if (!Util.isValid(path)) {
      Util.log("Path of modules not valid", 1);
      return;
    }

    try {
      modules.forEach(function (elem) {
        $.getScript(path + elem, function (data, textStatus, jqxhr) {
          Util.log("Module [" + elem + "] loaded");
        });
      });
    } catch (e) {
      Util.log(
        "Impossible to load modules with path " + path + ". Exception: " + e,
        1
      );
    }
  }

  /**
   * Attach event to a target
   *
   * @param target
   * @param event_type
   * @param callback
   */
  static attachEvent(target, event_type, callback) {
    if (!Util.isValid(target)) return;
    if (!Util.isValid(event_type)) return;
    if (typeof callback !== "function") return;

    try {
      $(target)
        .off(event_type)
        .on(event_type, function (event) {
          event.stopPropagation();
          callback($(this));
        });
    } catch (e) {
      Util.log(
        'Attaching event "' +
          event_type +
          '" to target "' +
          target +
          " failed! Exception: " +
          e,
        1
      );
    }
  }

  /**
   * Trigger an event
   *
   * @param target    Owner of trigger
   * @param event     Name of the event
   * @param data      Data to send
   */
  static trig(target, event, data) {
    $("#" + target).trigger(event, data);
    Util.log(
      'Event "' + event + '" triggered to target "' + target + '" with data:'
    );
    Util.log(data);
  }

  /**
   * Add some BR tag to the target
   *
   * @param target
   * @param howmany
   */
  static spaceBR(target, howmany = 1) {
    let count;
    for (count = 0; count < howmany; count++) {
      $(target).append("<br/>");
    }
  }
}

export default Util;
