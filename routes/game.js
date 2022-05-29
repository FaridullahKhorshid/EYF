import express from 'express';

const game = require('../controllers/game.controller.js');

let router = express.Router();

router.get('/', game.index);

router.get('/play', game.play);

module.exports = router;