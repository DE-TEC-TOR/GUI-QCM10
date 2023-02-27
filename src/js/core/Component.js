/**
 * Generic Component class
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */

import ComponentEvent from "./ComponentEvent";
import Util from "./Util";

class Component {
  /**
   * Constructor
   *
   * @param identifier
   */
  constructor(identifier) {
    // Members default values
    this._id = Util.isValid(identifier) ? identifier : "$_$";
    this._drawed = false;
    this._father = "";
    this._classes = "";
    this._value = "";

    // Events structure
    this._eventList = [];

    // Add default update event
    let th = this;
    this.handlerEvent("update", function (ref, d) {
      th.update(d);
    });

    Util.log('=> Component "' + identifier + '" inited!');
    Util.log(this);
  }

  /**
   * Method to update component (to override)
   *
   * @param data
   */
  update(data) {
    Util.log(data);
  }

  /**
   * Return the identifier
   *
   * @returns {string|*}
   */
  getId(jq = false) {
    return (jq ? "#" : "") + this._id;
  }

  /**
   * Return the father id
   *
   * @returns {string}
   */
  getFather(jq = false) {
    return (jq ? "#" : "") + this._father;
  }

  /**
   * Set component classes
   *
   * @param cls
   */
  setClasses(cls) {
    this._classes = Util.isValid(cls) ? cls : "";
  }

  /**
   * Return component classes
   *
   * @returns {string}
   */
  getClasses() {
    return this._classes;
  }

  /**
   * Add event to component
   *
   * @param eName
   * @param eCallback
   */
  handlerEvent(eName, eCallback) {
    try {
      this._eventList.push(
        new ComponentEvent(this.getId(true), eName, eCallback)
      );
    } catch (e) {
      Util.log(
        "Impossible to assign event " +
          eName +
          " to target " +
          this.getId() +
          " (exception): " +
          e,
        1
      );
    }
  }

  /**
   * Attach all events to target
   *
   */
  attachEvents() {
    try {
      this._eventList.forEach(function (elem) {
        elem.attachEvent();
      });
    } catch (e) {
      Util.log("Attaching events error (exception): " + e, 1);
    }
  }

  /**
   * Draw component
   *
   * @param father
   */
  draw(father) {
    // Register that component is drawed
    this._drawed = true;

    // If father is not valid, MAIN_CONTENT becomes father
    this._father = Util.isValid(father) ? father : ID_MAIN_CONTENT;
  }
}

export default Component;
