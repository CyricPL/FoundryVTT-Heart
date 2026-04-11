import applicationHTML from './application.html';
import HeartApplication from '../base/application';

export default class RequirementApplication extends HeartApplication {
    static DEFAULT_OPTIONS = {
        ...super.DEFAULT_OPTIONS,
        actions: {
            ...super.DEFAULT_OPTIONS.actions,
            submit: RequirementApplication._onSubmit,
        },
    };

    static PARTS = {
        main: { template: applicationHTML.path, scrollable: [".heart.form"] },
    };

    static get formType() {
        return 'requirement'
    }

    async _prepareContext() {
        return {
            options: this.options,
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.element.querySelectorAll('select[multiple]').forEach(select => {
            select.size = Math.max(select.options.length, 2);
        });
        this.setPosition({ height: 'auto' });
    }

    static build({requirements, callback, type}) {
        new this({
            type,
            requirements,
            callback
        }).render(true);
    }

    static _onSubmit(event, target) {
        const form = this.element;
        const data = new FormData(form);
        const output = Object.entries(this.options.requirements).reduce((map, [key, requirement]) => {
            if(requirement.isCheckbox) {
                map[key] = data.get(key) !== null;
            } else if(requirement.isMany) {
                map[key] = data.getAll(key);
            } else {
                map[key] = data.get(key);
            }
            return map;
        }, {});
        this.options.callback(output);
        this.close();
    }
}
