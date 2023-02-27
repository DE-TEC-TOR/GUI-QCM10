/**
 * Accordion element
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import Util from '../../core/Util';
import Component from '../../core/Component';

class Accordion extends Component {
    constructor(id, labels, texts) {
        super(id);
        let lbs = [];
        labels.forEach(function (value, index){
            lbs.push(Util.isValid(value) ? value : 'none');
        });
        this.labels = lbs;
        this.texts = texts;
    }

    draw(father) {
        let th = this;
        super.draw(father);
        $(father)
            .append($('<div>', {
                id: 'accordion'
            }))
            this.labels.forEach(function (val, idx){
                $('#accordion')     
                    .append($('<div>', {
                    class: "card accordion"
                })
                    .append($('<div>', {
                        class: "card-header",
                        id: "heading" + idx
                    })
                        .append($('<h5>', {
                            class: "mb-0",
                            })
                            .append($('<button>', {
                                type: "button",
                                class: "btn btn-link",
                                id: val + "_button",
                                html: val,
                                'data-toggle': 'collapse',
                                'data-target': "#collapseField" + idx,
                                'aria-expanded': true,
                                'aria-controls': "collapseField" + idx
                            }))
                            .append($('<a>', {
                                class: "panel-toggle",
                                html: '<span class="mdi mdi-chevron-down"></span>',
                                'data-toggle': 'collapse',
                                'data-target': "#collapseField" + idx,
                            }))
                        )
                    )
            .append($('<div>', {
                    id: 'collapseField' + idx,
                    class: 'collapse',
                    'aria-labelledby': "heading" + idx,
                    'data-parent': '#accordion'
                    })
                        .append($('<div>', {
                            class:'card-body',
                            html: th.texts[idx]  
                        }))
                    )   
                )
            });
            $("#collapseField").on("hide.bs.collapse", function () {
                let text = $(".panel-toggle").html().replace('<span class="mdi mdi-chevron-up"></span>', '<span class="mdi mdi-chevron-down"></span>');
                $(".panel-toggle").html(text);
            });
            $("#collapseField").on("show.bs.collapse", function () {
                let text = $(".panel-toggle").html().replace('<span class="mdi mdi-chevron-down"></span>', '<span class="mdi mdi-chevron-up"></span>');
                $(".panel-toggle").html(text);
            });
        this.attachEvents();
    }

}

export default Accordion;