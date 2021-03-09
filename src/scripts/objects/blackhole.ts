const ALPHA_STEP = 0.08;
const SCALE_MAX = 1.3;
const PULSE_TIME = 1000;
const ROTATE_SPEED = 0.01;

export default class BlackHole extends Phaser.Physics.Arcade.Sprite {
    alphaTarget: integer;
    camera: any;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'blackhole');
        scene.add.existing(this);

        scene.tweens.add({
            targets: this,
            scale: SCALE_MAX,
            duration: PULSE_TIME,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
        });

        this.x += this.width / 2;
        this.y += this.height / 2;
        this.alphaTarget = 0;
        this.setAlpha(0);
        this.setDepth(-400);
    }

    toggleVisible() {
        this.alphaTarget = this.alphaTarget ? 0 : 1;
    }

    moveTo(x, y) {
        this.setPosition(x * 16 + this.width / 2, y * 16 + this.height / 2);
    }

    update() {
        //Interpolate change in alpha
        this.setAlpha(Phaser.Math.Interpolation.SmoothStep(ALPHA_STEP, this.alpha, this.alphaTarget));
        this.rotation += ROTATE_SPEED;
    }
}