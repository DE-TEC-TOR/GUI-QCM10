/**
 * Bootstrap generic modal
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import Util from "../../core/Util";

class Modal {
  /**
   * Constructor
   *
   * @param id    Modal Id
   * @param size  Modal size
   */
  constructor(id, size, centered) {
    // Modal id
    this._id = id;
    // Modal size
    switch (size.toLowerCase()) {
      default:
      case "default":
        this._size = "";
        break;
      case "small":
        this._size = "modal-sm";
        break;
      case "big":
        this._size = "modal-lg";
        break;
    }

    // Modal position
    this._pos == centered ? "modal-dialog-centered" : "";

    // Modal title
    this._title = "";

    //Modal js object
    this.modalObj = null;
  }

  /**
   * Draw modal
   *
   * @param father    Modal's father object
   */
  draw(father) {
    $(father).append(
      $("<div>", {
        id: this._id,
        class: "modal fade",
        tabindex: -1,
        role: "dialog",
      }).append(
        $("<div>", {
          class: "modal-dialog " + this._pos + " " + this._size,
          role: "document",
        }).append(
          $("<div>", { class: "modal-content" })
            .append($("<div>", { class: "modal-header" }))
            .append($("<div>", { class: "modal-body" }))
            .append(
              $("<div>", {
                class: "modal-footer",
                id: this._id + "_standard-footer",
              })
            )
        )
      )
    );

    // On hidden event, reset modal
    let th = this;
    Util.attachEvent("#" + this._id, "hidden.bs.modal", function () {
      th.reset();
    });
  }

  /**
   * Show modal
   */
  show() {
    this.do("show");
    // this.modalObj.show();
  }

  /**
   * Hide modal
   */
  hide() {
    this.do("hide");
    // this.modalObj.hide();
  }

  /**
   * Execute a modal action
   *
   * @param action
   */
  do(action) {
    $("#" + this._id).modal(action);
  }

  /**
   * Reset modal
   */
  reset() {
    $("#" + this._id + " .modal-header").empty();
    $("#" + this._id + " .modal-body").empty();
    // $('#'+ this._id + ' .modal-footer').empty();
    $("#" + this._id + "_standard-footer").empty();
  }

  /**
   * Set the model title
   *
   * @param title
   */
  setTitle(title) {
    if (Util.isValid(title)) this._title = title;
    $("#" + this._id + " .modal-header")
      .empty()
      .append($("<h5>", { class: "modal-title", html: this._title }));
  }

  /**
   * Set the model body
   *
   * @param body
   */
  setBody(body) {
    $("#" + this._id + " .modal-body").append(body);
  }

  /**
   * Add modal button into model footer
   *
   * @param type
   * @param text
   * @param dismiss
   */
  addButton(id, type, text, dismiss = false, action = null) {
    let btn_class = "";
    // Select bootstrap class
    switch (type.toLowerCase()) {
      case "success":
        btn_class = "btn-success";
        break;
      case "outline-success":
        btn_class = "btn-outline-success";
        break;
      case "warning":
        btn_class = "btn-warning";
        break;
      case "info":
        btn_class = "btn-info";
        break;
      case "danger":
        btn_class = "btn-danger";
        break;
      case "secondary":
        btn_class = "btn-secondary";
        break;
      case "primary":
      default:
        btn_class = "btn-primary";
        break;
    }

    // $('#'+ this._id + ' .modal-footer')
    $("#" + this._id + "_standard-footer").append(
      $("<button>", {
        id: id,
        type: "button",
        class: "btn " + btn_class,
        "data-bs-dismiss": dismiss ? "modal" : "",
        html: text,
      })
    );

    // Add action to button
    Util.attachEvent("#" + id, "click", action);
  }
}

export default Modal;
