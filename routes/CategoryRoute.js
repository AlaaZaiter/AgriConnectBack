const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
  getAll,
  getByID,
  addCategory,
  updateByID,
  deleteByID,
} = require('../controllers/categoryController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add', upload.fields([{ name: 'image' }]),addCategory);
router.put('/update/:ID', upload.fields([{ name: 'image' }]),updateByID);
router.delete('/delete/:ID', deleteByID);

module.exports = router;
