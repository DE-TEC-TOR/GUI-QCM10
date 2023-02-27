/**
 * Circle status indicator for sidebar
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Component from '../../core/Component';

class ImageContainer extends Component {
    constructor(id) {
        super(id);
    }

    draw(father) {
        super.draw(father);
        $(father)
            .append($('<div>', {
                    class: 'mb-3',
                    id: this.getId(),
                    style: 'margin-top: 10px; width: 100%; border: 1px solid #068587; border-radius: 5px; display:none'
                })
                .append($('<img>', {
                    id: this.getId() + '_image',
                    src: '',
                    alt: 'Image preview',
                    style: 'width:100%'
                }))
            );
        this.attachEvents();
        // this.setUp();
    }
    setImgSrc(data) {
        $(this.getId(true) + '_image').attr('src', data);
    }
    show() {
        $(this.getId(true)).css('display', 'block');
    }
    hide() {
        $(this.getId(true)).css('display', 'none');
    }
}

export default ImageContainer;