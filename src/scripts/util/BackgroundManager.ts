const TOP = -1000;
const BOTTOM = -1100;

export default class BackgroundManager {
    scene: Phaser.Scene;
    backgrounds: Object;
    current: any;
    
    constructor(scene) {
        this.scene = scene;

        this.backgrounds = {
            paper: {
                sprite: this.createTileSprite('paper'),
                alphaTarget: 0,
            }, 
            mountains: {
                sprite: this.createTileSprite('mountains'),
                alphaTarget: 0,
            }, 
            blueprint: {
                sprite: this.createTileSprite('blueprint'),
                alphaTarget: 0,
            },
            dark: {
                sprite: this.createTileSprite('dark'),
                alphaTarget: 0,
            }
        }

        this.current = 'blueprint';
        this.setBackground('blueprint', true);
    }
    
    //Create background
    createTileSprite(key) {
        const bg = this.scene.add.tileSprite(0, 0, 9999, 192, key);
        bg.setOrigin(0, 0);
        bg.setScrollFactor(0.2);
        return bg;
    }

    setBackground(key, instant = false) {
        this.current = key;
        Object.keys(this.backgrounds).forEach(newKey => {
            let bg = this.backgrounds[newKey];
            if (this.current === newKey) {
                bg.alphaTarget = 1;
                bg.sprite.setDepth(TOP);
                if (instant) bg.sprite.setAlpha(1);
            } else {
                bg.alphaTarget = 0;
                bg.sprite.setDepth(BOTTOM);
            }
        });
    }

    update() {
        Object.values(this.backgrounds).forEach(bg => {
            bg.sprite.setAlpha(
                Phaser.Math.Interpolation.SmoothStep(
                    0.08, 
                    bg.sprite.alpha, 
                    bg.alphaTarget
                )
            );
        });
    }
}