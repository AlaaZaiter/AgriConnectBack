const { format } = require('date-fns');
const connection = require('../config/db');

const {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
  } = require('firebase/storage');

  // Initialize Cloud Storage
const storage = getStorage();

const getAll = async (_, res) => {
  const query = `SELECT * FROM product`;
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All products retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all products.`,
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  const ID = req.params.ID;
  const response = await getProductByID(ID);
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
const addProduct = async (req, res) => {
  const {
    Title,
    stock,
    description,
    price,
    CategoryId,
    CreatedBy,
    discount,
  } = req.body;

  try {
    
    
    const image = await FileUpload(req.files.image[0]);
   
    console.log(image.downloadURL)
    const result = await connection.query(
      `INSERT INTO product (Title, stock, description, price, image, CategoryId	,CreatedBy	,
        discount	) VALUES (?,?,?,?,?,?,?,?);`,
      [Title,  stock, description, price, image.downloadURL, CategoryId,CreatedBy,discount,]
    );

    console.log(result);
    res.status(201).json({
      success: true,
      message: 'Data added successfully',
    });
  } catch (error) {
    console.error('Error adding new course:', error);
    res.status(400).json({
      success: false,
      message: 'Unable to add new data',
      error: error.message,
    });
  }
};

const updateByID = async (req, res) => {
  const { ID } = req.params;
  const { Title, stock, description, price, CategoryId ,CreatedBy,
    discount} = req.body;
  const ProductImage = await FileUpload(req.files.image[0]);

  const query = `
    UPDATE product
    SET Title = ?, stock = ?, description = ?, price = ?, image = ?, CategoryId = ?,CreatedBy = ?,
    discount = ?
    WHERE id = ?
  `;

  try {
    if (!Title ||!CreatedBy || !discount || !stock || !description || !price || !ProductImage || !CategoryId) {
      return res.status(400).json({
        success: false,
        message: `Enter all fields to update product with id = ${ID}.`,
      });
    }

    const [response] = await connection.query(query, [
      Title,
      stock,
      description,
      price,
      ProductImage.downloadURL,
      CategoryId,
      CreatedBy,
    discount,
      ID,
    ]);

    if (response.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: `Product with id = ${ID} not found.`,
      });
    }

    const data = await getProductByID(ID); // Assuming getProductByID is a valid function
    return res.status(200).json({
      success: true,
      message: `Product updated successfully.`,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to update product with id ${ID}.`,
      error: error.message,
    });
  }
};


const deleteByID = async (req, res) => {
  const { ID } = req.params;
  const query = `DELETE FROM product WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `product with id = ${ID} not found.`,
      });
    return res.status(200).json({
      success: true,
      message: `product with id ${ID} deleted successfully.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to delete product with id ${ID}.`,
      error: error.message,
    });
  }
};

const getProductByID = async (ID) => {
  const query = `SELECT * FROM product WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    return response;
  } catch (error) {
    return error.message;
  }
};
const FileUpload = async (file) => {
    try {
      const dateTime = giveCurrentDateTime();
      const storageRef = ref(
        storage,
        `files/${file.originalname + ' ' + dateTime}`
      );
      const metadata = {
        contentType: file.mimetype,
      };
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File successfully uploaded.');
      return {
        message: 'file uploaded to firebase storage',
        name: file.originalname,
        type: file.mimetype,
        downloadURL: downloadURL,
      };
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error.message);
      console.error('Error details:', error.serverResponse); // Log server response
      throw error; // Rethrow the error to handle it in the calling function
    }
  };
  
  
    const giveCurrentDateTime = () => {
        const today = new Date();
        const date =
          today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time =
          today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        const dateTime = date + ' ' + time;
        return dateTime;
      };
module.exports = {
  getAll,
  getByID,
  addProduct,
  updateByID,
  deleteByID,
};
