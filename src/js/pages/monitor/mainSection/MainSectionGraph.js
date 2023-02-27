/**
 * Device main section for DAQ pages -> for device integrated software
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 */
import Util from "../../../core/Util";
import Button from "../../../components/controllers/Button";
import Switch from "../../../components/controllers/Switch";
import { NumberBox } from "../../../components/controllers/TextBoxes";
import { Graph, GraphInt } from "../../../components/graphics/Graphs";
import { validateNumInput } from "../../../core/Helpers";

const segmPos = 16;
const segmRng = 32;

class MainSectionGraphs {
  constructor(detConfig, notifier, webSock) {
    this.detConfig = { ...detConfig };
    this.devName = detConfig.devName;
    this.hasPos = detConfig.hasPos;
    this.hasRng = detConfig.hasRng;
    this.has2D = detConfig.has2D;
    this.hasInt = detConfig.hasInt;
    this.nChX = detConfig.nChX;
    this.nChY = detConfig.nChY;
    this.nChZ = detConfig.nChZ;
    this.nChInt = detConfig.nChInt;
    this.posPitch = detConfig.posPitch;
    this.rngPitch = detConfig.rngPitch;
    this.posResolution = detConfig.posResolution;
    this.rngResolution = detConfig.rngResolution;
    this.daqStatus = 0; //0 -> idle - 1 -> daqRunning - 2 -> streamingRunning - 3 -> aQuracyDaqRunning
    this.components = {
      graphs: { posGraphs: {}, rngGraphs: {}, intGraphs: {} },
      controls: { xAxis: {}, yAxis: {}, zAxis: {}, integrals: {}, shared: {} },
    };
    this.ws = webSock; //reference to the main page socket
    this.ntf = notifier;
    this.graph_array = [];
    this.graph2d_array = [];
    this.graph_array_depth = [];
    this.graph_array_profiles_x = [];
    this.graph_array_profiles_y = [];
    this.graph_array_integrals = [];
    this.graph_array_depth_comb = [];
    this.graph_array_profiles_x_comb = [];
    this.graph_array_profiles_y_comb = [];
  }

  build() {
    this.createGraphs();
    this.createControls();
  }

  createGraphs() {
    if (this.hasPos) {
      let graph_profile_x = new Graph(
        "graph_profile_x",
        "#",
        "Profile X total counts",
        this.posResolution,
        this.nChX,
        Math.round(this.nChX / segmPos)
      );
      let graph_profile_y = new Graph(
        "graph_profile_y",
        "#",
        "Profile Y total counts",
        this.posResolution,
        this.nChY,
        Math.round(this.nChY / segmPos)
      );
      let graph_last_profile_x = new Graph(
        "graph_last_profile_x",
        "#",
        "Profile X counts in last --- ms",
        this.posResolution,
        this.nChX,
        Math.round(this.nChX / segmPos)
      );
      let graph_last_profile_y = new Graph(
        "graph_last_profile_y",
        "#",
        "Profile Y counts in last --- ms",
        this.posResolution,
        this.nChY,
        Math.round(this.nChY / segmPos)
      );
      this.components.graphs.posGraphs.posXgraph = graph_profile_x;
      this.graph_array_profiles_x.push(graph_profile_x);
      this.components.graphs.posGraphs.posYgraph = graph_profile_y;
      this.graph_array_profiles_y.push(graph_profile_y);
      this.components.graphs.posGraphs.posXlastGraph = graph_last_profile_x;
      this.graph_array_profiles_x.push(graph_last_profile_x);
      this.components.graphs.posGraphs.posYlastGraph = graph_last_profile_y;
      this.graph_array_profiles_y.push(graph_last_profile_y);
      this.graph_array.push(graph_profile_x);
      this.graph_array.push(graph_profile_y);
      this.graph_array.push(graph_last_profile_x);
      this.graph_array.push(graph_last_profile_y);
    }
    if (this.hasInt) {
      let graph_int = [];
      let graph_last_int = [];
      for (let i = 0; i < this.nChInt; i++) {
        graph_int.push(
          new GraphInt(
            "graph_int_" + (i + 1),
            "#",
            "Integral sensor " + (i + 1) + " counts",
            0
          )
        );
        graph_last_int.push(
          new GraphInt(
            "graph_int_" + (i + 1) + "_diff",
            "#",
            "Integral sensor " + (i + 1) + " differential counts",
            0
          )
        );
        this.components.graphs.intGraphs["graph_int_" + (i + 1)] = graph_int[i];
        this.graph_array_integrals.push(graph_int[i]);
        this.components.graphs.intGraphs["graph_int_" + (i + 1) + "_diff"] =
          graph_last_int[i];
        this.graph_array_integrals.push(graph_last_int[i]);
        this.graph_array.push(graph_int[i]);
        this.graph_array.push(graph_last_int[i]);
      }
    }
    if (this.devName == "QPlus") {
      let graph_int_1 = new GraphInt(
        "graph_int_1",
        "#",
        "Central dot counts",
        0
      );
      let graph_last_int_1 = new GraphInt(
        "graph_int_1_diff",
        "#",
        "Central dot differential counts",
        0
      );
      this.components.graphs.intGraphs.graphInt1 = graph_int_1;
      this.graph_array_integrals.push(graph_int_1);
      this.components.graphs.intGraphs.graphLastInt1 = graph_last_int_1;
      this.graph_array_integrals.push(graph_last_int_1);
      this.graph_array.push(graph_int_1);
      this.graph_array.push(graph_last_int_1);
    }
    if (this.hasRng) {
      let graph_depth = new Graph(
        "graph_depth",
        "#",
        "Profile Z total counts",
        this.nChZ,
        Math.round(this.nChZ / segmRng),
        4
      );
      let graph_last_depth = new Graph(
        "graph_last_depth",
        "#",
        "Profile Z counts in last --- ms",
        this.nChZ,
        Math.round(this.nChZ / segmRng),
        4
      );
      let graph_firstCh = new GraphInt("graph_firstCh", "#", "CH 0 counts", 0);
      let graph_lastCh = new GraphInt(
        "graph_lastCh",
        "#",
        "CH " + (this.nChZ - 1) + " counts",
        0
      );
      let graph_last_firstCh = new GraphInt(
        "graph_firstCh_diff",
        "#",
        "CH 0 differential counts",
        0
      );
      let graph_last_lastCh = new GraphInt(
        "graph_lastCh_diff",
        "#",
        "CH " + (this.nChZ - 1) + " differential counts",
        0
      );
      this.components.graphs.rngGraphs.rngGraph = graph_depth;
      this.graph_array_depth.push(graph_depth);
      this.components.graphs.rngGraphs.rngLastGraph = graph_last_depth;
      this.graph_array_depth.push(graph_last_depth);
      this.components.graphs.rngGraphs.firstChGraph = graph_firstCh;
      this.components.graphs.rngGraphs.firstChLastGraph = graph_last_firstCh;
      this.components.graphs.rngGraphs.lastChGraph = graph_lastCh;
      this.components.graphs.rngGraphs.lastChLastGraph = graph_last_lastCh;
      this.graph_array.push(graph_depth);
      this.graph_array.push(graph_last_depth);
      this.graph_array.push(graph_firstCh);
      this.graph_array.push(graph_last_firstCh);
      this.graph_array.push(graph_lastCh);
      this.graph_array.push(graph_last_lastCh);
    }
    if (this.hasPos && this.hasRng) {
      let graph_depth_comb = new Graph(
        "graph_depth_comb",
        "#",
        "Profile Z total counts",
        this.nChZ,
        Math.round(this.nChZ / segmRng),
        4
      );
      let graph_profile_x_comb = new Graph(
        "graph_profile_x_comb",
        "#",
        "Profile X total counts",
        this.nChX,
        Math.round(this.nChX / segmPos)
      );
      let graph_profile_y_comb = new Graph(
        "graph_profile_y_comb",
        "#",
        "Profile Y total counts",
        this.nChY,
        Math.round(this.nChY / segmPos)
      );
      this.components.graphs.rngGraphs.rngGraphComb = graph_depth_comb;
      this.graph_array_depth.push(graph_depth_comb);
      this.components.graphs.posGraphs.posXgraphComb = graph_profile_x_comb;
      this.graph_array_profiles_x.push(graph_profile_x_comb);
      this.components.graphs.posGraphs.posYgraphComb = graph_profile_y_comb;
      this.graph_array_profiles_y.push(graph_profile_y_comb);
      this.graph_array.push(graph_depth_comb);
      this.graph_array.push(graph_profile_x_comb);
      this.graph_array.push(graph_profile_y_comb);
    }
  }

  createControls() {
    let th = this;
    //Position plots
    if (this.hasPos) {
      let pitch_selector_x = new NumberBox(
        "pitch_axes_x",
        "X pitch [mm]",
        this.posPitch
      );
      let pitch_selector_y = new NumberBox(
        "pitch_axes_y",
        "Y pitch [mm]",
        this.posPitch
      );
      let offset_selector_x = new NumberBox(
        "offset_axes_x",
        "X offset [mm]",
        (this.nChX / 2) * this.posPitch
      );
      let offset_selector_y = new NumberBox(
        "offset_axes_y",
        "Y offset [mm]",
        (this.nChY / 2) * this.posPitch
      );
      let axes_switch_x = new Switch("switch_axes_x", "X in mm");
      let axes_switch_y = new Switch("switch_axes_y", "Y in mm");
      let reset_default_x = new Button(
        "reset_default_x",
        '<span id="reset_val_x" class="mdi mdi-restore"></span>',
        1,
        true,
        "Reset plot to default"
      );
      let reset_default_y = new Button(
        "reset_default_y",
        '<span id="reset_val_y" class="mdi mdi-restore"></span>',
        1,
        true,
        "Reset plot to default"
      );
      let reset_zoom_x = new Button(
        "reset_zoom_x",
        '<span id="reset_zoom_x" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let reset_zoom_y = new Button(
        "reset_zoom_y",
        '<span id="reset_zoom_y" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let reset_zoom_x_diff = new Button(
        "reset_zoom_x_diff",
        '<span id="reset_zoom_x_diff" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let reset_zoom_y_diff = new Button(
        "reset_zoom_y_diff",
        '<span id="reset_zoom_y_diff" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      this.components.controls.xAxis.pitchSel = pitch_selector_x;
      this.components.controls.xAxis.offsetSel = offset_selector_x;
      this.components.controls.xAxis.axesSwitch = axes_switch_x;
      this.components.controls.xAxis.resetDef = reset_default_x;
      this.components.controls.xAxis.resetZoom = reset_zoom_x;
      this.components.controls.xAxis.resetZoomDiff = reset_zoom_x_diff;
      this.components.controls.yAxis.pitchSel = pitch_selector_y;
      this.components.controls.yAxis.offsetSel = offset_selector_y;
      this.components.controls.yAxis.axesSwitch = axes_switch_y;
      this.components.controls.yAxis.resetDef = reset_default_y;
      this.components.controls.yAxis.resetZoom = reset_zoom_y;
      this.components.controls.yAxis.resetZoomDiff = reset_zoom_y_diff;
      //X AXIS CONTROLS
      reset_zoom_x.addClickAction(function () {
        th.components.graphs.posGraphs.posXgraph.resetZoom();
      });
      reset_zoom_x_diff.addClickAction(function () {
        th.components.graphs.posGraphs.posXlastGraph.resetZoom();
      });
      pitch_selector_x.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(pitch_selector_x.getId(true)))
          ? validateNumInput(pitch_selector_x.getId(true))
          : th.posPitch;
        pitch_selector_x.update(value);
      });
      offset_selector_x.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(offset_selector_x.getId(true)))
          ? validateNumInput(offset_selector_x.getId(true))
          : ((th.nChX - 1) / 2) * th.posPitch;
        offset_selector_x.update(value);
      });
      axes_switch_x.handlerEvent("click", function () {
        if (axes_switch_x.getState()) {
          axes_switch_x.switch_state();
          th.graph_array_profiles_x.map((x) => {
            x.reset_x_axis();
          });
        } else {
          if ($(pitch_selector_x.getId(true)).val() == "") {
            this.ntf.notify("No pitch selected", "w", 2);
          } else {
            axes_switch_x.switch_state();
            let ptc = !isNaN(validateNumInput(pitch_selector_x.getId(true)))
              ? validateNumInput(pitch_selector_x.getId(true))
              : th.posResolution;
            let off = !isNaN(validateNumInput(offset_selector_x.getId(true)))
              ? validateNumInput(offset_selector_x.getId(true))
              : ((th.nChX - 1) / 2) * th.posResolution;
            th.graph_array_profiles_x.map((x) => {
              x.change_x_axis(ptc, off);
            });
          }
        }
      });
      reset_default_x.addClickAction(function () {
        pitch_selector_x.update(th.posResolution);
        offset_selector_x.update(((th.nChX - 1) / 2) * th.posResolution);
        if (axes_switch_x.getState()) {
          axes_switch_x.switch_state();
          th.graph_array_profiles_x.map((x) => {
            x.reset_x_axis();
          });
        }
      });
      //Y AXIS CONTROLS
      reset_zoom_y.addClickAction(function () {
        th.components.graphs.posGraphs.posYgraph.resetZoom();
      });
      reset_zoom_y_diff.addClickAction(function () {
        th.components.graphs.posGraphs.posYlastGraph.resetZoom();
      });
      pitch_selector_y.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(pitch_selector_y.getId(true)))
          ? validateNumInput(pitch_selector_y.getId(true))
          : th.posPitch;
        pitch_selector_y.update(value);
      });
      offset_selector_y.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(offset_selector_y.getId(true)))
          ? validateNumInput(offset_selector_y.getId(true))
          : ((th.nChY - 1) / 2) * th.posPitch;
        offset_selector_y.update(value);
      });
      axes_switch_y.handlerEvent("click", function () {
        if (axes_switch_y.getState()) {
          axes_switch_y.switch_state();
          th.graph_array_profiles_y.map((x) => {
            x.reset_x_axis();
          });
        } else {
          if ($(pitch_selector_y.getId(true)).val() == "") {
            this.ntf.notify("No pitch selected", "w", 2);
          } else {
            axes_switch_y.switch_state();
            let ptc = !isNaN(validateNumInput(pitch_selector_y.getId(true)))
              ? validateNumInput(pitch_selector_y.getId(true))
              : th.posResolution;
            let off = !isNaN(validateNumInput(offset_selector_y.getId(true)))
              ? validateNumInput(offset_selector_y.getId(true))
              : ((th.nChX - 1) / 2) * th.posResolution;
            th.graph_array_profiles_y.map((x) => {
              x.change_x_axis(ptc, off);
            });
          }
        }
      });
      reset_default_y.addClickAction(function () {
        pitch_selector_y.update(th.posResolution);
        offset_selector_y.update(((th.nChY - 1) / 2) * th.posResolution);
        if (axes_switch_y.getState()) {
          axes_switch_y.switch_state();
          th.graph_array_profiles_y.map((x) => {
            x.reset_x_axis();
          });
        }
      });
    }
    if (this.hasInt) {
      Object.values(th.components.graphs.intGraphs).forEach((elem, idx) => {
        let name = elem.getId().replace("graph", "reset_zoom");
        let int_reset = new Button(
          name,
          '<span id="' + name + '" class="mdi mdi-undo"></span>',
          1,
          true,
          "Reset zoom"
        );
        int_reset.handlerEvent("click", function () {
          elem.resetZoom();
        });
        this.components.controls.integrals[name] = int_reset;
      });
    }
    if (this.hasRng) {
      let range_pitch_selector = new NumberBox(
        "pitch_range_axes",
        "Z pitch [mm w.e.]",
        this.rngResolution
      );
      let range_offset_selector = new NumberBox(
        "offset_range_axes",
        "Z offset [mm w.e.]",
        0
      );
      let range_axes_switch = new Switch("switch_range_axes", "Z in mm w.e.");
      let reset_default_range = new Button(
        "reset_default_range",
        '<span id="reset_val" class="mdi mdi-restore"></span>',
        1,
        true,
        "Reset plot to default"
      );
      let reset_zoom_range = new Button(
        "reset_zoom_range",
        '<span id="reset_zoom_range" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let reset_zoom_range_diff = new Button(
        "reset_zoom_range_diff",
        '<span id="reset_zoom_range_diff" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let reset_zoom_firstCh = new Button(
        "reset_zoom_firstCh",
        '<span id="reset_zoom_firstCh" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let reset_zoom_firstCh_diff = new Button(
        "reset_zoom_firstCh_diff",
        '<span id="reset_zoom_firstCh_diff" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let reset_zoom_lastCh = new Button(
        "reset_zoom_lastCh",
        '<span id="reset_zoom_lastCh" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let reset_zoom_lastCh_diff = new Button(
        "reset_zoom_lastCh_diff",
        '<span id="reset_zoom_lastCh_diff" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      this.components.controls.zAxis.pitchSel = range_pitch_selector;
      this.components.controls.zAxis.offsetSel = range_offset_selector;
      this.components.controls.zAxis.axesSwitch = range_axes_switch;
      this.components.controls.zAxis.resetDef = reset_default_range;
      this.components.controls.zAxis.resetZoom = reset_zoom_range;
      this.components.controls.zAxis.resetZoomDiff = reset_zoom_range_diff;
      this.components.controls.zAxis.resetZoomFirstCh = reset_zoom_firstCh;
      this.components.controls.zAxis.resetZoomFirstChDiff =
        reset_zoom_firstCh_diff;
      this.components.controls.zAxis.resetZoomLastCh = reset_zoom_lastCh;
      this.components.controls.zAxis.resetZoomLastChDiff =
        reset_zoom_lastCh_diff;
      reset_zoom_range.addClickAction(function () {
        th.components.graphs.rngGraphs.rngGraph.resetZoom();
      });
      reset_zoom_range_diff.addClickAction(function () {
        th.components.graphs.rngGraphs.rngLastGraph.resetZoom();
      });
      reset_zoom_firstCh.addClickAction(function () {
        th.components.graphs.rngGraphs.firstChGraph.resetZoom();
      });
      reset_zoom_lastCh.addClickAction(function () {
        th.components.graphs.rngGraphs.lastChGraph.resetZoom();
      });
      reset_zoom_firstCh_diff.addClickAction(function () {
        th.components.graphs.rngGraphs.firstChLastGraph.resetZoom();
      });
      reset_zoom_lastCh_diff.addClickAction(function () {
        th.components.graphs.rngGraphs.lastChLastGraph.resetZoom();
      });
      range_pitch_selector.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(range_pitch_selector.getId(true)))
          ? validateNumInput(range_pitch_selector.getId(true))
          : th.rngResolution;
        range_pitch_selector.update(value);
      });
      range_offset_selector.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(range_offset_selector.getId(true)))
          ? validateNumInput(range_offset_selector.getId(true))
          : 0;
        range_offset_selector.update(value);
      });
      range_axes_switch.handlerEvent("click", function () {
        if (th.daqStatus != 0) {
          this.ntf.notify("Data streaming or DAQ ongoing. Stop before!", "w");
          return;
        } else {
          if (range_axes_switch.getState()) {
            range_axes_switch.switch_state();
            th.graph_array_depth.map((x) => {
              x.reset_x_axis();
            });
          } else {
            if ($(range_pitch_selector.getId(true)).val() == "") {
              this.ntf.notify("No pitch selected", "w", 2);
            } else {
              range_axes_switch.switch_state();
              let ptc = !isNaN(
                validateNumInput(range_pitch_selector.getId(true))
              )
                ? validateNumInput(range_pitch_selector.getId(true))
                : th.rngResolution;
              let off = !isNaN(
                validateNumInput(range_offset_selector.getId(true))
              )
                ? validateNumInput(range_offset_selector.getId(true))
                : 0;
              th.graph_array_depth.map((x) => {
                x.change_x_axis(ptc, off, "mm w.e.");
              });
            }
          }
        }
      });
      reset_default_range.addClickAction(function () {
        range_pitch_selector.update(th.rngResolution);
        range_offset_selector.update(0);
        if (range_axes_switch.getState()) {
          range_axes_switch.switch_state();
          th.graph_array_depth.map((x) => {
            x.reset_x_axis();
          });
        }
      });
    }
    if (this.hasPos && this.hasRng) {
      let pitch_selector_x_comb = new NumberBox(
        "pitch_axes_x_comb",
        "X pitch [mm]",
        this.posResolution
      );
      let offset_selector_x_comb = new NumberBox(
        "offset_axes_x_comb",
        "X offset [mm]",
        ((this.nChX - 1) / 2) * this.posResolution
      );
      let axes_switch_x_comb = new Switch("switch_axes_x_comb", "X in mm");
      let reset_default_x_comb = new Button(
        "reset_default_x_comb",
        '<span id="reset_val" class="mdi mdi-restore"></span>',
        1,
        true,
        "Reset plot to default"
      );
      let reset_zoom_x_comb = new Button(
        "reset_zoom_x_comb",
        '<span id="reset_zoom_x_comb" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let pitch_selector_y_comb = new NumberBox(
        "pitch_axes_y_comb",
        "Y pitch [mm]",
        this.posResolution
      );
      let offset_selector_y_comb = new NumberBox(
        "offset_axes_y_comb",
        "Y offset [mm]",
        ((this.nChY - 1) / 2) * this.posResolution
      );
      let axes_switch_y_comb = new Switch("switch_axes_y_comb", "Y in mm");
      let reset_default_y_comb = new Button(
        "reset_default_y_comb",
        '<span id="reset_val" class="mdi mdi-restore"></span>',
        1,
        true,
        "Reset plot to default"
      );
      let reset_zoom_y_comb = new Button(
        "reset_zoom_y_comb",
        '<span id="reset_zoom_y_comb" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      let range_pitch_selector_comb = new NumberBox(
        "pitch_range_axes_comb",
        "Z pitch [mm w.e.]",
        this.rngResolution
      );
      let range_offset_selector_comb = new NumberBox(
        "offset_range_axes_comb",
        "Z offset [mm w.e.]",
        0
      );
      let range_axes_switch_comb = new Switch(
        "switch_range_axes_comb",
        "Z in mm w.e."
      );
      let reset_default_range_comb = new Button(
        "reset_default_range_comb",
        '<span id="reset_val" class="mdi mdi-restore"></span>',
        1,
        true,
        "Reset plot to default"
      );
      let reset_zoom_range_comb = new Button(
        "reset_zoom_range_comb",
        '<span id="reset_zoom_range_comb" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      this.components.controls.xAxis.pitchSelComb = pitch_selector_x_comb;
      this.components.controls.xAxis.offsetSelComb = offset_selector_x_comb;
      this.components.controls.xAxis.axesSwitchComb = axes_switch_x_comb;
      this.components.controls.xAxis.resetDefComb = reset_default_x_comb;
      this.components.controls.xAxis.resetZoomComb = reset_zoom_x_comb;
      this.components.controls.yAxis.pitchSelComb = pitch_selector_y_comb;
      this.components.controls.yAxis.offsetSelComb = offset_selector_y_comb;
      this.components.controls.yAxis.axesSwitchComb = axes_switch_y_comb;
      this.components.controls.yAxis.resetDefComb = reset_default_y_comb;
      this.components.controls.yAxis.resetZoomComb = reset_zoom_y_comb;
      this.components.controls.zAxis.offsetSelComb = range_offset_selector_comb;
      this.components.controls.zAxis.pitchSelComb = range_pitch_selector_comb;
      this.components.controls.zAxis.axesSwitchComb = range_axes_switch_comb;
      this.components.controls.zAxis.resetDefComb = reset_default_range_comb;
      this.components.controls.zAxis.resetZoomComb = reset_zoom_range_comb;

      reset_zoom_x_comb.addClickAction(function () {
        th.components.graphs.rngGraphs.posXgraphComb.resetZoom();
      });
      reset_zoom_y_comb.addClickAction(function () {
        th.components.graphs.rngGraphs.posYgraphComb.resetZoom();
      });
      reset_zoom_range_comb.addClickAction(function () {
        th.components.graphs.rngGraphs.rngGraphComb.resetZoom();
      });
      //Range (Z) profile
      range_pitch_selector_comb.handlerEvent("change", function () {
        let value = !isNaN(
          validateNumInput(range_pitch_selector_comb.getId(true))
        )
          ? validateNumInput(range_pitch_selector_comb.getId(true))
          : th.rngResolution;
        range_pitch_selector_comb.update(value);
      });
      range_offset_selector_comb.handlerEvent("change", function () {
        let value = !isNaN(
          validateNumInput(range_offset_selector_comb.getId(true))
        )
          ? validateNumInput(range_offset_selector_comb.getId(true))
          : 0;
        range_offset_selector_comb.update(value);
      });
      range_axes_switch_comb.handlerEvent("click", function () {
        if (th.daqStatus != 0) {
          this.ntf.notify("Data streaming or DAQ ongoing. Stop before!", "w");
          return;
        } else {
          if (range_axes_switch_comb.getState()) {
            range_axes_switch_comb.switch_state();
            th.components.graphs.rngGraphs.rngGraphComb.reset_x_axis();
          } else {
            if ($(range_pitch_selector_comb.getId(true)).val() == "") {
              this.ntf.notify("No pitch selected", "w");
            } else {
              range_axes_switch_comb.switch_state();
              let ptc = !isNaN(
                validateNumInput(range_pitch_selector_comb.getId(true))
              )
                ? validateNumInput(range_pitch_selector_comb.getId(true))
                : th.rngResolution;
              let off = !isNaN(
                validateNumInput(range_offset_selector_comb.getId(true))
              )
                ? validateNumInput(range_offset_selector_comb.getId(true))
                : 0;
              th.components.graphs.rngGraphs.rngGraphComb.change_x_axis(
                ptc,
                off,
                "mm w.e."
              );
            }
          }
        }
      });
      reset_default_range_comb.addClickAction(function () {
        range_pitch_selector_comb.update(th.rngResolution);
        range_offset_selector_comb.update(0);
        if (range_axes_switch_comb.getState()) {
          range_axes_switch_comb.switch_state();
          th.components.graphs.rngGraphs.rngGraphComb.reset_x_axis();
        }
      });
      //X profile
      pitch_selector_x_comb.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(pitch_selector_x_comb.getId(true)))
          ? validateNumInput(pitch_selector_x_comb.getId(true))
          : th.posResolution;
        pitch_selector_x_comb.update(value);
      });
      offset_selector_x_comb.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(offset_selector_x_comb.getId(true)))
          ? validateNumInput(offset_selector_x_comb.getId(true))
          : ((th.nChX - 1) / 2) * th.posResolution;
        offset_selector_x_comb.update(value);
      });
      axes_switch_x_comb.handlerEvent("click", function () {
        if (th.daqStatus != 0) {
          this.ntf.notify("Data streaming or DAQ ongoing. Stop before!", "w");
          return;
        } else {
          if (axes_switch_x_comb.getState()) {
            axes_switch_x_comb.switch_state();
            th.components.graphs.posGraphs.posXgraphComb.reset_x_axis();
          } else {
            if ($(pitch_selector_x_comb.getId(true)).val() == "") {
              this.ntf.notify("No pitch selected", "w");
            } else {
              axes_switch_x_comb.switch_state();
              let ptc = !isNaN(
                validateNumInput(pitch_selector_x_comb.getId(true))
              )
                ? validateNumInput(pitch_selector_x_comb.getId(true))
                : th.posResolution;
              let off = !isNaN(
                validateNumInput(offset_selector_x_comb.getId(true))
              )
                ? validateNumInput(offset_selector_x_comb.getId(true))
                : ((th.nChX - 1) / 2) * th.posResolution;
              th.components.graphs.posGraphs.posXgraphComb.change_x_axis(
                ptc,
                off
              );
            }
          }
        }
      });
      reset_default_x_comb.addClickAction(function () {
        pitch_selector_x_comb.update(th.posResolution);
        offset_selector_x_comb.update(((th.nChX - 1) / 2) * th.posResolution);
        if (axes_switch_x_comb.getState()) {
          axes_switch_x_comb.switch_state();
          th.components.graphs.posGraphs.posXgraphComb.reset_x_axis();
        }
      });
      //Y profile
      pitch_selector_y_comb.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(pitch_selector_y_comb.getId(true)))
          ? validateNumInput(pitch_selector_y_comb.getId(true))
          : th.posResolution;
        pitch_selector_y_comb.update(value);
      });
      offset_selector_y_comb.handlerEvent("change", function () {
        let value = !isNaN(validateNumInput(offset_selector_y_comb.getId(true)))
          ? validateNumInput(offset_selector_y_comb.getId(true))
          : ((th.nChY - 1) / 2) * th.posResolution;
        offset_selector_y_comb.update(value);
      });
      axes_switch_y_comb.handlerEvent("click", function () {
        if (axes_switch_y_comb.getState()) {
          axes_switch_y_comb.switch_state();
          th.components.graphs.posGraphs.posYgraphComb.reset_x_axis();
        } else {
          if ($(pitch_selector_y_comb.getId(true)).val() == "") {
            this.ntf.notify("No pitch selected", "w");
          } else {
            axes_switch_y_comb.switch_state();
            let ptc = !isNaN(
              validateNumInput(pitch_selector_y_comb.getId(true))
            )
              ? validateNumInput(pitch_selector_y_comb.getId(true))
              : th.posResolution;
            let off = !isNaN(
              validateNumInput(offset_selector_y_comb.getId(true))
            )
              ? validateNumInput(offset_selector_y_comb.getId(true))
              : ((th.nChY - 1) / 2) * th.posResolution;
            th.components.graphs.posGraphs.posYgraphComb.change_x_axis(
              ptc,
              off
            );
          }
        }
      });
      reset_default_y_comb.addClickAction(function () {
        pitch_selector_y_comb.update(th.posResolution);
        offset_selector_y_comb.update(((th.nChY - 1) / 2) * th.posResolution);
        if (axes_switch_y_comb.getState()) {
          axes_switch_y_comb.switch_state();
          th.components.graphs.posGraphs.posYgraphComb.reset_x_axis();
        }
      });
    }
    if (this.has2D) {
      let reset_zoom_projx = new Button(
        "btn_reset_zoom_projx",
        '<span id="reset_zoom_projx" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      reset_zoom_projx.handlerEvent("click", function () {
        th.components.graphs.posGraphs.pos2DprojX.resetZoom();
      });
      let reset_zoom_projy = new Button(
        "btn_reset_zoom_projy",
        '<span id="reset_zoom_projy" class="mdi mdi-undo"></span>',
        1,
        true,
        "Reset zoom"
      );
      reset_zoom_projy.handlerEvent("click", function () {
        th.components.graphs.posGraphs.pos2DprojY.resetZoom();
      });
      let reset_2Dzoom_projx = new Button(
        "btn_reset_2Dzoom_projx",
        '<span id="reset_2Dzoom_projx" class="mdi mdi-arrow-expand-all"></span>',
        1,
        true,
        "Reset to full range"
      );
      reset_2Dzoom_projx.handlerEvent("click", function () {
        th.components.graphs.posGraphs.pos2DprojX.reset2Dzoom();
      });
      let reset_2Dzoom_projy = new Button(
        "btn_reset_2Dzoom_projy",
        '<span id="reset_2Dzoom_projy" class="mdi mdi-arrow-expand-all"></span>',
        1,
        true,
        "Reset to full range"
      );
      reset_2Dzoom_projy.handlerEvent("click", function () {
        th.components.graphs.posGraphs.pos2DprojY.reset2Dzoom();
      });
    }
    //only LightQ
    let HIanode_switch = new Switch(
      "switch_HI_anode",
      "L1 (STD)/L2 (DBL)",
      false,
      "el-doubleSwitch-style"
    );
    let high_low_switch = new Switch(
      "switch_high_low",
      "low/high",
      false,
      "el-doubleSwitch-style"
    );
    let sum_strips_switch = new Switch("switch_sum_strips", "sum strips?");
    this.components.controls.shared.HIanode_switch = HIanode_switch;
    this.components.controls.shared.high_low_switch = high_low_switch;
    this.components.controls.shared.sum_strips_switch = sum_strips_switch;
    HIanode_switch.handlerEvent("click", function () {
      if (HIanode_switch.getState()) {
        HIanode_switch.switch_state();
        high_low_switch.set_state(false);
        sum_strips_switch.set_state(false);
        high_low_switch.hide();
        sum_strips_switch.hide();
        th.setupProfilesAxis(false);
        th.ws.send("set_HIanode", "false");
      } else {
        high_low_switch.show();
        sum_strips_switch.show();
        HIanode_switch.switch_state();
        th.setupProfilesAxis(true);
        th.ws.send("set_HIanode", "true");
      }
      th.configurePlots(HIanode_switch, high_low_switch, sum_strips_switch);
    });
    high_low_switch.handlerEvent("click", function () {
      if (high_low_switch.getState()) {
        high_low_switch.switch_state();
        th.ws.send("set_high-low", "false");
      } else {
        high_low_switch.switch_state();
        th.ws.send("set_high-low", "true");
      }
      th.configurePlots(HIanode_switch, high_low_switch, sum_strips_switch);
    });
    sum_strips_switch.handlerEvent("click", function () {
      if (sum_strips_switch.getState()) {
        sum_strips_switch.switch_state();
        high_low_switch.enable();
        th.ws.send("set_sum_strips", "false");
      } else {
        sum_strips_switch.switch_state();
        high_low_switch.disable();
        th.ws.send("set_sum_strips", "true");
      }
      th.configurePlots(HIanode_switch, high_low_switch, sum_strips_switch);
    });
  }
  configurePlots(HIsw, hlsw, sumsw) {
    this.graph_array_profiles_x.forEach((x) => {
      x.switchAnodeConfig(HIsw.getState(), hlsw.getState(), sumsw.getState());
    });
    this.graph_array_profiles_y.forEach((x) => {
      x.switchAnodeConfig(HIsw.getState(), hlsw.getState(), sumsw.getState());
    });
  }
  setupProfilesAxis(mode) {
    if (mode) {
      this.posPitch = this.detConfig.posPitch * 2;
      this.components.controls.xAxis.pitchSel.update(this.posPitch);
      this.components.controls.yAxis.pitchSel.update(this.posPitch);
    } else {
      this.posPitch = this.detConfig.posPitch;
      this.components.controls.xAxis.pitchSel.update(this.posPitch);
      this.components.controls.yAxis.pitchSel.update(this.posPitch);
    }
  }
  updateProfiles(axis, mode, data) {
    let graphs = [];
    switch (axis) {
      case "x":
        if (mode == "int") {
          graphs = this.graph_array_profiles_x.filter(
            (x) => !x.getId().includes("last")
          );
        }
        if (mode == "diff") {
          graphs = this.graph_array_profiles_x.filter((x) =>
            x.getId().includes("last")
          );
        }
        break;
      case "y":
        if (mode == "int") {
          graphs = this.graph_array_profiles_y.filter(
            (x) => !x.getId().includes("last")
          );
        }
        if (mode == "diff") {
          graphs = this.graph_array_profiles_y.filter((x) =>
            x.getId().includes("last")
          );
        }
        break;
      case "z":
        if (mode == "int") {
          graphs = this.graph_array_depth.filter(
            (x) => !x.getId().includes("last")
          );
        }
        if (mode == "diff") {
          graphs = this.graph_array_depth.filter((x) =>
            x.getId().includes("last")
          );
        }
        break;
      default:
        return;
    }
    if (mode == "int") graphs.map((x) => x.updateData(data));
    if (mode == "diff") graphs.map((x) => x.updateDataDiff(data));
  }

  updateIntegrals(name, mode, data) {
    let graph = null;
    switch (mode) {
      case "int":
        graph = this.graph_array_integrals.filter(
          (x) => !x.getId().includes("diff") && x.getId().includes(name)
        );
        break;
      case "diff":
        graph = this.graph_array_integrals.filter(
          (x) => x.getId().includes("diff") && x.getId().includes(name)
        );
        break;
      default:
        return;
    }
    graph[0].updateData(data);
  }

  loadIntegrals(name, mode, data) {
    let graph = null;
    switch (mode) {
      case "int":
        graph = this.graph_array_integrals.filter(
          (x) => !x.getId().includes("diff") && x.getId().includes(name)
        );
        break;
      case "diff":
        graph = this.graph_array_integrals.filter(
          (x) => x.getId().includes("diff") && x.getId().includes(name)
        );
        break;
      default:
        return;
    }
    graph[0].loadData(data);
  }

  getGraphs() {
    return this.graph_array;
  }

  getProfileGraphs() {
    let profile_graphs = [];
    this.graph_array_profiles_x.forEach((x) => profile_graphs.push(x));
    this.graph_array_profiles_y.forEach((x) => profile_graphs.push(x));
    return profile_graphs;
  }

  getControls() {
    return this.components.controls;
  }

  setDaqStatus(val) {
    this.daqStatus = parseInt(val);
  }
}

export default MainSectionGraphs;
