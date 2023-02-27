/**
 *  SHARED GLOBALS
 *  Contains all application global variables and components
 *
 * @author : MattF
 * @company : DE.TEC.TOR.srl
 * @version : 1.0.0
 *
 */
//---------------------------------------------//
//----------------GLOBAL VARIABLES/CONTAINERS
//---------------------------------------------//
//----------------Plot array containers
export let graph_array = [];
export let graph_array_profiles_x = [];
export let graph_array_profiles_y = [];
export let configs_array = [];
//----------------Modals
export let modalBig = null;
export let modalSmall = null;
//----------------Active page
export let active_page = "daq";
//Lists
export let errorList = []; //internal errors
export let measuresList = []; //stored xy/image data files
export let calibList = []; //stored xy calibration files
//Calibration activation
export let use_calib = false;
//Calibration parameters
export let calib_param = {
  filename: "",
  X_calib: [],
  Y_calib: [],
  Int1_calib: 0,
  Int2_calib: 0,
};
