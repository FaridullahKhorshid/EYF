const urlSearchParams = new URLSearchParams(location.search);
let chatUsername = urlSearchParams.get('username');
let chatRoom = urlSearchParams.get('room');

initSocket()

function initSocket() {

    // send user form
    let roomForm = document.getElementById('chat_create_room_form');
    let chatForm = document.getElementById('chat_message_form');
    let leaveChatBtn = document.getElementById('leave_chat_button');
    let sendChatBtn = document.getElementById('send_chat_message');
    let chatMessageInput = document.getElementById('chat_message');

    // Join chatroom
    if (chatRoom != '' && chatRoom != undefined && chatRoom !== null) {
        socket = io();

        socket.emit('joinRoom', {
            username: chatUsername,
            room: chatRoom
        });

        // Message from server
        socket.on('message', (message) => {
            console.log(message);
            outputMessage(message);
        });

        // Message from server
        socket.on('typing', (message) => {
            document.getElementById('user_typing').innerText = message;
            setTimeout(function () {
                document.getElementById('user_typing').innerText = '';
            }, 1000);
        });

        // Message from server
        socket.on('outputImage', (message) => {
            message.text = `<img src="data:image/jpg;base64,${message.text}">`;
            outputMessage(message, true);
        });

        leaveChatBtn.addEventListener('click', (e) => {

            if (confirm('Weet u zeker dat u de chat wil verlaten?')) {
                socket.disconnect(true);

                window.location.href = '/chat';
            }
        })


        chatMessageInput.addEventListener('keydown', function () {
            socket.emit('chatTyping');
        });

        // Message submit
        sendChatBtn.addEventListener('click', (e) => {

            let fileInput = document.getElementById('chat_file');

            if (fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function () {
                    const bytes = new Uint8Array(this.result);
                    socket.emit('sendImage', bytes);
                    fileInput.value = '';
                };

                reader.readAsArrayBuffer(fileInput.files[0]);
            }

            // Get message text
            let message = chatMessageInput.value;
            message = message.trim();

            if (!message) {
                return false;
            }

            socket.emit('chatMessage', message);
            chatMessageInput.value = '';
            chatMessageInput.focus();

        });
    }
}


// Output message to DOM
function outputMessage(message, isImage = false) {


    const chatConversation = document.getElementById('conversation_messages');
    const divBody = document.createElement('div');

    divBody.classList.add('my-2');
    divBody.classList.add('d-flex');
    divBody.classList.add((chatUsername === message.username ? "justify-content-end" : 'justify-content-start'));

    const divContent = document.createElement('div');
    divContent.classList.add('content');
    divContent.classList.add((chatUsername === message.username ? "sender" : 'receiver'));

    //d-flex align-items-center justify-content-center
    const userP = document.createElement('p');
    userP.classList.add('message-user-meta');
    userP.classList.add('m-0');
    userP.innerText = message.username;
    userP.innerHTML += '<small> ' + message.time + '</small>';
    divContent.appendChild(userP);

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('text');
    if (isImage) {
        messageDiv.innerHTML = message.text;
    } else {
        messageDiv.innerText = message.text;
    }
    divContent.appendChild(messageDiv);

    divBody.appendChild(divContent);

    if (chatConversation != undefined) {
        chatConversation.appendChild(divBody);
        chatConversation.scrollTop = chatConversation.scrollHeight;
    }
}


// // file
// document.getElementById('chat_file').addEventListener('change', function () {
//
//     // console.log(this.files[0]);
//     const reader = new FileReader();
//     reader.onload = function () {
//         const bytes = new Uint8Array(this.result);
//         socket.emit('sendImage', bytes);
//     };
//
//     reader.readAsArrayBuffer(this.files[0]);
//
// }, false);




