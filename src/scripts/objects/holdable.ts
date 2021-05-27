import { State, StateMachine } from '../util/StateMachine';

export default class HoldableBehavior {
    stateMachine: StateMachine;
    holder;
    isGrabbable;
    isHeld;

    constructor(actor) {
        this.holder = null;
        this.isGrabbable = true;
        this.stateMachine = new StateMachine('idle', {
            idle: new IdleState,
            thrown: new ThrownState,
            held: new HeldState,
        }, actor);

        this.isHeld = false;
    }
}

class IdleState extends State {
    enter({ actor }) {
        actor.body.allowGravity = true;
    }
}

class ThrownState extends State {
    enter({ actor }) {       
        const direction = actor.holder.direction;
        const velX = actor.holder.body.velocity.x;
        const velY = actor.holder.body.velocity.y;
        
        actor.holder = null;
        actor.isHeld = false;
        
        actor.body.allowGravity = true;
        actor.setVelocityX((60 + Math.abs(velX)) * direction);
        actor.setVelocityY(-115 - (Math.abs(velY)));

        actor.stateMachine.setState('idle');
    }
}

class HeldState extends State {
    enter({ actor }, holder ) {
        actor.holder = holder;
        actor.body.allowGravity = false;
        actor.isHeld = true;
    }

    step({ actor }) {
        const direction = actor.holder.direction;
        
        //Flip to face same direction as character
        actor.flipX = direction == 1 ? false : true;
        
        //Follow player character
        actor.x = Phaser.Math.Interpolation.SmoothStep(0.5, actor.x, actor.holder.x + (8 * direction));
        actor.y = Phaser.Math.Interpolation.SmoothStep(0.8, actor.y, actor.holder.y);
    }
}