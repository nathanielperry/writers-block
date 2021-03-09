export default class ScriptManager {
    script: Array<any>;
    scene: Phaser.Scene;
    current: integer;

    constructor(scene: Phaser.Scene) {
        this.script = [];
        this.current = 0;
        this.scene = scene;
    }

    //Run script
    async run() {
        if (this.current >= this.script.length) return;
        const event = this.script[this.current];
        await event.fn.apply(this, event.args);
        this.current += 1;
        this.run();
    }

    //Util Events
    log(text: string) {
        return new Promise<void>((resolve) => {
            console.log(text);
            resolve();
        });
    }

    sleep(time: integer) {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        })
    }

    onWord(word, fn) {
        return new Promise<void>((resolve) => {
            this.scene.events.on('word-complete', async (event) => {
                if (event === word) {
                    this.scene.events.off('word-complete');
                    await fn();
                    resolve();
                }
            });
        });
    }
}