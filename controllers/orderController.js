const { format } = require('date-fns');
const connection = require('../config/db');

const getAll = async (_, res) => {
  const query = `SELECT * FROM \`orders\``;
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All orders retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all orders.`,
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  const ID = req.params.ID;
  const response = await getOrderByID(ID);
  if (!Array.isArray(response))
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve order with id ${ID}.`,
      data: response,
    });
  if (!response.length)
    return res.status(400).json({
      success: false,
      message: `Order with id ${ID} not found.`,
    });
  return res.status(200).json({
    success: true,
    message: `Order with id ${ID} retrieved successfully.`,
    data: {
      ...response[0],
    },
  });
};

const addOrder = async (req, res) => {
  const { UserID,  TotalAmount, orderStatus } = req.body;

  try {
    const response = await connection.query(
      'INSERT INTO `orders` (UserID,  TotalAmount, orderStatus) VALUES (?,?,?);',
      [UserID,  TotalAmount, orderStatus]
    );
const orderId = response[0].insertId;
    res.status(201).json({
      success: true,
      message: 'Data added successfully',
      orderId:orderId,
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

const updateStatus = async (req, res) => {
  const { ID } = req.params;
  const {  orderStatus } = req.body;

  const query = `
    UPDATE \`orders\`
    SET  orderStatus = ?
    WHERE id = ?
  `;

  try {
    if ( !orderStatus) {
      return res.status(400).json({
        success: false,
        message: `Enter all fields to update order with id = ${ID}.`,
      });
    }

    const [response] = await connection.query(query, [
      
      orderStatus,
      ID,
    ]);

    if (response.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: `Order with id = ${ID} not found.`,
      });
    }

    const data = await getOrderByID(ID);
    return res.status(200).json({
      success: true,
      message: `Order updated successfully.`,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to update order with id ${ID}.`,
      error: error.message,
    });
  }
};

const updateByID = async (req, res) => {
  const { ID } = req.params;
  const { UserID,  TotalAmount, orderStatus } = req.body;

  const query = `
    UPDATE \`orders\`
    SET UserID = ?,  TotalAmount = ?, orderStatus = ?
    WHERE id = ?
  `;

  try {
    if (!UserID  || !TotalAmount || !orderStatus) {
      return res.status(400).json({
        success: false,
        message: `Enter all fields to update order with id = ${ID}.`,
      });
    }

    const [response] = await connection.query(query, [
      UserID,
      
      TotalAmount,
      orderStatus,
      ID,
    ]);

    if (response.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: `Order with id = ${ID} not found.`,
      });
    }

    const data = await getOrderByID(ID);
    return res.status(200).json({
      success: true,
      message: `Order updated successfully.`,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to update order with id ${ID}.`,
      error: error.message,
    });
  }
};




const deleteByID = async (req, res) => {
  const { ID } = req.params;
  const query = `DELETE FROM \`orders\` WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `Order with id = ${ID} not found.`,
      });
    return res.status(200).json({
      success: true,
      message: `Order with id ${ID} deleted successfully.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to delete order with id ${ID}.`,
      error: error.message,
    });
  }
};

const getOrderByID = async (ID) => {
  const query = `SELECT * FROM \`orders\` WHERE id = ?`;
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
  addOrder,
  updateByID,
  deleteByID,
  updateStatus,
};
