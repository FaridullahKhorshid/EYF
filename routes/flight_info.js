import express from 'express';

const flightController = require('../controllers/flight.controller.js')

let router = express.Router();

router.get('/', flightController.index);

module.exports = router;