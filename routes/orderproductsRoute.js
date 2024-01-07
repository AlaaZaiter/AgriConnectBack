const express = require('express');
const router = express.Router();


const {
  getAll,
  addOrderProducts,
  getProductsByOrderId,
} = require('../controllers/orderproductsController');

router.get('/getAll', getAll);
router.get('/getByOrderID/:OrderID', getProductsByOrderId);
router.post('/add', addOrderProducts);


module.exports = router;
