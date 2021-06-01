import Entity from '../objects/entity';
import { State, StateMachine } from '../util/StateMachine';

const WALKSPEED: integer = 300;
const JUMPHEIGHT: integer = 200;
const SLOWEDWALKSPEED: integer = 90;
const SLOWEDJUMPHEIGHT: integer = 90;

const MAXVELX = 150;
const MAXVELY = 400;
const SLOWED_MAXVELX = 90;

const GRAB_RADIUS = 30;

export default class Writer extends Entity {
    keys: Phaser.Types.Input.Keyboard.CursorKeys;
    direction: integer;
    spawn: { x: integer, y: integer }
    heldItem;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'writer');

        this.spawn = { x, y };
        this.direction = 1;
        this.depth = -100;
        this.heldItem = null;
        this.keys = scene.input.keyboard.createCursorKeys();
        this.addStateMachine('platform', 'idle', 
            {
                spawn: new SpawnState,
                idle: new IdleState,
                walk: new WalkState,
                jump: new JumpState,
                freeze: new FreezeState,
            }
        );

        this.setDragX(700)
            .setMaxVelocity(300, 400);

        this.scene.input.keyboard.on('keydown-DOWN', () => {
            this.handlePlayerHold();
        });
    
        //preload animation
        this.anims.create({
            key: 'idle-right',
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('writer', {start: 0, end: 1}),
        });
        this.anims.create({
            key: 'idle-left',
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('writer', {start: 2, end: 3}),
        });
        this.anims.create({
            key: 'walk-right',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('writer', {start: 4, end: 7}),
        });
        this.anims.create({
            key: 'walk-left',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('writer', {start: 8, end: 11}),
        });
    }

    getWalkSpeed() {
        return this.heldItem ? SLOWEDWALKSPEED : WALKSPEED;
    }
    
    getJumpHeight() {
        return this.heldItem ? SLOWEDJUMPHEIGHT : JUMPHEIGHT;
    }

    handlePlayerHold() {
        if (this.heldItem) {
            this.heldItem.setState('holdable', 'thrown', this);
            this.heldItem = null;
        } else {
            //Pickup Logic
            //Get array of holdable objects in range
            const physicsObjects = this.scene.physics.overlapCirc(this.x, this.y, GRAB_RADIUS);
            //@ts-ignore -- filter gives not callable error
            const grabbableObjects = physicsObjects
                .map(body => {
                    return body.gameObject;
                })
                .filter(gameObject => {
                    return gameObject.isGrabbable;
                });

            if (grabbableObjects.length > 0) {
                //Grab random object from list
                this.heldItem = grabbableObjects[Math.floor(Math.random() * grabbableObjects.length)];
                this.heldItem.setState('holdable', 'held', this);
            }
        }
    }

    update() {
        super.update();
        this.setMaxVelocity(this.heldItem ? SLOWED_MAXVELX : MAXVELX, MAXVELY);

        if (this.y > 192) {
            //You ded
            this.scene.events.emit('died');
        } 
    }
}

class SpawnState extends State {
    enter({ actor, stateMachine }) {
        actor.setPosition(actor.spawn.x, actor.spawn.y);
        stateMachine.setState('idle');
    }
}

class FreezeState extends State {
    enter({ actor, stateMachine }) {
        actor.setAccelerationX(0);
        setTimeout(() => {
            stateMachine.setState('idle');
        }, 200);
    }
}

class IdleState extends State {
    enter({ actor }) {
        actor.anims.play(
            actor.direction === 1 ? 'idle-right' : 'idle-left'
        );
        actor.setAccelerationX(0);
    }

    step({ actor, stateMachine }) {
        const { left, right, up } = actor.keys;

        if (up.isDown && actor.body.blocked.down) {
            stateMachine.setState('jump');
        }

        if(left.isDown || right.isDown) {
            stateMachine.setState('walk');
        }
    }
}

class WalkState extends State {
    step({ actor, stateMachine }) {
        const { left, right, up } = actor.keys;
        
        if (up.isDown && actor.body.blocked.down) {
            stateMachine.setState('jump');
        }

        if(left.isDown) {
            actor.setAccelerationX(-actor.getWalkSpeed());
            actor.anims.play('walk-left', true);
            actor.direction = -1;
        } else if (right.isDown) {
            actor.setAccelerationX(actor.getWalkSpeed());
            actor.anims.play('walk-right', true);
            actor.direction = 1;
        } else {
            stateMachine.setState('idle');
        }
    }
}

class JumpState extends WalkState{
    enter({ actor }) {
        actor.setVelocityY(-actor.getJumpHeight());
    }

    step({ actor, stateMachine }) {
        super.step({ actor, stateMachine });
        if(actor.body.blocked.down) {
            stateMachine.setState('idle');
        }
    }
}