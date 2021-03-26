import { State, StateMachine } from '../util/StateMachine';
import StoryText from './storyText';
import Writer from './writer';

const DRAG = 200;

export default class Typewriter extends Phaser.Physics.Arcade.Sprite {
    stateMachine: StateMachine;
    writer: Writer;
    hasBeenGot: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, writer, story) {
        super(scene, x, y, 'typewriter');
        scene.add.existing(this);
        scene.physics.add.existing(this);

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
    enter({ actor }) {
        actor.body.allowGravity = true;
    }
}

class HeldState extends State {
    enter({ actor }) {
        if (!actor.hasBeenGot) {
            actor.hasBeenGot = true;
            actor.scene.events.emit('zone', 'typewriter-get');
        }

        actor.body.allowGravity = false;
        actor.scene.events.emit('hold-tw');
    }
    
    step({ actor }) {
        const direction = actor.writer.direction;
        
        //Flip to face same direction as character
        actor.flipX = direction == 1 ? false : true;
        
        //Follow player character
        actor.x = Phaser.Math.Interpolation.SmoothStep(0.5, actor.x, actor.writer.x + (8 * direction));
        actor.y = Phaser.Math.Interpolation.SmoothStep(0.8, actor.y, actor.writer.y);
    }
}

class ThrownState extends State {
    enter({ actor }) {
        const direction = actor.writer.direction;
        const velX = actor.writer.body.velocity.x;
        const velY = actor.writer.body.velocity.y;
        
        actor.body.allowGravity = true;
        actor.scene.events.emit('throw-tw');
        actor.setVelocityX((60 + Math.abs(velX)) * direction);
        actor.setVelocityY(-115 - (Math.abs(velY)));
    }
    
    step({ actor, stateMachine }) {
        if(actor.body.blocked.down) {
            stateMachine.setState('idle');
        }
    }
}