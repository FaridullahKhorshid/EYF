const gameSocket = io();
const startButton = document.getElementById('start_game');
const nameInput = document.getElementById('in_game_name');
const gameStartDiv = document.getElementById('game_start_form');
const gameContainer = document.getElementById('game_container');
let user;
let opponent;

const cellElements = document.querySelectorAll('.cell')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')

// frontend game actions
const X_CLASS = 'x'
const o_CLASS = 'o'
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// restart game btn
restartButton.addEventListener('click', function () {
    winningMessageElement.classList.remove('show');
    startGame();
});

let inGameName = localStorage.getItem('in_game_name');

if (inGameName != null && inGameName.length > 0) {
    gameStartDiv.classList.add('d-none');
    gameContainer.classList.remove('d-none');
} else {
    gameStartDiv.classList.remove('d-none');
    gameContainer.classList.add('d-none');
}

startButton.addEventListener('click', () => {
    inGameName = nameInput.value;

    if (inGameName !== null && inGameName.length > 0) {
        inGameName = nameInput.value;
        localStorage.setItem('in_game_name', inGameName);
    } else {
        alert('In game naam is leeg!');
    }

    joinGame();
});

joinGame();

function joinGame() {
    if (inGameName !== null && inGameName.length > 0) {
        gameStartDiv.classList.add('d-none');
        gameContainer.classList.remove('d-none');
        gameSocket.emit('joinGame', {'inGameName': inGameName, 'game': 'tic_tac_toe'});
    }
}

gameSocket.on('gameBegin', ({room, users}) => {

    console.log(users);
    user = users.find(user => user.username === inGameName);
    opponent = users.find(opponent => opponent.id === user.opponentId);

    users.forEach((user) => {
        document.getElementById('player_' + user.symbol + '_name').innerText = user.username;
    });

    if (opponent) {
        startGame();
        updateBoard();
    }
});

// Event is called when either player makes a move
gameSocket.on("moveMade", function (data) {

    placeMark(data.positionId, data.symbol);

    myTurn = data.symbol !== user.symbol;

    updateBoard();
});

function makeMove(e) {
    e.preventDefault();
    // It's not your turn
    if (!myTurn) {
        return;
    }

    // Emit the move to the server
    gameSocket.emit("makeMove", {
        symbol: user.symbol,
        room: user.room,
        positionId: e.target.getAttribute('id'),
    });
}


function startGame() {

    myTurn = user.symbol === 'x';

    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(o_CLASS)
        cell.removeEventListener('click', makeMove)
        cell.addEventListener('click', makeMove, {once: true})
    });

    updateBoard();
}

function placeMark(id, currentClass) {
    document.getElementById(id).classList.add(currentClass);
}

function updateBoard() {

    document.getElementById('player_x').classList.remove('selected_player');
    document.getElementById('player_o').classList.remove('selected_player');
    document.getElementById('player_' + (myTurn ? user.symbol : opponent.symbol)).classList.add('selected_player');

    board.classList.remove(user.symbol);
    board.classList.remove(opponent.symbol);
    board.style.opacity = "1";

    if (myTurn) {
        board.classList.add(user.symbol);
    } else {
        board.style.opacity = "0.5";
    }

    if (checkWin(user.symbol)) {
        winningMessageTextElement.innerText = `${user.username}! Hoera je hebt gewonnen!`;
        winningMessageElement.classList.add('show');
    } else if (checkWin(opponent.symbol)) {
        winningMessageTextElement.innerText = `${user.username}! Helaas je hebt verloren!`;
        winningMessageElement.classList.add('show');
    } else if (isDraw()) {
        winningMessageTextElement.innerText = 'Draw!';
        winningMessageElement.classList.add('show');
    }
}


function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(o_CLASS)
    })
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

document.getElementById('leave_game').addEventListener('click', function () {
    localStorage.setItem('in_game_name', '');
    window.location.reload();
});
