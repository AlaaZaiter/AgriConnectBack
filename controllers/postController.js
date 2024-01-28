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
  const query = `SELECT * FROM forumpost`;
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All forumpost retrieved successfully.`,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve all forumpost.`,
      error: error.message,
    });
  }
};



const getByID = async (req, res) => {
  const ID = req.params.ID;
  const response = await getPostByID(ID);
  if (!Array.isArray(response))
    return res.status(400).json({
      success: false,
      message: `Unable to retrieve forumpost with id ${ID}.`,
      data: response,
    });
  if (!response.length)
    return res.status(400).json({
      success: false,
      message: `forumpost with id ${ID} not found.`,
    });
  return res.status(200).json({
    success: true,
    message: `forumpost with id ${ID} retrieved successfully.`,
    data: {
      ...response[0],
    },
  });
};
const addPost = async (req, res) => {
  const {
    Content,	
    FarmerUserID,
  } = req.body;

  try {
    
    
    const image = await FileUpload(req.files.File[0]);
   
    console.log(image.downloadURL)
    const result = await connection.query(
      `INSERT INTO forumpost (Content,	
        FarmerUserID,
        File,created_at) VALUES (?,?,?,current_timestamp());`,
      [Content,	
        FarmerUserID,
         image.downloadURL]
    );

    console.log(result);
    res.status(201).json({
      success: true,
      message: 'Data added successfully',
    });
  } catch (error) {
    console.error('Error adding new forumpost:', error);
    res.status(400).json({
      success: false,
      message: 'Unable to add new data',
      error: error.message,
    });
  }
};

const updateByID = async (req, res) => {
  const { ID } = req.params;
  const { Content,	
	} = req.body;
  const File = await FileUpload(req.files.File[0]);

  const query = `
    UPDATE forumpost
    SET Content = ?,   File = ?
    WHERE id = ?
  `;

  try {
    if (!Content  || !File ) {
      return res.status(400).json({
        success: false,
        message: `Enter all fields to update forumpost with id = ${ID}.`,
      });
    }

    const [response] = await connection.query(query, [
        Content,	
      File.downloadURL,
      ID,
    ]);

    if (response.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: `forumpost with id = ${ID} not found.`,
      });
    }

    const data = await getPostByID(ID);
    return res.status(200).json({
      success: true,
      message: `forumpost updated successfully.`,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error while trying to update forumpost with id ${ID}.`,
      error: error.message,
    });
  }
};


const deleteByID = async (req, res) => {
  const { ID } = req.params;
  const query = `DELETE FROM forumpost WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `forumpost with id = ${ID} not found.`,
      });
    return res.status(200).json({
      success: true,
      message: `forumpost with id ${ID} deleted successfully.`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to delete forumpost with id ${ID}.`,
      error: error.message,
    });
  }
};

const getPostByID = async (ID) => {
  const query = `SELECT * FROM forumpost WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    return response;
  } catch (error) {
    return error.message;
  }
};
const getDiscussiontByID = async (ID) => {
  const query = `SELECT * FROM disucssion WHERE id = ?`;
  try {
    const [response] = await connection.query(query, [ID]);
    return response;
  } catch (error) {
    return error.message;
  }
};
const FileUpload = async (file) => {
    try {
      // Check if the file is an image or video
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only images (jpeg, png) and videos (mp4, webm) are allowed.');
      }
  
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
        message: 'File uploaded to Firebase Storage',
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
  addPost,
  updateByID,
  deleteByID,
};
