const OBJECT_LAYER = 'objects';

export default class MapManager {
    scene: Phaser.Scene;
    objects: {};
    currentMap;
    currentLevel;
    currentTilesetKey;

    constructor(scene) {
        this.scene = scene;
        this.objects = {};

        //register script actions
        this.scene.events.on('action-show', ([name]) => {
            this.getMapObject(name).setAlpha(1);
        });
        this.scene.events.on('action-hide', name => {
            this.getMapObject(name).setAlpha(0);
        });
    }
    
    loadLevel(level) {
        //Load Tiled Data from "level"
        const { tilemapKey, tilesetKey, tilesetName, 
                layers, objectTypes } = level;
        this.currentLevel = level;
        this.loadTilemap(tilemapKey, tilesetKey, tilesetName, layers);
        
        //Instantiate Objects
        this.instantiateObjectOfType('sprite', null);
        Object.entries(objectTypes).forEach(([type, Constructor]) => {
            this.instantiateObjectOfType(type, Constructor);
        });
    }

    private loadTilemap(mapKey, tilesetKey, tilesetName, layers) {
        //create new tilemap from map json: mapKey
        const tilemap = this.scene.make.tilemap({ key: mapKey });
        this.currentMap = tilemap;
        this.currentTilesetKey = tilesetKey;
        
        //Link the tilesetKey (png) with the tilesetName from Tiled
        this.currentMap.addTilesetImage(tilesetName, tilesetKey);
        
        //Iterate over layers
        //Assign to this.currentMap and set collision
        layers.forEach(l => {          
            const layer = this.currentMap.createLayer(l.name, tilesetName);
            if (l.collide) {
                //Set all tiles in tileset as colliding.
                layer.setCollisionByExclusion([-1]);
            }
        });

        return this.currentMap;
    }       

    //Add collision between actor and tile layer
    addLayerCollider(actor, layerName) {
        this.scene.physics.add.collider(
            actor,
            this.currentMap.getLayer(layerName).tilemapLayer,
        );
    }

    //Instantiate objects of "type" using Constructor
    private instantiateObjectOfType(type, Constructor) {
        const objects = this.getTiledObjectsOfType(type);
        
        Object.entries(objects).forEach(([name, arr]) => {
            //@ts-ignore
            const instancedObjects = arr.map(obj => {               
                if (obj.type == 'sprite') {
                    //If sprite, use createFromObjects helper
                    return this.currentMap.createFromObjects('objects', {
                        name: obj.name,
                        key: this.currentLevel.objectSpritesheetKey,
                        frame: obj.gid - 1,
                    });
                } else {
                    //If anything else, use custom constructor
                    return new Constructor(this.scene, obj);
                }
            });
            this.objects[name] = instancedObjects;
        });
    }

    private getTiledObjects() {
        return this.currentMap.getObjectLayer(OBJECT_LAYER).objects;
    }

    //get all objects of type "type" as key value pairs
    //of objectName: objectsArray
    private getTiledObjectsOfType(type) {
        const objects = this.getTiledObjects().filter(object => {
            return object.type === type;
        });

        //Return key value pairs with values being an array of objects of each name
        return objects.reduce((acc, object) => {
            if (acc[object.name]) {
                acc[object.name] = acc[object.name].concat(object);
            } else {
                acc[object.name] = [object];
            }
            return acc;
        }, {});
    }

    getMapObject(name) {
        //Return first object of name: 'name'
        return this.objects[name][0];
    }

    getMapObjects(name?) {
        //Return all objects, or all objects of name: 'name'
        return name ? this.objects : this.objects[name];
    }

    getMapObjectsOfType(type) {
        //Return all objects of type: 'type'
        const allObjects = Object.values(this.objects).flat();
        //@ts-ignore
        return allObjects.filter(obj => obj.tiledType === type);
    }
}

class MapObject {
    name: string;
    tiledType: string;
    tiledData: any;

    constructor(object) {
        this.name = object.name;
        this.tiledType = object.type;
        this.tiledData = object;
    }
}