module.exports = {
  secret: process.env.JWT_SECRET || 'supersecreturlshortenerjwttokenkey123!',
  options: {
    expiresIn: '7d'
  }
};
