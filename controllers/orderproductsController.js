const { format } = require('date-fns');
const connection = require('../config/db');

const getAll = async (_, res) => {
    const query = `
    SELECT * 
    FROM orderproducts op
    JOIN orders o ON op.Orderid = o.id
    JOIN product p ON op.ProductId = p.id;
  `;
  
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All orderProducts retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all orderproducts.`,
      error: error.message,
    });
  }
};
const getProductsByOrderId = async (req, res) => {
  const OrderID = req.params.OrderID;
  const query = `
  SELECT * 
    FROM orderproducts op
    JOIN product p ON op.ProductId = p.id
    where op.Orderid = ?;
`;

try {
  const [response] = await connection.query(query,[OrderID]);
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



const addOrderProducts = async (req, res) => {
  const { Orderid,	ProductId,	Quantity } = req.body;

  try {
    const result = await connection.query(
      'INSERT INTO `orderproducts` (Orderid	,ProductId,	Quantity) VALUES (?,?,?);',
      [Orderid,	ProductId,	Quantity]
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
  addOrderProducts,
  getProductsByOrderId,
};
