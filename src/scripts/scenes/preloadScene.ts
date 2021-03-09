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

    TileManager.preload(this);
    BackgroundManager.preload(this);
  }

  create() {
    this.scene.start('MainScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
