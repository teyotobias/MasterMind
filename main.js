/*----- constants -----*/

const COLORS = {
    '0' : 'white',
    '1' : 'red',
    '2' : 'yellow',
    '3' : 'blue',
    '4' : 'purple',
    '5' : 'pink',
    '6' : 'orange'
}
const RESULTS = {
    '0' : 'white',
    '1' : 'black',
    '2' : 'red'
}



/*----- state variables -----*/
let turn; //can be one of 0-9
let board; //array of 10 rows 
let winner; //null = no winner; 1 = winner
let results; //array of 10 rows corresponding to color choices player makes
let playerChoices;
let colorCode;

/*----- cached elements  -----*/
const messageEl = document.getElementById('result-message');
const colorCodeEl= document.getElementById('color-code');
const playAgainBtn = document.getElementById('play-again');


/*----- event listeners -----*/


/*----- functions -----*/
init();

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
    colorCode = [1,2,3,4]; //randomly generate, HCed just for testing
    playerChoices = [0,0,0,0];
    turn = 0;
    winner = null;
    colorCodeEl.style.visibility = 'hidden';
    messageEl.style.visibility = 'hidden';
    playAgainBtn.style.visibility = 'hidden';
    render();
}
function render() {
    renderBoard();
    renderMessage();
   // renderControls();
}

function renderBoard() {
    board.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function(cellVal, colIdx) {
            console.log(rowIdx, colIdx, cellVal);

            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];

        });
    });
    results.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function(cellVal, colIdx) {
            const cellId = `pegc${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];
        });

    })
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

function renderMessage() {
    if(turn === 10 || winner){
        messageEl.innerText = winner === null ? "You lose! Play again?":"You win! Play again?";
        colorCodeEl.style.visibility = 'visible';
        messageEl.style.visibility = 'visible';
        playAgainBtn.style.visibility = 'visible';

    }
}

function renderControls() {
}