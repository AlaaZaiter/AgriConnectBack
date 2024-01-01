const express = require('express');
const router = express.Router();


const {
  getAll,
  getByID,
  addOrder,
  updateByID,
  deleteByID,
} = require('../controllers/orderController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add', addOrder);
router.put('/update/:ID', updateByID);
router.delete('/delete/:ID', deleteByID);

module.exports = router;
