
const qwerty = document.querySelector('#qwerty');
const phrase = document.querySelector('#phrase');
const startButton = document.querySelector('.btn__reset');
const h3 = document.createElement('h3');
const liveHeart = 'img/liveHeart.png';
const lostHeart = 'img/lostHeart.png';
const totalHearts = 5;
let missed = 0;
const phrases = [
    'every cloud has a silver lining',
    'take chances and make mistakes',
    'happiness is an attitude',
    'life is a gift',
    'today is a new beginning'
];
let usedPhrases = [];
let currentPhrase = '';

/********Functions*********/
//return a random phrase from an array
const getRandomPhraseAsArray = arr => {
    let randomNumber = Math.floor(Math.random() * arr.length);
    let randomPhrase = arr[randomNumber];

    /*If word has been used already and all words haven't been used, a new word is selected*/
    while (usedPhrases.includes(randomPhrase) && usedPhrases.length !== phrases.length) {
        randomNumber = Math.floor(Math.random() * arr.length);
        randomPhrase = arr[randomNumber]; 
    }

    /*If all words have been used, usedPhrases array is reset*/
    if (usedPhrases.length === phrases.length) {
        usedPhrases = [];
    }

    /*Random Phrase is pushed to Used Phrase Array*/
    usedPhrases.push(randomPhrase);
    currentPhrase = randomPhrase;
    return randomPhrase;
}

const randomPhrase = getRandomPhraseAsArray(phrases);

//adds the letters of a string to the display   
const addPhraseToDisplay = arr => {
        const ul = phrase.firstElementChild;
        //Clear existing display
        ul.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        const li = document.createElement('li');
        li.textContent = arr[i];
        if (li.textContent !== ' ') {
            li.className = 'letter';
        } else {
            li.className = 'space';
        }
        ul.appendChild(li);
    }
}

addPhraseToDisplay(randomPhrase);

//check if a letter is in the phrase
const checkLetter = button => {
    const lis = document.querySelectorAll('ul li');
    let isMatch = null;
    for (let i = 0; i < lis.length; i++) {
        if (button === lis[i].textContent.toLowerCase()) {
            lis[i].classList.add ('show');
            isMatch = true;
        } 
    }
    return isMatch;
}

//check if the game has been won or lost
const checkWin = () => {
    const letter = document.querySelectorAll('.letter');
    const letterTotal = letter.length;
    const show = document.querySelectorAll('.show');
    const showTotal = show.length;

    const startOverlay = document.querySelector('div.start');
    const resetText = 'Reset Game';
    const title = document.querySelector('.title');
   
    if (letterTotal === showTotal) {
        startOverlay.classList.replace('start', 'win');
        title.textContent = 'You won!!!!!';
        setTimeout(() => {startOverlay.style.display = 'flex';}, 500);
        //Clear out h3 text
        h3.textContent = '';
        startButton.textContent = resetText;
    } else if (missed >= 5) {
        startOverlay.classList.replace('start', 'lose');
        title.textContent = 'You lost!!!';
        setTimeout(() => {startOverlay.style.display = 'flex';}, 500);
        startButton.textContent = resetText;
        h3.textContent = `The random phrase was ${currentPhrase}.`;
        title.after(h3);
    }   
}


//Create Heart Images   
const createHearts = items => {
    for (let i = 0; i < items; i++) {
        const ol = document.querySelector('ol');
        const li = document.createElement('li');
        const image = document.createElement('img');
        li.classList.add('tries');
        image.src = liveHeart;
        image.height = '35';
        image.width = '30';
        li.appendChild(image);
        ol.appendChild(li);
    }
}

//Reset letters   
const resetLetters = () => {
    const letterDisplay = document.querySelectorAll('#phrase li');
        for (let i = 0; i < letterDisplay.length; i++) {
            letterDisplay[i].className = '';
        }
}

//Reset buttons   
const resetButtons = () => {
    const letterButton = document.querySelectorAll('.keyrow button');
    for (let i = 0; i < letterButton.length; i++) {
        letterButton[i].className = '';
    }
}

//Reset hearts   
const resetHearts = () => {
    const scoreboardHearts = document.querySelectorAll('.tries img');
    for (let i = 0; i < scoreboardHearts.length; i++) {
        let heartSRC = scoreboardHearts[i].src;
        if (heartSRC !== liveHeart) {
            scoreboardHearts[i].src = liveHeart;
        }
    }
}


//Reset Game  
const resetGame = () => {
        //Remove show class from display   
        resetLetters();

        //Remove chosen class from buttons   
        resetButtons();

        //Generate random word and add to display
        const randomPhrase = getRandomPhraseAsArray(phrases);
        addPhraseToDisplay(randomPhrase);

         //Reset scoreboard hearts
        resetHearts();

         //Reset score   
         missed = 0;

         };
      
/********Event Listeners*********/
//listen for the start game button to be pressed   
startButton.addEventListener('click', () => {
    const buttonText = startButton.textContent;
    if (buttonText === 'Start Game') {
        createHearts(totalHearts);
    } else if (buttonText === 'Reset Game') {
        resetGame();
    }
    const startScreen = document.querySelector('#overlay');
    startScreen.style.display = 'none';

    //Remove win and move class from start screen
    startScreen.classList.replace('win', 'start');
    startScreen.classList.replace('lose', 'start');
});

//listen for the onscreen keyboard to be clicked
qwerty.addEventListener('click', e=> {
    const button = e.target;
    if (button.nodeName === 'BUTTON' && button.className !== 'chosen') {
        const letter = button.textContent;

        /*Add transition to individual button to resolve flickering issue*/
        button.style.transition = 'all .2s ease-in-out';
        button.className = 'chosen';

        const letterFound = checkLetter(letter);
        const scoreboardOL = document.querySelector('#scoreboard ol');
        const scoreboardHearts = document.querySelectorAll('.tries img');
     
        if (!letterFound && missed <= 5) {
            missed ++;
            scoreboardHearts[(totalHearts - missed)].src = lostHeart;
        }

        checkWin();

        /*Remove transition from individual button*/
        button.style.transition = 'none';
    }
});