const db = require("../models");
const {Op} = require("sequelize");

import {formatDate, parseOrders} from "../public/js/order";

const Order = db.order;
const OrderProduct = db.order_product;
const Product = db.product;

exports.index = async (req, res) => {
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    const orders = await Order.findAll({
        where: {
            [Op.not]: [
                {orderStatus: 'afgehandeld'}
            ]
        },
        include: [{
            model: OrderProduct,
            include: [{
                model: Product,
            }]
        }]
    });
    res.render('orders', {
        title: 'orders',
        orders: await parseOrders(orders),
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
        formatDate
    })
}

exports.create = (req, res) => {
    let body = req.body;
    let shoppingCart = body.shoppingCart;
    let user = body.user;

    const order = {
        orderStatus: 'in afwachting',
        date: new Date(),
        lastName: user.surname,
        seatNumber: user.seatNumber,
        paymentType: user.paymentType,
        totalPrice: body.totalPrice
    }

    Order.create(order)
        .then(data => {
            shoppingCart.forEach(item => {
                let orderProduct = {
                    orderId: data.id,
                    orderProductId: item.id,
                    amount: item.amount,
                }
                OrderProduct.create(orderProduct)
            })
        })
}

exports.complete = async (req, res) => {
    const orderId = req.body.orderId;
    const existingOrder = await Order.findOne({where: {id: orderId}})

    if (existingOrder !== null) {
        await Order.update({orderStatus: 'afgehandeld'}, {
            where: {
                id: orderId
            }
        });
        res.redirect('/order')
    }
}


exports.delete = async (req, res) => {
    const orderId = req.body.orderId;
    await Order.destroy({
        where: {
            id: orderId
        }
    });
    res.redirect('/order')
}
