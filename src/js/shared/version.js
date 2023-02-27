/**
 *  SOFTWARE VERSION
 *  Contains software version details
 *
 * @author : MattF
 * @company : DE.TEC.TOR.srl
 * @version : 1.0.0
 *
 */

import { default as configs } from "./configs";
//---------------------------------------------PRODUCT/SOFTWARE VERSION----------------------------------//
let manufacturer = "De.Tec.Tor. srl";
let soft_release = "v1.0.0";
let soft_date = "10/2022";
let prod_name = configs.devName;
let rev = "01";
let prod_manual = "QCM" + configs.devID + "-R&D-UM-" + rev;

let prod_soft_version = {
  manufacturer: manufacturer,
  software: soft_release,
  release: soft_date,
  product: prod_name,
  manual: prod_manual,
};

export default prod_soft_version;
