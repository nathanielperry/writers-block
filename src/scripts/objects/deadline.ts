export default class DeadLine extends Phaser.GameObjects.Rectangle {
    scene: Phaser.Scene;
    velX: integer;
    targetX: integer;
    jumping: boolean;
    stoppingPoint: integer;

    constructor(scene: Phaser.Scene) {
        super(scene, -100, 0, 5, 192, 0xff0000);
        this.setOrigin(0, 0);
        this.scene = scene;
        this.velX = 0;
        this.targetX = -100;
        this.jumping = false;
        this.stoppingPoint = -1;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // @ts-ignore
        this.body.allowGravity = false;
        // @ts-ignore
        // this.body.immovable = true;

        this.scene.physics.add.overlap(this, this.scene.writer, () => {
            this.scene.events.emit('story', 'ded');
        });
        //@ts-ignore
        this.scene.physics.add.overlap(this, this.scene.typewriter, () => {
            this.scene.events.emit('story', 'ded');
        });
    }

    setVelX(velX: integer) {
        this.jumping = false;
        this.velX = velX;
    }

    jumpTo(x) {
        this.jumping = true;
        this.targetX = x;
        setTimeout(() => {
            this.jumping = false;
            this.velX = 0.2;
        }, 1500);
    }

    jump(x) {
        this.jumping = true;
        this.targetX = this.x + x;
        setTimeout(() => {
            this.jumping = false;
            this.velX = 0.2;
        }, 500);
    }

    stopAt(x) {
        this.stoppingPoint = x;
    }

    resume(velX?) {
        this.stoppingPoint = -1;
        this.velX = velX ? velX : this.velX;
    }

    update() {
        if(this.jumping) {
            this.x = Phaser.Math.Interpolation.SmootherStep(
                0.2,
                this.x,
                this.targetX,
            );
        } else {
            this.x += this.velX;
        }

        if(this.stoppingPoint > 0) {
            this.x = Math.min(this.x, this.stoppingPoint);
        }
    }
}