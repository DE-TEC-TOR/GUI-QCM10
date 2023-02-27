/**
 * Date Range picker element
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from '../../core/Util';
import Component from '../../core/Component';
import flatpickr from 'flatpickr';

class DateRangePicker extends Component {
    constructor(id, label) {
        super(id);
        this.fp = null;
        this.label = (Util.isValid(label)) ? label : 'none';
        this.config = {
            mode: 'range',
            dateFormat: "Y-m-d"
        }
    }

    createDateRangePicker() {   
        this.fp = flatpickr(this.getId(true), this.config); // flatpickr
    }
    
    draw(father) {
        super.draw(father);
        $(father)
            .append($('<div>', {
                    class: 'input-group mb-3',
                    style: 'margin-top: 2px; width:100%'
                })
                .append($('<div>', {
                        class: 'input-group-prepend',
                        style: 'width:20%; text-align: center',
                    })
                    .append($('<label>', {
                        class: 'input-group-text select_box_label',
                        id: this.getId() + '_label',
                        for: this.getId(),
                        html: '<span class="mdi mdi-calendar-range-outline"></span>'
                    }))
                )
                .append($('<input>', {
                    type: 'text',
                    placeholder: "Select a date range",
                    style: 'width:80%; text-align: right; padding-right: 8px',
                    id: this.getId(),
                }))
        );
        this.createDateRangePicker();
        this.attachEvents();
    }

    getDates() {
        let range = this.fp.selectedDates;
        return range;
    }

    reset(){
        this.fp.clear();
    }
}

export default DateRangePicker;