const connection = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../extra/generateToken');

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
  const query = `SELECT * FROM users WHERE email = ?;`;
  try {
    const [response] = await connection.query(query, [email]);

    if (!response.length)
      return res.status(400).json({
        success: false,
        message: `User with email ${email} not found`,
      });

    const validPassword = await bcrypt.compare(password, response[0].password);
    if (!validPassword)
      return res.status(400).json({
        success: false,
        message: `Entered password of email ${email} is wrong`,
      });

    const token = generateToken(response[0].ID, response[0].role);

    res.status(200).json({
      success: true,
      message: `User with email ${email} logged in successfully`,
      token: token,
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
  const { FullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (FullName, email, password) VALUES (?, ?, ?);`;
  try {
    const [response] = await connection.query(query, [
        FullName,
      email,
      hashedPassword,
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

const updateByID = async (req, res) => {
  const { ID } = req.params;
  const { fullName, email } = req.body;
  const query = `UPDATE users SET FullName = ?, email = ? WHERE id = ?;`;

  try {
    const [response] = await connection.query(query, [fullName, email, ID]);
    if (!response.affectedRows)
      return res.status(400).json({
        success: false,
        message: `User with ID = ${ID} not found`,
      });
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
  const query = `SELECT id, FullName, email, role FROM users WHERE id = ?;`;
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

module.exports = {
  getAll,
  getByID,
  login,
  register,
  updateByID,
  switchToAdmin,
  deleteByID,
  addFarmer,
};
