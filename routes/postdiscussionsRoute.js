const express = require('express');
const router = express.Router();


const {
  getAll,
  addPostDiscussions,
  getDiscussionsByPostId,
  getPostsByDiscussionId,
} = require('../controllers/postdiscussionsController');

router.get('/getAll', getAll);
router.get('/getByDisID/:PostID', getDiscussionsByPostId);
router.get('/getByPostID/:DisID', getPostsByDiscussionId);
router.post('/add', addPostDiscussions);


module.exports = router;
