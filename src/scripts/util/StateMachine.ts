interface state {
    enter: Function,
    step: Function,
    exit: Function,
}

export class StateMachine {
    states: {
        [index: string]: state;
    }
    actor: any;
    initialState: any;
    currentState: any;

    constructor(initial, states, actor) {
        this.initialState = initial;
        this.currentState = null;
        this.states = states;
        this.actor = actor;
    }

    step(args?) {
        if(this.currentState == null) {
            this.currentState = this.initialState;
            this.states[this.currentState].enter({
                actor: this.actor,
                stateMachine: this,
                args,
            });
        }

        this.states[this.currentState].step({
                actor: this.actor,
                stateMachine: this,
                args,
        });
    }

    setState(newState: string, args?) {
        this.currentState = newState;
        this.states[this.currentState].enter({
            actor: this.actor,
            stateMachine: this,
            args,
        });
    }
}

export class State implements state {
    enter(args?): void {

    }

    step(args?): void {

    }

    exit(args?): void {

    }
}