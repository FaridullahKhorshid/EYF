const exec = require('child_process').exec;
const db = require("../models");
const Voucher = db.voucher;

exports.index = async (req, res) => {
    let cookie = (req.cookies['loggedIn']) ? JSON.parse(req.cookies['loggedIn']) : {loggedIn: '', username: ''};

    await Voucher.findAll({raw: true}).then(products => {
        res.render('voucher', {
            title: 'voucher',
            products,
            loggedIn: cookie.loggedIn,
            username: cookie.username,
            shoppingCart: req.shoppingCart,
        });
    });
};

exports.findAll = (req, res) => {
    Voucher.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving vouchers."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Voucher.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving voucher with id=" + id
            });
        });
};

exports.validate = async (req, res) => {


    const code = req.query.code;

    let voucher = await Voucher.findOne({where: {code: code}});
    if (voucher) {
        let testCode = exec('sudo ./TulipAir_Infra/add_client.sh ' + req.connection.remoteAddress.replace('::ffff:', ''), function (error, stdout, stderr) {
            if (error !== null) {
                console.log(error);
            } else {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
            }
        });

        res.send(voucher);
        console.log(voucher.id);

    } else {
        res.send(false);
        console.log('false');
    }

};


exports.update = (req, res) => {

};

exports.delete = (req, res) => {

};
