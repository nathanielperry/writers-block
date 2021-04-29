import MainScene from "../scenes/mainScene";

export default class MapObjectsManager {
    scene: MainScene;
    sprites: Array<Phaser.GameObjects.Sprite>;
    spawns;
    targetY: integer;

    constructor(scene) {
        this.scene = scene;
        
        //Create all objects with type 'sprite'
        this.sprites = scene.map.createSpritesOfType('sprite', 'mapSprites');
        this.spawns = scene.map.getObjectsOfType('spawnpoint');
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

    getSprite(name) {
        return this.getMapObjects()[name];
    }

    getMapObjects() {
        return this.sprites.reduce((acc, s) => {
            if (acc[s.name]) {
                acc[s.name] = [s].concat(acc[s.name]);
            } else {
                acc[s.name] = s;
            }
            return acc;
        }, {});
    }

    getSpawn(name) {
        return this.spawns[name];
    }
}