import MainScene from "../scenes/mainScene";

export default class MapObjectsManager {
    scene: MainScene;
    sprites: Array<Phaser.GameObjects.Sprite>;
    zones;
    targetY: integer;

    constructor(scene) {
        this.scene = scene;
        
        //Create all objects with type 'sprite'
        this.sprites = scene.map.createSpritesOfType('sprite', 'mapSprites');
        
    }

    forEachByName(names: string | Array<string>, fn: Function) {
        let spriteNames: Array<any> = [];
        spriteNames = spriteNames.concat(names);
        this.forEachByX(s => {
            return spriteNames.includes(s.name);
        }, s => fn(s));
    }

    forEachByX(testFn: Function, fn: Function) {
        return this.getSprites(testFn).forEach(sprite => {
            fn(sprite);
        });
    }

    getSprites(fn: Function) {
        return this.sprites.reduce((match: Array<any>, sprite) => {
            if (fn(sprite)) {
                match.push(sprite);
            }
            return match;
        }, []);
    }

    getMapObjects() {
        return this.sprites.reduce((acc, s) => {
            acc[s.name] = s;
            return acc;
        }, {});
    }
}