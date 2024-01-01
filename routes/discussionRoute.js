const express = require('express');
const router = express.Router();


const {
  getAll,
  getByID,
  addDiscussion,
  updateByID,
  deleteByID,
} = require('../controllers/discussionController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add', addDiscussion);
router.put('/update/:ID', updateByID);
router.delete('/delete/:ID', deleteByID);

module.exports = router;
