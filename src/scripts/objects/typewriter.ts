import Entity from '../objects/entity';
import HoldableBehavior from '../objects/holdable';

const DRAG = 200;

export default class Typewriter extends Entity {
    hasBeenGot: boolean;
    isHeld: Boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'typewriter');

        this.setMaxVelocity(250, 300);
        this.hasBeenGot = false;

        //Add components
        this.addBehavior(HoldableBehavior);
    }

    update() {
        super.update();

        if (this.isHeld) {
            this.scene.events.emit('showStoryText');
        } else {
            this.scene.events.emit('hideStoryText');
        }

        //Add floor drag
        if (this.body.blocked.down) {
            this.setDragX(DRAG);
        } else {
            this.setDragX(0);
        }

        //Trigger death event if below screen
        if (this.y > 192) {
            //You ded
            this.scene.events.emit('died');
        } 
    }
}