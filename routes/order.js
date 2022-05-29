import express from 'express';

const order = require('../controllers/order.controller.js');

let router = express.Router();

router.get('/', order.index);

router.post('/create', order.create);

router.post('/complete', order.complete);

router.delete('/delete', order.delete);

module.exports = router;
