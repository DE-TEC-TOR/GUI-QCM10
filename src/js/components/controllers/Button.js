/**
 * Generic button
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Component from '../../core/Component';
import Util from '../../core/Util';

class Button extends Component
{
    constructor (id, text, mode = 0, en_tooltip = false, tooltip_text = '')
    {
        super(id);

        this.text = (Util.isValid(text)) ? text : 'none';
        this.en_tooltip = en_tooltip;
        this.tooltip_text = (Util.isValid(tooltip_text)) ? tooltip_text : '';
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
            case 3:
                this.setClasses('btn btn-danger btn-sm btn-block');
            break;
            default:
                break;
        }

        // Default action on click
        this.onclickFunction = function () {
            Util.log('No action on click');
        };

        let th = this;
        this.handlerEvent('click', function (event, data) {
            th.click();
        });
        this.handlerEvent('enable', function(event, data){
            th.enable();
        });
        this.handlerEvent('disable', function (event, data){
            th.disable();
        });
    }

    enable () {
        // console.log('enabling button');
        $(this.getId(true)).disabled = false;
    }
    
    disable () {
        // console.log('disabling button');
        $(this.getId(true)).disabled = true;
    }

    click ()
    {
        this.onclickFunction();
    }

    addClickAction (func)
    {
        this.onclickFunction = func;
    }

    update(data) {
        super.update(data);
    }

    setName(name) {
        this.text = (Util.isValid(name)) ? name : 'none';
        $(this.getId(true)).html(name);
    }

    draw(father) {
        super.draw(father);
        if (this.en_tooltip) {
            $(father)
                .append($('<button>', {
                    id: this.getId(),
                    type: 'button',
                    class: this.getClasses(),
                    html: this.text,
                    dataToggle: "tooltip",
                    title: this.tooltip_text,
                    style: "margin-bottom:6px;"
                }));
        }
        else{            
            $(father)
                .append($('<button>', {
                    id: this.getId(),
                    type: 'button',
                    class: this.getClasses(),
                    html: this.text,
                    style: "margin-bottom:6px;"
                }));
        }
        this.attachEvents();
    }
}

export default Button;