const express = require('express');
const router = express.Router();

const {
  getAll,
  getByID,
  addCategory,
  updateByID,
  deleteByID,
} = require('../controllers/categoryController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add', addCategory);
router.put('/update/:ID', updateByID);
router.delete('/delete/:ID', deleteByID);

module.exports = router;
