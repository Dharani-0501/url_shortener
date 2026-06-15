const validateUrl = require('../utils/validateUrl');

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  if (username.length < 3) {
    return res.status(400).json({ msg: 'Username must be at least 3 characters' });
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: 'Please provide a valid email address' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  next();
};

const validateUrlShorten = (req, res, next) => {
  const { originalUrl, customAlias, expiresAt } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ msg: 'Original URL is required' });
  }
  if (!validateUrl(originalUrl)) {
    return res.status(400).json({ msg: 'Please provide a valid HTTP or HTTPS URL' });
  }
  if (customAlias) {
    const aliasRegex = /^[a-zA-Z0-9_-]+$/;
    if (!aliasRegex.test(customAlias)) {
      return res.status(400).json({ msg: 'Custom alias must be alphanumeric, underscores, or hyphens only' });
    }
    if (customAlias.length < 3 || customAlias.length > 30) {
      return res.status(400).json({ msg: 'Custom alias must be between 3 and 30 characters' });
    }
  }
  if (expiresAt) {
    const expirationDate = new Date(expiresAt);
    if (isNaN(expirationDate.getTime())) {
      return res.status(400).json({ msg: 'Invalid expiration date format' });
    }
    if (expirationDate <= new Date()) {
      return res.status(400).json({ msg: 'Expiration date must be in the future' });
    }
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUrlShorten
};
