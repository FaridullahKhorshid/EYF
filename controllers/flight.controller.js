const db = require("../models");

exports.index = async (req, res) => {

    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    res.render('flight_info', {
        title: 'Vluchtinformatie',
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
        pageInfo: 'Op deze pagina zie je de vluchtinformatie van uw huidige vlucht. Verder kunt ook informatie vinden van verschillende steden.',
    });
}