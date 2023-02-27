/**
 * Device navbar menu -> for device integrated software
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */

import manualImg from "../../../../images/ISO_7010_M002.png";
import brandImg from "../../../../images/dett.png";
import { default as version } from "../../../shared/version";

const detConfigPlaceholders = [
  { id: "visu_manu", name: "Manufacturer", key: "manufacturer" },
  { id: "visu_product", name: "Product name", key: "product" },
  { id: "visu_manual", name: "User Manual", key: "manual" },
  { id: "visu_version", name: "Software", key: "software" },
  { id: "visu_year", name: "Rel. date", key: "release" },
];

const appendConfigs = (htmlEl, placeholds, configs) => {
  placeholds.forEach((el, idx) => {
    htmlEl.append(
      $("<div>", {
        class: "input-group input-group-sm mt-3 mb-3",
      })
        .append(
          $("<div>", {
            class: "input-group-prepend",
          }).append(
            $("<label>", {
              class: "input-group-text select_box_label",
              style: "width: 110px",
              for: el.id,
              html: el.name,
            })
          )
        )
        .append(
          $("<input>", {
            type: "text",
            class: "form-control select_box",
            style: "text-align: right",
            id: el.id,
            disabled: true,
            value: configs[el.key],
          })
        )
    );
  });
  return htmlEl;
};

class Navbar {
  constructor(detConfig, modal, notifier, webSock, page, brandImg) {
    this.detConfig = detConfig;
    this.daqStatus = 0;
    this.links = [];
    this.activeLink = null;
    this.ws = webSock;
    this.modal = modal;
    this.page = page;
    this.brandImage = brandImg;
    this.ntf = notifier;
  }

  createDeviceLogo() {
    const brand = document.createElement("img");
    brand.setAttribute("width", "80");
    brand.setAttribute("src", this.brandImage);
    return brand;
  }

  composeBar() {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("collapse", "navbar-collapse", "collapse-menu");
    mainDiv.id = "navbarSupportedContent";
    const mainUl = document.createElement("ul");
    mainUl.classList.add("navbar-nav", "mr-auto");
    this.createNavItems().forEach((elem, idx) => {
      mainUl.appendChild(elem);
    });
    // mainUl.appendChild(this.createCenteredTitle());
    mainDiv.appendChild(mainUl);
    // mainDiv.appendChild(this.createBrandLogo());
    mainDiv.appendChild(this.createManualLink());
    return mainDiv;
  }

  createNavItems() {
    let navItems = [];
    navItems.push(this.createNavItem("DAQ", "daq"));
    if (this.detConfig.hasPos && !this.detConfig.hasRng) {
      navItems.push(this.createNavItem("Calibration", "posCalib"));
    }
    if (this.detConfig.hasRng && !this.detConfig.hasPos) {
      navItems.push(this.createNavItem("Calibration", "rngCalib"));
    }
    if (this.detConfig.hasPos && this.detConfig.hasRng) {
      navItems.push(
        this.createNavDropdown("Calibration", [
          { text: "X/Y Calibration", key: "posCalib" },
          { text: "Z Calibration", key: "rngCalib" },
        ])
      );
    }
    return navItems;
  }

  createNavItem(text, key) {
    let th = this;
    let listEl = document.createElement("li");
    listEl.classList.add("nav-item");
    let anchLink = document.createElement("a");
    anchLink.classList.add("nav-link");
    anchLink.innerText = text;
    anchLink.id = "link_" + key;
    this.links.push(anchLink);
    if (key == "daq") {
      this.activeLink = anchLink;
      anchLink.classList.add("active");
    }
    anchLink.addEventListener("click", function () {
      if (th.daqStatus != 0) {
        alertify.warning(
          "You are trying to leave this page with an ongoing run. Stop the run before."
        );
      } else {
        if (th.activeLink == anchLink) {
          console.log("Already here -> do nothing");
        } else {
          th.links.map((x) => x.classList.remove("active"));
          anchLink.classList.add("active");
          th.activeLink = anchLink;
          th.page.show(key); //-> init the corresponding page
        }
      }
    });
    listEl.appendChild(anchLink);
    return listEl;
  }

  createNavDropdown(textMain, subLinks) {
    let th = this;
    let listEl = document.createElement("li");
    listEl.classList.add("nav-item", "dropdown");
    let anchMain = document.createElement("a");
    anchMain.classList.add("nav-link", "dropdown-toggle");
    anchMain.setAttribute("data-toggle", "dropdown");
    anchMain.setAttribute("aria-haspopup", "true");
    anchMain.setAttribute("aria-expanded", "false");
    anchMain.innerText = textMain;
    this.links.push(anchMain);
    let dropDiv = document.createElement("div");
    dropDiv.classList.add("dropdown-menu");
    dropDiv.setAttribute("aria-labelledby", "navbarDropdownCalib");
    subLinks.forEach((el, idx) => {
      let anchSub = document.createElement("a");
      anchSub.classList.add("dropdown-item");
      anchSub.innerText = el.text;
      this.links.push(anchSub);
      anchSub.addEventListener("click", function () {
        if (th.daqStatus != 0) {
          alertify.warning(
            "You are trying to leave this page with an ongoing run. Stop the run before."
          );
        } else {
          if (th.activeLink == anchSub) {
            console.log("Already here -> do nothing");
          } else {
            th.links.map((x) => x.classList.remove("active"));
            anchSub.classList.add("active");
            anchMain.classList.add("active");
            th.activeLink = anchSub;
            th.page.show(el.key); //-> init the corresponding page
          }
        }
      });
      dropDiv.appendChild(anchSub);
    });
    listEl.appendChild(anchMain);
    listEl.appendChild(dropDiv);
    return listEl;
  }

  createCenteredTitle() {
    let listEl = document.createElement("li");
    listEl.classList.add("nav-item", "nav_centered");
    let anchLink = document.createElement("a");
    anchLink.classList.add("nav-link");
    anchLink.setAttribute("style", "pointer-events: none");
    let headerTitle = document.createElement("h2");
    headerTitle.innerText = this.detConfig.devName;
    headerTitle.classList.add("main-page-title");
    anchLink.appendChild(headerTitle);
    listEl.appendChild(anchLink);
    return listEl;
  }

  createManualLink() {
    let th = this;
    let spanEl = document.createElement("span");
    spanEl.classList.add("manual-img");
    let imgLink = document.createElement("img");
    imgLink.src = manualImg;
    imgLink.width = "60";
    spanEl.appendChild(imgLink);
    imgLink.addEventListener("click", function () {
      if (th.daqStatus != 0) {
        th.ntf.notify("Run ongoing. Stop the run before.", "w");
      } else {
        //display the device and software infos
        th.fillDetectorConfigModal();
        th.modal.show();
      }
    });
    return spanEl;
  }

  createBrandLogo() {
    let spanEl = document.createElement("span");
    spanEl.classList.add("nav_centered");
    let imgLogo = document.createElement("img");
    imgLogo.src = brandImg;
    imgLogo.width = "260";
    spanEl.appendChild(imgLogo);
    return spanEl;
  }

  fillDetectorConfigModal() {
    let modalBody = $("<div>", { class: "container" });
    modalBody = appendConfigs(modalBody, detConfigPlaceholders, version);
    this.modal.setTitle("Device infos");
    this.modal.setBody(modalBody);
    let th = this;
    this.modal.addButton(
      "btn_read_manual",
      "success",
      "Read User Manual",
      false,
      function () {
        window.open("manual_path", "resizeable,scrollbar");
        th.modal.hide();
      }
    );
    // DISMISS MODAL
    this.modal.addButton("btn_close", "secondary", "Close", true);
  }

  draw() {
    $("#nav-brand").append(this.createDeviceLogo());
    $("#device_menu").append(this.composeBar());
    $("#main-nav").append(this.createBrandLogo());
  }
}

export default Navbar;
