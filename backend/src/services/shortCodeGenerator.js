const Url = require('../models/Url');

const generateRandomCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateUniqueCode = async () => {
  let isUnique = false;
  let code = '';
  let attempts = 0;
  
  while (!isUnique && attempts < 10) {
    code = generateRandomCode();
    const existing = await Url.findOne({
      $or: [{ shortCode: code }, { customAlias: code }]
    });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate a unique short code');
  }

  return code;
};

module.exports = {
  generateUniqueCode
};
