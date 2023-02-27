/**
 * File upload handlers
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from '../../core/Util';
import Component from '../../core/Component';

//--------------------------------------------FILE UPLOADER--------------------------------------------//
export class FileIn extends Component {
    constructor(id, label){
        super(id);
        this.label = (Util.isValid(label)) ? label : 'none';
    }

    reset() {
        document.getElementById(this.getId()).reset();
    }
    
    draw(father) {
            super.draw(father);
            $(father)
                .append($('<form>', {
                    id: this.getId(),
                    class: "form-input"
                })
                    .append($('<div>', {
                                class: "form-group"
                            })
                            .append($('<label>', {
                                for: this.getId() + "_input",
                                class: "btn btn-block btn-outline-success",
                                style: "margin-top: 10px; font-size:13px",
                                html: this.label
                            })
                            .append($('<input>', {
                                type: "file",
                                class: "form-control-file",
                                id: this.getId() + "_input",
                                style: "display: none;"
                            }))
                            )
                    )
            );
        this.attachEvents();
    }
}

//--------------------------------------------IMAGE UPLOADER--------------------------------------------//
export class ImageIn extends Component {
    constructor(id, label) {
        super(id);
        this.label = (Util.isValid(label)) ? label : 'none';
    }

    draw(father) {
        super.draw(father);
        $(father)
            .append($('<form>', {
                    class: "form-input"
                })
                .append($('<div>', {
                        class: "form-group"
                    })
                    .append($('<label>', {
                            for: this.getId() + "_input",
                            class: "btn btn-block btn-outline-success",
                            style: "margin-top: 10px; font-size:12px",
                            html: this.label
                        })
                        .append($('<input>', {
                            type: "file",
                            class: "form-control-file",
                            name: this.getId() + "_input",
                            id: this.getId() + "_input",
                            style: "display: none;"
                        }))
                    )
                )
            );
        this.attachEvents();
    }

}
