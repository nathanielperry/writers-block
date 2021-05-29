import { StateMachineSystem } from '../util/StateMachine';

export default class Entity extends Phaser.Physics.Arcade.Sprite {
    stateMachineSystem: StateMachineSystem;

    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.stateMachineSystem = new StateMachineSystem(this);
    }

    update() {
        this.stateMachineSystem.step();
    }

    //@ts-ignore -- Overwrite of Phaser setState causes TS error
    setState(machineID, state, ...args) {
        this.stateMachineSystem.setState(machineID, state, ...args);
    }

    addBehavior(Behavior) {
        Object.assign(this, new Behavior(this));
    }

    addStateMachine(name, initial, states) {
        this.stateMachineSystem.addStateMachine(
            name, initial, states
        );
    }
}