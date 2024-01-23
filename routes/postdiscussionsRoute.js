const express = require('express');
const router = express.Router();


const {
  getAll,
  addPostDiscussions,
  getDiscussionsByPostId,
  getPostsByDiscussionId,
  getMostPopularPosts,
} = require('../controllers/postdiscussionsController');

router.get('/getAll', getAll);
router.get('/getMost', getMostPopularPosts);
router.get('/getByPostID/:PostID', getDiscussionsByPostId);
router.get('/getByDisID/:DisID', getPostsByDiscussionId);
router.post('/add', addPostDiscussions);


module.exports = router;
