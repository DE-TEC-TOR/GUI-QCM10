/**
 * DAQ page layout creation function
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import { ID_MAIN_CONTENT } from "../../core/Globals";

export default function create_daq_ui(dev_name, hasPos) {
  switch (dev_name) {
    //---------------------------------------------------------------------QUBENEXT---------------------------------------------------------------------//
    case "QUBENext":
      if (hasPos) {
        $(ID_MAIN_CONTENT)
          .empty()
          .append(
            $("<div>", {
              class: "row",
              style: "padding-top: 20px;",
            })
              .append(
                $("<div>", {
                  id: "area_plot",
                  class: "col-xl-10 col-lg-12 col-md-12 col-sm-12",
                })
                  .append(
                    $("<nav>").append(
                      $("<div>", {
                        class: "nav nav-tabs",
                        role: "tablist",
                      })
                        .append(
                          '<a class="nav-item nav-link active" id="nav-mlic-pos-tab" data-toggle="tab" href="#nav-mlic-pos" role="tab" aria-controls="nav-mlic-pos" aria-selected="true">Combined</a>'
                        )
                        .append(
                          '<a class="nav-item nav-link" id="nav-mlic-tab" data-toggle="tab" href="#nav-mlic" role="tab" aria-controls="nav-mlic" aria-selected="true">Depth</a>'
                        )
                        .append(
                          '<a class="nav-item nav-link" id="nav-position-tab" data-toggle="tab" href="#nav-position" role="tab" aria-controls="nav-position" aria-selected="false">Position</a>'
                        )
                    )
                  )
                  .append(
                    $("<div>", {
                      class: "tab-content",
                      id: "nav-tabContent",
                    })
                      .append(
                        $("<div>", {
                          id: "nav-mlic-pos",
                          class: "tab-pane fade show active",
                          role: "tabpanel",
                        })
                          .append(
                            $("<div>", {
                              class: "row",
                            }).append(
                              $("<div>", {
                                id: "area_graph_depth_comb",
                                class:
                                  "col-xs-12 col-sm-12 col-md-12 col-lg-12",
                              })
                            )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_switch_range_axes_comb",
                                  class: "col-xs-3 col-sm-3 col-md-3 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_pitch_range_axes_comb",
                                  class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_offset_range_axes_comb",
                                  class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                }).append(
                                  $("<div>", {
                                    class: "row justify-content-center",
                                  })
                                    .append(
                                      $("<div>", {
                                        id: "area_reset_default_range_comb",
                                        class:
                                          "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                      })
                                    )
                                    .append(
                                      $("<div>", {
                                        id: "area_reset_zoom_range_comb",
                                        class:
                                          "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                      })
                                    )
                                )
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_graph_profile_x_comb",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_graph_profile_y_comb",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_space_axes_x_comb",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_x_comb",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_space_axes_y_comb",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_y_comb",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_switch_axes_x_comb",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_pitch_axes_x_comb",
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_offset_axes_x_comb",
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_default_x_comb",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_switch_axes_y_comb",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_pitch_axes_y_comb",
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_offset_axes_y_comb",
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_default_y_comb",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
                      )
                      .append(
                        $("<div>", {
                          id: "nav-mlic",
                          class: "tab-pane fade show",
                          role: "tabpanel",
                        })
                          .append(
                            $("<div>", {
                              class: "row",
                            }).append(
                              $("<div>", {
                                id: "area_graph_depth",
                                class:
                                  "col-xs-12 col-sm-12 col-md-12 col-lg-12",
                              })
                            )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  class: "col-xs-3 col-sm-3 col-md-3 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                }).append(
                                  $("<div>", {
                                    class: "row justify-content-center",
                                  })
                                    .append(
                                      $("<div>", {
                                        class:
                                          "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                      })
                                    )
                                    .append(
                                      $("<div>", {
                                        id: "area_reset_zoom_range",
                                        class:
                                          "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                      })
                                    )
                                )
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row",
                            }).append(
                              $("<div>", {
                                id: "area_graph_depth_diff",
                                class:
                                  "col-xs-12 col-sm-12 col-md-12 col-lg-12",
                              })
                            )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_switch_range_axes",
                                  class: "col-xs-3 col-sm-3 col-md-3 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_pitch_range_axes",
                                  class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_offset_range_axes",
                                  class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                                })
                              )
                              .append(
                                $("<div>", {
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                }).append(
                                  $("<div>", {
                                    class: "row justify-content-center",
                                  })
                                    .append(
                                      $("<div>", {
                                        id: "area_reset_default_range",
                                        class:
                                          "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                      })
                                    )
                                    .append(
                                      $("<div>", {
                                        id: "area_reset_zoom_range_diff",
                                        class:
                                          "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                      })
                                    )
                                )
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_graph_firstCh",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_graph_lastCh",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_space_firstCh",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_firstCh",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_space_lastCh",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_lastCh",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_graph_firstCh_diff",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_graph_lastCh_diff",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_space_firstCh_diff",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_firstCh_diff",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_space_lastCh_diff",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_lastCh_diff",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
                      )
                      .append(
                        $("<div>", {
                          id: "nav-position",
                          class: "tab-pane fade",
                          role: "tabpanel",
                        })
                          .append(
                            $("<div>", {
                              class: "row",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_graph_profile_x",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_graph_profile_y",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_space_profile_x",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_x",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_space_profile_y",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_y",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_graph_last_profile_x",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_graph_last_profile_y",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_space_profile_x_diff",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_x_diff",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_space_profile_y_diff",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_y_diff",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_switch_axes_x",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_pitch_axes_x",
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_offset_axes_x",
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_default_x",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_switch_axes_y",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_pitch_axes_y",
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_offset_axes_y",
                                  class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_default_y",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_graph_int_1",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_graph_int_2",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_space_int_1",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_int_1",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_space_int_2",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_int_2",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_graph_int_1_diff",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_graph_int_2_diff",
                                  class:
                                    "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                                })
                              )
                          )
                          .append(
                            $("<div>", {
                              class: "row justify-content-center",
                            })
                              .append(
                                $("<div>", {
                                  id: "area_space_int_1_diff",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_int_1_diff",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_space_int_2_diff",
                                  class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                                })
                              )
                              .append(
                                $("<div>", {
                                  id: "area_reset_zoom_int_2_diff",
                                  class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                                })
                              )
                          )
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
      } else {
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
                        id: "area_graph_depth",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-12",
                      })
                    )
                  )
                  .append(
                    $("<div>", {
                      class: "row justify-content-center",
                    })
                      .append(
                        $("<div>", {
                          class: "col-xs-3 col-sm-3 col-md-3 col-lg-3",
                        })
                      )
                      .append(
                        $("<div>", {
                          class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                        })
                      )
                      .append(
                        $("<div>", {
                          class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                        })
                      )
                      .append(
                        $("<div>", {
                          class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                        }).append(
                          $("<div>", {
                            class: "row justify-content-center",
                          })
                            .append(
                              $("<div>", {
                                class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                              })
                            )
                            .append(
                              $("<div>", {
                                id: "area_reset_zoom_range",
                                class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                              })
                            )
                        )
                      )
                  )
                  .append(
                    $("<div>", {
                      class: "row",
                    }).append(
                      $("<div>", {
                        id: "area_graph_depth_diff",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-12",
                      })
                    )
                  )
                  .append(
                    $("<div>", {
                      class: "row justify-content-center",
                    })
                      .append(
                        $("<div>", {
                          id: "area_switch_range_axes",
                          class: "col-xs-3 col-sm-3 col-md-3 col-lg-3",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_pitch_range_axes",
                          class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_offset_range_axes",
                          class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                        })
                      )
                      .append(
                        $("<div>", {
                          class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                        }).append(
                          $("<div>", {
                            class: "row justify-content-center",
                          })
                            .append(
                              $("<div>", {
                                id: "area_reset_default_range",
                                class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                              })
                            )
                            .append(
                              $("<div>", {
                                id: "area_reset_zoom_range_diff",
                                class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                              })
                            )
                        )
                      )
                  )
                  .append(
                    $("<div>", {
                      class: "row",
                    })
                      .append(
                        $("<div>", {
                          id: "area_graph_firstCh",
                          class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_graph_lastCh",
                          class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                        })
                      )
                  )
                  .append(
                    $("<div>", {
                      class: "row justify-content-center",
                    })
                      .append(
                        $("<div>", {
                          id: "area_space_firstCh",
                          class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_reset_zoom_firstCh",
                          class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_space_lastCh",
                          class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_reset_zoom_lastCh",
                          class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                        })
                      )
                  )
                  .append(
                    $("<div>", {
                      class: "row",
                    })
                      .append(
                        $("<div>", {
                          id: "area_graph_firstCh_diff",
                          class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_graph_lastCh_diff",
                          class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                        })
                      )
                  )
                  .append(
                    $("<div>", {
                      class: "row justify-content-center",
                    })
                      .append(
                        $("<div>", {
                          id: "area_space_firstCh_diff",
                          class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_reset_zoom_firstCh_diff",
                          class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_space_lastCh_diff",
                          class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_reset_zoom_lastCh_diff",
                          class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
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
      }
      break;
    //---------------------------------------------------------------------QEYE---------------------------------------------------------------------//
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
                      id: "area_graph_depth",
                      class: "col-xs-12 col-sm-12 col-md-12 col-lg-12",
                    })
                  )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        class: "col-xs-3 col-sm-3 col-md-3 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      }).append(
                        $("<div>", {
                          class: "row justify-content-center",
                        })
                          .append(
                            $("<div>", {
                              class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                            })
                          )
                          .append(
                            $("<div>", {
                              id: "area_reset_zoom_range",
                              class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                            })
                          )
                      )
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  }).append(
                    $("<div>", {
                      id: "area_graph_depth_diff",
                      class: "col-xs-12 col-sm-12 col-md-12 col-lg-12",
                    })
                  )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_switch_range_axes",
                        class: "col-xs-3 col-sm-3 col-md-3 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_pitch_range_axes",
                        class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_offset_range_axes",
                        class: "col-xs-4 col-sm-4 col-md-4 col-lg-3",
                      })
                    )
                    .append(
                      $("<div>", {
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      }).append(
                        $("<div>", {
                          class: "row justify-content-center",
                        })
                          .append(
                            $("<div>", {
                              id: "area_reset_default_range",
                              class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                            })
                          )
                          .append(
                            $("<div>", {
                              id: "area_reset_zoom_range_diff",
                              class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                            })
                          )
                      )
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_firstCh",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_lastCh",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_firstCh",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_firstCh",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_lastCh",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_lastCh",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_firstCh_diff",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_lastCh_diff",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_firstCh_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_firstCh_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_lastCh_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_lastCh_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
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
    //---------------------------------------------------------------------NEXTQ-Q360---------------------------------------------------------------------//
    case "NextQ":
    case "Q360":
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
                        id: "area_graph_profile_x",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_profile_y",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_profile_x",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_profile_y",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_last_profile_x",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_last_profile_y",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_profile_x_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_x_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_profile_y_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_y_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_switch_axes_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_pitch_axes_x",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_offset_axes_x",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_default_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_switch_axes_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_pitch_axes_y",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_offset_axes_y",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_default_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_int_1",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_int_2",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_int_1",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_1",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_int_2",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_2",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_int_1_diff",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_int_2_diff",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_int_1_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_1_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_int_2_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_2_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
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
                        id: "area_graph_profile_x",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_profile_y",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_profile_x",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_profile_y",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_last_profile_x",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_last_profile_y",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_profile_x_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_x_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_profile_y_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_y_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_switch_axes_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_pitch_axes_x",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_offset_axes_x",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_default_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_switch_axes_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_pitch_axes_y",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_offset_axes_y",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_default_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_int_1",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_int_1_diff",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_int_1",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_1",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_int_1_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_1_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
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
    //---------------------------------------------------------------------AQURACY---------------------------------------------------------------------//
    case "aQuracy":
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
                      id: "area_plot_2d",
                      class: "col-xs-12 col-sm-12 col-md-12 col-lg-8",
                    })
                  )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_projection_x",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_projection_y",
                        class: "col-xs-12 col-sm-12 col-md-12 col-lg-6",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                    style: "margin-bottom:20px",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_x",
                        class: "col-xs-4 col-sm-4 col-md-4 col-lg-4",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_2Dzoom_projx",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_projx",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_y",
                        class: "col-xs-4 col-sm-4 col-md-4 col-lg-4",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_2Dzoom_projy",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_projy",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
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
    case "LightQ":
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
                    id: "",
                    class: "col-xl-12 col-lg-12 col-md-12 col-sm-12",
                  }).append(
                    $("<div>", {
                      class: "row switches-row",
                    })
                      .append(
                        $("<div>", {
                          id: "area_switch_HI_anode",
                          class: "col-2",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_switch_high_low",
                          class: "col-3",
                        })
                      )
                      .append(
                        $("<div>", {
                          id: "area_switch_sum_strips",
                          class: "col-2",
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
                        id: "area_graph_profile_x",
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 graph-container",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_profile_y",
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 graph-container",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_profile_x",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_profile_y",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_last_profile_x",
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 graph-container",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_last_profile_y",
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 graph-container",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_profile_x_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_x_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_profile_y_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_y_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_switch_axes_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_pitch_axes_x",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_offset_axes_x",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_default_x",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_switch_axes_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_pitch_axes_y",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_offset_axes_y",
                        class: "col-xs-2 col-sm-2 col-md-2 col-lg-2",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_default_y",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_int_1",
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 graph-container",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_int_2",
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 graph-container",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_int_1",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_1",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_int_2",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_2",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row",
                  })
                    .append(
                      $("<div>", {
                        id: "area_graph_int_1_diff",
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 graph-container",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_graph_int_2_diff",
                        class:
                          "col-xs-12 col-sm-12 col-md-12 col-lg-6 graph-container",
                      })
                    )
                )
                .append(
                  $("<div>", {
                    class: "row justify-content-center",
                  })
                    .append(
                      $("<div>", {
                        id: "area_space_int_1_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_1_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_space_int_2_diff",
                        class: "col-xs-5 col-sm-5 col-md-5 col-lg-5",
                      })
                    )
                    .append(
                      $("<div>", {
                        id: "area_reset_zoom_int_2_diff",
                        class: "col-xs-1 col-sm-1 col-md-1 col-lg-1",
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
