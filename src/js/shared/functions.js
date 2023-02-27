/**
 * Shared functions - functionalities shared by different pages
 *
 * @author : MattF
 * @company : DE.TEC.TOR.srl
 * @version : 1.0.0
 */
// ----------------------------- -------------- ----------------------------- //
// ----------------------------- PLOT TREATMENT ----------------------------- //
// ----------------------------- -------------- ----------------------------- //
/**
 * Plot on screen XY profile data read from file
 *
 * @return
 */
function plotXYprofiles(json, input_cluster) {
  Util.trig("graph_x_an", "reset");
  Util.trig("graph_y_an", "reset");
  data_x = json.profile_x.slice(1, json.profile_x.length - 2);
  data_y = json.profile_y.slice(1, json.profile_y.length - 2);
  Util.trig("graph_x_an", "updateData", JSON.stringify(data_x));
  Util.trig("graph_y_an", "updateData", JSON.stringify(data_y));
  Util.trig("file_loaded_XY", "update", input_cluster.data_filename);
}
