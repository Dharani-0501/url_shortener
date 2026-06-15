const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.options);
};

module.exports = generateToken;
