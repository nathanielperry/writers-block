import MapSpawnpoint from './MapSpawnpoint';
import MapPointer from './MapPointer';
import MapZone from './MapZone';

const levels = [
    {
        name: 'An Idea',
        tilemapKey: 'tilemap',
        tilesetKey: 'tileset',
        objectSpritesheetKey: 'tilesheet',
    tilesetName: 'writer-tiles',
        layers: [
            { name: 'ground', collide: true, },
            { name: 'background', },
        ],
        objectTypes: {
            'spawnpoint': MapSpawnpoint,
            'pointer': MapPointer,
            'zone': MapZone,
        }
    }
]

export default levels;