/**
 *  SHARED TOOLS
 *  Contains all application shared functions
 *
 * @author : MattF
 * @version : 1.0.0
 *
 */
//Generate User Manual link functionality in all pages
function generateUMlink(detector) {
  document.getElementById("manual_img").addEventListener("click", function () {
    modalDefault.setTitle("Infos");
    modalDefault.setBody(
      $("<div>", {
        class: "container",
      })
        .append(
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
                  for: "visu_manu",
                  html: "Manufacturer",
                })
              )
            )
            .append(
              $("<input>", {
                type: "text",
                class: "form-control select_box",
                style: "text-align: right",
                id: "visu_manu",
                disabled: true,
                value: prod_soft_version.prod,
              })
            )
        )
        .append(
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
                  for: "visu_product",
                  html: "Product name",
                })
              )
            )
            .append(
              $("<input>", {
                type: "text",
                class: "form-control select_box",
                style: "text-align: right",
                id: "visu_product",
                disabled: true,
                value: prod_soft_version.product,
              })
            )
        )
        .append(
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
                  for: "visu_manual",
                  html: "User manual",
                })
              )
            )
            .append(
              $("<input>", {
                type: "text",
                class: "form-control select_box",
                style: "text-align: right",
                id: "visu_manual",
                disabled: true,
                value: prod_soft_version.manual,
              })
            )
        )
        .append(
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
                  for: "visu_version",
                  html: "Software",
                })
              )
            )
            .append(
              $("<input>", {
                type: "text",
                class: "form-control select_box",
                style: "text-align: right",
                id: "visu_version",
                disabled: true,
                value: prod_soft_version.rel,
              })
            )
            .append(
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
                      for: "visu_year",
                      html: "Rel. date",
                    })
                  )
                )
                .append(
                  $("<input>", {
                    type: "text",
                    class: "form-control select_box",
                    style: "text-align: right",
                    id: "visu_year",
                    disabled: true,
                    value: prod_soft_version.date,
                  })
                )
            )
        )
    );
    // LOAD FILE
    modalDefault.addButton(
      "btn_read_manual",
      "success",
      "Read User Manual",
      false,
      function () {
        window.open(manual_path + detector + ".pdf", "resizeable,scrollbar");
        modalDefault.hide();
      }
    );
    // DISMISS MODAL
    modalDefault.addButton("btn_close", "secondary", "Close", true);
    modalDefault.show();
  });
}
