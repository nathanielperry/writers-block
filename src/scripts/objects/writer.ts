import { DOWN, Scene, UP } from 'phaser';
import { State, StateMachine } from '../util/StateMachine';
const WALKSPEED: integer = 300;
const JUMPHEIGHT: integer = 200;
const SLOWEDWALKSPEED: integer = 90;
const SLOWEDJUMPHEIGHT: integer = 90;

const MAXVELX = 150;
const MAXVELY = 400;
const SLOWED_MAXVELX = 90;

export default class Writer extends Phaser.Physics.Arcade.Sprite {
    stateMachine: StateMachine;
    keys: Phaser.Types.Input.Keyboard.CursorKeys;
    isTypewriterOverlapped: boolean;
    typewriter: any;
    direction: integer;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'writer');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.direction = 1;
        this.keys = scene.input.keyboard.createCursorKeys();
        this.stateMachine = new StateMachine('idle', {
            idle: new IdleState,
            walk: new WalkState,
            jump: new JumpState,
            freeze: new FreezeState,
        }, this);

        this.setDragX(700)
            .setMaxVelocity(300, 400);

        this.scene.input.keyboard.on('keydown-DOWN', () => {
            if (this.scene.physics.overlap(this, this.typewriter)) {
                if (this.isTypewriterHeld()) this.stateMachine.setState('freeze');
                this.typewriter.toggleHeld();
            }
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

    isTypewriterHeld() {
        return this.typewriter.stateMachine.currentState == 'held';
    }

    getWalkSpeed() {
        return this.isTypewriterHeld() ? SLOWEDWALKSPEED : WALKSPEED;
    }
    
    getJumpHeight() {
        return this.isTypewriterHeld() ? SLOWEDJUMPHEIGHT : JUMPHEIGHT;
    }

    update() {
        this.setMaxVelocity(this.isTypewriterHeld() ? SLOWED_MAXVELX : MAXVELX, MAXVELY);
        this.stateMachine.step();

        if (this.y > 192) {
            //You ded
            this.scene.events.emit('story', 'ded');
        } 
    }
}

class FreezeState extends State {
    enter() {
        this.actor.setAccelerationX(0);
        setTimeout(() => {
            this.stateMachine.setState('idle');
        }, 200);
    }
}

class IdleState extends State {
    enter() {
        this.actor.anims.play(
            this.actor.direction === 1 ? 'idle-right' : 'idle-left'
        );
        this.actor.setAccelerationX(0);
    }

    run() {
        const { left, right, up } = this.actor.keys;

        if (up.isDown && this.actor.body.blocked.down) {
            this.stateMachine.setState('jump');
        }

        if(left.isDown || right.isDown) {
            this.stateMachine.setState('walk');
        }
    }
}

class WalkState extends State {
    enter() {
        
    }

    run() {
        const { left, right, up } = this.actor.keys;
        
        if (up.isDown && this.actor.body.blocked.down) {
            this.stateMachine.setState('jump');
        }

        if(left.isDown) {
            this.actor.setAccelerationX(-this.actor.getWalkSpeed());
            this.actor.anims.play('walk-left', true);
            this.actor.direction = -1;
        } else if (right.isDown) {
            this.actor.setAccelerationX(this.actor.getWalkSpeed());
            this.actor.anims.play('walk-right', true);
            this.actor.direction = 1;
        } else {
            this.stateMachine.setState('idle');
        }
    }
}

class JumpState extends WalkState{
    enter() {
        this.actor.setVelocityY(-this.actor.getJumpHeight());
    }

    run () {
        super.run();
        if(this.actor.body.blocked.down) {
            this.stateMachine.setState('idle');
        }
    }
}