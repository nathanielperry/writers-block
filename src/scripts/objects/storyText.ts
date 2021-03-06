export default class StoryText {
    scene: Phaser.Scene
    story: string;
    pureStory: string;
    isActive: boolean;
    currentPosition: integer;
    offsetPosition: integer;

    constructor(scene: Phaser.Scene) {
      this.scene = scene;
      this.isActive = false;
      this.setInactive();

      this.scene.events.on('action-story', str => {
        this.addStoryBlock(str);
      });

      this.clear();

      //Register event listeners
      this.scene.events.on('showStoryText', () => {
        this.setActive();
      });
      this.scene.events.on('hideStoryText', () => {
        this.setInactive();
      });
    }

    clear() {
      this.currentPosition = -1;
      this.offsetPosition = -1;
      this.story = '';
      this.pureStory = '';
    }

    setActive() {
      this.isActive = true;
    }
    
    setInactive() {
      this.isActive = false;
    }

    getPureStoryText() {
      return this.story.replaceAll(/\[.+?\]/g, '');
    }

    getRemainingPureStoryText() {
      return this.getPureStoryText().slice(this.currentPosition + 1);
    }

    getCurrentWord() {
      return this.getRemainingPureStoryText().split(' ')[0];
    }

    getCurrentLetter() {
      return this.pureStory[this.currentPosition + 1];
    }

    nextIsEvent() { 
      return this.story[this.offsetPosition + 1] === '[';
    }

    getIsActive() {
      return this.isActive;
    }

    emitEvent() {
      //Check for next [bracket] pair from current offSetpositon 
      //(story position offset to account for events in brackets)
      const match = this.story.slice(this.offsetPosition).match(/\[(.+?)\]/);
      //If there is a valid event name, emit it.
      if (match !== null) {
        console.log(match[1]);
        this.scene.events.emit('action-event', match[1]);
        //offsetPosition increased to point at closing bracket.
        this.offsetPosition += match[0].length;
      }
    }

    addStoryBlock(str) {
      let newBlock = str;
      if (this.currentPosition + 1 < this.pureStory.length) {
        newBlock = ' ' + newBlock;
      }
      this.story += newBlock;
      this.pureStory = this.getPureStoryText();
    }

    autoType() {
      setTimeout(() => {
        this.addLetter(this.getCurrentLetter());
      }, 10);
    }

    addLetter(letter) {
      if(!this.isActive) return;
      if (letter === this.getCurrentLetter()) {
        //Successful Letter typed
        this.currentPosition++;
        this.offsetPosition++;
        //If the next character is '['
        //emit the event name.
        if (this.nextIsEvent()) {
          this.emitEvent();
        }
      }
    }
  }