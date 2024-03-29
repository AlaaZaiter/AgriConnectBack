require('dotenv').config();
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./config/firebase');
const emailValidator = require('deep-email-validator');
const translate=require('translate-google')


// Initialize firebase app
initializeApp(firebaseConfig);

const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
require('./config/db');
app.use(bodyParser.json());
app.use(cors());

const userRoute = require ('./routes/userRoute')
const categoryRoute = require('./routes/CategoryRoute')
const productRoute = require('./routes/productRoute')
const orderRoute= require('./routes/orderRoute')
const cartRoute = require('./routes/cartRoute')
const postRoute = require('./routes/postRoute')
const discussionRoute = require('./routes/discussionRoute')
const paymentRoute = require('./routes/paymentRoute')
const postdiscussions=require('./routes/postdiscussionsRoute')
const orderProducst = require('./routes/orderproductsRoute')
const cartproducts = require('./routes/cartproductsRoute')
app.use('/user',userRoute);
app.use('/category',categoryRoute)
app.use('/product',productRoute)
app.use('/order',orderRoute)
app.use('/cart',cartRoute)
app.use('/post',postRoute)
app.use('/discussion',discussionRoute)
app.use('/payment',paymentRoute)
app.use('/postdiscussions',postdiscussions)
app.use('/orderProducst',orderProducst)
app.use('/cartproducts',cartproducts)
app.post('/translate',async(req,res)=>{
  const{msg,to}=req.body;
 const translation= await translate(msg,{ from:'auto',to:to})
 res.status(200).json({translation})
})
async function isEmailValid(email) {
  return emailValidator.validate(email)
}

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });