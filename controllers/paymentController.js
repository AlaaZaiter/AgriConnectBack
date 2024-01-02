const { format } = require('date-fns');
const connection = require('../config/db');

const getAll = async (_, res) => {
  const query = `SELECT * FROM \`payment\``;
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All payment retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all payment.`,
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  const ID = req.params.ID;
  const response = await getPaymentByID(ID);
  if (!Array.isArray(response))
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve payment with id ${ID}.`,
      data: response,
    });
  if (!response.length)
    return res.status(400).json({
      success: false,
      message: `payment with id ${ID} not found.`,
    });
  return res.status(200).json({
    success: true,
    message: `payment with id ${ID} retrieved successfully.`,
    data: {
      ...response[0],
    },
  });
};

const addPayment = async (req, res) => {
  const {OrderID,Amount,PaymentStatus,TransactionID } = req.body;

  try {
    const result = await connection.query(
      'INSERT INTO `payment` (OrderID,Amount,PaymentStatus,TransactionID) VALUES (?,?,?,?);',
      [OrderID,Amount,PaymentStatus,TransactionID]
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

const updateByID = async (req, res) => {
  const { ID } = req.params;
  const { OrderID,Amount,PaymentStatus,TransactionID } = req.body;

  const query = `
    UPDATE \`payment\`
    SET OrderID = ?, Amount = ?, PaymentStatus = ?, TransactionID = ?
    WHERE id = ?
  `;

  try {
    if (!OrderID || !Amount || !PaymentStatus || !TransactionID ) {
      return res.status(400).json({
        success: false,
        message: `Enter all fields to update payment with id = ${ID}.`,
      });
    }

    const [response] = await connection.query(query, [
        OrderID,
        Amount,
        PaymentStatus,
        TransactionID,
        ID,
    ]);

    if (response.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: `Payment with id = ${ID} not found.`,
      });
    }

    const data = await getPaymentByID(ID);
    return res.status(200).json({
      success: true,
      message: `payment updated successfully.`,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to update Payment with id ${ID}.`,
      error: error.message,
    });
  }
};

const deleteByID = async (req, res) => {
  const { ID } = req.params;
  const query = `DELETE FROM \`payment\` WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `payment with id = ${ID} not found.`,
      });
    return res.status(200).json({
      success: true,
      message: `payment with id ${ID} deleted successfully.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to delete payment with id ${ID}.`,
      error: error.message,
    });
  }
};

const getPaymentByID = async (ID) => {
  const query = `SELECT * FROM \`payment\` WHERE id = ?`;
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
  addPayment,
  updateByID,
  deleteByID,
};
