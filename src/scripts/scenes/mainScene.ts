import StoryText from "../objects/storyText";
import TutorialObjects from "../objects/tutorialObjects";
import Typewriter from "../objects/typewriter";
import Writer from "../objects/writer"
import BlackHole from "../objects/blackhole"
import CameraManager from "../util/CameraManager";
import processEvent from "../util/processEvent";
import TileManager from "../util/TileManager";
import MapObjectsManager from "../util/MapObjectsManager";
import BackgroundManager from "../util/BackgroundManager";
import DeadLine from "../objects/deadline";
import ZoneManager from "../util/ZoneManager";

export default class MainScene extends Phaser.Scene {
  writer: Writer;
  typewriter: Typewriter;
  ground: Phaser.GameObjects.Rectangle;
  storyText: StoryText;
  cam: CameraManager;
  map: TileManager;
  mom: MapObjectsManager;
  blackhole: BlackHole;
  deadline: DeadLine;
  zm: ZoneManager;
  bgman: any;
  spawns: any;
  checkpointData: Object;
  deadlineEngaged: boolean;
  deaths: integer;

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    //Set background
    // @ts-ignore
    this.bgman = new BackgroundManager(this);

    //Initialize Tilemap
    this.map = new TileManager(this);

    //Setup tutorial buttons
    this.mom = new MapObjectsManager(this);
    this.mom.forEachByName([
        'key-up', 
        'key-down',
        'keyboard',
        'idea-1',
        'idea-2',
        'idea-3',
        'idea-4',
        'idea-5',
        'bridge-1',
    ], s => {
      s.setAlpha(0);
    });

    this.checkpointData = {};

    //Get spawnpoints
    this.spawns = this.map.getObjectsOfType('spawnpoint');
    
    this.writer = new Writer(this, this.spawns.playerSpawn.x, this.spawns.playerSpawn.y)
      .setDepth(-100);
    this.storyText = new StoryText(this, `Writer's Block: An essay on motivation. [title-done]`);
    this.typewriter = new Typewriter(this, this.spawns.typewriterSpawn.x, this.spawns.typewriterSpawn.y, this.writer, this.storyText)
      .setDepth(-200);
    this.writer.typewriter = this.typewriter;
    this.deadline = new DeadLine(this);
    this.deadlineEngaged = false;
    this.blackhole = new BlackHole(this, 0, 0);
    this.blackhole.moveTo(78, 3);
    this.deaths = 0;

    this.zm = new ZoneManager(this);
    this.zm.generateZones();
  
    //Main listener for zone triggers
    this.events.on('zone', (name) => {
      processEvent(this, name);
    });

    //Main listener for word triggers
    this.events.on('story', (word) => {
      processEvent(this, word);
    });

    this.map.collide(this.writer);
    this.map.collide(this.typewriter);

    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'Control') {
        this.storyText.autoType();
      } else {
        this.storyText.addLetter(event.key);
      }
    });

    this.cam = new CameraManager(this, this.cameras.main);
    this.cam.follow(this.writer);
  }

  update() {
    this.writer.update();
    this.typewriter.update();
    this.cam.update();
    this.blackhole.update();
    this.bgman.update();
    this.deadline.update();
  }

  createCheckpoint(x, y) {
    //Move spawnpoints
    const spawns = this.map.getObjectsOfType('spawnpoint');
    spawns.playerSpawn.x = x;
    spawns.playerSpawn.y = y;
    spawns.typewriterSpawn.x = x;
    spawns.typewriterSpawn.y = y;
  }

  createTriggerZones(index) {
    //Setup event trigger zones
    const zones = this.map.getObjectsOfType('zone');
    Object.values(zones).forEach((zone, i) => {
      // @ts-ignore
      if (i > this.checkpointData.triggerIndex) return;
      // @ts-ignore
      const newZone = this.add.zone(zone.x, zone.y, zone.width, zone.height);
      this.physics.add.existing(newZone);
      // @ts-ignore
      newZone.body.allowGravity = false;
      newZone.setOrigin(0, 0);
      let triggered = false;
      //@ts-ignore
      this.physics.add.overlap(this.writer, newZone, () => {
        if (!triggered) {
          // @ts-ignore
          this.events.emit('zone', zone.name);
          triggered = true;
        }
      });
    });
  }

  engageDeadline() {
    this.deadlineEngaged = true;
  }
}
