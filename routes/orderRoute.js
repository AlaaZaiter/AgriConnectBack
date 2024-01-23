const express = require('express');
const router = express.Router();


const {
  getAll,
  getByID,
  addOrder,
  updateByID,
  deleteByID,
  updateStatus,
} = require('../controllers/orderController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add', addOrder);
router.put('/update/:ID', updateByID);
router.put('/updateStatus/:ID', updateStatus);
router.delete('/delete/:ID', deleteByID);

module.exports = router;
