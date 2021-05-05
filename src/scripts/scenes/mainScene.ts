import StoryText from "../objects/storyText";
import TutorialObjects from "../objects/tutorialObjects";
import Typewriter from "../objects/typewriter";
import Writer from "../objects/writer"
import BlackHole from "../objects/blackhole"
import CameraManager from "../util/CameraManager";
import TileManager from "../util/TileManager";
import MapObjectsManager from "../util/MapObjectsManager";
import BackgroundManager from "../util/BackgroundManager";
import DeadLine from "../objects/deadline";
import TextDisplay from "../objects/textDisplay";
import ZoneManager from "../util/ZoneManager";
import ScriptManager from "../util/ScriptManager";

export default class MainScene extends Phaser.Scene {
  writer: Writer;
  typewriter: Typewriter;
  spawnLocation;
  typewriterSpawnLocation;
  ground: Phaser.GameObjects.Rectangle;
  storyText: StoryText;
  textDisplay: TextDisplay;
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
    const scriptMan = new ScriptManager(this, this.cache.text.get('script'));

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
        'key-down-2',
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
    this.setPlayerSpawn('playerSpawn');
    this.setTypewriterSpawn('typewriterSpawn');

    this.writer = new Writer(this, this.spawnLocation.x, this.spawnLocation.y)
      .setDepth(-100);
    this.storyText = new StoryText(this);
    this.storyText.addStoryBlock(`Writer's Block: An essay on motivation. [title-done]`);
    this.textDisplay = new TextDisplay(this, 20, 10);

    this.events.on('hold-tw', () => {
      this.storyText.setActive();
    });
    this.events.on('throw-tw', () => {
      this.storyText.setInactive();
    });
    
    this.typewriter = new Typewriter(this, this.typewriterSpawnLocation.x, this.typewriterSpawnLocation.y, this.writer, this.storyText)
      .setDepth(-200);
    this.writer.typewriter = this.typewriter;
    this.deadline = new DeadLine(this);
    this.deadlineEngaged = false;
    this.blackhole = new BlackHole(this, 0, 0);
    this.blackhole.moveTo(78, 3);
    this.deaths = 0;

    this.zm = new ZoneManager(this);
    this.zm.generateZones();
    this.cam = new CameraManager(this, this.cameras.main);
    this.cam.follow(this.writer);

    scriptMan.registerGameObjects({
      bgman: this.bgman,
      cam: this.cam,
      writer: this.writer,
      typewriter: this.typewriter,
      deadline: this.deadline,
      blackhole: this.blackhole,
      physics: this.physics,
      ...this.mom.getMapObjects(),
    });

    scriptMan.registerGameActions({
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
        this.cam.move(x);
      },
      camFollow(name) {
        this.cam.follow(this[name]);
      },
      checkpoint(name) {
        this.createCheckpoint(name);
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
      },
      setX(name, x) {
        this[name].x = x;
      },
      setState(name, state, ...args) {
        this[name].getChildren.forEach(sprite => sprite.setState(state, args));
      },
      destroy(name) {
        this[name].destroy();
      },
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

  setPlayerSpawn(name) {
    const spawn = this.mom.getSpawn(name);
    this.spawnLocation = {
      x: spawn.x,
      y: spawn.y,
    }
  }

  setTypewriterSpawn(name) {
    const spawn = this.mom.getSpawn(name);
    this.typewriterSpawnLocation = {
      x: spawn.x,
      y: spawn.y,
    }
  }

  createCheckpoint(name) {
    //Move spawnpoints
    this.setPlayerSpawn(name);
    this.setTypewriterSpawn(name);
    //Track position in story.
    //Reset zones after point in story.
  }

  engageDeadline() {
    this.deadlineEngaged = true;
  }
}
