import MainScene from '../scenes/mainScene';

export default class ZoneManager {
    scene: MainScene;
    zones: Array<any>;

    constructor(scene: MainScene) {
        this.scene = scene;
        this.zones = [];
    }

    generateZones() {
        //Setup event trigger zones
        const zones = this.scene.map.getObjectsOfType('zone');
        Object.values(zones).forEach((zone, i) => {
            // @ts-ignore
            const newZone = this.scene.add.zone(zone.x, zone.y, zone.width, zone.height);
            this.scene.physics.add.existing(newZone);
            // @ts-ignore
            newZone.body.allowGravity = false;
            newZone.setOrigin(0, 0);
            
            const zoneObj = {
                zone: newZone,
                // @ts-ignore
                name: zone.name,
                triggered: false,
            }

            this.zones.push(zoneObj);

            //@ts-ignore
            this.scene.physics.add.overlap(this.scene.writer, newZone, () => {
                if (!this.zones[i].triggered) {
                    // @ts-ignore
                    this.scene.events.emit('zone', zone.name);
                    this.zones[i].triggered = true;
                }
            });
        });
    }

    resetZones(i) {
        this.zones.slice(i).forEach(zone => {
            zone.triggered = false;
        });
    }
}