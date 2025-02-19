const express = require('express');
const { 
        findFlat, findWork, findReservation, findChangeDate, 
        updatReservation, getChangeableDate, createReservation,
        getReservations
     } = require('../controllers/reservationController');
const authenticate = require('../middleware/authMiddleware');


const router = express.Router();

// search Flat name
router.post('/findFlat',findFlat);
router.post('/findWork',findWork);
router.post('/findReservation',findReservation);
router.post('/findChangeDate',findChangeDate);
router.post('/updateReservation',updatReservation);
router.post('/getChangeableDate',getChangeableDate);
router.post('/createReservation',createReservation);
router.get('/getReservations',getReservations);
module.exports = router;
