export default class MapSpawnpoint {
    scene: Phaser.Scene;
    x: integer;
    y: integer;

    constructor(scene, mapObject) {
        const { x, y } = mapObject;
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    get position() {
        return { x: this.x, y: this.y }
    }
}