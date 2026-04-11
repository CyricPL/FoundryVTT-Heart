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
        main: { template: applicationHTML.path },
    };

    static get formType() {
        return 'requirement'
    }

    _onRender(context, options) {
        super._onRender(context, options);
        // Force window to fit content after render
        requestAnimationFrame(() => {
            const body = this.element.querySelector('.window-body');
            const header = this.element.querySelector('.window-header');
            if (body) {
                const height = (header?.offsetHeight ?? 0) + body.scrollHeight + 16;
                this.setPosition({ height });
            }
        });
    }

    async _prepareContext() {
        const requirements = Object.entries(this.options.requirements).reduce((map, [key, req]) => {
            map[key] = req.isMany
                ? { ...req, size: Math.max(Object.keys(req.options).length, 2) }
                : req;
            return map;
        }, {});
        return {
            options: { ...this.options, requirements },
        };
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
