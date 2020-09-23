const phrasesArray = [
  new Phrase('Hold your horses'), 
  new Phrase('Barking up the wrong tree'), 
  new Phrase('Neck of the woods'), 
  new Phrase('The best of both worlds'), 
  new Phrase('Your guess is as good as mine')
];

class Game {
  constructor() {
    this.missed = 0;
    this.phrases = phrasesArray;
    this.activePhrase = null;
    this.isRunning = false;
  }

  startGame() {
    // hide the start screen overlay
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    // set isRunning game to true
    this.isRunning = true;
    // get random phrase
    this.activePhrase = this.getRandomPhrase();
    // display phrase on board
    this.activePhrase.addPhraseToDisplay();
  }

  // method to reset the game 
  resetGame() {
    // remove all li elements from ul
    const phraseUL = document.querySelector('#phrase ul');
    phraseUL.innerHTML = '';

    // enable all of onscreen keyboard buttons
    const allKeys = document.querySelectorAll('.key');
    allKeys.forEach(key => {
      key.enabled = true;
      key.classList.remove('chosen', 'wrong');
    });

    // reset all heart images
    const scoreboard = document.querySelectorAll('#scoreboard img');
    scoreboard.forEach(heart => heart.setAttribute('src', 'images/liveHeart.png'))

    // reset missed variable
    this.missed = 0;
  }

  // method to randomly retrieve one of phrases
  getRandomPhrase() {
    const randomIndex = Math.floor(Math.random() * this.phrases.length);
    return this.phrases[randomIndex];
  }

  // method to hande player game interaction
  handleInteraction(selectedLetter) {
    // check if letter already had been selected 
    let letterAlreadySelected;
    const disabledKeys = document.querySelectorAll('button[disabled]');
    disabledKeys.forEach(key => key.textContent === selectedLetter ? letterAlreadySelected = true : '');
    // if it has been already selected return from the method
    if(letterAlreadySelected) return; 
    
    // get reference to all keys
    const allKeys = document.querySelectorAll('.key');
  
    // if key match selected letter, disable it and store its index 
    let selectedKeyIndex;
    allKeys.forEach( (key,index) => {
      if(key.textContent === selectedLetter) {
        key.disabled = true;
        selectedKeyIndex = index;
      }
    });

    //check if phrase contains letter
    const phraseContainsLetter = this.activePhrase.checkLetter(selectedLetter);
    if(!phraseContainsLetter) {
      // doesn't contain => add wrong css class to selected letter keyboard and remove life
      allKeys[selectedKeyIndex].classList.add('wrong');
      this.removeLife();
    } else {
      // contains => add chosen css class to selected letter keyboard
      allKeys[selectedKeyIndex].classList.add('chosen');
      this.activePhrase.showMatchedLetter(selectedLetter);

      // check if game won and call gameOver
      if(this.checkForWin()) {
        this.gameOver();
      }
    }
  }

  // method to remove life from scoreboard
  removeLife() {
    // get a reference to the scoreboard hearts
    const scoreboard = document.querySelectorAll('#scoreboard img');
    // reversed it so hearts are removed from right to left
    const indexReversed = (scoreboard.length - 1) - this.missed;
    // replace the full heart with lost heart and increment missed variable
    scoreboard[indexReversed].setAttribute('src', 'images/lostHeart.png');
    this.missed++;
    if(this.missed === 5) this.gameOver();
  }

  // method to check if player revealed all letters in active phrase
  checkForWin() {
    // get reference to phrase li letter elements && check if all have 'show' class
    const phrasesLI = document.querySelectorAll('.letter');
    return [...phrasesLI].every(li => li.classList.contains('show'));
  }

  // method to display win/lose screen
  gameOver(){
    // set isRunning game to false
    this.isRunning = false;
    // get reference to overlay div
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
    // stop the game 
    // get reference to gameover message h1
    const gameOverMessageRef = document.getElementById('game-over-message');
    if(this.missed < 5) {
      // won message and screen
      gameOverMessageRef.textContent = "Congratulations you won! :)";
      overlay.classList.replace('start', 'win');
    }else{
      // lost message and screen
      gameOverMessageRef.textContent = "Unfortunately you lost :(";
      overlay.classList.replace('start', 'lose');
    }
  }
}