class TextDisplay extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, color, strokeColor, content) {
        super(scene, 10, 5, content, {
            color: color,
            fontSize: '32px',
            strokeThickness: 5,
            stroke: strokeColor,
        });

        scene.add.existing(this);
        this.setOrigin(0);
        this.setScrollFactor(0);
    }

    setContent(text) {
      this.setText(text);
    }
}

export default class StoryText {
    nextInput: string;
    currentInput: string;
    theRest: string;

    nextDisplay: TextDisplay;
    currentDisplay: TextDisplay;
    theRestDisplay: TextDisplay;
    textDisplayGroup: Phaser.GameObjects.Group;
    
    isVisible: boolean;
    letterCount: integer;
    storyLength: integer;
    storyPos: integer;
    currentWordLength: integer;
    currentWord: string;
    wordEvents: Object;
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, story: string) {
      this.storyLength = 0;
      this.storyPos = 1;
      this.wordEvents = {};

      this.theRestDisplay = new TextDisplay(scene, 'white', '#000', this.theRest);
      this.nextDisplay = new TextDisplay(scene, '#00d', '#7bf', this.nextInput);
      this.currentDisplay = new TextDisplay(scene, 'pink', '#f0f', this.currentInput);
      
      this.theRestDisplay.setDepth(400);
      this.nextDisplay.setDepth(400);
      this.currentDisplay.setDepth(400);

      this.theRest = '';
      this.addToStory(story);
      this.nextInput = story[0];
      this.currentInput = '';
      this.scene = scene;

      this.letterCount = 0;
      this.setCurrentWord();


      this.textDisplayGroup = this.scene.add.group([
        this.theRestDisplay,
        this.nextDisplay,
        this.currentDisplay,
      ]);

      this.isVisible = false;
      this.setInvisible();
    }

    render() {
      this.theRestDisplay.setText(this.theRest);
      this.nextDisplay.setText(this.nextInput);
      this.currentDisplay.setText(this.currentInput);
    }

    setVisible() {
      this.textDisplayGroup.setAlpha(1);
      this.isVisible = true;
    }
    
    setInvisible() {
      this.textDisplayGroup.setAlpha(0);
      this.isVisible = false;
    }

    setCurrentWord() {
      this.currentWordLength = this.theRest.split(' ')[0].length;
      this.currentWord = this.theRest.split(' ')[0];
    }

    getNextLetter() {
      const match = this.theRest.match(/[^\s]/);
      return match ? match[0] : '';
    }

    addToStory(text) {
      //Remove events from story text
      //Grab their index and calculate overall position in story
      //Then attach event listeners to all events
      
      //Offset tracks space taken up by the event strings
      //This helps to not count the space in the event position

      let offset = 0; 
      let result;
      const regex = /\[(.+?)\]/g;
      while(result = regex.exec(text)) {
        offset += result[0].length;
        this.wordEvents[this.storyLength + regex.lastIndex - offset + 1] = result[1];
      }

      const plainText = text.replace(regex, '').trimRight();

      //Add new text to overall story length counter.
      this.storyLength += plainText.length + 1;
      //Add a space if there is any story still in the queue.
      if (this.theRest.length > 0) {
        this.theRest = this.theRest.concat(' ');
        //Add the new story text.
        this.theRest = this.theRest.concat(plainText);
      } else {
        //If there was no story still in queue...
        //Add the new story text.
        this.theRest = this.theRest.concat(plainText);
        
        //Then reset the next letter and word.
        this.nextInput = this.getNextLetter();
        this.setCurrentWord();
      }

      this.render();
    }

    restart(text) {
      this.theRest = '';
      this.storyLength = 0;
      this.storyPos = 1;
      this.letterCount = 0;

      this.addToStory(text);
      this.getNextLetter();
    }

    autoType() {
      // setTimeout(() => {
      //   this.addLetter(this.nextInput === '_' ? ' ' : this.nextInput.trim());
      //   this.addLetter(' ');
      // }, 100);
    }

    advanceStoryPosition() {
      //Move overrall position in story + 1
      this.storyPos += 1;
      //Trigger any events at new position.
      const event = this.wordEvents[this.storyPos];
      if (event) {
        this.scene.events.emit('story', event);
      }
    }

    addLetter(letter) {
      if(!this.isVisible) return;

      //If word is not completely typed and matches nextInput..
      if(this.letterCount < this.currentWordLength && letter === this.nextInput.trim()) {
        //Add letter to current input.
        this.currentInput = this.currentInput.concat(letter);
        //Move pointer to next letter.
        this.letterCount += 1;
        
        //Remove already typed letters from the rest of the story.
        this.theRest = this.theRest.slice(this.letterCount);
        //Add in spaces to replace removed ones.
        this.theRest = ''.padStart(this.letterCount, ' ') + this.theRest;

        this.advanceStoryPosition();
        
        //Get next letter from story.
        //Add spaces to displace nextInput by number of typed letters.
        if (this.letterCount >= this.currentWordLength) {
          this.nextInput = '_';
        } else {
          this.nextInput = this.getNextLetter();
        }

        this.nextInput = ''.padStart(this.letterCount, ' ') + this.nextInput;
      
      //If at end of word and next letter is a space..
      } else if (this.letterCount >= this.currentWordLength && letter === ' ') {
        //Reset counters and remove word.
        this.theRest = this.theRest.trimLeft();
        this.nextInput = this.getNextLetter();
        this.currentInput = '';

        this.letterCount = 0;
        this.scene.events.emit('word-complete', this.currentWord);
        this.setCurrentWord();

        this.advanceStoryPosition();
      }

      this.render();
    }

  }