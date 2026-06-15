const validateUrl = (urlStr) => {
  try {
    const newUrl = new URL(urlStr);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

module.exports = validateUrl;
