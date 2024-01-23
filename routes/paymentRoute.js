const express = require('express');
const router = express.Router();


const {
  
  processPayment,
  getStatusByOrderId,
} = require('../controllers/paymentController');


router.post('/pay',processPayment)
router.get('/getStatus/:orderID',getStatusByOrderId)

module.exports = router;
