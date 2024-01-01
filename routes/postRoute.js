const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAll,
  getByID,
  addPost,
  updateByID,
  deleteByID,
} = require('../controllers/postController');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/add',upload.fields([{ name: 'File' }]), addPost);
router.put('/update/:ID',upload.fields([{ name: 'File' }]), updateByID);
router.delete('/delete/:ID', deleteByID);

module.exports = router;
