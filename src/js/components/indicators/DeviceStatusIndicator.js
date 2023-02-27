/**
 * Device status indicator for sidebar
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from '../../core/Util';
import Component from '../../core/Component';

class DeviceStatusIndicator extends Component
{
    constructor(id)
    {
        super(id);
        this._status = 0;
        this.setEvents();
    }

    setEvents ()
    {
        let th = this;
        this.handlerEvent('update', function (event, data) {
            th.update(data);
        });
    }

    setClassStatus ()
    {
        switch (this._status) {
            // Not connected
            case 0:
            default:
                this.setClasses('DeviceStatusIndicator_not_connected');
                break;

            // Connected
            case 1:
                this.setClasses('DeviceStatusIndicator_connected');
                break;
        }
    }

    setStatus (status)
    {
        if (Util.isValidNumber(status))
        {
            this._status = status;
        }
        else
        {
            Util.log('Invalid status for DeviceStatusIndicator (' + this.getId() +')', 1);
        }
    }

    update(data)
    {
        this.setStatus(data);
        this.setClassStatus();
        $(this.getId(true)).removeClass().addClass(this.getClasses());
    }

    draw(father) {
        super.draw(father);

        this.setClassStatus();

        $(this.getFather())
            .append($('<div>', {id: this.getId(), class: this.getClasses()}));

        this.attachEvents();
    }
}

export default DeviceStatusIndicator;