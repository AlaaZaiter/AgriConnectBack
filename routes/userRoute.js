const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAll,
  getByID,
  login,
  register,
  updateByID,
  switchToAdmin,
  deleteByID,
  verifyEmail,
  updateWithImageByID,
} = require('../controllers/userController');
const isAuthenticated = require('../middlwares/isAuth');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/login', login);
router.post('/register', upload.fields([{ name: 'image' }]),register);
router.put('/update/:ID',upload.fields([{ name: 'image' }]), updateByID);
router.put('/updateWithImg/:ID',upload.fields([{ name: 'image' }]), updateWithImageByID);
router.put(
  '/switchToAdmin/:ID',
  isAuthenticated(['admin']),
  switchToAdmin
);
router.delete('/delete/:ID', deleteByID);
router.put('/verify', verifyEmail);


module.exports = router;
