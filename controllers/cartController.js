const { format } = require('date-fns');
const connection = require('../config/db');

const getAll = async (_, res) => {
  const query = `SELECT * FROM \`cart\``;
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All carts retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all carts.`,
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  const ID = req.params.ID;
  const response = await getCartByID(ID);
  if (!Array.isArray(response))
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve cart with id ${ID}.`,
      data: response,
    });
  if (!response.length)
    return res.status(400).json({
      success: false,
      message: `cart with id ${ID} not found.`,
    });
  return res.status(200).json({
    success: true,
    message: `cart with id ${ID} retrieved successfully.`,
    data: {
      ...response[0],
    },
  });
};

const addCart = async (req, res) => {
  const { customerId } = req.body;

  try {
    const result = await connection.query(
      'INSERT INTO `cart` (customerId) VALUES (?);',
      [customerId]
    );

    console.log(result);

    // Assuming 'insertId' holds the ID of the newly added cart
    const newCartId = result.insertId;

    res.status(201).json({
      success: true,
      message: 'Data added successfully',
      cartId: newCartId, // Send the new cart ID in the response
    });
  } catch (error) {
    console.error('Error adding new cart:', error);
    res.status(400).json({
      success: false,
      message: 'Unable to add new data',
      error: error.message,
    });
  }
};


const updateByID = async (req, res) => {
  const { ID } = req.params;
  const { customerId } = req.body;

  const query = `
    UPDATE \`cart\`
    SET customerId = ?
    WHERE id = ?
  `;

  try {
    if (!customerId  ) {
      return res.status(400).json({
        success: false,
        message: `Enter all fields to update order with id = ${ID}.`,
      });
    }

    const [response] = await connection.query(query, [
        customerId,
    		
        ID,
    ]);

    if (response.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: `cart with id = ${ID} not found.`,
      });
    }

    const data = await getCartByID(ID);
    return res.status(200).json({
      success: true,
      message: `cart updated successfully.`,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to update cart with id ${ID}.`,
      error: error.message,
    });
  }
};

const deleteByID = async (req, res) => {
  const { ID } = req.params;
  const query = `DELETE FROM \`cart\` WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `cart with id = ${ID} not found.`,
      });
    return res.status(200).json({
      success: true,
      message: `cart with id ${ID} deleted successfully.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to delete cart with id ${ID}.`,
      error: error.message,
    });
  }
};

const getCartByID = async (ID) => {
  const query = `SELECT * FROM \`cart\` WHERE id = ?`;
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
  addCart,
  updateByID,
  deleteByID,
};
