import {Op} from "sequelize";

const db = require("../models");

const Product = db.product;


exports.getCart = async (req, res) => {
    res.render('common/cart', {
        title: 'cart',
        shoppingCart: req.shoppingCart,
    });
}

exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const product = {
        name: req.body.name,
        product_type: req.body.product_type,
        price: req.body.price
    };

    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Product."
            });
        });
};

exports.findAll = (req, res) => {
    Product.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving products."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Product.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product with id=" + id
            });
        });
};

exports.category = async (req, res) => {

    const type = req.query.type;
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    let products = [];
    if (type === 'luxury') {
        products = await Product.findAll({raw: true, where: {product_type: 'luxury'}})
    } else if (type === 'drinks') {
        products = await Product.findAll({
            raw: true,
            where: {
                [Op.or]: [{product_type: 'hot'}, {product_type: 'cold'}]
            }
        })
    } else if (type === 'food') {
        products = await Product.findAll({
            raw: true,
            where: {
                [Op.or]: [{product_type: 'snacks'}, {product_type: 'hot_food'}]
            }
        })
    } else {
        products = await Product.findAll({raw: true});
    }

    res.render('shop', {
        title: 'shop',
        products: products,
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
        type: type,
        pageInfo: 'In de shop kunt u producten bestellen en die worden dan afgeleverd door een van de medewerkers.',
    });
}
