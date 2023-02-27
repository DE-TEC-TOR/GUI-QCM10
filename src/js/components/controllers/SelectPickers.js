/**
 * Select pickers components
 *
 * @author : Mattia Fontana
 * @company : TORETDevices srl
 * @version : 1.0.0
 */
import select2 from 'select2';
import Component from '../../core/Component';


//----------------------------------------------------------------------------------------------------------------------//
//--------------------------------------SINGLE OPTION SELECT PICKER - select2 library-----------------------------------//
//----------------------------------------------------------------------------------------------------------------------//
export class SelectPicker extends Component {
    constructor(id) {
        super(id);
        this.config = {
            placeholder: 'Select an analysis parameter',
        }
    }

    createSelectPicker(){
        $(this.getId(true)).select2(this.config);

        let th = this;
        this.handlerEvent('reset', function (ref) {
            th.reset(); 
        });

    }

    draw(father) {
        super.draw(father);
        $(father)
        .append($('<div>', {
                    class: 'input-group',
                    style: 'margin-top: 2px; width:100%'
                })
            .append($('<select>', {
                class: 'custom-select select_box',
                id: this.getId(),
                style: 'border: 1px solid #068587; border-radius: 5px; width:100%',
                disabled: true
            })
            )
        );
        this.createSelectPicker();
        this.attachEvents();
    }

    enable() {
        $(this.getId(true)).prop('disabled', false);
    }

    disable() {
        $(this.getId(true)).prop('disabled', true);
    }

    setUp() {
        SOCK.send(this.getId(), null, true);
    }

    update(data) {
        let n_opt = 0;
        let dataParsed = JSON.parse(data);
        // Create option tag foreach result + optgroups according to the received data
        let th = this;
        $(th.getId(true)).empty();
        for(let key in dataParsed){
            $(th.getId(true))
                .append($('<optgroup>', {
                    label: key,
                    id: th.getId()+'_group_' + key
                }));
            for(let key2 in dataParsed[key]){
                n_opt++;
                $('#' + th.getId() + '_group_' + key)
                    .append($('<option>', {
                        value: dataParsed[key][key2].code_name,
                        html: key + ' > ' + dataParsed[key][key2].full_name
                    }));
            }
        }
        if (n_opt > 0) {
            this.enable();
        }
    }

    addOption(value, html, selected = false) {
        let th = this;
        $(th.getId(true))
            .append($('<option>', {
                value: value,
                html: html,
                selected: selected
            }));
    }

    getSelectedOption() {
        let selection = $(this.getId(true)).select2('data');
        return selection;
    }

    select_first() {
        let th = this;
        let data = $(this.getId(true) + ' > option')[0].value;
        $(th.getId(true) + ' option').each(function (index, opt) {
            if (opt.value == data) {
                opt.selected = true;
            }
        });
    }

    select(data) {
        let th = this;
        $(th.getId(true) + ' option').each(function (index, opt) {
            if (opt.value == data) {
                opt.selected = true;
            }
        });
    }

    reset(){
        $(this.getId(true)).val(null).trigger('change');
    }
}

//----------------------------------------------------------------------------------------------------------------------//
//------------------------------------MULTIPLE OPTION SELECT PICKER - select2 library-----------------------------------//
//----------------------------------------------------------------------------------------------------------------------//
export class SelectPickerMultiple extends Component {
    constructor(id, label, title = 'Select tags') {
        super(id);
        this.label = label;
        this.title = title;
        this.config = {
            placeholder: title,
        }
    }

    createSelectPicker() {
        $(this.getId(true)).select2(this.config);

        let th = this;
        this.handlerEvent('reset', function (ref) {
            th.reset();
        });

        this.handlerEvent('update', function(ref, data) {
            let options = data.data;
            th.update(options);
        });

        this.handlerEvent('addOption', function (ref, data) {
            let value = data.value;
            let html = data.html;
            let selected = toBool(data.selected);
            th.addOption(value, html, selected);
        });

    }

    draw(father) {
        super.draw(father);
        $(father)
            .append($('<div>', {
                    class: 'input-group',
                    style: 'margin-top: 2px; width:100%'
                })
                 .append($('<div>', {
                         class: 'input-group-prepend'
                     })
                     .append($('<label>', {
                         class: 'input-group-text select_box_label',
                         for: this.getId()+'_label',
                         html: this.title,
                         style: 'border-radius: 10px 10px 0px 0px;'
                     }))
                 )
                .append($('<select>', {
                    class: 'custom-select select_box',
                    id: this.getId(),
                    name: this.label+'[]',
                    multiple: 'multiple',
                    style: 'border: 1px solid #068587; border-radius: 0px 5px 5px 5px; width:100%',
                    disabled: true
                }))
            );
        this.createSelectPicker();
        this.attachEvents();
    }

    enable() {
        $(this.getId(true)).prop('disabled', false);
    }

    disable() {
        $(this.getId(true)).prop('disabled', true);
    }

    setUp() {
        SOCK.send(this.getId(), null, true);
    }

    update(data) {
        let n_opt = 0;
        // Create option tag foreach result + optgroups according to the received data
        let th = this;
        $(th.getId(true)).empty();
        data.forEach(function (value, index) {
            n_opt++;
            $(th.getId(true))
                .append($('<option>', {
                    value: value,
                    html: value
                }));
            });
        if (n_opt > 0) {
            this.enable();
        }
    }

    addOption(value, html, selected = false) {
        let th = this;
        $(th.getId(true))
            .append($('<option>', {
                value: value,
                html: value,
                selected: selected
            }));
    }

    getSelectedOption() {
        let selection = $(this.getId(true)).select2('data');
        return selection;
    }

    select_first() {
        let th = this;
        let data = $(this.getId(true) + ' > option')[0].value;
        $(th.getId(true) + ' option').each(function (index, opt) {
            if (opt.value == data) {
                opt.selected = true;
            }
        });
    }

    select(data) {
        let th = this;
        $(th.getId(true) + ' option').each(function (index, opt) {
            if (opt.value == data) {
                opt.selected = true;
            }
        });
    }

    reset() {
        $(this.getId(true)).val(null).trigger('change');
    }
}


