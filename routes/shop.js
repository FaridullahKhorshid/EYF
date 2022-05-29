import express from 'express';

const shop = require('../controllers/shop.controller.js');

let router = express.Router();

router.get('/', shop.category)

router.get('/get_all', shop.findAll);

router.get('/get_one/:id', shop.findOne);

router.get('/get_cart', shop.getCart);

module.exports = router;
