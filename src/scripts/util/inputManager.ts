const keyCodes = [
    'LEFT',
    'RIGHT',
    'UP',
    'DOWN'
];

export class KeyboardManager {
    pressed: Array<string>;

    constructor(scene: Phaser.Scene) {
        this.pressed = [];

        //For each keycode, add a key down and up event to add or remove from pressed array.
        for (const code in keyCodes) {
            scene.input.keyboard.on('keydown-' + code, () => {
                if (this.pressed.indexOf(code) > 0) return;
                this.pressed.push(code);
            });

            scene.input.keyboard.on('keyup-' + code, () => {
                if (this.pressed.indexOf(code) > 0) {
                    this.pressed.splice(this.pressed.indexOf(code), 1);
                };
            });
        }
    };
}