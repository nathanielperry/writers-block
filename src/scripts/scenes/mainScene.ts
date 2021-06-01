import StoryText from "../objects/storyText";
import Typewriter from "../objects/typewriter";
import Writer from "../objects/writer";
import BlackHole from "../objects/blackhole";
import CameraManager from "../util/CameraManager";
import BackgroundManager from "../util/BackgroundManager";
import DeadLine from "../objects/deadline";
import TextDisplay from "../objects/textDisplay";
import ScriptManager from "../util/ScriptManager";
import MapManager from "../util/map/MapManager";

import levels from '../util/map/levels';

export default class MainScene extends Phaser.Scene {
  debug: Boolean;
  writer: Writer;
  typewriter: Typewriter;
  spawnLocation;
  typewriterSpawnLocation;
  ground: Phaser.GameObjects.Rectangle;
  storyText: StoryText;
  textDisplay: TextDisplay;
  cam: CameraManager;
  mapManager: MapManager;
  blackhole: BlackHole;
  deadline: DeadLine;
  bgman: any;
  spawns: any;
  checkpointData: Object;
  deadlineEngaged: boolean;
  deaths: integer;
  lastEvent: string;
  scriptMan: ScriptManager;

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.debug = true;
    this.deaths = 0;

    //Initialize various managers
    this.scriptMan = new ScriptManager(this, this.cache.text.get('script'));
    this.bgman = new BackgroundManager(this);
    this.mapManager = new MapManager(this);
    
    this.mapManager.loadLevel(levels[0]);

    //Set initial spawns
    let playerSpawn, typewriterSpawn;
    if (this.debug) {
      playerSpawn = this.mapManager.getMapObject('dev');
      typewriterSpawn = this.mapManager.getMapObject('dev');
    } else {
      playerSpawn = this.mapManager.getMapObject('playerSpawn');
      typewriterSpawn = this.mapManager.getMapObject('typewriterSpawn');
    }    
    
    //Spawn Player
    this.writer = new Writer(this, playerSpawn.x, playerSpawn.y);

    //Initialize story manager and text display
    this.storyText = new StoryText(this);
    this.textDisplay = new TextDisplay(this, 20, 10);
    
    //Spawn typewriter, deadline, and blackhole
    this.typewriter = new Typewriter(this, typewriterSpawn.x, typewriterSpawn.y);
    this.deadline = new DeadLine(this);
    this.blackhole = new BlackHole(this, 0, 0);
    this.blackhole.moveTo(78, 3);
    
    //Set ground collision for writer and typewriter
    this.mapManager.addLayerCollider(this.writer, 'ground');
    this.mapManager.addLayerCollider(this.typewriter, 'ground');

    //Setup overlaps to detect death state
    const deathOnTouchGroup = this.add.group(this.deadline);
    const vulnerableGroup = this.add.group(this.writer, this.typewriter);
    this.physics.add.overlap(vulnerableGroup, deathOnTouchGroup, () => {
      this.events.emit('died');
    });
  
    //Register event handlers
    this.events.on('died', () => {
      this.loadCheckpoint();
    });
    
    //Set writer to trigger event zones
    this.mapManager.getMapObjectsOfType('zone').forEach(zone => {      
      //@ts-ignore
      zone.setZoneCollider(this.writer);
    });

    //References writer and typewriter in constructor
    this.cam = new CameraManager(this, this.cameras.main);
    this.cam.follow(this.writer);

    // //Register game objects for access in event script
    // this.scriptMan.registerGameObjects({
    //   bgman: this.bgman,
    //   cam: this.cam,
    //   writer: this.writer,
    //   typewriter: this.typewriter,
    //   deadline: this.deadline,
    //   blackhole: this.blackhole,
    //   physics: this.physics,
    //   mom: this.mom,
    //   scene: this,
    //   ...this.mapManager.getMapObjects(),
    // });

    //Register actions that may be called from event script
    this.scriptMan.registerGameActions({
      log(string) {
        console.log(string);
      },
      show(name) {
        this[name].setAlpha(1);
      }, 
      hide(name) {
        this[name].setAlpha(0);
      },
      moveCamera(x) {
        if (typeof x === 'string') {
          this.cam.move(this.mom.getPointer(x).x);
        } else {
          this.cam.move(x);
        }
      },
      camFollow(name) {
        this.cam.follow(this[name]);
      },
      checkpoint(name) {
        //Set new spawn
        let newSpawn = this.mom.getSpawn(name);
        this.scene.setSpawn(newSpawn, newSpawn);
        //Set last event
        this.scene.lastEvent = this.scene.scriptMan.lastEvent;
      },
      fadeBackgroundTo(name) {
        this.bgman.setBackground(name);
      },
      wait(seconds) {
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), seconds * 1000);
        });
      },
      addPlayerCollider(name) {
        this.physics.add.collider(this.writer, this[name]);
        this.physics.add.collider(this.typewriter, this[name]);
      },
      setX(name, x) {
        if (typeof x === 'string') {
          this[name].x = this.mom.getPointer(x).x;
        } else {
          this[name].x = x;
        }
      },
      setState(name, state, ...args) {
        const parsedArgs = args.map(a => {
          return this[a] || a;
        });
        this[name].stateMachine.setState(state, ...parsedArgs);
      },
      destroy(name) {
        this[name].destroy();
      },
      getProp(varName, objectName, propertyName) {
        this.scene.scriptMan.registerGameObjects({
          [varName]: this.mom.getPointer(objectName)[propertyName],
        });
      },
    });

    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'Control') {
        this.storyText.autoType();
      } else {
        this.storyText.addLetter(event.key);
      }
    });
  }

  update() {
    this.writer.update();
    this.typewriter.update();
    this.cam.update();
    this.blackhole.update();
    this.bgman.update();
    this.deadline.update();
    this.textDisplay.update(this.storyText);
  }

  setSpawn(position) {
    this.writer.spawn = position;
    this.typewriter.spawn = position;
  }

  loadCheckpoint() {
    //Clear story.
    this.storyText.clear();
    //Move player to spawn.
    this.writer.setState('platform', 'spawn');
    this.typewriter.setPosition(
      this.typewriter.spawn.x,
      this.typewriter.spawn.y,
    );
    //Re-run last event.
    this.scriptMan.runEventByName(this.lastEvent);
  }
}
