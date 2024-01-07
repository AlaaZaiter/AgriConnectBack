const express = require('express');
const router = express.Router();

const {
  getAll,
  getByID,
  login,
  register,
  updateByID,
  switchToAdmin,
  deleteByID,
  verifyEmail,
} = require('../controllers/userController');
const isAuthenticated = require('../middlwares/isAuth');

router.get('/getAll', getAll);
router.get('/getByID/:ID', getByID);
router.post('/login', login);
router.post('/register', register);
router.put('/update/:ID', isAuthenticated(['admin']), updateByID);
router.put(
  '/switchToAdmin/:ID',
  isAuthenticated(['admin']),
  switchToAdmin
);
router.delete('/delete/:ID', isAuthenticated(['admin']), deleteByID);
router.get('/verify', verifyEmail);


module.exports = router;
