import { StateMachine } from "../util/StateMachine";

export default class CustomGameObject extends Phaser.GameObjects.GameObject{
    stateMachine: StateMachine;

    constructor(scene, type, initialState, states) {
        super(scene, type);
        this.stateMachine = new StateMachine(initialState, {}, this);
    }
}