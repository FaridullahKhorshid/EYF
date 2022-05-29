import express from 'express';

const user = require('../controllers/user.controller.js')
let router = express.Router();

router.get('/', user.index)

router.post('/login', user.submit)

router.get('/logout', user.logout)

module.exports = router;
