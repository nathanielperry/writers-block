import MapSprite from './MapSprite';
import MapSpawnpoint from './MapSpawnpoint';
import MapPointer from './MapPointer';
import MapZone from './MapZone';

const levels = [
    {
        name: 'An Idea',
        tilemapKey: 'tilemap',
        tilesetKey: 'tileset',
    tilesetName: 'writer-tiles',
        layers: [
            { name: 'ground', collide: true, },
            { name: 'background', },
        ],
        objectTypes: {
            'sprite': MapSprite,
            'spawnpoint': MapSpawnpoint,
            'pointer': MapPointer,
            'zone': MapZone,
        }
    }
]

export default levels;