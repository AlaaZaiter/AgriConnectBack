const { format } = require('date-fns');
const connection = require('../config/db');

const getAll = async (_, res) => {
    const query = `
    SELECT * 
    FROM postdiscussions ps
    JOIN forumpost p ON ps.PostId = p.id
    JOIN disucssion d ON ps.DiscussionID = d.id;
  `;
  
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All postdiscussions retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all postdiscussions.`,
      error: error.message,
    });
  }
};
const getDiscussionsByPostId = async (req, res) => {
  const PostID = req.params.PostID;
  const query = `
  SELECT * 
  FROM postdiscussions ps
  JOIN disucssion d ON ps.DiscussionID = d.id
  where ps.PostId = ?;
`;

try {
  const [response] = await connection.query(query,[PostID]);
  return res.status(200).json({
    success: true,
    message: `All postdiscussions retrieved successfully.`,
    data: response,
  });
} catch (error) {
  return res.status(400).json({
    success: false,
    message: `Unable to retrieve all postdiscussions.`,
    error: error.message,
  });
}
};

const getPostsByDiscussionId = async (req, res) => {
  const DisID = req.params.DisID;
  const query = `
  SELECT * 
  FROM postdiscussions ps
  JOIN forumpost p ON ps.PostId = p.id
  where ps.DiscussionID = ?;
`;

try {
  const [response] = await connection.query(query,[DisID]);
  return res.status(200).json({
    success: true,
    message: `All postdiscussions retrieved successfully.`,
    data: response,
  });
} catch (error) {
  return res.status(400).json({
    success: false,
    message: `Unable to retrieve all postdiscussions.`,
    error: error.message,
  });
}
};

const addPostDiscussions = async (req, res) => {
  const { PostId ,	DiscussionID } = req.body;

  try {
    const result = await connection.query(
      'INSERT INTO `postdiscussions` (PostId,	DiscussionID) VALUES (?,?);',
      [PostId ,	DiscussionID]
    );

    console.log(result);
    res.status(201).json({
      success: true,
      message: 'Data added successfully',
    });
  } catch (error) {
    console.error('Error adding new order:', error);
    res.status(400).json({
      success: false,
      message: 'Unable to add new data',
      error: error.message,
    });
  }
};






module.exports = {
  getAll,
  addPostDiscussions,
  getDiscussionsByPostId,
  getPostsByDiscussionId,
};
