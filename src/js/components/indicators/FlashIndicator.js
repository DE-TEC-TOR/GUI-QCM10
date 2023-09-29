/**
 * GIF Loader indicator
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import Component from "../../core/Component";

class FlashIndicator extends Component {
  constructor(id, text) {
    super(id);
    this.text = text;
    let th = this;

    this.handlerEvent("activate", function () {
      th.activate();
    });
    this.handlerEvent("deactivate", function () {
      th.deactivate();
    });
  }

  activate() {
    //activate loader GIF
    $(this.getId(true)).css("display", "inline-block");
  }

  deactivate() {
    // deactivate loader GIF
    $(this.getId(true)).css("display", "none");
  }

  draw(father) {
    super.draw(father);
    $(father).append(
      $("<div>", {
        id: this.getId(),
        class: "justify-content-center btn btn-sm flash_indicator pulse",
        style: "width:100%; display: none;",
      }).append('<p class="text-center">' + this.text + "</p>")
    );
    this.attachEvents();
  }
}

export default FlashIndicator;
