import { State, StateMachine } from '../util/StateMachine';

const DEADZONE = 2;
const SPEED = 0.1;

export default class DeadLine extends Phaser.GameObjects.Rectangle {
    stateMachine: StateMachine;
    scene: Phaser.Scene;
    targetX: integer;

    constructor(scene: Phaser.Scene) {
        super(scene, -100, 0, 5, 192, 0xff0000);
        this.setOrigin(0, 0);
        this.scene = scene;
        this.targetX = -100;

        this.stateMachine = new StateMachine('idle', {
            idle: new IdleState,
            jumpTo: new JumpToState,
            jump: new JumpState,
            jumpToRelative: new JumpToRelativeState,
            moving: new MovingState,
        }, this);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // @ts-ignore
        this.body.allowGravity = false;
        // @ts-ignore
        this.scene.physics.add.overlap(this, this.scene.writer, () => {
            this.scene.events.emit('died');
        });
        //@ts-ignore
        this.scene.physics.add.overlap(this, this.scene.typewriter, () => {
            this.scene.events.emit('died');
        });
    }

    update() {
        this.stateMachine.step();
    }
}

class IdleState extends State {
    //Do Nothing
}

class JumpToState extends State {
    enter( { actor }, x) {
        actor.targetX = x;
    }

    step({ actor, stateMachine }) {
        actor.x = Phaser.Math.Interpolation.SmootherStep(
            0.2,
            actor.x,
            actor.targetX,
        );

        if (Math.abs(actor.targetX - actor.x) < DEADZONE) {
            stateMachine.setPreviousState();
        }
    }
}

class JumpState extends State {
    enter({ actor, stateMachine }, x) {
        //Save last state here so we can return to it
        //at the end of the jumpTo state.
        const prevState = stateMachine.previousState;
        stateMachine.setState('jumpTo', actor.x + x);
        stateMachine.previousState = prevState;
    }
}

class MovingState extends State {
    step({ actor }, speed) {
        actor.x += speed || SPEED;
    }
}

class JumpToRelativeState extends State {
    enter({ actor, stateMachine }, relativeActor, x) {
        //Save last state here so we can return to it
        //at the end of the jumpTo state.
        const prevState = stateMachine.previousState;
        stateMachine.setState('jumpTo', relativeActor.x + x);
        stateMachine.previousState = prevState;
    }
}