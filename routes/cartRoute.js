
const express = require('express');
const router = express.Router();


const {
  getAll,
  getByID,
  addCart,
  updateByID,
  deleteByID,
} = require('../controllers/cartController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add', addCart);
router.put('/update/:ID', updateByID);
router.delete('/delete/:ID', deleteByID);

module.exports = router;
