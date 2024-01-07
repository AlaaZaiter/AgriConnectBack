const { format } = require('date-fns');
const connection = require('../config/db');

const getAll = async (_, res) => {
    const query = `
    SELECT * 
    FROM cartproducts cp
    JOIN cart c ON cp.Cartid = c.id
    JOIN product p ON cp.productId = p.id;
  `;
  
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All cartProducts retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all cartproducts.`,
      error: error.message,
    });
  }
};
const getProductsByCartId = async (req, res) => {
  const CartID = req.params.CartID;
  const query = `
  SELECT * 
  FROM cartproducts cp
  JOIN product p ON cp.productId = p.id
    where cp.Cartid	 = ?;
`;

try {
  const [response] = await connection.query(query,[CartID]);
  return res.status(200).json({
    success: true,
    message: `All orderProducst retrieved successfully.`,
    data: response,
  });
} catch (error) {
  return res.status(400).json({
    success: false,
    message: `Unable to retrieve all orderProducst.`,
    error: error.message,
  });
}
};



const addCartProducts = async (req, res) => {
  const { Cartid ,productId,	Quantity } = req.body;

  try {
    const result = await connection.query(
      'INSERT INTO `orderproducts` (Cartid ,productId,	Quantity) VALUES (?,?,?);',
      [Cartid ,productId,	Quantity]
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
  addCartProducts,
  getProductsByCartId,
};
