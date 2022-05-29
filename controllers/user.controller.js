const db = require("../models");
const User = db.user;

exports.index = (req, res) => {
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    res.render('login', {
        title: 'login',
        errors: '',
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
    })
}

exports.submit = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({where: {userName: username, password: password}})
    if (user !== null) {
        const cookieBody = {
            loggedIn: true,
            username: username,
            role: 'admin'
        }
        console.log(cookieBody)
        res.cookie('loggedIn', JSON.stringify(cookieBody), {
            maxAge: 86400 * 1000,
            httpOnly: true
        })
        res.redirect('/');
    } else {
        res.render('login', {
            loggedIn: false,
            shoppingCart: req.shoppingCart,
            title: 'Login',
            errors: 'Het is niet gelukt om in te loggen.'
        })
    }
}

exports.logout = (req, res) => {
    res.cookie('loggedIn', '', {
        maxAge: 0,
        httpOnly: true
    })
    res.redirect('/')
}
