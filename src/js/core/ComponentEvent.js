/**
 * Component Event class
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from './Util';

class ComponentEvent
{
    /**
     * Constructor
     *
     * @param eTarget
     * @param eName
     * @param eCallback
     */
    constructor (eTarget, eName, eCallback)
    {
        if (!Util.isValid(eTarget))
        {
            Util.log('Event target not valid', 1);
            return;
        }
        if (!Util.isValid(eName))
        {
            Util.log('Event name not valid for target ' + eTarget, 1);
            return;
        }
        if (typeof eCallback !== 'function')
        {
            Util.log('Callback event for target ' + eTarget + ' is not valid', 1);
            return;
        }

        this._eventTarget       = eTarget;
        this._eventName         = eName;
        this._eventCallback     = eCallback;
    }

    /**
     * Attach event to target
     *
     */
    attachEvent ()
    {
        let cbk = this._eventCallback;
        $(this._eventTarget).off(this._eventName).on(this._eventName, function (event, data) {
           event.stopPropagation();
           cbk($(this), data);
        });
    }
}

export default ComponentEvent;