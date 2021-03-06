import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 192;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 400 }
    }
  },
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
})

window.addEventListener('keydown', (e) => {
  //Disable backspace from going back
  if (e.key === 'Backspace') e.preventDefault();
});
