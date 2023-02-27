/**
 * Page general class -> all device pages (dinamically created with JS) extend this class 
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from './Util';
import ComponentEvent from './ComponentEvent';

class Page {
    /**
     * Constructor
     *
     * @param page_title
     */
    constructor (page_title)
    {
        this._title     = page_title;
        this._url       = '';
        this._inited    = false;

        // Events structure
        this._eventList = [];

        // Components array
        this._comps = [];

        Util.log('Page "'+ page_title +'" created!');
        Util.log(this);
    }

    /**
     * Initialize page
     */
    init ()
    {
        this._inited = true;
        document.title = this._title;
    }

    /**
     * Is the page already inited?
     *
     * @returns {boolean}
     */
    isInited ()
    {
        return this._inited;
    }

    /**
     * Set the URL of the page
     *
     * @param page_url
     */
    setUrl (page_url)
    {
        this._url = page_url;
    }

    /**
     * Add event to page
     *
     * @param eName
     * @param eCallback
     */
    handlerEvent (eName, eCallback)
    {
        try
        {
            this._eventList.push(new ComponentEvent(window, eName, eCallback));
        }
        catch (e)
        {
            Util.log('Impossible assign event '+ eName +' to window (exception): '+ e, 1);
        }
    }

    /**
     * Attach all events to target
     *
     */
    attachEvents ()
    {
        try
        {
            this._eventList.forEach(function (elem) {
                elem.attachEvent();
            });
        }
        catch (e)
        {
            Util.log('Attaching events error (exception): '+ e, 1);
        }
    }

    /**
     * Add a component to the page
     *
     * @param key
     * @param elem
     */
    pushComp (key, elem)
    {
        this._comps[key] = elem;
    }

    /**
     * Return the component object
     *
     * @param key
     * @returns {*}
     */
    getComp (key)
    {
        return this._comps[key];
    }

    /**
     * Call method draw of a component
     *
     * @param key
     * @param father
     */
    drawComp (key, father)
    {
        this.getComp(key).draw(father);
    }

    /**
     * Draw all components of the page
     *
     * @param key
     * @param father
     */
    drawComps (key, father)
    {
        this._comps.forEach(function (elem) {
            elem.draw(father);
        });
    }
}

export default Page;