import {formatDate, parseOrders} from "../public/js/order";

const db = require("../models");
const {Op} = require("sequelize");

let {promisify} = require('util');
let exec = promisify(require('child_process').exec);

const User = db.user;
const Order = db.order;
const OrderProduct = db.order_product;
const Product = db.product;
const Voucher = db.voucher;

exports.index = async (req, res) => {

    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    if (!(req.cookies['loggedIn'])) {
        res.redirect('/');
    }

    const openOrders = await Order.count({
        where: {
            [Op.not]: [
                {orderStatus: 'afgehandeld'}
            ]
        }
    });

    res.render('admin', {
        title: 'admin',
        openOrders: openOrders,
        loggedIn: cookie.loggedIn,
        username: cookie.username,
        shoppingCart: req.shoppingCart,
    })
}

exports.users = async (req, res) => {
    res.render('manage_users', {
        title: 'Admin',
        shoppingCart: req.shoppingCart,
        loggedIn: req.loggedIn,
        users: await User.findAll()
    })
}

exports.deleteUser = async (req, res) => {
    await User.destroy({
        where: {
            id: req.body.userId
        }
    })
    res.redirect('/admin/manage_users')
}

exports.vouchers = async (req, res) => {

}

exports.wifi = async (req, res) => {

}

exports.createUser = async (req, res) => {
    const user = {
        userName: req.body.username,
        password: req.body.password
    };

    User.create(user)
        .then(data => {
            res.redirect('/admin/manage_users')
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
}

exports.orderHistory = async (req, res) => {
    const orderHistory = await Order.findAll({
        where: {
            [Op.not]: [
                {orderStatus: 'in afwachting'}
            ]
        },
        include: [{
            model: OrderProduct,
            include: [{
                model: Product,
            }]
        }]
    });
    res.render('order_history', {
        title: 'Bestel geschiedenis',
        shoppingCart: req.shoppingCart,
        loggedIn: req.loggedIn,
        orders: await parseOrders(orderHistory),
        formatDate
    })
}


exports.updateUser = async (req, res) => {
    const user = {
        id: req.body.id,
        userName: req.body.username,
        existingPassword: req.body.existingPassword,
        newPassword: req.body.newPassword
    }
    const existingUser = await User.findOne({where: {id: user.id}})
    if (existingUser !== null) {
        await User.update({userName: user.userName, password: user.newPassword}, {
            where: {
                id: user.id
            }
        }).then(res.redirect('/admin/manage_users'))
    }
}


exports.manageVouchers = async (req, res) => {
    res.render('manage_vouchers', {
        title: 'Admin',
        shoppingCart: req.shoppingCart,
        loggedIn: req.loggedIn,
        vouchers: await Voucher.findAll({raw: true})
    })
}

exports.createVoucher = async (req, res) => {
    const voucher = {
        code: req.body.code,
        duration: req.body.duration,
        price: req.body.price
    };
    Voucher.create(voucher)
        .then(data => {
            res.redirect('/admin/manage_vouchers')
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Voucher."
            });
        });
}

exports.deleteVoucher = async (req, res) => {
    await Voucher.destroy({
        where: {
            id: req.body.voucherId
        }
    })
    res.redirect('/admin/manage_vouchers')
}


exports.wifiPassword = async (req, res) => {
    const newpwd = await (exec('./TulipAir_Infra/get_current_wifi_password.sh'));
    console.log(newpwd.stdout)
    res.render('password_wifi', {
        title: 'Wifi wachtwoord',
        shoppingCart: req.shoppingCart,
        loggedIn: req.loggedIn,
        newpwd: newpwd.stdout
    })
}

exports.resetWifiPassword = async (req, res) => {
    const resetWifiPwd = await (exec('sudo ./TulipAir_Infra/reset_wifi_password.sh'));
    console.log(resetWifiPwd.stdout)
    res.render('reset_wifi_pwd', {
        title: 'Reset wifi wachtwoord',
        shoppingCart: req.shoppingCart,
        loggedIn: req.loggedIn,
        resetWifiPwd: resetWifiPwd.stdout
    })
}

exports.pauseSystem = async (req, res) => {
    const pauseSystem = await (exec('sudo ./TulipAir_Infra/suspend_wifi.sh'));
    res.render('suspend_system', {
        title: 'Halt system',
        shoppingCart: req.shoppingCart,
        loggedIn: req.loggedIn,
        pauseSystem: pauseSystem
    })
}

exports.startSystem = async (req, res) => {
    const startSystem = await (exec('sudo ./TulipAir_Infra/start_wifi.sh'));
    console.log(startSystem)
    res.render('start_system', {
        title: 'Start system',
        shoppingCart: req.shoppingCart,
        loggedIn: req.loggedIn,
        startSystem: startSystem
    })
}