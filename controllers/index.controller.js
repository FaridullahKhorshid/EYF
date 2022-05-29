const db = require("../models");
const Product = db.product;

exports.index = async (req, res) => {

    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    await Product.findAll({raw: true}).then(products => {
        res.render('index', {
            title: 'Tulip Air',
            products,
            loggedIn: cookie.loggedIn,
            username: cookie.username,
            shoppingCart: req.shoppingCart,
            pageInfo: 'U bevindt zich nu in de hoofdpagina van Tulip Air. Vanaf hier kunt u navigeren naar de shop en entertainment sectie en nog veel meer. '
        });
    });
};
