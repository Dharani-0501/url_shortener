const Url = require('../models/Url');
const Visit = require('../models/Visit');

exports.getAnalytics = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    if (url.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const visits = await Visit.find({ urlId: url.id }).sort({ timestamp: -1 });

    const totalClicks = visits.length;
    const lastVisited = visits.length > 0 ? visits[0].timestamp : null;

    const recentVisits = visits.slice(0, 50).map(visit => ({
      id: visit._id,
      timestamp: visit.timestamp
    }));

    res.json({
      url,
      totalClicks,
      lastVisited,
      recentVisits
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching analytics');
  }
};
