/**
 * Range slider - noUIslider library
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from '../../core/Util';
import Component from '../../core/Component';
import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

class RangeSlider extends Component {
    constructor(id, label, min, max, orientation) {
        super(id);
        let th = this;
        this.label = (Util.isValid(label)) ? label : 'none';
        this.min = min;
        this.max = max;
        this.orientation = orientation;
        let height = '26vw';
        let width = '90%';
        let direction = '';
        let align = '';
        if(orientation == 'vertical'){
            width = '16px';
            direction = 'rtl';
            align = 'right';
        }
        if(orientation == 'horizontal'){
            direction = 'ltr';
            // height = ((window.screen.height * window.devicePixelRatio)/80).toString() + 'px';
            height = '16px';
            align = 'center';
        }
        this.height = height;
        this.width = width;
        this.direction = direction;
        this.align = align;

        this.config = {
                range: {
                    'min': this.min,
                    'max': this.max
                },
                // step: 1,
                // Handles start at ...
                start: [this.min, this.max],
                // ... must be at least x apart
                margin: 0,
                // ... but no more than x
                limit: this.max,
                // Display colored bars between handles
                connect: true,
                // Put '0' at the bottom of the slider
                direction: this.direction,
                orientation: this.orientation,
                // Move handle on tap, bars are draggable
                behaviour: 'tap-drag',
                tooltips: [wNumb({decimals: 0}), wNumb({decimals: 0})],
                // Show a scale with the slider
                pips: {
                    mode: 'steps',
                    density: 5,
                    filter: this.filterPips,
                    format: wNumb({
                        decimals: 0
                    }),
                }
        }
    }

    createSlider(){
        noUiSlider.create(document.getElementById(this.getId()), this.config);

        let th = this;

        this.handlerEvent('reset', function(ref){
            document.getElementById(th.getId()).noUiSlider.reset();
        });

        this.handlerEvent('updateLimits', function(ref, limits){
            document.getElementById(th.getId()).noUiSlider.set([limits.min, limits.max]);
        });

        this.handlerEvent('getLimits', function(ref){
            var limits = document.getElementById(th.getId()).noUiSlider.get();
            return {
                'min': parseFloat(limits[0]),
                'max': parseFloat(limits[1])
            };
        });
    }

    disable() {
        $(this.getId(true)).setAttribute('disabled', true);
    }

    enable() {
        $(this.getId(true)).removeAttribute('disabled');
    }

    getLimits() {
        var limits = document.getElementById(this.getId()).noUiSlider.get();
        return {
            'min': parseFloat(limits[0]),
            'max': parseFloat(limits[1])
        };
    }

    filterPips(value, type) {
        return value % 50 ? 2 : 1;
    }

    draw(father) {
        super.draw(father);
        $(father)
        .append($('<div>', {
            id: this.getId(),
            height: this.height,
            width: this.width,
            // class: 'align-middle',
            align: this.align
        }));
        this.createSlider();
        this.attachEvents();
    }
}

export default RangeSlider;
