import MapObjectsManager from "./MapObjectsManager";

export default class ScriptManager {
    script: String;
    paused: Boolean;
    lastEvent: String;
    scene: Phaser.Scene;
    events: Array<{
        name: string,
        content: Array<string>,
    }>;
    gameObjects: {
        [index: string]: any,
    };
    gameActions: {
        [index: string]: any,
    };

    constructor(scene: Phaser.Scene, script: string) {
        this.script = script;
        this.events = [];
        this.lastEvent = '';
        this.scene = scene;
        this.gameObjects = {};
        this.gameActions = {};
        this.paused = false;

        this.parseEvents();
        this.createEventListener();

        //Register pause/resume event listeners
        this.scene.events.on('scriptPause', () => {
            this.paused = true;
        });
        this.scene.events.on('scriptResume', () => {
            this.paused = false;
        });
    }

    //Load a string into script manager
    setScript(txt) {
        this.script = txt;
    }

    getGameObject(name) {
        return this.gameObjects[name];
    }

    getEventsFromCurrent() {
        const index = this.events.findIndex(event => event.name === this.lastEvent);
        return this.events.slice(index);
    }

    //Parse #events into objects with the event name and the event content
    parseEvents() {
        const eventStrings = this.script.split('#').filter(str => str !== '');
        const events = eventStrings.map(str => {
            const lines = str.split('\r\n').filter(line => line !== '').map(line => line.trim());
            return {
                name: lines[0],
                content: lines.slice(1),
            }
        });
        
        this.events = events;
        return this;
    }

    parseEventArgs(args: Array<string>) {
        //For each argument, return an int, a matching game object, or the original argument.
        return args.map(arg => {
            if (!isNaN(parseInt(arg))) {
                return parseInt(arg);
            }    
            return arg.trim();
        });

    }

    interpolateStoryBlock(str: string) {
        const regex = /\{(.+)\}/g;
        let matchArr;
        //For every block of text within {curly braces}
        while((matchArr = regex.exec(str)) !== null) {
            let capture = matchArr[1];
            //Replace with corresponding gameObject of same name
            //Using an IIFE here to generate string dynamically
            str.replace(capture, (() => this.gameObjects[capture])());
        }
        return str;
    }

    //Set a listener for each event name, which will run that event's content
    createEventListener() {
        this.scene.events.on('script-event', name => {
            const event = this.events.find(event => event.name === name);
            if (event) {
                this.run(event);
            }
        });
    }

    runEventByName(name) {
        const event = this.events.find(e => e.name === name);
        if (event) {
            this.run(event);
        }
    }

    //Run a parsed event object by emitting an [action, args] 
    //pair for each as a script-action event or a `story string` 
    //as a script-story event
    //TODO: Refactor script manager to fix scope issues
    async run(event) {
        this.lastEvent = event.name;
        for (const str of event.content) {
            //If string starts with '--' emit corresponding event (if exists)
            if(/^--/.test(str)) {
                let [_, action, args] = str.match(/--(.+)\((.+)\)/);
                args = this.parseEventArgs(args.split(','));
                //If paused, wait for resume
                await new Promise((resolve) => {
                    const pauseInterval = setInterval(() => {
                        if (!this.paused) {
                            resolve(true);
                            clearInterval(pauseInterval);
                        }
                    }, 10);
                });
                //Emit script action as event
                this.scene.events.emit('action-' + action, args);
            //If string starts and ends with `backticks`, send script-story event with contents
            } else if(/^`.+`$/.test(str)) {
                let storyString = str.slice(1, str.length - 1);
                storyString = this.interpolateStoryBlock(storyString);
                this.scene.events.emit('script-story', storyString);
            }
        }
    }

    //Register new game objects for access within script events
    registerGameObjects(gameObjects) {
        Object.entries(gameObjects).forEach(gameObject => {
            const [key, value] = gameObject;
            this.gameObjects[key] = value;
        });
    }

    //Register new game action names and functions
    registerGameActions(gameActions: {
        [index: string]: any,
    }) {
        Object.entries(gameActions).forEach(gameAction => {
            const [name, fn] = gameAction;
            this.gameActions[name] = fn;
        });
    }
}