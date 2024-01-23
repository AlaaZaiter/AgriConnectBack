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
  const { Title ,AdminId} = req.body;
  const image = await FileUpload(req.files.image[0]);

  const query = `INSERT INTO category (Title,image,AdminId) VALUES (?,?,?)`;

  try {
    const [response] = await connection.query(query, [
        Title,image.downloadURL,AdminId
      
    ]);
    return res.status(200).json({
      success: true,
      message: `Category added successfully.`,
      data: { response},
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
  const { Title,AdminId } = req.body;
  const image = await FileUpload(req.files.image[0]);

  const query = `UPDATE category SET Title = ?, image = ?, AdminId = ? WHERE id = ?`;
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
        image.downloadURL,
        AdminId,
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
  addCategory,
  updateByID,
  deleteByID,
};
