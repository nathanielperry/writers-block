export class StateMachine {
    states: Object;
    initialState: any;
    currentState: any;

    constructor(initial, states: Object, actor: any) {
        this.initialState = initial;
        this.currentState = null;
        this.states = states;

        for (const state of Object.values(states)) {
            state.stateMachine = this;
            state.actor = actor;
        }
    }

    step() {
        if(this.currentState == null) {
            this.currentState = this.initialState;
            this.states[this.currentState].enter();
        }

        this.states[this.currentState].run();
    }

    setState(newState: string) {
        this.currentState = newState;
        this.states[this.currentState].enter();
    }
}

export class State {
    actor: any;
    stateMachine: StateMachine;

    enter(): void {

    }

    run(): void {

    }
}