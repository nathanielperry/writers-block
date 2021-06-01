export default class TileManager {
    scene: Phaser.Scene;
    tileset: any;
    objectLayer: any;
    map: Phaser.Tilemaps.Tilemap;
    layerId: integer;
    tileSize: integer;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.map = scene.make.tilemap({ key: 'tilemap' });
        this.tileset = this.map.addTilesetImage('writer-tiles', 'tileset');
        this.map.createLayer('background', 'writer-tiles');
        this.map.createLayer('ground', 'writer-tiles');
        this.map.setCollisionBetween(0, 999, true, true, 'ground');
    }

    //set collision with actor
    collide(actor) {
        this.scene.physics.add.collider(actor, this.map.getLayer('ground').tilemapLayer);
    }

    //Get spawnpoints
    getObjects(): Array<any> {
        return this.map.getObjectLayer('objects').objects;
    }

    getObjectsOfType(type) {
        const objects = this.getObjects().filter(object => {
            return object.type === type;
        });

        return objects.reduce((acc, object) => {
            if (acc[object.name]) {
                acc[object.name] = [object].concat(acc[object.name]);
            } else {
                acc[object.name] = object;
            }
            return acc;
        }, {});
    }

    createSpritesOfType(type, key) {
        const objects = this.getObjectsOfType(type);
        // @ts-ignore
        const sprites = Object.values(objects).map(object => {            
            //Cast into array to account for
            //possible multiples of same name
            let arr;
            // @ts-ignore
            if (object.length) {
                arr = object;
            } else {
                arr = [object];
            }

            return arr.map(o => {
                let spriteData = {};

                if (o.properties) {
                    spriteData = o.properties.reduce((acc, prop) => {
                        acc[prop.name] = prop.value;
                        return acc;
                    }, {});
                }

                // @ts-ignore
                const sprite = this.scene.add.sprite(o.x, o.y, key, spriteData.frame);
                // sprite.setData(spriteData);
                
                // @ts-ignore -- Setting initial alpha from Tiled param
                sprite.setAlpha(spriteData.alpha != undefined ? spriteData.alpha : 1);
                sprite.setOrigin(0, 0);
                // @ts-ignore
                sprite.name = o.name;
                return sprite;
            });
        });

        return sprites.flat();
    }

    createWall(name, key) {

    }
}