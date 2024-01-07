const express = require('express');
const router = express.Router();


const {
  getAll,
  addCartProducts,
  getProductsByCartId,
} = require('../controllers/cartproductsController');

router.get('/getAll', getAll);
router.get('/getByOrderID/:CartID', getProductsByCartId);
router.post('/add', addCartProducts);


module.exports = router;
