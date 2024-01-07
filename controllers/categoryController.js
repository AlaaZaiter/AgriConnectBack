const { format } = require('date-fns');
const connection = require('../config/db');

const getAll = async (_, res) => {
  const query = `SELECT * FROM category`;
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All Categories retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all Categories.`,
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  const ID = req.params.ID;
  const response = await getCategoryByID(ID);
  if (!Array.isArray(response))
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve Category with id ${ID}.`,
      data: response,
    });
  if (!response.length)
    return res.status(400).json({
      success: false,
      message: `Event with id ${ID} not found.`,
    });
  return res.status(200).json({
    success: true,
    message: `Category with id ${ID} retrieved successfully.`,
    data: {
      ...response[0],
    },
  });
};

const addCategory = async (req, res) => {
  const { Title } = req.body;
  const query = `INSERT INTO category (Title) VALUES (?)`;

  try {
    const [response] = await connection.query(query, [
        Title,
      
    ]);
    const data = await getCategoryByID(response.insertId);
    if (!Array.isArray(data)) throw new Error(`Unable to add a new Category.`);
    return res.status(200).json({
      success: true,
      message: `Category added successfully.`,
      data: { data},
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to add a new Category.`,
      error: error.message,
    });
  }
};

const updateByID = async (req, res) => {
  const { ID } = req.params;
  const { Title } = req.body;
  const query = `UPDATE category SET Title = ? WHERE id = ?`;
  console.log(req.body);
  try {
    if (!Title ) {
      return res.status(400).json({
        success: false,
        message: `Enter all fields to update category with id = ${ID}.`,
      });
    }

    const [response] = await connection.query(query, [
        Title,
     
      ID,
    ]);

    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `category with id = ${ID} not found.`,
      });

    const data = await getCategoryByID(ID);
    return res.status(200).json({
      success: true,
      message: `category updated successfully.`,
      data: { data },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to update event with id ${ID}.`,
      error: error.message,
    });
  }
};

const deleteByID = async (req, res) => {
  const { ID } = req.params;
  const query = `DELETE FROM category WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `Category with id = ${ID} not found.`,
      });
    return res.status(200).json({
      success: true,
      message: `Category with id ${ID} deleted successfully.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to delete category with id ${ID}.`,
      error: error.message,
    });
  }
};

const getCategoryByID = async (ID) => {
  const query = `SELECT * FROM category WHERE id = ?`;
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
  addCategory,
  updateByID,
  deleteByID,
};
