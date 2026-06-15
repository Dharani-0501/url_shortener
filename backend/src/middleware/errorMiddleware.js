module.exports = function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong on the server' });
};
