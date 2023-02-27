/**
 * Circle status indicator for sidebar
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from "../../core/Util";
import Component from "../../core/Component";

class SelectBox extends Component {
  constructor(id, label, dim = "sm") {
    super(id);
    this.label = Util.isValid(label) ? label : "none";
    this.dim = dim;
  }

  drawInModal(father) {
    super.draw(father);

    $(father).append(
      $("<div>", { class: "input-group mb-3" })
        .append(
          $("<div>", { class: "input-group-prepend" }).append(
            $("<label>", {
              class: "input-group-text select_box_label",
              for: this.getId(),
              html: this.label,
            })
          )
        )
        .append(
          $("<select>", {
            class: "custom-select select_box",
            id: this.getId(),
            disabled: true,
          })
        )
    );

    this.attachEvents();
  }

  draw(father) {
    super.draw(father);
    let dim_string = "";
    if (this.dim == "sm") {
      dim_string = "input-group input-group-sm";
    } else {
      dim_string = "input-group";
    }
    $(father).append(
      $("<div>", { class: dim_string + " mb-3" })
        .append(
          //   $("<div>", { class: "input-group-prepend" }).append(
          $("<label>", {
            class: "input-group-text select_box_label",
            for: this.getId(),
            html: this.label,
          })
          //   )
        )
        .append(
          $("<select>", {
            class: "custom-select select_box ",
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
    // Create option tag foreach result
    let th = this;
    let dataParsed = JSON.parse(data);
    $(th.getId(true)).empty();
    dataParsed.list.forEach(function (opt, index) {
      if (opt != "") {
        $(th.getId(true)).append(
          $("<option>", {
            value: opt,
            html: opt,
            selected: opt == dataParsed.current ? true : false,
          })
        );
      }
    });
    Util.trig(this.getId(), "change");
    // If there is at least one option, enable input
    let n_opt = $(this.getId(true) + " > option").length;
    if (n_opt > 0) {
      this.enable();
    }
  }

  updateSM(data) {
    let dataParsed = JSON.parse(data);
    let th = this;
    $(th.getId(true)).empty();
    // Create option tag foreach result
    dataParsed.list.forEach(function (opt) {
      switch (opt) {
        case "0":
          th.addOption(opt, "Continuous", opt == dataParsed.current);
          break;
        case "1":
          th.addOption(opt, "Triggered", opt == dataParsed.current);
          break;
        default:
          th.addOption(opt, "Continuous", opt == dataParsed.current);
          break;
      }
    });
    Util.trig(this.getId(), "change");
    let n_opt = $(this.getId(true) + " > option").length;
    if (n_opt > 1) {
      this.enable();
    }
  }

  updateSR(data) {
    let dataParsed = JSON.parse(data);
    let th = this;
    $(th.getId(true)).empty();
    // Create option tag foreach result
    dataParsed.list.forEach(function (opt) {
      th.addOption(opt, (1000 / opt).toString(), opt == dataParsed.current);
    });
    Util.trig(th.getId(), "change");
    let n_opt = $(this.getId(true) + " > option").length;
    if (n_opt > 1) {
      this.enable();
    }
  }

  updateDT(data, active) {
    let dataParsed = JSON.parse(data);
    let th = this;
    $(th.getId(true)).empty();
    // Create option tag foreach result
    dataParsed.list.forEach(function (opt) {
      $(th.getId(true)).append(
        $("<option>", {
          value: opt,
          html: opt,
          selected: opt == dataParsed.current ? true : false,
        })
      );
    });
    Util.trig(th.getId(), "change");
    let n_opt = $(this.getId(true) + " > option").length;
    if (n_opt > 1 && active) {
      this.enable();
    }
  }

  addOption(value, html, selected = false) {
    let th = this;
    $(th.getId(true)).append(
      $("<option>", {
        value: value,
        html: html,
        selected: selected,
      })
    );
  }

  getSelectedOption() {
    let options = $(this.getId(true) + " > option");
    let opt;
    for (let i = 0; i < options.length; i++) {
      opt = options[i];
      if (opt.selected === true) {
        break;
      }
    }
    return opt.value;
  }

  select_first() {
    let th = this;
    let data = $(this.getId(true) + " > option")[0].value;
    $(th.getId(true) + " option").each(function (index, opt) {
      if (opt.value == data) {
        opt.selected = true;
      }
    });
  }

  select(data) {
    let th = this;
    $(th.getId(true) + " option").each(function (index, opt) {
      if (opt.value == data) {
        opt.selected = true;
      }
    });
  }
}

export default SelectBox;
