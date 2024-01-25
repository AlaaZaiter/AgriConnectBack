const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { generateToken } = require('../extra/generateToken');
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
  const query = `SELECT id, FullName, email, phoneNumber ,role FROM users;`;
  try {
    const [response] = await connection.query(query);
    return res.status(200).json({
      success: true,
      message: `All users retrieved successfully `,
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to get all users`,
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  //   const ID = req.params.ID;
  const { ID } = req.params;
  try {
    const response = await getUserByID(ID);
    return res.status(200).json({
      success: true,
      message: `User of id = ${ID} data retrieved successfully `,
      data: response[0],
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to get user by id = ${ID}`,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? and isEmailVerified = true;`;
  try {
    const [response] = await connection.query(query, [email]);

    if (!response.length)
      return res.status(400).json({
        success: false,
        message: `User with email ${email} not found or verified`,
      });

    const validPassword = await bcrypt.compare(password, response[0].password);
    if (!validPassword)
      return res.status(400).json({
        success: false,
        message: `Entered password of email ${email} is wrong`,
      });

    const token = generateToken(response[0].id, response[0].role);

    res.status(200).json({
      success: true,
      message: `User with email ${email} logged in successfully`,
      token: token,
      data:response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to login for user with email ${email}`,
      error: error.message,
    });
  }
};

const register = async (req, res) => {
  const { FullName, email, password, phoneNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const ProductImage = await FileUpload(req.files.image[0]);

  // Generate a verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Insert user data along with the verification token into the database
  const query = `INSERT INTO users (FullName, email, phoneNumber, password, verificationToken,image) VALUES (?,?, ?, ?, ?, ?);`;
  try {
    const [response] = await connection.query(query, [
      FullName,
      email,
      phoneNumber,
      hashedPassword,
      verificationToken,
      ProductImage.downloadURL,
    ]);

    const [data] = await getUserByID(response.insertId);
    const token = generateToken(data.id, data.role);

    // Send verification email
    const verificationUrl = `${process.env.VERIFICATION_EMAIL_BASE_URL}?token=${verificationToken}&userToken=${token}`;
    const emailText = `Please verify your email by clicking on the link: ${verificationUrl}`;
    await sendEmail(email, "Email Verification", emailText);

    res.status(200).json({
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
       data: response ,
       token: token,

    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to register a new user`,
      error: error.message,
    });
  }
};

const updateByID = async (req, res) => {
  const { ID } = req.params;
  const updatedFields = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update provided',
    });
  }

  const setClause = Object.keys(updatedFields)
    .map(field => `${field} = ?`)
    .join(', ');

  const values = Object.values(updatedFields);
  values.push(ID);

  const query = `UPDATE users SET ${setClause} WHERE id = ?;`;

  try {
    const [response] = await connection.query(query, values);

    if (!response.affectedRows) {
      return res.status(400).json({
        success: false,
        message: `User with ID = ${ID} not found`,
      });
    }

    const data = await getUserByID(ID);

    res.status(200).json({
      success: true,
      message: `User with ID = ${ID} updated successfully`,
      data: data[0],
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to update user with ID = ${ID}`,
      error: error.message,
    });
  }
};
const updateWithImageByID = async (req, res) => {
  const { ID } = req.params;
  const {FullName,PhoneNumber} = req.body;
  const ProductImage = await FileUpload(req.files.image[0]);

 

  

  const query = `UPDATE users SET Title = ?, stock = ?, description = ? WHERE id = ?;`;

  try {
    const [response] = await connection.query(query, [
      FullName,PhoneNumber,ProductImage.downloadURL
    ]);

    if (!response.affectedRows) {
      return res.status(400).json({
        success: false,
        message: `User with ID = ${ID} not found`,
      });
    }

    const data = await getUserByID(ID);

    res.status(200).json({
      success: true,
      message: `User with ID = ${ID} updated successfully`,
      data: data[0],
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to update user with ID = ${ID}`,
      error: error.message,
    });
  }
};

const switchToAdmin = async (req, res) => {
  const { ID } = req.params;
  const query = `UPDATE users SET role = 'admin' WHERE id = ?;`;

  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `User with ID = ${ID} not found`,
      });
    const data = await getUserByID(ID);
    res.status(200).json({
      success: true,
      message: `User with ID = ${ID} switched to admin successfully`,
      data: data[0],
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to switch to admin for user with ID = ${ID}`,
      error: error.message,
    });
  }
};

const deleteByID = async (req, res) => {
  const { ID } = req.params;
  const query = `DELETE FROM users WHERE id = ?;`;
  try {
    const [response] = await connection.query(query, [ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `User with ID = ${ID} not found`,
      });
    return res.status(200).json({
      success: true,
      message: `User with ID = ${ID} deleted successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Unable to delete user with ID = ${ID}`,
      error: error.message,
    });
  }
};

const getUserByID = async (ID) => {
  const query = `SELECT id, FullName, email, role,created_at,image	 FROM users WHERE id = ?;`;
  try {
    const [response] = await connection.query(query, [ID]);
    return response;
  } catch (error) {
    return error;
  }
};
const addFarmer = async (req, res) => {
    const { fullName, email, password,role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (FullName, email, password ,role) VALUES (?,?, ?, ?);`;
    try {
      const [response] = await connection.query(query, [
        fullName,
        email,
        hashedPassword,
        role
      ]);
      const [data] = await getUserByID(response.insertId);
      // const token = generateToken(data.ID, data.role);
      res.status(200).json({
        success: true,
        message: `User registered successfully`,
        // data: { ...data, token: token },
        data: data,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Unable to register a new user`,
        error: error.message,
      });
    }
  };
  const verifyEmail = async (req, res) => {
    const { token } = req.body;
  
    const query = `UPDATE users SET isEmailVerified = true WHERE verificationToken = ?;`;
    try {
      const [response] = await connection.query(query, [token]);
  
      if (response.affectedRows === 0) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
  
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error verifying email" });
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
  login,
  register,
  updateByID,
  switchToAdmin,
  deleteByID,
  addFarmer,
  verifyEmail,
  updateWithImageByID
};
