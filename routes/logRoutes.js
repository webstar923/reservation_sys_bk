const express = require('express');
const { 
    getErrorData,getChangeData
     } = require('../controllers/logController');

const router = express.Router();

router.get('/getErrorData',getErrorData);
router.get('/getChangeData',getChangeData);

module.exports = router;