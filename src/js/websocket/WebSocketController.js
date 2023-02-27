/**
 * Websocket controller -> to control websocket connections
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import { WATCHDOG_INTERVAL } from "../core/Globals";
import Util from "../core/Util";
import { getDeltaDate } from "../core/Helpers";

class WebsocketController {
  /**
   * Webscoket controller constructor
   */
  constructor(address = null, port = null, watchdog = false, notifier = null) {
    this._reference = "Websocket";
    this._connected = false;
    this._address = Util.isValid(address) ? address : "";
    this._port = Util.isValid(port) ? port : "";
    this._protocol = "ws://";

    // Watchdog management
    this._watchdog_enabled = watchdog;
    this._watchdog_timer = null;
    this._watchdog_last_sent = new Date();
    this._watchdog_last_received = new Date();

    // Auto-connection
    this._connection_auto = false;
    this._connection_timer = null;

    this._sck = null;

    this.ntf = notifier;

    Util.log("=> Websocket Inited!");
    Util.log(this._watchdog_enabled);
    Util.log(this);
  }

  /**
   * Check if websocket js is available in the browser
   *
   * @returns {boolean}
   */
  websocketIsAvailable() {
    if (!window.WebSocket) {
      Util.notify(
        this._reference,
        "Websocket not available. Your browser does not support js sockets",
        "e",
        0
      );
      Util.log("Websocket is not available on this browser", 1);
      return false;
    } else {
      return true;
    }
  }

  /**
   * Returns the connection status
   *
   * @returns {boolean}
   */
  isConnected() {
    return this._connected;
  }

  /**
   * Connect the socket
   *
   */
  connect() {
    // let th = this;
    if (this.websocketIsAvailable()) {
      this._remote = this._protocol + this._address + ":" + this._port;
      this._sck = new WebSocket(this._remote);
      this._connected = true;
      console.log("Web socket created on " + this._remote);
      // On error
      let th = this;
      this._sck.onerror = function (event) {
        th._connected = false;
        Util.log(
          "CONNECTION ERROR: impossible to connect to target " +
            th._address +
            " at port " +
            th._port,
          1
        );
      };

      // On close
      this._sck.onclose = function (event) {
        th._connected = false;
      };

      // On message
      this._sck.onmessage = function (msg) {
        th.messageParse(msg);
      };

      // Enable watchdog
      if (this._watchdog_enabled) {
        this._watchdog_timer = setInterval(function () {
          th.send("watchdog");
          th._watchdog_last_sent = new Date();
        }, WATCHDOG_INTERVAL);
      }
    } else {
      this._sck = null;
      this._connected = false;
    }
  }

  /**
   * Disconnect the socket
   *
   */
  disconnect() {
    if (this.isConnected()) {
      this._sck.close();
      this._connected = false;
    }

    // Stop watchdog timer
    clearInterval(this._watchdog_timer);
  }

  /**
   * Parsing message
   * (Override method into the son, to implement messages)
   *
   * @param msg
   */
  messageParse(msg) {
    // console.log("Parsing message...");
    Util.log(msg);
    return JSON.parse(msg.data);
  }

  /**
   * Send a JSON message
   *
   * @param target
   * @param msg
   * @param mute      Don't show user notify
   */
  send(target, msg = null, def = null, type = 0, mute = false) {
    if (this._sck == null) {
      // if (!mute) Util.notify(null, 'No connection available!', 'e', 3);
      Util.log(
        'Error: no connection available! Enable to send to target "' +
          (Util.isNull(msg) ? "(none)" : target) +
          '":',
        1
      );
      Util.log(msg, 1);
      return false;
    }

    let preparedMsg = {
      action: target,
      value: msg,
      default: def,
      type: type,
    };

    let message = JSON.stringify(preparedMsg);
    if (this._sck.readyState === this._sck.OPEN) {
      this._sck.send(message);
      Util.log("Message sent:");
      Util.log(message);
    } else {
      Util.log("Error sending message socket: ", message.toString(), 1);
      if (
        getDeltaDate(this._watchdog_last_received, this._watchdog_last_sent) > 5
      ) {
        // Util.notify(this._reference, 'CONNECTION ERROR: no connection to the target device - ' + this._address, 'e', 0);
        this.ntf.conn_error();
        this.disconnect();
        Util.trig("main_content", "disconnected");
      }
      return false;
    }
    return true;
  }

  /**
   * Send a JSON message to the LOGGER ACTOR
   *
   * @param target
   * @param msg
   * @param mute      Don't show user notify
   */
  send_to_logger(target, msg = null, mute = false) {
    if (this._sck == null) {
      // if (!mute) Util.notify(null, 'No connection available!', 'e', 3);
      Util.log(
        'Error: no connection available! Enable to send to target "' +
          (Util.isNull(msg) ? "(none)" : target) +
          '":',
        1
      );
      Util.log(msg, 1);
      return false;
    }
    let preparedMsg = JSON.stringify({
      action: target,
      value: msg,
    });
    let message = JSON.stringify({
      action: "send_to_logger",
      value: preparedMsg,
    });
    if (this._sck.readyState === this._sck.OPEN) {
      this._sck.send(message);
      Util.log("Message sent:");
      Util.log(message);
    } else {
      Util.log("Error sending message socket: ", message.toString(), 1);
      if (
        getDeltaDate(this._watchdog_last_received, this._watchdog_last_sent) > 5
      ) {
        // Util.notify(this._reference, 'CONNECTION ERROR: no connection to the target device - ' + this._address, 'e', 0);
        this.ntf.conn_error();
        this.disconnect();
        Util.trig("main_content", "disconnected");
      }
      return false;
    }
    return true;
  }

  /**
   * Update watchdog info when it comes
   *
   */
  watchdogUpdate() {
    this._watchdog_last_received = new Date();
  }
}

export default WebsocketController;
