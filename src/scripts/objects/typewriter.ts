import { State, StateMachine } from '../util/StateMachine';
import StoryText from './storyText';
import Writer from './writer';

const DRAG = 200;

export default class Typewriter extends Phaser.Physics.Arcade.Sprite {
    stateMachine: StateMachine;
    writer: Writer;
    story: StoryText;
    hasBeenGot: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, writer, story) {
        super(scene, x, y, 'typewriter');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.story = story;
        this.writer = writer;
        this.stateMachine = new StateMachine('idle', {
            idle: new IdleState,
            held: new HeldState,
            thrown: new ThrownState,
        }, this);

        this.setMaxVelocity(250, 300);
        this.hasBeenGot = false;
    }

    isHeld() {
        return this.stateMachine.currentState === 'held'; 
    }

    toggleHeld() {
        if(this.stateMachine.currentState != 'held') {
            this.stateMachine.setState('held');
        } else {
            this.stateMachine.setState('thrown');
        }
    }

    update() {
        this.stateMachine.step();
        if (this.body.blocked.down) {
            this.setDragX(DRAG);
        } else {
            this.setDragX(0);
        }

        if (this.y > 192) {
            //You ded
            this.scene.events.emit('story', 'ded');
        } 
    }
}

class IdleState extends State {
    enter() {
        this.actor.body.allowGravity = true;
    }
}

class HeldState extends State {
    enter() {
        if (!this.actor.hasBeenGot) {
            this.actor.hasBeenGot = true;
            this.actor.scene.events.emit('zone', 'typewriter-get');
        }

        this.actor.body.allowGravity = false;
        this.actor.story.setVisible();
    }
    
    run() {
        const direction = this.actor.writer.direction;

        //Flip to face same direction as character
        this.actor.flipX = direction == 1 ? false : true;

        //Follow player character
        this.actor.x = Phaser.Math.Interpolation.SmoothStep(0.5, this.actor.x, this.actor.writer.x + (8 * direction));
        this.actor.y = Phaser.Math.Interpolation.SmoothStep(0.8, this.actor.y, this.actor.writer.y);
    }
}

class ThrownState extends State {
    enter() {
        const direction = this.actor.writer.direction;
        const velX = this.actor.writer.body.velocity.x;
        const velY = this.actor.writer.body.velocity.y;

        this.actor.body.allowGravity = true;
        this.actor.story.setInvisible();
        this.actor.setVelocityX((60 + Math.abs(velX)) * direction);
        this.actor.setVelocityY(-115 - (Math.abs(velY)));
    }

    run() {
        if(this.actor.body.blocked.down) {
            this.stateMachine.setState('idle');
        }
    }
}