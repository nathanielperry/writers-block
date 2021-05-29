import HoldableBehavior from '../objects/holdable';
import { StateMachineSystem } from '../util/StateMachine';

const DRAG = 200;

export default class Typewriter extends Phaser.Physics.Arcade.Sprite {
    hasBeenGot: boolean;
    stateMachineSystem: StateMachineSystem;
    isHeld: Boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'typewriter');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.stateMachineSystem = new StateMachineSystem();
        this.setMaxVelocity(250, 300);
        this.hasBeenGot = false;

        //Add components
        Object.assign(this, new HoldableBehavior(this));
    }

    update() {
        this.stateMachineSystem.step();

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