/**
 *  MAIN JS FILE
 *  Contains the main GUI logic, initializes all needed components
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 *
 */
import $ from "jquery";
import "./styles/_main.scss";
import * as bootstrap from "bootstrap";
import { default as Notifier } from "./js/core/Notifier";
// import { default as configs } from "./js/shared/configs";
import { default as DeviceConfigs } from "./js/shared/DeviceConfigs";
import { default as WSD } from "./js/websocket/WebSocketDevice";
import { default as init } from "./js/mainPage";

let ntf = new Notifier();
//Dynamically retrieve IP to open WS connection from user typed URL
const url = new URL(window.location.href);
let hostname = url.hostname;
let configsObj = new DeviceConfigs();
configsObj.init();
if (hostname != "localhost") {
  configsObj.setIP(hostname);
}
const configs = configsObj.getConfigs();
let ws = new WSD(configs, ntf);
ws.connect();

$(document).ready(() => {
  init(configs, ntf, ws);
});
