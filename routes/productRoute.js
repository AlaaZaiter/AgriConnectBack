const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAll,
  getByID,
  addProduct,
  updateByID,
  deleteByID,
  decrementStock,
} = require('../controllers/productController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add',upload.fields([{ name: 'image' }]), addProduct);
router.put('/update/:ID',upload.fields([{ name: 'image' }]), updateByID);
router.delete('/delete/:ID', deleteByID);
router.put('/decrementStock/:ID',decrementStock)

module.exports = router;
