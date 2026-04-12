const mongoose = require('mongoose');

const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database is not connected. Please check your backend configuration and .env file.' 
    });
  }
  next();
};

module.exports = { checkDbConnection };
