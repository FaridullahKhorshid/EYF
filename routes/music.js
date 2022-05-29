import express from 'express';

const music = require('../controllers/music.controller.js');

let router = express.Router();

router.get('/', music.index);

router.get('/get_files', music.getFiles);

router.get('/play', music.play);

module.exports = router;