export default class MapZone extends Phaser.GameObjects.Zone {
    triggered: boolean;

    constructor(scene, tiledObject) {      
        const { x, y, width, height } = tiledObject;
        super(scene, x, y, width, height);

        scene.physics.add.existing(this);

        //@ts-ignore
        this.body.allowGravity = false;
        this.setOrigin(0, 0);

        this.scene = scene;
        this.triggered = false;
    }

    setZoneCollider(actor) {        
        this.scene.physics.add.overlap(actor, this, () => {
            if (!this.triggered) {
                // @ts-ignore
                this.scene.events.emit('script-event', this.name);
                this.triggered = true;
            }
        });
    }

    reset() {
        this.triggered = false;
    }
}