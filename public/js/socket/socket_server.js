import {chat, game} from './socket_helper';

const chatName = 'Tulip Air';

function init(io) {
    // Run when client connects
    io.on('connection', socket => {

        initChat(socket, io);
        initTicTacToe(socket, io);

        // Runs when client disconnects
        socket.on('disconnect', () => {
            const user = chat.userLeave(socket.id);

            if (user) {

                // chat user leaves
                io.to(user.room).emit(
                    'message',
                    chat.getMessage(chatName, `${user.username} heeft de chat verlaten!`)
                );

                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: chat.getRoomUsers(user.room)
                });

                io.to(user.room).emit('gameBegin', {
                    room: user.room,
                    users: game.getRoomUsers(user.room)
                });
            }
        });
    });

}

function initTicTacToe(socket, io) {

    socket.on('joinGame', ({inGameName, gameName}) => {

        if (inGameName !== null && inGameName.length > 0) {

            let opponent = game.getOpponentGameRoom();
            let roomName = (opponent ? opponent.room : inGameName + '_' + gameName);
            let user = game.userJoin(socket.id, inGameName, roomName, true, (opponent ? 'o' : 'x'), (opponent ? opponent.id : null));

            if (opponent) {
                game.userLeave(opponent.id);
                game.userJoin(opponent.id, opponent.username, user.room, true, opponent.symbol, user.id);
            }

            socket.join(user.room);

            io.to(user.room).emit('gameBegin', {
                room: user.room,
                users: game.getRoomUsers(user.room)
            });
        }
    });

    socket.on("makeMove", function (data) {
        io.to(data.room).emit('moveMade', data);
    });
}

function initChat(socket, io) {


    socket.on('joinRoom', ({username, room}) => {
        const user = chat.userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', chat.getMessage(chatName, 'Welcome ' + username + ' to ' + room + ' chat room!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                chat.getMessage(chatName, `${user.username} heeft de chat gejoined!`)
            );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: chat.getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', message => {
        console.log(message);
        const user = chat.getCurrentUser(socket.id);

        io.to(user.room).emit('message', chat.getMessage(user.username, message));
    });

    // Listen for chatMessage
    socket.on('chatTyping', message => {
        const user = chat.getCurrentUser(socket.id);

        socket.broadcast
            .to(user.room).emit('typing', user.username + ' is aan het typen...');
    });

    socket.on('sendImage', async image => {
        // image is an array of bytes
        const buffer = Buffer.from(image);
        const user = chat.getCurrentUser(socket.id);

        console.log(image);

        io.to(user.room).emit('outputImage', chat.getMessage(user.username, buffer.toString('base64')));

    });

}

let server = {};
server.init = init;

module.exports = server;
