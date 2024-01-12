/*----- constants -----*/

/* number: color for COLOR MAPPER */
const COLORS = {
    '0' : 'white',
    '1' : 'red',
    '2' : 'yellow',
    '3' : 'blue',
    '4' : 'purple',
    '5' : 'pink',
    '6' : 'orange',
    '7': 'green',
    '8': 'brown',
}
const RESULTS = {
     0 : 'white',
     1 : 'black',
     2 : 'red'
}

/*----- state variables -----*/
let turn; //can be one of 0-9
let board; //array of 10 rows 
let winner; //null = no winner; 1 = winner
let results; //array of 10 rows corresponding to color choices player makes
let playerChoices;
let colorCode;
let playerResults;
let currentSelection = []


/*----- cached elements  -----*/
const messageEl = document.getElementById('result-message');
const colorCodeEl= document.getElementById('color-code');
const playAgainBtn = document.getElementById('play-again');


/*----- event listeners -----*/
document.getElementById('colors').addEventListener('click', handleChoice);
//      ^Event Delegation
document.getElementById('play-again').addEventListener('click', playAgain);
document.getElementById('deselect').addEventListener('click', deselectAll);
document.getElementById('select').addEventListener('click', handleSelect);
document.getElementById('color-selection-button').addEventListener('click', function() {
    if (turn == 0 && playerChoices.every(choice => choice === 0)) {
        document.getElementById('color-selection-modal').style.display = 'block';
        populateColorChoices();
        updateSelectedColorsDisplay();
    } else {
        alert('Cannot modify in game!');
    }
});


/*----- functions -----*/
init();
//initalize board and data for game
function init() {
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ];
    results = [
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
        ['white', 'white', 'white', 'white'],
    ];

    if (currentSelection.length === 0) {
        currentSelection = ['1','2','3','4','5','6'];
    }
    colorCode = generateRandomColorCode();

    console.log('Color Code:', colorCode);


    playerChoices = [0,0,0,0];
    playerResults = [0,0,0,0];
    turn = 0;
    winner = null;
    colorCodeEl.style.visibility = 'hidden';
    messageEl.style.visibility = 'hidden';
    playAgainBtn.style.visibility = 'hidden';
    render();
}

function renderPlayerColorChoices() {
    const colorsEl = document.getElementById('colors');
    colorsEl.innerHTML = '';
    currentSelection.forEach(key => {
        const colorDiv = document.createElement('div');
        colorDiv.id = `color${key}`;
        colorDiv.style.backgroundColor = COLORS[key];
        colorsEl.appendChild(colorDiv);
    });
}

function selectColor(colorKey) {
    if (currentSelection.length < 6 && !currentSelection.includes(colorKey)) {
        currentSelection.push(colorKey);
        updateSelectedColorsDisplay();
    }
}
function updateSelectedColorsDisplay() {
    const selectedColorsEl = document.getElementById('selected-colors');
    // clears current display:
    selectedColorsEl.innerHTML = '';
    for (let i = 0; i < 6; i++ ) {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-choice-bubble';
        if ( i < currentSelection.length) {
            colorDiv.style.backgroundColor = COLORS[currentSelection[i]];
        } else {
            colorDiv.style.backgroundColor = 'lightgrey';
        }
        selectedColorsEl.appendChild(colorDiv);
    }
    // add new
}
function resetColorSelection() {
    currentSelection = [];
    updateSelectedColorsDisplay();
}

function finishColorSelection() {
    if (currentSelection.length === 6) {
        // close modal and use these colors for the game
        document.getElementById('color-selection-modal').style.display = 'none';
        renderPlayerColorChoices();
        colorCode = generateRandomColorCode();
        console.log('New Color Code:', colorCode);
        // now update game logic to use these colors
    }
}
function populateColorChoices() {
    const allColorsEl = document.getElementById('all-colors');
    allColorsEl.innerHTML = '';
    Object.keys(COLORS).forEach(key => {
        if(key!= '0') {
            const colorDiv = document.createElement('div')
            colorDiv.style.backgroundColor = COLORS[key];
            colorDiv.onclick = () => selectColor(key);
            allColorsEl.appendChild(colorDiv)
        }
    })
}







//generate random color code for each game
function generateRandomColorCode() {
    let randomColors = [];
    let colorKeys = currentSelection.slice()
    for(let i = 0; i < 4; i++) {
        let randIndex = Math.floor(Math.random() * colorKeys.length);
        randomColors.push(colorKeys[randIndex]);
        /*
        Taken out - repetition is okay here.
         colorKeys.splice(randIndex, 1); // Remove the selected key to avoid repetition
         */
    }
    return randomColors;

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array;
}

//calls determineOutcome after a turn has been finished
//and prepares board / game logic for next turn
function handleSelect() {
    determineOutcome();
    winner = getWinner() ? 1 : null;
    //slice instead of = because if playerResults gets cleared after
    // then so does results. slice creates a copy
    playerResults = shuffleArray(playerResults);
    results[turn] = playerResults.slice();
    // let count = playerResults.filter(val => val === 'red').length;
    // if(count == 0) {
    //     messageEl.innerText = "You're Cold..."
    // }
    // else if(count == 1) {
    //     messageEl.innerText = "Room Temp...";
    // }
    // else if(count == 2) {
    //     messageEl.innerText = "Very Warm..."
    // }
    // else if(count == 3) {
    //     messageEl.innerText = "You're Touching the Sun..."
    // }
    playerChoices.fill(0);
    playerResults.fill(0);
    turn++;
    render();
    
}
//render function -> board, message, controls
function render() {
    renderBoard();
    renderPlayerColorChoices();
    renderMessage();
    renderControls();
}
//deselects all colors selected for current turn
function deselectAll() {
    playerChoices.fill(0);
    playerResults.fill(0);
    board[turn].fill(0);
    render();

}
//renders board layout
function renderBoard() {
    //remember to clear player results
    //iterating over board and assigning each circle its color
    board.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function(cellVal, colIdx) {
            console.log(rowIdx, colIdx, cellVal);

            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];

        });
    });
    // ensure color choices are maintained
    //iterating over result pegs and assigning each peg its color
    results.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function(cellVal, colIdx) {
            const cellId = `pegc${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = cellVal;
        });

    });
    playerChoices.forEach(function(cellVal, choiceIdx) {
        const cellId = `choice${choiceIdx}`;
        const cellEl = document.getElementById(cellId);
        cellEl.style.backgroundColor = COLORS[cellVal];
        console.log(choiceIdx + cellVal);
    });
    colorCode.forEach(function(cellVal, colIdx) {
        const cellId = `c${colIdx}rA`;
        const cellEl = document.getElementById(cellId);
        cellEl.style.backgroundColor = COLORS[cellVal];
    });
}
//sends message to player based on win/loss
function renderMessage() {
    if(turn === 10 || winner){
        messageEl.innerText = winner === null ? "You lose! Play again?":"You win! Play again?";
        // colorCodeEl.style.visibility = 'visible';
        //messageEl.style.visibility = 'visible';
        // playAgainBtn.style.visibility = 'visible';
    }
    messageEl.style.visibility = 'visible';
}
//controls visibility of game outcome elements
function renderControls() {
    if(turn === 10 || winner) {
        colorCodeEl.style.visibility = 'visible';
        messageEl.style.visibility = 'visible';
        playAgainBtn.style.visibility = 'visible';
    }
}
//determines # of black, red pegs awarded to player
function determineOutcome() {

    let playerChoicesCopy = [...playerChoices];
    let colorCodeCopy = [...colorCode];
    //first check if any match in right place - red pegs
    for(let i = 0; i < playerChoices.length; i++) {
        if(playerChoices[i] === colorCode[i]) {
            playerResults[i] = RESULTS[2];  // Red peg
            playerChoicesCopy[i] = null;
            colorCodeCopy[i] = null;
        }
    }
    //now check to see if any belong but are not in right place - black pegs
    for(let i = 0; i < playerChoicesCopy.length; i++) {
        if(playerChoicesCopy[i] !== null) {
            let foundIndex = colorCodeCopy.indexOf(playerChoicesCopy[i]);
            if(foundIndex !== -1) {
                playerResults[i] = RESULTS[1];  // Black peg
                colorCodeCopy[foundIndex] = null;
            }
        }
    }
    //playerChoices.fill(0);
}
function playAgain() {
    init();
}
//checks to see if exists 4 red pegs -> they have guessed the code correctly
function getWinner() {
    return playerResults.every(val => val === RESULTS['2']); 
}

//handles a single selection of a color and updates board data
//provides a guard for color selection as well
function handleChoice(evt) {
    console.log(evt.target);
    //error checking right here
    if(evt.target.id !== 'colors') {
        const elID = evt.target.id;
        const colorID = elID[5];
        for(let i = 0; i < playerChoices.length; i++) {
            if(playerChoices[i] == 0){
                playerChoices[i] = colorID;
                board[turn][i] = colorID;
                break;
            }
        }  
    }

    render();
}