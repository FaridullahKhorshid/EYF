import express from 'express';

const voucher = require('../controllers/voucher.controller.js');

let router = express.Router();

router.get('/', voucher.index);

router.get('/get_all', voucher.findAll);

router.get('/validate', voucher.validate);

module.exports = router;