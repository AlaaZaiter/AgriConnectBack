const express = require('express');
const router = express.Router();


const {
  getAll,
  addOrderProducts,
  getProductsByOrderId,
  getOrderByUserID
} = require('../controllers/orderproductsController');

router.get('/getAll', getAll);
router.get('/getByOrderID/:OrderID', getProductsByOrderId);
router.get('/getOrderByUserID/:UserID', getOrderByUserID);
router.post('/add', addOrderProducts);


module.exports = router;
