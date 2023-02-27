/**
 * Graph elements -> from ChartJS library
 *
 * @author : MattF
 * @company : DE.TEC.TOR. srl
 * @version : 1.0.0
 **/
import Chart from "chart.js/auto";
import chartjs_plugin_zoom from "chartjs-plugin-zoom";
import Util from "../../core/Util";
import Component from "../../core/Component";
import { colorPalette } from "../../core/Appearance";

Chart.register(chartjs_plugin_zoom);

//--------------------------------------------GRAPH COUNTS per CHANNEL - CHARTjs library--------------------------------------------//
export class Graph extends Component {
  constructor(
    id,
    label,
    title = "",
    setPtc = null,
    numberOfPoints = null,
    pitch = null,
    aspRat = 2
  ) {
    super(id);
    this.label = label;
    this.title = title;
    this.labels = [];
    this.completeLabels = [];
    this.zoomedLabels = [];
    this.zoomedData = [];
    this.numberOfPoints = numberOfPoints == null ? 10 : numberOfPoints;
    this.defaultData = [];
    this.completeData = [];
    for (let i = 0; i < this.numberOfPoints; ++i) {
      this.labels.push(i);
      this.completeLabels.push(i);
    }
    this.labels.forEach((i) => {
      this.defaultData.push({
        x: i,
        y: 0,
      });
      this.completeData.push({
        x: i,
        y: 0,
      });
    });
    this.pitch = pitch == null ? 6 : pitch;
    this.setPtc = setPtc;
    this.setOff = (this.numberOfPoints * setPtc) / 2;
    this.aspect_ratio = aspRat;
    /* Graph HTML values */
    this.height = "350px";
    /* Graph object */
    this.graph = null;
    /* Graph colors available */
    this.colors = colorPalette;
    /* Graph configuration default */
    this.config = {
      type: "line",
      data: {
        datasets: [
          {
            label: "Raw",
            backgroundColor: this.colors.graphGreen,
            borderColor: this.colors.graphGreen,
            fill: false,
            lineTension: 0,
            pointRadius: 1,
            pointStyle: "line",
            showLine: true,
            pointBackgroundColor: this.colors.graphGreen,
            cubicInterpolationMode: "monotone",
            data: null,
          },
        ],
      },
      options: {
        aspectRatio: this.aspect_ratio,
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            type: "linear",
            display: true,
            title: {
              display: true,
              text: "channel",
            },
            ticks: {
              stepSize: this.pitch,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: this.label,
            },
            ticks: {
              beginAtZero: false,
              callback: (val) => {
                if (val > 10000) {
                  return val.toExponential(1);
                } else {
                  return val.toFixed(1);
                }
              },
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: this.title,
          },
          tooltip: {
            mode: "nearest",
            intersect: false,
            callbacks: {
              title: function (context) {
                return "Point: " + context[0].dataIndex;
              },
              label: function (context) {
                let item = context.parsed.y;
                if (item > 10000) {
                  item = item.toExponential(2);
                } else {
                  item = item.toFixed(2);
                }
                return "(" + context.parsed.x + " ; " + item + ")";
              },
            },
          },
          legend: {
            position: "right",
            display: false,
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              filter: function (item, chart) {
                // Logic to remove a particular legend item goes here
                return item.text == null || !item.text.includes("Line");
              },
            },
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: false,
              },
              drag: {
                enabled: true,
                borderColor: this.colors.orange,
                borderWidth: "3",
                backgroundColor: this.colors.lightOrange,
                threshold: 10,
                // drag: this.dragOptions,
                // mode: 'xy'
              },
              pinch: {
                enabled: true,
              },
            },
            pan: {
              enabled: false,
              mode: "x",
            },
          },
        },
        transitions: {
          zoom: {
            animation: {
              duration: 500,
              easing: "easeOutCubic",
            },
          },
        },
      },
    };
    /* Graph axis status */
    this.axisStatus = 0;
    this.anodeConfig = { HIconfig: false, hl: false, sum: false };
  }

  createLabels() {
    this.graph.data.labels = this.labels;
    this.graph.data.datasets[0].data = this.defaultData;
    this.graph.update();
  }

  setAllConfigurations(conf) {
    this.config = conf;
    if (this.graph != null) this.chart.update();
  }

  showLegend() {
    let th = this;
    th.graph.options.plugins.legend.display = true;
    th.graph.update();
  }

  createGraph() {
    this.graph = new Chart(document.getElementById(this.getId()), this.config);
    this.createLabels();
    let th = this;
    this.handlerEvent("updateData", function (ref, newData) {
      th.updateData(newData);
    });

    this.handlerEvent("updateDataDiff", function (ref, newData) {
      th.updateDataDiff(newData);
    });

    this.handlerEvent("updateDataZoom", function (ref, limits) {
      th.updateDataZoom(limits);
    });

    this.handlerEvent("updateDataFrom2D", function (ref, data) {
      th.updateDataFrom2D(data);
    });

    this.handlerEvent("flip", function (ref) {
      th.flip();
    });

    this.handlerEvent("update_ROI", function (ref, data) {
      th.updateROI(data);
    });

    this.handlerEvent("update_postAnalysis", function (ref, data) {
      let labels = data.labels;
      let data_array = data.profile;
      let new_data = [];
      for (let i = 0; i < data_array.length; i++) {
        new_data.push({
          x: labels[i],
          y: data_array[i],
        });
      }
      th.graph.data.datasets[0].data = new_data;
      th.config.options.scales.y.max = 1.2;
      th.config.options.scales.y.min = -0.2;
      th.graph.update();
    });

    this.handlerEvent("addHline", function (ref, data) {
      let labels = data.labels;
      let Ylevel = data.Ylevel;
      let colors = data.colors;
      th.addHline(labels, Ylevel, colors);
      th.graph.update();
    });

    this.handlerEvent("addFit", function (ref, data) {
      th.addFit(data);
    });

    this.handlerEvent("reset", function () {
      th.reset();
    });

    this.handlerEvent("reset2Dzoom", function () {
      th.reset2Dzoom();
    });

    this.handlerEvent("setTitle", function (ref, title) {
      th.setTitle(title);
    });
  }

  setTitle(title) {
    this.config.options.plugins.title.text = title;
    this.graph.update();
  }

  reset() {
    let Ndatasets = this.graph.data.datasets.length;
    if (Ndatasets > 1) {
      for (let i = 1; i < Ndatasets; ++i) {
        this.graph.data.datasets.pop();
      }
    }
    this.defaultData = [];
    for (let i = 0; i < this.numberOfPoints; ++i) {
      this.defaultData.push({ x: this.labels[i], y: 0 });
    }
    this.createLabels();
  }

  reset2Dzoom() {
    this.graph.data.datasets[0].data = this.defaultData; //data_array;
    this.config.options.scales.y.ticks = {
      beginAtZero: false,
    };
    this.graph.update();
  }

  normalize(max) {
    let new_data = [];
    /* Create labels */
    for (let i = 0; i < this.numberOfPoints; ++i) {
      new_data.push({
        x: this.labels[i],
        y: this.defaultData[i].y / max,
      });
    }
    this.defaultData = new_data;
    this.graph.data.datasets[0].data = new_data;
    this.graph.update();
    return this.labels;
  }

  flip() {
    let Nlines = this.graph.data.datasets.length;
    let new_data = [];
    let data_length = 0;
    for (let i = 0; i < Nlines; ++i) {
      data_length = this.graph.data.datasets[i].data.length;
      for (let j = 0; j < data_length; j++) {
        new_data.push({
          x: this.labels[j],
          y: this.graph.data.datasets[i].data[data_length - 1 - j].y,
        });
      }
      this.graph.data.datasets[i].data = new_data;
      new_data = [];
    }
    this.graph.update();
  }

  addFit(data) {
    for (let ds = 0; ds < this.graph.data.datasets.length; ds++) {
      this.graph.data.datasets.pop();
    }
    let labels = data.coordinates_raw;
    let array_raw_data = data.raw_data;
    let array_fit_data = data.fit_data;
    let raw_data = [];
    let fit_data = [];
    for (let i = 0; i < labels.length; ++i) {
      raw_data.push({
        x: labels[i],
        y: array_raw_data[i],
      });
      fit_data.push({
        x: labels[i],
        y: array_fit_data[i],
      });
    }
    this.graph.data.datasets.push({
      data: fit_data,
      label: "Best Fit",
      backgroundColor: this.colors.graphRed,
      borderColor: this.colors.graphRed,
      fill: false,
      lineTension: 0,
      pointRadius: 1,
      pointStyle: "dash",
      showLine: true,
      borderWidth: 1,
      pointBackgroundColor: this.colors.graphRed,
      cubicInterpolationMode: "monotone",
    });
    this.graph.data.datasets.push({
      data: raw_data,
      label: "Raw",
      backgroundColor: this.colors.graphGreen,
      borderColor: this.colors.graphGreen,
      fill: false,
      lineTension: 0,
      pointRadius: 1,
      pointStyle: "line",
      showLine: true,
      borderWidth: 1,
      pointBackgroundColor: this.colors.graphGreen,
      cubicInterpolationMode: "monotone",
    });
    this.graph.options.plugins.legend.display = true;
    this.graph.options.scales.x.title.text = data.axis_title;
    this.graph.options.scales.x.min = labels[0];
    this.graph.options.scales.x.max = labels[-1];
    this.graph.update();
  }

  addVline(Xposition) {
    let annot = {
      type: "line",
      mode: "vertical",
      scaleID: "x-axis-0",
      value: Xposition.toFixed(1),
      borderColor: "black",
      label: {
        content: "Center",
        enabled: true,
        position: "top",
      },
    };
    // this.graph.options.annotation.annotations.push(annot);
    this.graph.update();
  }

  addHline(lab, Ylev, col) {
    let labels = lab;
    let Ylevel = Ylev;
    let colors = col;
    let new_data = [];
    for (let ll = 0; ll < Ylevel.length; ++ll) {
      for (let i = 0; i < labels.length; ++i) {
        new_data.push({
          x: labels[i],
          y: Ylevel[ll],
        });
      }
      this.graph.data.datasets.push({
        data: new_data,
        label: "Line",
        backgroundColor: colors[ll],
        borderColor: colors[ll],
        fill: false,
        lineTension: 0,
        pointRadius: 1,
        pointStyle: "dash",
        showLine: true,
        borderWidth: 1,
        pointBackgroundColor: colors[ll],
        cubicInterpolationMode: "monotone",
      });
      new_data = [];
    }
  }

  setDatasetName(name, dataset) {
    this.graph.data.datasets[dataset].label = name;
    this.graph.update();
  }

  disable_tooltips() {
    this.graph.options.plugins.tooltip.enabled = false;
  }

  enable_tooltips() {
    this.graph.options.plugins.tooltip.enabled = true;
  }

  setAnodeConfig(HIanode, hl, sum) {
    this.anodeConfig.HIconfig = HIanode;
    this.anodeConfig.hl = hl;
    this.anodeConfig.sum = sum;
  }

  switchAnodeConfig(HIanode, hl, sum) {
    this.setAnodeConfig(HIanode, hl, sum);
    this.defaultData = this.plotData(this.completeData);
    this.labels = this.plotLabels(this.defaultData);
    this.createLabels();
  }

  reset_x_axis() {
    let new_labels = [];
    let new_data = [];
    this.completeData.forEach((x, i) => {
      new_labels.push(i);
      new_data.push({
        x: i,
        y: x.y,
      });
    });
    this.completeLabels = new_labels;
    this.completeData = new_data;
    this.axisStatus = 0;
    this.config.options.scales.x.title.text = "channel";
    this.defaultData = this.plotData(this.completeData);
    this.labels = this.plotLabels(this.defaultData);
    this.createLabels();
  }

  change_x_axis(ptc, off, label = "mm") {
    let new_labels = [];
    let new_data = [];
    this.completeData.forEach((x, i) => {
      new_labels.push((i * ptc - off).toFixed(1));
      new_data.push({
        x: new_labels[i],
        y: x.y,
      });
    });
    this.axisStatus = 1;
    this.completeLabels = new_labels;
    this.completeData = new_data;
    this.config.options.scales.x.title.text = label;
    this.defaultData = this.plotData(this.completeData);
    this.labels = this.plotLabels(this.defaultData);
    this.createLabels();
  }

  update_post_analysis(
    ptc,
    off,
    value,
    Ylev,
    col,
    set_pitch = 1,
    label = "mm"
  ) {
    let new_labels = [];
    let new_data = [];
    let up_off = (off - this.graph.data.datasets[0].data[0].x) * ptc;
    /* Create labels */
    for (let i = 0; i < this.graph.data.datasets[0].data.length; ++i) {
      new_labels.push((i * ptc - up_off).toFixed(1));
      new_data.push({
        x: (i * ptc - up_off).toFixed(1),
        y: this.graph.data.datasets[0].data[i].y / value,
      });
    }
    // this.labels = new_labels;
    this.graph.data.labels = new_labels;
    this.config.options.scales.x.title.text = label;
    this.graph.data.datasets[0].data = new_data;
    this.config.options.scales.y.max = 1.2;
    this.config.options.scales.y.min = -0.2;
    this.config.options.scales.x.ticks.stepSize = 1;
    this.addHline(new_labels, Ylev, col);
    this.graph.update();
  }

  plotData(data) {
    let new_data = [];
    let cnt = 0;
    if (this.anodeConfig.HIconfig) {
      if (this.anodeConfig.sum) {
        let dataHi = [];
        data.forEach((x, i) => {
          if (!(i % 2)) {
            dataHi.push(x);
          }
        });
        let dataLow = [];
        data.forEach((x, i) => {
          if (i % 2) {
            dataLow.push(x);
          }
        });
        return dataHi.map((el, i) => {
          return {
            x: this.axisStatus ? i * this.setPtc * 2 - this.setOff : i,
            y: el.y + dataLow[i].y,
          };
        });
      } else if (this.anodeConfig.hl) {
        data.forEach((x, i) => {
          if (!(i % 2)) {
            new_data.push({
              x: this.axisStatus ? cnt * this.setPtc * 2 - this.setOff : cnt,
              y: x.y,
            });
            cnt++;
          }
        });
      } else {
        data.forEach((x, i) => {
          if (i % 2) {
            new_data.push({
              x: this.axisStatus ? cnt * this.setPtc * 2 - this.setOff : cnt,
              y: x.y,
            });
            cnt++;
          }
        });
      }
    } else {
      data.forEach((x, i) => {
        new_data.push({
          x: this.axisStatus ? i * this.setPtc - this.setOff : i,
          y: x.y,
        });
      });
    }
    return new_data;
  }

  plotLabels(data) {
    let labels = [];
    data.forEach((x, i) => {
      if (this.axisStatus == 0) {
        labels.push(i);
      } else {
        labels.push(
          this.anodeConfig.HIconfig
            ? i * this.setPtc * 2 - this.setOff
            : i * this.setPtc - this.setOff
        );
      }
    });
    return labels;
  }

  updateData(newData) {
    let Nlines = this.graph.data.datasets.length;
    if (Nlines > 1) {
      for (let i = 1; i < Nlines; ++i) {
        this.graph.data.datasets.pop();
      }
    }
    let data = JSON.parse(newData);
    let new_data = [];
    data.forEach((x, i) => {
      new_data.push({
        x: this.completeLabels[i],
        y: x,
      });
    });
    this.completeData = new_data;
    this.defaultData = this.plotData(this.completeData);
    this.labels = this.plotLabels(this.defaultData);
    this.createLabels();
  }

  updateDataDiff(newData) {
    let Nlines = this.graph.data.datasets.length;
    if (Nlines > 1) {
      for (let i = 1; i < Nlines; ++i) {
        this.graph.data.datasets.pop();
      }
    }
    let axis = newData.axis;
    let data = JSON.parse(newData.value);
    let int_time = data.slice(0, 1);
    let data_array = data.slice(1, this.numberOfPoints + 1);
    let new_data = [];
    data_array.forEach((x, i) => {
      new_data.push({
        x: this.completeLabels[i],
        y: x,
      });
    });
    this.completeData = new_data;
    this.defaultData = this.plotData(this.completeData);
    this.labels = this.plotLabels(this.defaultData);
    this.config.options.plugins.title.text =
      "Profile " + axis + " counts in last " + int_time + " ms";
    this.createLabels();
  }

  updateDataZoom(limits) {
    let min_lim = Math.round(limits.min) + 1;
    let max_lim = Math.round(limits.max) + 1;
    let new_data = [];
    for (let i = min_lim; i < max_lim + 1; i++) {
      new_data.push({
        x: this.labels[i],
        y: this.defaultData[i],
      });
    }
    this.defaultDataZoom = new_data;
    this.graph.data.datasets[0].data = new_data;
    this.config.options.scales.y.ticks = {
      beginAtZero: false,
    };
    this.graph.update();
  }

  updateDataFrom2D(data) {
    let Nlines = this.graph.data.datasets.length;
    if (Nlines > 1) {
      for (let i = 1; i < Nlines; ++i) {
        this.graph.data.datasets.pop();
      }
    }
    let data_array = data.data;
    let new_data = [];
    for (let i = 0; i < this.numberOfPoints; i++) {
      new_data.push({
        x: this.labels[i],
        y: data_array[i],
      });
    }
    this.defaultData = new_data;
    this.graph.data.datasets[0].data = new_data;
    this.config.options.scales.y.ticks = {
      beginAtZero: false,
    };
    this.graph.update();
  }

  updateROI(data) {
    let Nlines = this.graph.data.datasets.length;
    if (Nlines > 1) {
      for (let i = 1; i < Nlines; ++i) {
        this.graph.data.datasets.pop();
      }
    }
    let limits = data.limits;
    let data_array = data.profile;
    let new_data = [];
    for (let i = 0; i < data_array.length; i++) {
      new_data.push({
        x: limits[0] + i,
        y: data_array[i],
      });
    }
    this.graph.data.datasets[0].data = new_data; //data_array;
    this.config.options.scales.y.ticks = {
      beginAtZero: false,
    };
    this.graph.update();
  }

  disable_zoom() {
    this.graph.options.plugins.zoom.zoom.drag.enabled = false;
  }

  enable_zoom() {
    this.graph.options.plugins.zoom.zoom.drag.enabled = false;
  }

  resetZoom() {
    this.graph.resetZoom();
  }

  getNlines() {
    let Nlines = this.graph.data.datasets.length;
    return Nlines;
  }

  draw(father) {
    super.draw(father);
    $(father).append(
      $("<canvas>", {
        id: this.getId(),
        style: "height:" + this.height + ";",
      })
    );

    this.createGraph();
    this.attachEvents();
  }
}

//--------------------------------------------GRAPH COUNTS INTEGRAL CHAMBERS - CHARTjs library--------------------------------------------//
export class GraphInt extends Component {
  constructor(id, label, title = "", numberOfPoints = null, aspRat = 2) {
    super(id);
    this.sampleId = 0;
    this.colors = colorPalette;
    this.labels = [];
    this.defaultData = [];
    this.numberOfPoints = numberOfPoints == null ? 10 : numberOfPoints;
    for (let i = 0; i < this.numberOfPoints; ++i) {
      this.labels.push(i);
    }
    this.labels.forEach((i) => {
      this.defaultData.push({
        x: i,
        y: 0,
      });
    });
    this.title = title;
    this.height = "350px";
    this.aspect_ratio = aspRat;
    /* Graph object */
    this.graph = null;
    /* Graph configuration default */
    this.config = {
      type: "line",
      data: {
        datasets: [
          {
            label: "Raw",
            backgroundColor: this.colors.graphGreen,
            borderColor: this.colors.graphGreen,
            fill: false,
            lineTension: 0,
            pointRadius: 1,
            pointStyle: "line",
            showLine: true,
            pointBackgroundColor: this.colors.graphGreen,
            cubicInterpolationMode: "monotone",
            data: null,
          },
        ],
      },
      options: {
        aspectRatio: this.aspect_ratio,
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: "Time [ms]",
            },
          },
          y: {
            title: {
              display: true,
              text: label,
            },
            ticks: {
              beginAtZero: false,
              callback: (val) => {
                if (val > 10000) {
                  return val.toExponential(1);
                } else {
                  return val.toFixed(1);
                }
              },
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: this.title,
          },
          tooltip: {
            mode: "nearest",
            intersect: false,
            callbacks: {
              title: function (context) {
                return "Point: " + context[0].dataIndex;
              },
              label: function (context) {
                let item = context.parsed.y;
                if (item > 10000) {
                  item = item.toExponential(2);
                } else {
                  item = item.toFixed(2);
                }
                return "(" + context.parsed.x + " ; " + item + ")";
              },
            },
          },
          legend: {
            position: "right",
            display: false,
            labels: {
              usePointStyle: false,
              boxWidth: 25,
            },
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: false,
              },
              drag: {
                enabled: true,
                borderColor: this.colors.orange,
                borderWidth: "3",
                backgroundColor: this.colors.lightOrange,
                threshold: 10,
              },
              pinch: {
                enabled: true,
              },
            },
            pan: {
              enabled: false,
              mode: "x",
            },
          },
        },
        transitions: {
          zoom: {
            animation: {
              duration: 500,
              easing: "easeOutCubic",
            },
          },
        },
      },
    };
  }

  createLabels() {
    this.graph.data.labels = this.labels;
    this.graph.data.datasets[0].data = this.defaultData;
    this.graph.update();
  }

  setAllConfigurations(conf) {
    this.config = conf;
    if (this.graph != null) this.chart.update();
  }

  createGraph() {
    this.graph = new Chart(document.getElementById(this.getId()), this.config);
    this.createLabels();
    let th = this;
    this.handlerEvent("updateData", function (ref, newData) {
      th.updateData(newData);
    });

    this.handlerEvent("loadData", function (ref, newData) {
      th.loadData(newData);
    });

    this.handlerEvent("reset", function () {
      th.reset();
    });
  }

  reset() {
    this.labels = [];
    this.defaultData = [];
    this.labels.forEach((i) => {
      this.defaultData.push({
        x: i,
        y: 0,
      });
    });
    this.createLabels();
  }

  updateData(newData) {
    let data = JSON.parse(newData);
    let sample_id = data.ID;
    let int_data = data.Data;
    this.graph.data.labels.push(sample_id[0]);
    this.graph.data.datasets[0].data.push({
      x: sample_id[0],
      y: int_data[0],
    });
    if (this.graph.data.datasets[0].data.length > 2000) {
      this.graph.data.datasets[0].data.shift();
      this.graph.data.labels.shift();
    }
    this.graph.update();
  }

  loadData(newData) {
    let th = this;
    this.reset();
    let data = JSON.parse(newData);
    let sample_id = data.ID;
    let int_data = data.Data;
    sample_id.forEach(function (value, index) {
      th.graph.data.labels.push(value);
      th.graph.data.datasets[0].data.push({ x: value, y: int_data[index] });
    });
    this.graph.update();
  }

  disable_tooltips() {
    this.graph.options.plugins.tooltip.enabled = false;
  }

  enable_tooltips() {
    this.graph.options.plugins.tooltip.enabled = true;
  }

  disable_zoom() {
    this.graph.options.plugins.zoom.zoom.drag.enabled = false;
  }

  enable_zoom() {
    this.graph.options.plugins.zoom.zoom.drag.enabled = false;
  }

  resetZoom() {
    this.graph.resetZoom();
  }

  draw(father) {
    super.draw(father);

    $(father).append(
      $("<canvas>", {
        id: this.getId(),
        style: "height:" + this.height + ";",
      })
    );

    this.createGraph();
    this.attachEvents();
  }
}

//--------------------------------------------MEMORY INDICATOR DOUGHNUT - CHARTjs library--------------------------------------------//
export class GraphRound extends Component {
  constructor(id, title = "", width = "100%") {
    super(id);
    this.colors = colorPalette;
    this.config = {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "Memory usage",
            borderAlign: "center",
            borderColor: "#fff",
            backgroundColor: [this.colors.graphGreen, this.colors.grey],
            hoverBackgroundColor: [this.colors.backGreen, this.colors.backGrey],
            data: null,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            labels: {
              usePointStyle: false,
              boxWidth: 25,
            },
          },
          title: {
            display: true,
            text: title,
            fontStyle: "normal",
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + " " + context.parsed + " %";
              },
            },
          },
        },
      },
    };
    this.labels = [];
    this.defaultData = [100, 0];
    this.height = "100px";
    this.width = width;
    this.graph = null;
  }

  build() {}

  createLabels() {
    this.labels = ["Free", "Used"];
    this.graph.data.labels = this.labels;
    this.graph.data.datasets[0].data = this.defaultData;
    this.graph.update();
  }

  setAllConfigurations(conf) {
    this.config = conf;
    if (this.graph != null) this.chart.update();
  }

  createGraph() {
    this.graph = new Chart(document.getElementById(this.getId()), this.config);
    this.createLabels();

    let th = this;
    this.handlerEvent("updateData", function (ref, newData) {
      th.updateData(newData);
    });

    this.handlerEvent("reset", function () {
      th.reset();
    });
  }

  reset() {
    this.graph.clear(); //data.datasets[0].data = null;
    this.createLabels();
  }

  updateData(newData) {
    let data = JSON.parse(newData);
    let tot_size = data.total_size.toFixed(1);
    let free_space = ((data.free * 100) / tot_size).toFixed(1);
    let used_space = (100 - free_space).toFixed(1);
    this.graph.data.labels = ["Free", "Used"];
    this.defaultData = [free_space, used_space];
    this.graph.data.datasets[0].data = this.defaultData;
    if (free_space > 50) {
      this.graph.data.datasets[0].backgroundColor = [
        this.colors.graphGreen,
        this.colors.lightOrange,
      ];
      this.graph.data.datasets[0].hoverBackgroundColor = [
        this.colors.backGreen,
        this.colors.backYellow,
      ];
    } else if (free_space <= 50 && free_space > 25) {
      this.graph.data.datasets[0].backgroundColor = [
        this.colors.graphGreen,
        this.colors.orange,
      ];
      this.graph.data.datasets[0].hoverBackgroundColor = [
        this.colors.backGreen,
        this.colors.backOrange,
      ];
    } else if (free_space <= 25) {
      this.graph.data.datasets[0].backgroundColor = [
        this.colors.graphGreen,
        this.colors.graphRed,
      ];
      this.graph.data.datasets[0].hoverBackgroundColor = [
        this.colors.backGreen,
        this.colors.backRed,
      ];
      Util.notify(
        "Memory status",
        "Available memory below 25 %. Think about downloading/deleting acquisition files",
        "w",
        0
      );
    }
    this.graph.update();
  }

  draw(father) {
    super.draw(father);

    $(father).append(
      $("<div>", {
        style:
          "margin: auto; padding-bottom: 10px; width: 35%; min-width:100px; position:relative;",
      }).append(
        $("<canvas>", {
          class: "text-center",
          id: this.getId(),
        })
      )
    );

    this.createGraph();
    this.attachEvents();
  }
}

//--------------------------------------------GAUGE PLOT - CHARTjs library--------------------------------------------//
export class GraphGauge extends Component {
  constructor(id, title = "", label = "") {
    super(id);
    this.title = title;
    this.label = label;
    this.colors = colorPalette;
    this.config = {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: label,
            borderAlign: "center",
            borderColor: "#fff",
            backgroundColor: [this.colors.graphGreen, this.colors.grey],
            hoverBackgroundColor: [this.colors.backGreen, this.colors.backGrey],
            data: null,
          },
        ],
      },
      options: {
        responsive: true,
        circumference: 180,
        rotation: -90,
        plugins: {
          legend: {
            display: true,
            labels: {
              usePointStyle: false,
              boxWidth: 25,
            },
          },
          title: {
            display: false,
            text: this.title,
            fontStyle: "normal",
            fontSize: 16,
            fontColor: "#000",
            position: "top",
            // padding: '15px',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let data = context.parsed;
                if (data !== null) {
                  data += " %";
                }
                return " " + data;
              },
            },
          },
        },
      },
    };
    this.labels = [];
    this.defaultData = [];
    this.height = "auto";
    this.width = "100%";
    this.graph = null;
  }

  createLabels() {
    this.labels = ["Free", "Used"];
    this.defaultData = [100, 0];
    this.graph.data.labels = this.labels;
    this.graph.data.datasets[0].data = this.defaultData;
    this.graph.update();
  }

  setAllConfigurations(conf) {
    this.config = conf;
    if (this.graph != null) this.chart.update();
  }

  createGraph() {
    this.graph = new Chart(document.getElementById(this.getId()), this.config);
    this.createLabels();

    let th = this;
    this.handlerEvent("updateData", function (ref, newData) {
      th.updateData(newData);
    });

    this.handlerEvent("reset", function () {
      th.reset();
    });
  }

  reset() {
    this.graph.clear(); //data.datasets[0].data = null;
    this.createLabels();
  }

  updateData(newData) {
    let data = JSON.parse(newData);
    let tot_size = data.total_size.toFixed(1);
    let free_space = ((data.free * 100) / tot_size).toFixed(1);
    let used_space = (100 - free_space).toFixed(1);
    this.graph.data.labels = ["Free", "Used"];
    this.graph.data.datasets[0].data = [free_space, used_space];
    if (free_space > 50) {
      this.graph.data.datasets[0].backgroundColor = [
        this.colors.graphGreen,
        this.colors.lightOrange,
      ];
      this.graph.data.datasets[0].hoverBackgroundColor = [
        this.colors.backGreen,
        this.colors.backYellow,
      ];
    } else if (free_space <= 50 && free_space > 25) {
      this.graph.data.datasets[0].backgroundColor = [
        this.colors.graphGreen,
        this.colors.orange,
      ];
      this.graph.data.datasets[0].hoverBackgroundColor = [
        this.colors.backGreen,
        this.colors.backOrange,
      ];
    } else if (free_space <= 25) {
      this.graph.data.datasets[0].backgroundColor = [
        this.colors.graphGreen,
        this.colors.graphRed,
      ];
      this.graph.data.datasets[0].hoverBackgroundColor = [
        this.colors.backGreen,
        this.colors.backRed,
      ];
      Util.notify(
        "Memory status",
        "Available memory below 25 %. Think about downloading/deleting acquisition files",
        "w",
        0
      );
    }
    this.graph.update();
  }

  draw(father) {
    super.draw(father);
    $(father).append(
      $("<canvas>", {
        class: "text-center generic-plot",
        id: this.getId(),
      })
    );
    this.createGraph();
    this.attachEvents();
  }
}
