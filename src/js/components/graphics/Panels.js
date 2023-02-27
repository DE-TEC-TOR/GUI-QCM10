/**
 * Panel elements
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from '../../core/Util';
import Component from '../../core/Component';

export class DevicePanel extends Component
{
    constructor (id)
    {
        super(id);
        this._img               = '';
        this._img_width         = '';

        this._logo              = '';
        this._logo_width        = '';

        this._status            = 0;
        this._indicator         = new DeviceStatusIndicator ('indicator_' + this.getId());
    }

    setImg (img, width = null)
    {
        if (Util.isValid(img))      this._img = img;
        if (Util.isValid(width))    this._img_width = width;
    }

    setLogo (logo, width = null)
    {
        if (Util.isValid(logo))     this._logo = logo;
        if (Util.isValid(width))    this._logo_width = width;
    }

    update (status)
    {
        this._indicator.setStatus(status);
        this._indicator.update();
    }

    draw(father) {
        super.draw(father);

        this._indicator.setStatus(this._status);

        $(this.getFather())
            .append($('<div>', {id:'container_' + this.getId(), class: 'col-lg-4 col-md-6 col-sm-12'})
                .append($('<p>', {class: 'text-center'})
                    .append($('<img>', {src: this._img, width: this._img_width}))
                )
                .append($('<p>', {class: 'text-center'})
                    .append($('<img>', {src: this._logo, width: this._logo_width}))
                )
            );

        this._indicator.draw('#container_' + this.getId());
    }
}

//----------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------GENERIC SIDEBAR PANEL--------------------------------------------//
//----------------------------------------------------------------------------------------------------------------------//
export class Panel extends Component {
    constructor(id, title) {
        super(id);
        this.setClasses('panel');

        this.components = [];
        this.title = (Util.isValid(title)) ? title : 'None';

        /* Attributes (default values) */
        this.titleAlignment = 'text-left';
    }

    addComponent(obj) {
        this.components.push(obj);
    }

    setTitleAlignment(alignment) {
        switch (alignment.toLowerCase()) {
            case 'left':
                this.titleAlignment = 'text-left';
                break;
            case 'center':
                this.titleAlignment = 'text-center';
                break
            case 'right':
                this.titleAlignment = 'text-right';
                break;
            default:
                this.titleAlignment = 'text-left';
                Util.log('Wrong assignment for alignment of title - panel id: ' + this.getId(), 2);
                break;
        }
    }

    show(){
        $(this.getId(true)).css('display', 'block');
    }

    hide(){
        $(this.getId(true)).css('display', 'none');
    }

    drawHidden(father) {
        super.draw(father);

        $(father).append($('<div>', {
                id: this.getId(),
                class: 'col-12 ' + this.getClasses(),
                style: 'display:none'
            })
            .append($('<p>', {
                class: 'panel_title ' + this.titleAlignment,
                html: this.title
            }))
        );

        /* Add components */
        let th = this;
        this.components.forEach(function (comp) {
            comp.draw(th.getId(true));
        });
    }

    draw(father) {
        super.draw(father);

        $(father).append($('<div>', {
                id: this.getId(),
                class: 'col-12 ' + this.getClasses()
            })
            .append($('<p>', {
                class: 'panel_title ' + this.titleAlignment,
                html: this.title
            }))
        );

        /* Add components */
        let th = this;
        this.components.forEach(function (comp) {
            comp.draw(th.getId(true));
        });
    }

}


