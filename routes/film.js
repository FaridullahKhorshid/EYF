import express from 'express';

const music = require('../controllers/film.controller.js');

let router = express.Router();

router.get('/', music.index);

router.get('/play', music.play);

module.exports = router;