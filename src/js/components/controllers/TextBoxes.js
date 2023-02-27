/**
 * Text boxe objects
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from "../../core/Util";
import { validateNumInput } from "../../core/Helpers";
import Component from "../../core/Component";

//--------------------------------------------NUMERIC TEXT BOX FIELD--------------------------------------------//
export class NumberBox extends Component {
  constructor(id, label, content = 1) {
    super(id);
    this.label = Util.isValid(label) ? label : "none";
    this.content = content;

    let th = this;
    this.handlerEvent("change", function () {
      let val = !isNaN(validateNumInput(th.getId(true)))
        ? validateNumInput(th.getId(true))
        : 1;
      th.updateContent(val);
    });
  }

  draw(father) {
    super.draw(father);
    $(father).append(
      $("<div>", { class: "input-group input-group-sm mb-3" })
        .append(
          $("<label>", {
            class: "input-group-text select_box_label",
            for: this.getId(),
            html: this.label,
          })
        )
        .append(
          $("<input>", {
            type: "text",
            class: "form-control select_box",
            style: "text-align: right",
            id: this.getId(),
            disabled: false,
            value: this.content.toFixed(3),
          })
        )
    );
    this.attachEvents();
  }

  enable() {
    $(this.getId(true)).prop("disabled", false);
  }

  disable() {
    $(this.getId(true)).prop("disabled", true);
  }

  update(data) {
    $(this.getId(true)).prop("value", data.toFixed(3));
    this.content = parseFloat(data); //.toFixed(3);
  }

  updateContent(data) {
    this.content = parseFloat(data); //.toFixed(3);
  }

  getValue() {
    return this.content;
  }
}

//--------------------------------------------FREE TEXT BOX FIELDS--------------------------------------------//
export class FreeTextBox extends Component {
  constructor(id, label, content) {
    super(id);

    this.label = Util.isValid(label) ? label : "none";
  }

  draw(father) {
    super.draw(father);
    $(father).append(
      $("<div>", { class: "input-group input-group-sm mb-3" })
        .append(
          $("<label>", {
            class: "input-group-text select_box_label",
            for: this.getId(),
            html: this.label,
          })
        )
        .append(
          $("<input>", {
            type: "text",
            class: "form-control select_box",
            id: this.getId(),
            disabled: true,
          })
        )
    );

    this.attachEvents();
  }

  enable() {
    $(this.getId(true)).prop("disabled", false);
  }

  disable() {
    $(this.getId(true)).prop("disabled", true);
  }

  update(data) {
    $(this.getId(true)).prop("value", data);
  }
}

//--------------------------------------------FREE BIG TEXT BOX FIELDS--------------------------------------------//
export class TextBoxBig extends Component {
  constructor(id, label, content) {
    super(id);
    this.label = Util.isValid(label) ? label : "none";
  }

  draw(father) {
    super.draw(father);
    $(father).append(
      $("<div>", {
        class: "input-group input-group-sm mb-3",
        style: "margin-top: 15px",
        style: "height: 100%",
      })
        .append(
          $("<label>", {
            class: "input-group-text select_box_label",
            for: this.getId(),
            html: this.label,
            style: "height: 100%",
          })
        )
        .append(
          $("<textarea>", {
            type: "text",
            class: "form-control select_box",
            id: this.getId(),
            disabled: true,
            style: "height: 100%",
          })
        )
    );

    this.attachEvents();
  }

  enable() {
    $(this.getId(true)).prop("disabled", false);
  }

  disable() {
    $(this.getId(true)).prop("disabled", true);
  }

  update(data) {
    $(this.getId(true)).prop("value", data);
    this.enable();
  }
}

//--------------------------------------------OUTPUT TEXT BOX FIELD WITH UNIT LABEL--------------------------------------------//
export class UnitTextBox extends Component {
  constructor(id, label, unit, content) {
    super(id);
    this.label = Util.isValid(label) ? label : "none";
    this.unit = unit;
  }

  draw(father) {
    super.draw(father);
    $(father).append(
      $("<div>", {
        class: "input-group input-group-sm mb-3",
        style: "margin-top: 5px",
      })
        .append(
          $("<label>", {
            class: "input-group-text select_box_label",
            id: this.getId() + "_label",
            for: this.getId(),
            html: this.label,
          })
        )
        .append(
          $("<input>", {
            type: "text",
            class: "form-control select_box",
            style: "text-align: right",
            id: this.getId(),
            disabled: true,
          })
        )
        .append(
          $("<div>", { class: "input-group-append" }).append(
            $("<span>", {
              class: "input-group-text  select_box_unit",
              html: this.unit,
            })
          )
        )
    );

    this.attachEvents();
  }

  enable() {
    $(this.getId(true)).prop("disabled", false);
  }

  disable() {
    $(this.getId(true)).prop("disabled", true);
  }

  update(data) {
    let val = data.val;
    let threshold = data.thr;
    $(this.getId(true)).prop("value", val);
    if (parseFloat(val) > threshold) {
      if ($(this.getId(true) + "_label").hasClass("select_box_label")) {
        $(this.getId(true) + "_label")
          .removeClass("select_box_label")
          .addClass("select_box_label_warning");
      }
    } else {
      if ($(this.getId(true) + "_label").hasClass("select_box_label_warning")) {
        $(this.getId(true) + "_label")
          .removeClass("select_box_label_warning")
          .addClass("select_box_label");
      }
    }
  }
}

//--------------------------------------------FREE BIG TEXT BOX FIELDS--------------------------------------------//
export class TextBoxSidebar extends Component {
  constructor(id, content = "") {
    super(id);
    this.content = Util.isValid(content) ? content : "";
  }

  draw(father) {
    super.draw(father);
    $(father).append(
      $("<div>", {
        class: "mb-3 overflow-auto",
        id: this.getId(),
        style:
          "margin-top: 10px; height: 60px; border: 1px solid #068587; border-radius: 5px; display:none",
      }).append(
        $("<p>", {
          id: this.getId() + "_text",
          html: this.content,
          style: "height: 100%; padding-left: 5px",
        })
      )
    );

    this.attachEvents();
  }

  show() {
    $(this.getId(true)).css("display", "block");
  }

  hide() {
    $(this.getId(true)).css("display", "none");
  }

  update(data) {
    $(this.getId(true) + "_text").text(data);
  }
}
