/**
 * Calibration page layout creation function
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import { ID_MAIN_CONTENT } from "../../core/Globals";

export function create_calibration_ui(dev_name) {
  switch (dev_name) {
    //---------------------------------------------------------------------NEXTQ-Q360-QUBENEXT with STRIPS---------------------------------------------------------------------//
    case "NextQ":
    case "Q360":
    case "LightQ":
    case "QUBENext":
      $(ID_MAIN_CONTENT)
        .empty()
        .append(
          $("<div>", {
            class: "row",
            style: "padding-top: 20px;",
          })
            .append(
              $("<div>", {
                id: "",
                class: "col-xl-10 col-lg-12 col-md-12 col-sm-12",
              })
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration integral sensor 1",
                        })
                      )
                    )
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration integral sensor 2",
                        })
                      )
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_calib_int1",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_int2",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration X channels",
                        })
                      )
                    )
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration Y channels",
                        })
                      )
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_calib_x_odd",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_x_even",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_y_odd",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_y_even",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                )
            )
            .append(
              $("<div>", {
                id: "sidebar",
                class: "col-xl-2 col-lg-12 col-md-12 col-sm-12",
              })
            )
        );
      break;
    //---------------------------------------------------------------------QPLUS---------------------------------------------------------------------//
    case "QPlus":
      $(ID_MAIN_CONTENT)
        .empty()
        .append(
          $("<div>", {
            class: "row",
            style: "padding-top: 20px;",
          })
            .append(
              $("<div>", {
                id: "",
                class: "col-xl-10 col-lg-12 col-md-12 col-sm-12",
              })
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration X channels",
                        })
                      )
                    )
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration Y channels",
                        })
                      )
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_calib_x_odd",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_x_even",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_y_odd",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_y_even",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                )
            )
            .append(
              $("<div>", {
                id: "sidebar",
                class: "col-xl-2 col-lg-12 col-md-12 col-sm-12",
              })
            )
        );
      break;
    //---------------------------------------------------------------------BMI02---------------------------------------------------------------------//
    case "BMI02":
      $(ID_MAIN_CONTENT)
        .empty()
        .append(
          $("<div>", {
            class: "row",
            style: "padding-top: 20px;",
          })
            .append(
              $("<div>", {
                id: "",
                class: "col-xl-10 col-lg-12 col-md-12 col-sm-12",
              })
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  }).append(
                    $("<div>", {
                      class:
                        "col-xs-6 col-sm-6 col-md-6 col-lg-6 center-block text-center title_space",
                    }).append(
                      $("<span>", {
                        class: "main_title",
                        html: "Calibration integral sensor",
                      })
                    )
                  )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  }).append(
                    $("<div>", {
                      id: "area_calib_int1",
                      class: "col-xs-6 col-sm-6 col-md-6 col-lg-6",
                    })
                  )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration X channels",
                        })
                      )
                    )
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration Y channels",
                        })
                      )
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_calib_x_odd",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_x_even",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_y_odd",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_y_even",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                )
            )
            .append(
              $("<div>", {
                id: "sidebar",
                class: "col-xl-2 col-lg-12 col-md-12 col-sm-12",
              })
            )
        );
      break;
    //---------------------------------------------------------------------BMI01---------------------------------------------------------------------//
    case "BMI01":
      $(ID_MAIN_CONTENT)
        .empty()
        .append(
          $("<div>", {
            class: "row",
            style: "padding-top: 20px;",
          })
            .append(
              $("<div>", {
                id: "",
                class: "col-xl-10 col-lg-12 col-md-12 col-sm-12",
              })
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-6 col-sm-6 col-md-6 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration integral sensor 1",
                        })
                      )
                    )
                    .append(
                      $("<div>", {
                        class:
                          "col-xs-6 col-sm-6 col-md-6 col-lg-6 center-block text-center title_space",
                      }).append(
                        $("<span>", {
                          class: "main_title",
                          html: "Calibration integral sensor 2",
                        })
                      )
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_calib_int1",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_int2",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-6",
                      })
                    )
                )
            )
            .append(
              $("<div>", {
                id: "sidebar",
                class: "col-xl-2 col-lg-12 col-md-12 col-sm-12",
              })
            )
        );
      break;
    default:
      break;
  }
}

export function create_range_calibration_ui(dev_name) {
  switch (dev_name) {
    case "QUBENext":
    case "QEye":
      $(ID_MAIN_CONTENT)
        .empty()
        .append(
          $("<div>", {
            class: "row",
            style: "padding-top: 20px;",
          })
            .append(
              $("<div>", {
                id: "",
                class: "col-xl-10 col-lg-12 col-md-12 col-sm-12",
              })
                .append(
                  $("<div>", {
                    class: "row",
                  }).append(
                    $("<div>", {
                      class:
                        "col-xs-12 col-sm-12 col-md-12 col-lg-12 center-block text-center title_space",
                    }).append(
                      $("<span>", {
                        class: "main_title",
                        html: "Calibration Z channels",
                      })
                    )
                  )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_calib_0",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_1",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_2",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_calib_3",
                        class: "col-xs-6 col-sm-6 col-md-6 col-lg-3",
                      })
                    )
                )
            )
            .append(
              $("<div>", {
                id: "sidebar",
                class: "col-xl-2 col-lg-12 col-md-12 col-sm-12",
              })
            )
        );

      break;
    default:
      break;
  }
}
