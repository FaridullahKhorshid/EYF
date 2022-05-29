const users = [];
var moment = require('moment');

// Join user to chat
function userJoin(id, username, room) {

    const index = users.findIndex(user => user.username === username);
    username = ((index !== -1) ? username + '+' : username);

    const user = {id, username, room};

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

function getMessage(username, text) {

    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}


//game functions

// Join user to chat
function joinGame(id, username, room, game = false, symbol = 'x', opponentId = null) {
    const user = {id, username, room, game, symbol, opponentId};
    users.push(user);

    return user;
}

// Get current user
function getOpponentGameRoom() {
    let rooms = users.filter(user => user.game === true && !user.opponentId)
    return rooms[0] !== undefined ? rooms[0] : false;
}

let chat = {};
chat.userJoin = userJoin;
chat.getCurrentUser = getCurrentUser;
chat.userLeave = userLeave;
chat.getRoomUsers = getRoomUsers;
chat.getMessage = getMessage;

let game = {}
game.getCurrentUser = getCurrentUser;
game.userJoin = joinGame;
game.userLeave = userLeave;
game.getMessage = getMessage;
game.getOpponentGameRoom = getOpponentGameRoom;
game.getRoomUsers = getRoomUsers;


module.exports = {chat, game};
