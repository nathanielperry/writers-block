const OBJECT_LAYER = 'objects';

export default class MapManager {
    scene: Phaser.Scene;
    objects: {};
    currentMap;

    constructor(scene) {
        this.scene = scene;
        this.objects = {};
    }
    
    loadLevel(level) {
        //Load Tiled Data from "level"
        const { tilemapKey, tilesetKey, tilesetName, 
                layers, objectTypes } = level;
        this.loadTilemap(tilemapKey, tilesetKey, tilesetName, layers);
        
        //Instantiate Objects
        Object.entries(objectTypes).forEach(([type, Constructor]) => {
            this.instantiateObjectOfType(type, Constructor);
        });
    }

    private loadTilemap(mapKey, tilesetKey, tilesetName, layers) {
        //create new tilemap from map json: mapKey
        const tilemap = this.scene.make.tilemap({ key: mapKey });
        this.currentMap = tilemap;
        
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
                //Create new generic mapObject
                const mapObject = new MapObject(obj.name, obj.type);                
                //Instance new object from constructor and combine with mapObject
                return Object.assign(new Constructor(this.scene, obj), mapObject);
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
        const objects = name ? this.objects : this.objects[name];
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

    constructor(name, type) {
        this.name = name;
        this.tiledType = type;
    }
}