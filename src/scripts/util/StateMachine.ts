interface state {
    enter: Function,
    step: Function,
    exit: Function,
}

export class StateMachineSystem {
    machines: {
        [index: string]: StateMachine;
    }
    actor: any;

    constructor(actor, machines = {}) {
        this.actor = actor;
        this.machines = machines;
    }

    setState(machineID, state, ...args) {
        this.machines[machineID].setState(state, ...args);
    }

    step() {
        Object.values(this.machines).forEach(sm => sm.step());
    }

    addStateMachine(name, initial, states) {
        this.machines[name] = new StateMachine(
            initial, 
            states, 
            this.actor
        );
    }

    removeStateMachine(name) {
        delete this.machines[name];
    }
}

export class StateMachine {
    states: {
        [index: string]: state;
    }
    actor: any;
    initialState: any;
    currentState: any;
    previousState: any;

    constructor(initial, states, actor) {
        this.initialState = initial;
        this.currentState = null;
        this.previousState = null;
        this.states = states;
        this.actor = actor;
    }
    
    step(...args) {
        if(this.currentState == null) {
            this.currentState = this.initialState;
            this.states[this.currentState].enter({
                actor: this.actor,
                stateMachine: this,
            }, ...args);
        }

        this.states[this.currentState].step({
                actor: this.actor,
                stateMachine: this,
        }, ...args);
    }

    setState(newState: string, ...args) {
        if(this.currentState != null) {
            this.states[this.currentState].exit({
                actor: this.actor,
                stateMachine: this,
            }, ...args);
        }

        this.previousState = this.currentState;
        this.currentState = newState;
        this.states[this.currentState].enter({
            actor: this.actor,
            stateMachine: this,
        }, ...args);
    }

    setPreviousState() {
        console.log('Setting previous state', this.previousState);
        this.setState(this.previousState);
    }
}

export class State implements state {
    enter(...args): void {

    }

    step(...args): void {

    }

    exit(...args): void {

    }
}