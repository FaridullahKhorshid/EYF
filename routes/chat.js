import express from 'express';

const chat = require('../controllers/chat.controller.js');

let router = express.Router();

// router.get('/:username/:room', chat.index);
router.get('/', chat.index);

module.exports = router;