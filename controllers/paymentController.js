const { format } = require('date-fns');
const connection = require('../config/db');
const SECRET_KEY='sk_test_51OZd1WJFhc9UZk7fOsGplE523D8vjjlEAqOzvZpOL2TcIMCbK3Mu8fAorQQxkTPbafzQMWXmHwa0zcDiUuZAcJxv00woUMJAeg';
const stripe = require('stripe')(SECRET_KEY);



const addPaymentRecord = async (orderID, amount, paymentStatus, paymentMethod, stripeToken) => {
  const query = `
    INSERT INTO payment (OrderID, Amount, PaymentStatus, PaymentMethod, StripeToken)
    VALUES (?, ?, ?, ?, ?);
  `;
  try {
    const [result] = await connection.query(query, [orderID, amount, paymentStatus, paymentMethod, stripeToken]);
    return result;
  } catch (error) {
    throw error;
  }
};


const processPayment = async (req, res) => {
  try {
    const { OrderID, amount, PaymentMethod, stripeToken } = req.body;

    // Create a charge using the received token
    const charge = await stripe.charges.create({
      amount: amount * 100, // Convert to cents if your amount is in dollars
      currency: 'usd',
      source: stripeToken, // Use the token here
      description: `Charge for order ${OrderID}`,
    });

    // Insert the payment record into the database
    await addPaymentRecord(OrderID, amount, 'succeeded', PaymentMethod, charge.id);

    res.status(200).json({ success: true, chargeId: charge.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
const getStatusByOrderId= async (req,res)=>{
  const {orderID}=req.params;
    const query ='select p.PaymentStatus from payment p join orders o on p.OrderID=o.id where p.OrderID =? '
    
  try {
    const [result] = await connection.query(query,orderID)
    return res.status(200).json({
      success: true,
      message: `status with id ${orderID} retrieved successfully.`,
      data: result[0],
      
    });  } catch (error) {
    throw error;
  }
}





module.exports = {
  
  getStatusByOrderId,
  processPayment,
};
