import MainScene from "../scenes/mainScene";

const DISTANCE = 8;
const DURATION = 1000;
const STEP = 0.1;

export default class TutorialObjects {
    scene: MainScene;
    objects: Array<Phaser.GameObjects.Sprite>;
    targetY: integer;

    constructor(scene) {
        this.scene = scene;
        this.targetY = DISTANCE;
        
        this.objects = scene.map.createSpritesOfType('tutorial', 'keys');
        const group = this.scene.add.group(this.objects);
        group.setAlpha(0);

        setInterval(() => {
            this.toggleY();
        }, DURATION);
    }

    toggleY() {
        this.targetY = this.targetY === DISTANCE ? -DISTANCE : DISTANCE;
    }

    toggleVisible(name) {
        const object = this.objects.find(o => o.name === name);
        object?.setAlpha(object?.alpha == 0 ? 1 : 0);
    }

    move(name, x, y) {
        const object = this.objects.find(o => o.name === name);
        object?.setPosition(x * 16, y * 16);
    }

    update() {
        this.objects.forEach(o => {
            o.y = Phaser.Math.Interpolation.SmootherStep(STEP, o.y, o.y + this.targetY);
        });
    }
}