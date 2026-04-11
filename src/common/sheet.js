export default function HeartSheetMixin(baseClass) {
    return class extends baseClass {
        static MIN_WIDTH = 300;
        static MIN_HEIGHT = 150;

        get default_img() {
            return CONST.DEFAULT_TOKEN;
        }

        get img() {
            return 'systems/heart/assets/battle-gear.svg';
        }

        get title() {
            const key = 'heart.' + this.document.name;
            const resp = game.i18n.localize(key);
            if (resp == key) {
                return this.document.name;
            } else {
                return resp;
            }
        }

        setPosition(position = {}) {
            const minWidth = this.constructor.MIN_WIDTH;
            const minHeight = this.constructor.MIN_HEIGHT;
            if (typeof position.width === 'number')
                position = { ...position, width: Math.max(position.width, minWidth) };
            if (typeof position.height === 'number')
                position = { ...position, height: Math.max(position.height, minHeight) };
            return super.setPosition(position);
        }

        _onRender(context, options) {
            super._onRender?.(context, options);
            // Foundry v13 overrides checkbox appearance via CSS that beats !important.
            // Inline styles set via setProperty('important') are the only reliable override.
            this.element.querySelectorAll('input[type="checkbox"]').forEach(el => {
                el.style.setProperty('appearance', 'none', 'important');
                el.style.setProperty('-webkit-appearance', 'none', 'important');
                el.style.setProperty('background-color', 'transparent', 'important');
                el.style.setProperty('box-shadow', 'none', 'important');
                if (el.disabled && el.checked) {
                    el.style.setProperty('background-image', 'linear-gradient(90deg, #2c2c2c 0%, #2c2c2c 100%)', 'important');
                    el.style.setProperty('background-size', '12px 12px', 'important');
                    el.style.setProperty('background-position', 'center', 'important');
                    el.style.setProperty('background-repeat', 'no-repeat', 'important');
                } else if (el.checked) {
                    el.style.setProperty('background-image', 'linear-gradient(90deg, #000000 0%, #000000 100%)', 'important');
                    el.style.setProperty('background-size', '12px 12px', 'important');
                    el.style.setProperty('background-position', 'center', 'important');
                    el.style.setProperty('background-repeat', 'no-repeat', 'important');
                } else if (el.disabled) {
                    el.style.setProperty('background-image', 'linear-gradient(90deg, #D4D4D4 0%, #D4D4D4 100%)', 'important');
                    el.style.setProperty('background-size', '12px 12px', 'important');
                    el.style.setProperty('background-position', 'center', 'important');
                    el.style.setProperty('background-repeat', 'no-repeat', 'important');
                } else {
                    el.style.setProperty('background-image', 'none', 'important');
                }
            });
        }

        async _prepareContext(options) {
            const context = await super._prepareContext(options);
            if (context.actor && (context.actor.img === this.default_img)) {
                context.actor.img = this.img;
            }
            else if (context.item) {
                context.item.img = this.img;
            }
            else {
                context.img = this.img;
            }
            return context;
        }
    };
}
