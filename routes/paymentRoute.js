const express = require('express');
const router = express.Router();


const {
  getAll,
  getByID,
  addPayment,
  updateByID,
  deleteByID,
} = require('../controllers//paymentController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add', addPayment);
router.put('/update/:ID', updateByID);
router.delete('/delete/:ID', deleteByID);

module.exports = router;
