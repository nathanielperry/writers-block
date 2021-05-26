import BackgroundManager from '../util/BackgroundManager';
import TileManager from '../util/TileManager';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.spritesheet('writer', 'assets/img/writer-sheet.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet('mapSprites', 'assets/img/mapSprites.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('platforms', 'assets/img/platforms.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('blackhole', 'assets/img/blackhole.png');
    this.load.image('typewriter', 'assets/img/typewriter.png');
    this.load.image('deadline', 'assets/img/deadline.png');
    this.load.image('thanks', 'assets/img/thanks.png');

    this.load.image('tileset', 'assets/img/tileset.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/tilemap.json');

    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('mountains', 'assets/img/mountains.png');
    this.load.image('blueprint', 'assets/img/blueprint.png');
    this.load.image('dark', 'assets/img/dark.png');

    this.load.text('script', 'assets/script.txt');

    TileManager.preload(this);
    BackgroundManager.preload(this);
  }

  create() {
    this.scene.start('MainScene')
  }
}
