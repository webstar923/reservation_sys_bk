const express = require('express');
const { findFlat, findWork, findReservation, findChangeDate } = require('../controllers/reservationController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// search Flat name
router.post('/findFlat',findFlat);
router.post('/findWork',findWork);
router.post('/findReservation',findReservation);
router.post('/findChangeDate',findChangeDate);
module.exports = router;
