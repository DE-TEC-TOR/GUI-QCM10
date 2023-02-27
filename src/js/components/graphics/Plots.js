/**
 * Plot elements -> with plotlyjs library 
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Plotly from 'plotly.js/dist/plotly';
import Util from '../../core/Util';
import Component from '../../core/Component';
import { colorPalette } from '../../core/Appearance';
import LOGO from './LOGO.js';
//--------------------------------------------PLOT COUNTS per CHANNEL - PLOTLYjs library--------------------------------------------//
export class Plot extends Component {
    constructor(id, label, title = '', numberOfPoints, hh, ww, pitch) {
        super(id);
        this.title = title;
        this.colors = colorPalette;
        this.data = [{
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            name: 'Raw',
            line: {
                color: this.colors.graphGreen,
                width: 2
            },
            hovertemplate: '<i>X</i>: %{x}' +
                '<br><i>Y</i>: %{y}' +
                '<extra></extra>'
        }];
        this.layout = {
            font: {
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                size: 10,
                color: '#666',
            },
            title: {
                text: '<b>' + title + '</b>',
                font: {
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    size: 12
                },
            },
            xaxis: {
                title: {
                    text: 'channel',
                },
                autotick: false,
                ticks: 'outside',
                tick0: 0,
                dtick: pitch,
                tickangle: -45,
                zerolinecolor: '#666',
                zerolinewidth: 2,
            },
            yaxis: {
                autorange: true,
                title: {
                    text: '#',
                },
                zerolinecolor: '#666',
                zerolinewidth: 2,
            },
            shapes: [],
            autosize: true

        };
        this.config = {
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: 'profile',
                height: 600,
                width: 800,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            scrollZoom: true,
            displayModeBar: true,
            showSendToCloud: false,
            displaylogo: false,
            modeBarButtonsToRemove: ['toImage', 'hoverCompareCartesian'],
            responsive: true
        }
        this.numberOfPoints = numberOfPoints;
        this.labels = [];
        this.defaultData = [];
        this.xmin = 0;
        this.xmax = 0;
        this.ymin = 0;
        this.ymax = 0;

        this.height = hh+'px';
        this.width = ww+'px';
    }

    createDefaults() {
        this.labels = [];
        /* Create labels */
        for (let i = 0; i < this.numberOfPoints; ++i) {
            this.labels.push(i);
        }
        this.xmin = this.labels[0];
        this.xmax = this.labels[this.numberOfPoints-1];
        /* Create default data */
        for (let i = 0; i < this.numberOfPoints; ++i) {
            this.defaultData.push(0);
        }
        this.ymin = this.defaultData[0];
        this.ymax = this.defaultData[this.numberOfPoints - 1];

        this.data[0].x = this.labels;
        this.data[0].y = this.defaultData;
    }

    createGraph() {
        this.createDefaults();
        Plotly.react(this.getId(), this.data, this.layout, this.config);

        let th = this;
        this.handlerEvent('updateData', function (ref, newData) {
            th.updateData(newData);
        });

        this.handlerEvent('updateDataDiff', function (ref, newData) {
            th.updateDataDiff(newData);
        });

        this.handlerEvent('addVline', function(ref, Xlevel) {
            //Line Horizontal
            th.addVline(Xlevel);
        });

        this.handlerEvent('addHline', function(ref, Ylevel){
            //Line Horizontal
            th.addHline(Ylevel);
        });
    }

    updateData (newData) {
        // this.reset();
        let data = JSON.parse(newData);
        let data_array = data.slice(1, this.numberOfPoints + 1);
        this.data[0].y = data_array;
        Plotly.react(this.getId(), this.data, this.layout, this.config);
        this.ymin = th.data[0].y[0];
        this.ymax = th.data[0].y[this.numberOfPoints - 1];
    }

    updateDataDiff (newData) {
        let axis = newData.axis;
        let data = JSON.parse(newData.value);
        let int_time = data.slice(0, 1);
        let data_array = data.slice(1, this.numberOfPoints + 1);
        this.data[0].y = data_array;
        this.layout.title.text = "<b> Profile " + axis + " counts in last " + int_time + " ms </b>";
        Plotly.react(this.getId(), this.data, this.layout, this.config);
        this.ymin = this.data[0].y[0];
        this.ymax = this.data[0].y[this.numberOfPoints - 1];
    }

    addVline(level){
        this.layout.shapes.push({
            type: 'line',
            x0: level,
            y0: this.ymin,
            x1: level,
            y1: this.ymax,
            line: {
                color: this.colors.orange,
                width: 2,
                dash: 'dash'
            }
        });
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    addHline (level){
        this.layout.shapes.push({
            type: 'line',
            x0: this.xmin,
            y0: level,
            x1: this.xmax,
            y1: level,
            line: {
                color: this.colors.orange,
                width: 2,
                dash: 'dash'
            }
        });
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    reset() {
        this.defaultData = [];
        this.data[0].x = this.labels;
        this.data[0].y = this.defaultData;
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    disable_tooltips() {
        this.layout.hovermode = false;
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    enable_tooltips() {
        this.layout.hovermode = 'closest';
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    resize(w) {
        var update = {
            height: '350px',
            width: w + 'px'
        }
        Plotly.relayout(this.getId(), update);
    }

    change_x_axis(ptc, off, set_pitch = 1, label = 'mm'){
        let new_labels = [];
        /* Create labels */
        for (let i = 0; i < this.numberOfPoints; ++i) {
            // new_labels.push(((i - (this.numberOfPoints-1)/2) * ptc).toFixed(1));
            new_labels.push(((i*ptc) - off).toFixed(1));
        }
        this.xmin = new_labels[0];
        this.xmax = new_labels[this.numberOfPoints - 1];
        this.data[0].x = new_labels;
        let new_layout = {
            font: {
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                size: 10,
                color: '#666',
            },
            title: {
                text: '<b>' + this.title + '</b>',
                font: {
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    size: 12
                },
            },
            xaxis: {
                title: {
                    text: label,
                },
                autotick: false,
                ticks: 'outside',
                tick0: 0,
                dtick: ptc * set_pitch,
                tickangle: -45,
                zerolinecolor: '#666',
                zerolinewidth: 2,
            },
            yaxis: {
                autorange: true,
                title: {
                    text: '#',
                },
                zerolinecolor: '#666',
                zerolinewidth: 2,
            },
            shapes: [],
            autosize: true

        };
        Plotly.react(this.getId(), this.data, new_layout, this.config);
    }

    reset_x_axis(){
        this.labels = [];
        /* Create labels */
        for (let i = 0; i < this.numberOfPoints; ++i) {
            // this.labels.push(((i - 31) * 0.6).toFixed(1));
            this.labels.push(i);
        }
        this.xmin = this.labels[0];
        this.xmax = this.labels[this.numberOfPoints - 1];
        this.data[0].x = this.labels;
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    draw(father) {
        super.draw(father);
        $(father)
            .append($('<div>', {
                id: this.getId(),
                height: this.height,
                width: this.width
            }));
        this.createGraph();
        this.attachEvents();
    }
}

//--------------------------------------------PLOT COUNTS INTEGRAL CHAMBERS - PLOTLYjs library--------------------------------------------//
export class PlotInt extends Component {
    constructor(id, label, title = '', numberOfPoints, hh, ww) {
        super(id);
        this.colors = colorPalette;
        /* Graph configuration default */
        this.data = [{
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            name: 'Raw',
            line: {
                color: this.colors.graphGreen,
                width: 2
            },
            hovertemplate: '<i>X</i>: %{x}' +
                '<br><i>Y</i>: %{y}' +
                '<extra></extra>'
        }];
        this.layout = {
            font: {
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                size: 10,
                color: '#666',
            },
            title: {
                text: '<b>' + title + '</b>',
                font: {
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    size: 12
                },
            },
            xaxis: {
                title: {
                    text: 'time [ms]',
                },
                autorange: true,
                autotick: true,
                ticks: 'outside',
                tickangle: -45,
                zerolinecolor: '#666',
                zerolinewidth: 2
            },
            yaxis: {
                autorange: true,
                title: {
                    text: '#',
                },
                zerolinecolor: '#666',
                zerolinewidth: 2
            },
            shapes: [],
            autosize: true
        };
        this.config = {
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: 'profile',
                height: 600,
                width: 800,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            scrollZoom: true,
            displayModeBar: true,
            showSendToCloud: false,
            displaylogo: false,
            modeBarButtonsToRemove: ['toImage', 'hoverCompareCartesian'],
            responsive: true
        }
        this.numberOfPoints = numberOfPoints;
        this.labels = [];
        this.defaultData = [];
        for (let i = 0; i < this.numberOfPoints; ++i) {
            this.labels.push(i);
        }
        for (let i = 0; i < this.numberOfPoints; ++i) {
            this.defaultData.push(0);
        }
        this.xmin = this.labels[0];
        this.xmax = this.labels[this.numberOfPoints - 1];
        this.ymin = this.defaultData[0];
        this.ymax = this.defaultData[this.numberOfPoints - 1];
        this.height = hh+'px';
        this.width = ww+'px';
    }

    createDefaults() {
        this.data[0].x = this.labels;
        this.data[0].y = this.defaultData;
    }

    createGraph() {
        this.createDefaults();
        Plotly.react(this.getId(), this.data, this.layout, this.config);
        let th = this;
        this.handlerEvent('updateData', function (ref, newData) {
            th.updateData(newData);
        });
        this.handlerEvent('loadData', function (ref, newData) {
            th.loadData(newData);
        });
        this.handlerEvent('addVline', function (ref, Xlevel) {
            //Line Horizontal
            th.addVline(Xlevel);
        });

        this.handlerEvent('addHline', function (ref, Ylevel) {
            //Line Horizontal
            th.addHline(Ylevel);
        });
    }

    updateData (newData) {
        let data = JSON.parse(newData);
        let sample_id = data.ID;
        let int_data = data.Data;
        sample_id.forEach(function (value, index) {
            this.data[0].x.push(value);
            this.data[0].y.push(int_data[index]);
        });
        Plotly.react(this.getId(), this.data, this.layout, this.config);
        this.ymin = this.data[0].y[0];
        this.ymax = this.data[0].y[this.numberOfPoints - 1];
    }

    loadData (newData) {
        this.createDefaults();
        let data = JSON.parse(newData);
        let sample_id = data.ID;
        let int_data = data.Data;
        sample_id.forEach(function (value, index) {
            this.labels.push(value);
            this.defaultData.push(int_data[index]);
        });
        this.ymin = this.defaultData[0];
        this.ymax = this.defaultData[this.numberOfPoints - 1];
        this.data[0].x = this.labels;
        this.data[0].y = this.defaultData;
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    addVline (level) {
        this.layout.shapes.push({
            type: 'line',
            x0: level,
            y0: this.ymin,
            x1: level,
            y1: this.ymax,
            line: {
                color: this.colors.orange,
                width: 2,
                dash: 'dash'
            }
        });
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    addHline (level) {
        this.layout.shapes.push({
            type: 'line',
            x0: this.xmin,
            y0: level,
            x1: this.xmax,
            y1: level,
            line: {
                color: this.colors.orange,
                width: 2,
                dash: 'dash'
            }
        });
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    reset() {
        this.data = [{
            x: this.labels,
            y: this.defaultData,
            type: 'scatter',
            mode: 'lines',
            name: 'Raw',
            line: {
                color: this.colors.graphGreen,
                width: 2
            },
            hovertemplate: '<i>X</i>: %{x}' +
                '<br><i>Y</i>: %{y}' +
                '<extra></extra>'
        }];
        this.layout.shapes = [];
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    disable_tooltips() {
        this.layout.hovermode = false;
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    enable_tooltips() {
        this.layout.hovermode = 'closest';
        Plotly.react(this.getId(), this.data, this.layout, this.config);
    }

    resize(w) {
        var update = {
            height: '350px',
            width: w + 'px'
        }
        Plotly.relayout(this.getId(), update);
    }

    draw(father) {
        super.draw(father);

        $(father)
            .append($('<div>', {
                id: this.getId(),
                height: this.height,
                width: this.width
            }));
        this.createGraph();
        this.attachEvents();
    }
}

//--------------------------------------------2-DIM PLOT COUNTS per PIXEL (aQuracy) - PLOTLYjs library--------------------------------------------//
export class Plot2D extends Component {
    constructor(id, label, title = '', numberOfPointsX, numberOfPointsY) {
        super(id);
        this.colors = colorPalette;
        this.data = [{
            x: [],
            y: [],
            z: [],
            type: 'heatmap',
            colorscale: 'Greys',
            colorbar: {
                title: 'Counts'
            },
            showscale: true,
            hovertemplate: '<i>X</i>: %{x}' +
                '<br><i>Y</i>: %{y}' +
                '<br><b>Counts</b>: %{z}' +
                '<extra></extra>'
        }];
        this.layout = {
            font: {
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                size: 12,
                color: '#666',
            },
            title: {
                text: '<b>' + title + '</b>',
            },
            xaxis: {
                title: {
                    text: 'X',
                },
                showspikes: false,
                spikecolor: this.colors.orange,
                spikethickness: 2,
                spikedash: 'dashdot',
                spikemode: 'across+toaxis',
                spikesnap: 'cursor',
                showline: true,
                showgrid: true,
            },
            yaxis: {
                title: {
                    text: 'Y',
                },
                showspikes: false,
                spikecolor: this.colors.orange,
                spikethickness: 2,
                spikedash: 'dashdot',
                spikemode: 'across+toaxis',
                spikesnap: 'cursor',
                showline: true,
                showgrid: true,
            },
            zaxis: {
                autorange: true
            },
            shapes: [
                    //line vertical
                    {
                        type: 'line',
                        visible: false,
                        xref: 'x',
                        yref: 'y',
                        x0: 400,
                        y0: 0,
                        x1: 400,
                        y1: 600,
                        opacity: 0.7,
                        line: {
                            color: this.colors.orange,
                            width: 2,
                            dash: 'dot'
                        }
                    },
                    //line horizontal
                    {
                        type: 'line',
                        visible: false,
                        xref: 'x',
                        yref: 'y',
                        x0: 0,
                        y0: 300,
                        x1: 800,
                        y1: 300,
                        opacity: 0.7,
                        line: {
                            color: this.colors.orange,
                            width: 2,
                            dash: 'dot'
                        }
                    },

            ],
            modebar: {
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                color: this.colors.graphGreen,
                activecolor: this.colors.orange
            },
            autosize: true,
            hovermode: 'closest'
        };
        this.config = {
            responsive: true,
            editable: true,
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: 'beam2DProfile',
                height: 600,
                width: 800,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            },
            scrollZoom: false,
            displayModeBar: true,
            showSendToCloud: false,
            displaylogo: false,
            modeBarButtonsToRemove: ['toggleSpikelines', 'resetScale2d', 'zoomIn2d', 'zoomOut2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
        }
        this.numberOfPointsX = numberOfPointsX;
        this.numberOfPointsY = numberOfPointsY;
        this.Xlabels = [];
        this.Ylabels = [];
        this.defaultData = [];
        for (let i = 0; i < this.numberOfPointsX; ++i) {
            this.Xlabels.push(i);
        }
        for (let k = 0; k < this.numberOfPointsY; ++k) {
            this.Ylabels.push(k);
        }
        this.defaultData = LOGO;
        this.width = ((window.width * window.devicePixelRatio) / 1.2 * 8 / 12 * 0.9).toString() + 'px';
        this.height = ((window.width * window.devicePixelRatio) / 1.2 * 8 / 12 * 0.9 * 3/4).toString() + 'px';
    }

    createDefaults() {
        this.data[0].z = this.defaultData;
        this.data[0].x = this.Xlabels;
        this.data[0].y = this.Ylabels;
    }

    createGraph() {
        this.createDefaults();
        Plotly.newPlot(this.getId(), this.data, this.layout, this.config);

        let th = this;
        this.handlerEvent('updateData', function (ref, newData) {
            th.updateData(newData);
        });
        this.handlerEvent('reset', function (ref) {
            th.reset();
        });
        
    }

    updateData (newData) {
        let data = JSON.parse(newData).data;
        this.data[0].z = data;
        this.data[0].x = this.Xlabels;
        this.data[0].y = this.Ylabels;
        Plotly.update(this.getId(), this.data, this.layout, 0);
    }

    reset() {
        this.defaultData = LOGO;
        this.data[0].z = this.defaultData;
        this.data[0].x = this.Xlabels;
        this.data[0].y = this.Ylabels;
        Plotly.update(this.getId(), this.data, this.layout, 0);
    }

    disable_tooltips() {
        this.layout.hovermode = false;
        let update = {
            hovermode : false
        };
        Plotly.relayout(this.getId(), update);
    }

    enable_tooltips() {
        this.layout.hovermode = 'closest';
        let update = {
            hovermode : 'closest'
        };
        Plotly.relayout(this.getId(), update);
    }
    
    draw(father) {
        super.draw(father);

        $(father)
            .append($('<div>', {
                id: this.getId(),
                style: 'width:100%; padding-top: 75%; position:relative'
            }));
        this.createGraph();
        this.attachEvents();
    }
}