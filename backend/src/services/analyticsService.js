const Visit = require('../models/Visit');

const logVisit = async (urlId, req) => {
  try {
    const visit = new Visit({
      urlId
    });
    await visit.save();
  } catch (err) {
    console.error('Failed to log analytics visit:', err.message);
  }
};

module.exports = {
  logVisit
};
