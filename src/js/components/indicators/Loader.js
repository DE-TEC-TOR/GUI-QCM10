/**
 * GIF Loader indicator
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Component from '../../core/Component';
const LOADER = require('./loader.gif');

class Loader extends Component {
    constructor(id) {
        super(id);
        this.loader = LOADER;
        let th = this;

        this.handlerEvent('activate', function () {
            th.activate();
        });
        this.handlerEvent('deactivate', function () {
            th.deactivate();
        });
    }

    activate() {
        //activate loader GIF
        $(this.getId(true)).css('display', 'inline-block');
    }

    deactivate(){ 
        // deactivate loader GIF
        $(this.getId(true)).css('display', 'none');
    }

    draw(father) {
        super.draw(father);
            $(father)
                .append($('<div>', {
                    id: this.getId(),
                    class: 'justify-content-center',
                    style: 'width:100%; display:none'
                })
                .append('<p class="text-center"><img width="60" src="' + this.loader + '"></p>'));
        this.attachEvents();
    }
}

export default Loader;