const { format } = require('date-fns');
const connection = require('../config/db');

const getAll = async (_, res) => {
  const query = `SELECT * FROM \`discussion\``;
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All discussions retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all discussions.`,
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  const ID = req.params.ID;
  const response = await getDiscussionByID(ID);
  if (!Array.isArray(response))
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve disussion with id ${ID}.`,
      data: response,
    });
  if (!response.length)
    return res.status(400).json({
      success: false,
      message: `discussion with id ${ID} not found.`,
    });
  return res.status(200).json({
    success: true,
    message: `discussion with id ${ID} retrieved successfully.`,
    data: {
      ...response[0],
    },
  });
};

const addDiscussion = async (req, res) => {
  const { Topic	,content,UserID	 } = req.body;

  try {
    const result = await connection.query(
      'INSERT INTO discussion (Topic,content,UserID) VALUES (?,?,?);',
      [Topic,content,UserID]
    );
    const DiscussionId = result[0].insertId;


    console.log(result);
    res.status(201).json({
      success: true,
      message: 'Data added successfully',
      DiscussionId:DiscussionId,
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

const updateByID = async (req, res) => {
  const { ID } = req.params;
  const { Topic	,content,UserID} = req.body;

  const query = `
    UPDATE \`discussion\`
    SET Topic = ?, content = ?, UserID = ?
    WHERE id = ?
  `;

  try {
    if (!UserID || !content || !Topic ) {
      return res.status(400).json({
        success: false,
        message: `Enter all fields to update discussion with id = ${ID}.`,
      });
    }

    const [response] = await connection.query(query, [
        Topic,
        content,
        UserID,
        ID,
    ]);

    if (response.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: `discussion with id = ${ID} not found.`,
      });
    }

    const data = await getDiscussionByID(ID);
    return res.status(200).json({
      success: true,
      message: `discussion updated successfully.`,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to update discussion with id ${ID}.`,
      error: error.message,
    });
  }
};

const deleteByID = async (req, res) => {
  const { ID } = req.params;
  const query = `DELETE FROM \`discussion\` WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `discussion with id = ${ID} not found.`,
      });
    return res.status(200).json({
      success: true,
      message: `discussion with id ${ID} deleted successfully.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to delete discussion with id ${ID}.`,
      error: error.message,
    });
  }
};

const getDiscussionByID = async (ID) => {
  const query = `SELECT * FROM \`discussion\` WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    return response;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getAll,
  getByID,
  addDiscussion,
  updateByID,
  deleteByID,
};
