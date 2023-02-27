/**
 * Circle status indicator for sidebar
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import Util from "../../core/Util";
import Component from "../../core/Component";

class Switch extends Component {
  constructor(id, label, state = false, clsAttr = "el-switch-style") {
    super(id);
    let th = this;
    this.label = Util.isValid(label) ? label : "none";
    this.doubleLabel = null;
    this._state = state;
    this.inputId = this.getId() + "_input";
    this.clsAttr = clsAttr;

    this.handlerEvent("set_state", function (ref, data) {
      th.set_state(data);
    });
  }

  enable() {
    $(this.getId(true)).prop("disabled", false);
  }

  disable() {
    $(this.getId(true)).prop("disabled", true);
  }

  checkLabel() {
    let labels = this.label.split("/");
    if (labels.length == 2) {
      return (
        "<span class='text-orange'>" +
        labels[0] +
        "</span>/<span class='text-green'>" +
        labels[1] +
        "</span>"
      );
    } else {
      return this.label;
    }
  }
  show() {
    $("#" + this.getId() + "_container").css("display", "block");
  }

  hide() {
    $("#" + this.getId() + "_container").css("display", "none");
  }

  setUp() {
    SOCK.send(this.getId(), null, true);
  }

  getState() {
    return this._state;
  }

  switch_state() {
    if (this.getState()) {
      this._state = false;
      $("#" + this.inputId).attr("checked", false);
      Util.log("Switch status changed to " + this._state);
    } else {
      this._state = true;
      $("#" + this.inputId).attr("checked", true);
      Util.log("Switch status changed to " + this._state);
    }
  }

  set_state(status) {
    if (this._state != status) {
      this._state = status;
      $("#" + this.inputId).attr("checked", status);
      Util.log("Switch status changed to " + this._status);
    } else {
      Util.log("Switch status already OK");
    }
  }

  draw(father) {
    let newLabel = this.checkLabel();
    super.draw(father);
    $(father).append(
      $("<div>", {
        id: this.getId() + "_container",
      }).append(
        $("<p>", {
          id: this.getId(),
          style: "margin: 0px",
          "data-value": this.getState(),
        })
          .append(
            $("<label>", {
              class: "el-switch el-switch-sm",
              for: this.getId(),
            })
              .append(
                $("<input>", {
                  type: "checkbox",
                  name: "switch",
                  checked: this._state,
                  id: this.inputId,
                })
              )
              .append(
                $("<span>", {
                  class: this.clsAttr,
                })
              )
          )
          .append(
            $("<span>", {
              class: "margin-r",
              html: newLabel,
              style:
                "font-size: 12px; color: #000; vertical-align: top; margin: 4px; text-align: right;",
            })
          )
      )
    );

    this.attachEvents();
    this.checkLabel();
  }
}

export default Switch;
