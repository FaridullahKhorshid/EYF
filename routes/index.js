import express from 'express';

const index = require('../controllers/index.controller.js');

let router = express.Router();

router.get('/', index.index);

module.exports = router;
