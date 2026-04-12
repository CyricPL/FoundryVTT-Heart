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
            super._onRender(context, options);
            if (!this.isEditable) return;
            this.element.querySelectorAll('.editor .editor-edit').forEach(button => {
                button.addEventListener('click', () => this._onEditorButtonClick(button));
            });
        }

        _onEditorButtonClick(button) {
            const editorDiv = button.closest('.editor');
            const content = editorDiv?.querySelector('[data-target]');
            if (!content) return;
            const path = content.dataset.target;
            const current = foundry.utils.getProperty(this.document, path) ?? '';
            // Convert stored HTML to plain text for editing
            const plain = current
                .replace(/<\/p>\s*<p>/gi, '\n')
                .replace(/<p>/gi, '')
                .replace(/<\/p>/gi, '')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]*>/g, '')
                .trim();

            new Dialog({
                title: this.document.name,
                content: `<div style="padding:4px"><textarea name="text" style="width:100%;min-height:150px;resize:vertical;font-family:Alegreya,serif;font-size:1em">${plain}</textarea></div>`,
                buttons: {
                    save: {
                        icon: '<i class="fas fa-save"></i>',
                        label: 'Save',
                        callback: (html) => {
                            const text = html.find('textarea[name="text"]').val().trim();
                            const stored = text
                                ? '<p>' + text.split('\n').map(l => l.trim()).filter(l => l).join('</p><p>') + '</p>'
                                : '';
                            this.document.update({ [path]: stored });
                        }
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: 'Cancel'
                    }
                },
                default: 'save'
            }).render(true);
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
