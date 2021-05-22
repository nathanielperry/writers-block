import MainScene from "../scenes/mainScene";

export default class MapObjectsManager {
    scene: MainScene;
    sprites: Array<Phaser.GameObjects.Sprite>;
    spriteGroups: Object;
    spawns;
    pointers;

    constructor(scene) {
        this.scene = scene;
        
        //Create all objects with type 'sprite'
        this.sprites = scene.map.createSpritesOfType('sprite', 'mapSprites');
        //Add to physics engine
        this.sprites.forEach(sprite => {
            this.scene.physics.add.existing(sprite);
            //@ts-ignore
            sprite.body.setAllowGravity(false);
            //@ts-ignore
            sprite.body.setImmovable(true);
        });
        this.spriteGroups = this.sprites.reduce((acc, sprite) => {
            if (!acc[sprite.name]) {
                acc[sprite.name] = this.scene.add.group();
            }
            acc[sprite.name].add(sprite);
            return acc;
        }, {});
        this.spawns = scene.map.getObjectsOfType('spawnpoint');
        this.pointers = scene.map.getObjectsOfType('pointer');
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
        return this.spriteGroups;
    }

    getMapObject(name) {
        return this.getMapObjects()[name] || name;
    }

    getSpawn(name) {
        return this.spawns[name];
    }

    getPointer(name) {
        return this.pointers[name];
    }
}