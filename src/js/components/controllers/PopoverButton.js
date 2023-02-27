/**
 * Button with popover effect
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Component from '../../core/Component';
import Util from '../../core/Util';

class PopoverButton extends Component {
    constructor(id, text, mode = 0, pop_title = '', pop_text = '') {
        super(id);
        this.text = (Util.isValid(text)) ? text : 'none';
        this.pop_text = (Util.isValid(pop_text)) ? pop_text : '';
        this.pop_title = pop_title;
        // Appearence mode
        switch (mode) {
            case 0:
                this.setClasses('btn btn-success btn-sm btn-block');
                break;
            case 1:
                this.setClasses('btn btn-outline-success btn-sm btn-block');
                break;
            case 2:
                this.setClasses('btn btn-success btn-sm btn-circle');
                break;
            default:
                break;
        }

        let th = this;
        this.handlerEvent('click', function () {
            $(th.getId(true)).popover('toggle');
        });

     }
    setName(name) {
        this.text = (Util.isValid(name)) ? name : 'none';
        $(this.getId(true)).html(name);
    }

    draw(father) {
        super.draw(father);
            $(father)
                .append($('<button>', {
                    style: 'margin-top:5px;',
                    id: this.getId(),
                    type: 'button',
                    class: this.getClasses(),
                    'data-toggle': 'popover',
                    'data-trigger': 'focus',
                    'data-title':this.pop_title,
                    'data-content': this.pop_text,
                    'data-placement': "top",
                    html: this.text
                }));
        $('.popover-dismiss').popover({
            trigger: 'focus'
        })
        this.attachEvents();
    }
}

export default PopoverButton;