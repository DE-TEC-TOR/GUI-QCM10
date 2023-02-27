/**
 * Circle status indicator for sidebar
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import Util from "../../core/Util";
import Component from "../../core/Component";
import { colorPalette } from "../../core/Appearance";

class CircleIndicator extends Component {
  constructor(id, label) {
    super(id);
    this.spanId = this.getId() + "_span";
    this.label = Util.isValid(label) ? label : "None";
    this.setClasses("circle_indicator");
    this._state = 99; //99 -> no connection - 0 -> OK - 1 -> problem/error
    //for HV status 99 ->no connection - 0 -> HV off - 1 -> HV on and in range - 2 -> HV out of range - 3 -> unknown state/error
    this.colors = colorPalette;
    this.curColor = this.colors.grey;
  }

  update(state) {
    super.update(state);
    switch (state) {
      case 0:
        this._state = 0;
        this.curColor = this.colors.indGreen;
        $(this.getId(true)).attr("data-value", 0);
        $("#" + this.spanId).css("color", this.colors.indGreen);
        break;
      case 1:
        this._state = 1;
        this.curColor = this.colors.indRed;
        $(this.getId(true)).attr("data-value", 1);
        $("#" + this.spanId).css("color", this.colors.indRed);
        break;
      default:
        this._state = 99;
        this.curColor = this.colors.grey;
        $(this.getId(true)).attr("data-value", 99);
        $("#" + this.spanId).css("color", this.colors.grey);
        break;
    }
  }

  updateHV(state) {
    super.update(state);
    switch (state) {
      case 0:
        this._state = 0;
        this.curColor = this.colors.grey;
        $(this.getId(true)).attr("data-value", 0);
        $("#" + this.spanId).css("color", this.colors.grey);
        break;
      case 1:
        this._state = 1;
        this.curColor = this.colors.indGreen;
        $(this.getId(true)).attr("data-value", 1);
        $("#" + this.spanId).css("color", this.colors.indGreen);
        break;
      case 2:
        this._state = 2;
        this.curColor = this.colors.indRed;
        $(this.getId(true)).attr("data-value", 2);
        $("#" + this.spanId).css("color", this.colors.indRed);
        break;
      default:
        this._state = 3;
        this.curColor = this.colors.indRed;
        $(this.getId(true)).attr("data-value", 3);
        $("#" + this.spanId).css("color", this.colors.indRed);
        break;
    }
  }

  draw(father) {
    super.draw(father);

    $(father).append(
      $("<p>", {
        id: this.getId(),
        class: this.getClasses(),
        "data-value": this.getState(),
      })
        .append($("<span>", { id: this.spanId, class: "mdi mdi-brightness-1" }))
        .append(this.label)
    );
    $("#" + this.spanId).css("color", this.curColor);
    this.attachEvents();
  }

  getState() {
    return this._state;
  }
}

export default CircleIndicator;
