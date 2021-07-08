export default class MapSpawnpoint {
    x: integer;
    y: integer;

    constructor(scene, tiledObject) {       
        const { x, y } = tiledObject;
        this.setPosition(x, y);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    get position() {
        return { x: this.x, y: this.y }
    }
}