exports.index = async (req, res) => {
    let username = req.query.username;
    let room = req.query.room;
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    res.render('chat', {
        title: 'Chat',
        usernameChat: username,
        room,
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
    });
};

