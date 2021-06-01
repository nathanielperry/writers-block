export default class MapSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, mapObject) {
        const { x, y, key } = mapObject;
        super(scene, x, y, key);
    }
}