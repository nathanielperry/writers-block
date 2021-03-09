import MainScene from "../scenes/mainScene";

export default class CameraManager {
    cam: Phaser.Cameras.Scene2D.Camera;
    scene: MainScene;
    x: integer;
    target: any;
    actor: any;
    isInMoveMode: boolean;
    interpolation: integer;
    colliders: any;
    
    constructor(scene, camera) {
        this.cam = camera;
        this.scene = scene;
        this.x = 0;
        this.isInMoveMode = false;
        this.interpolation = 0.2;

        this.cam.setLerp(this.interpolation, this.interpolation);
        this.cam.setBounds(0, 0, 332 * 16, 192);
        
        //Create sprites to constrain player within camera.
        this.colliders = [
            this.createBoundingRectangle(0, -2),
            this.createBoundingRectangle(this.cam.width, 0),
        ];
    }

    createBoundingRectangle(x, origin) {
        const rectangle = this.scene.add.rectangle(0, 0, 2, this.cam.height);
        rectangle.setOrigin(0, 0);
        this.scene.physics.add.existing(rectangle);
        // @ts-ignore
        rectangle.body.allowGravity = false;
        // @ts-ignore
        rectangle.body.immovable = true;
        // @ts-ignore
        this.scene.physics.add.collider(this.scene.writer, rectangle);
        // @ts-ignore
        this.scene.physics.add.collider(this.scene.typewriter, rectangle);
        return rectangle;
    }

    follow(actor) {
        this.isInMoveMode = false;
        this.actor = actor;
        this.colliders[0].x = 0;
        this.colliders[1].x = 0;
    }

    move(x) {
        this.isInMoveMode = true;
        this.target = x;
        this.colliders[0].x = x-6;
        this.colliders[1].x = this.cam.width + x - 4;
    }

    update() {
        if (!this.isInMoveMode) {
            this.target = this.actor.x;
        }
        
        this.cam.scrollX = Phaser.Math.Interpolation.SmoothStep(
            this.interpolation, 
            this.cam.scrollX,
            // @ts-ignore
            this.isInMoveMode ? this.target : this.target - this.cam.width / 2
        );

        //@ts-ignore
        if (this.scene.typewriter.x < this.cam.scrollX) {
            this.scene.events.emit('story', 'ded');
        }
    }
}