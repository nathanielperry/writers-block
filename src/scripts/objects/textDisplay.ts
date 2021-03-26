import MainScene from "../scenes/mainScene";

export default class TextDisplay {
    nextDisplay: Phaser.GameObjects.Text;
    currentDisplay: Phaser.GameObjects.Text;
    theRestDisplay: Phaser.GameObjects.Text;
    group: Phaser.GameObjects.Group;
    xOffset: integer;
    yOffset: integer;
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: integer, y: integer) {
        this.xOffset = x;
        this.yOffset = y;
        this.scene = scene;

        const sharedStyles = {
            fontSize: '32px',
            strokeThickness: 5,
        };

        this.theRestDisplay = scene.add.text(x, y, '', {
            color: 'white',
            stroke: '#000',
            ...sharedStyles,
        });
        this.nextDisplay = scene.add.text(x, y, '', {
            color: '#00d',
            stroke: '#7bf',
            ...sharedStyles,
        });
        this.currentDisplay = scene.add.text(x, y, '', {
            color: 'pink',
            stroke: '#f0f',
            ...sharedStyles,
        });
    
        this.group = scene.add.group([
            this.theRestDisplay,
            this.nextDisplay,
            this.currentDisplay,
        ]);
    
        this.group.setOrigin(0);
        this.theRestDisplay.setDepth(403);
        this.currentDisplay.setDepth(402);
        this.nextDisplay.setDepth(401);
    }

    update(storyText) {
        const x = this.scene.cameras.main.scrollX + this.xOffset;
        const y = this.scene.cameras.main.scrollY + this.yOffset;
        this.group.setXY(x, y);
        // this.group.setAlpha(storyText.getIsActive() ? 1 : 0);
        this.group.setVisible(true);
        this.group.setAlpha(1);

        this.theRestDisplay.setText(storyText.getPureStoryText());
        this.currentDisplay.setText(storyText.getCurrentWord());
        this.nextDisplay.setText(storyText.getCurrentLetter());
    }
}