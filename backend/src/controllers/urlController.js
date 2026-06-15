const Url = require('../models/Url');
const Visit = require('../models/Visit');
const { generateUniqueCode } = require('../services/shortCodeGenerator');
const { logVisit } = require('../services/analyticsService');

exports.shortenUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  let shortCode = '';
  if (customAlias) {
    try {
      const existingAlias = await Url.findOne({
        $or: [{ shortCode: customAlias }, { customAlias }]
      });
      if (existingAlias) {
        return res.status(400).json({ msg: 'This custom alias or short code is already taken' });
      }
      shortCode = customAlias;
    } catch (err) {
      return res.status(500).send('Server error checking custom alias');
    }
  } else {
    try {
      shortCode = await generateUniqueCode();
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  const expirationDate = expiresAt ? new Date(expiresAt) : null;

  try {
    const newUrl = new Url({
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      userId: req.user.id,
      expiresAt: expirationDate
    });

    const savedUrl = await newUrl.save();
    res.json(savedUrl);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error saving short URL');
  }
};

exports.getUrls = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error retrieving URLs');
  }
};

exports.editUrl = async (req, res) => {
  const { originalUrl } = req.body;

  try {
    let url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    if (url.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to edit this URL' });
    }

    url.originalUrl = originalUrl;
    await url.save();

    res.json(url);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error updating URL');
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    if (url.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Url.findByIdAndDelete(req.params.id);
    await Visit.deleteMany({ urlId: req.params.id });

    res.json({ msg: 'URL and its analytics deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error deleting URL');
  }
};

exports.redirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }]
    });

    if (!url) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Not Found</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding: 50px; }
            .container { max-width: 500px; margin: 0 auto; background: rgba(30, 41, 59, 0.7); padding: 40px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px); }
            h1 { color: #f43f5e; margin-bottom: 20px; }
            p { color: #94a3b8; font-size: 16px; line-height: 1.6; }
            a { display: inline-block; margin-top: 25px; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.2s; }
            a:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404 - Link Not Found</h1>
            <p>The shortened link you are trying to access does not exist, has been deleted, or the alias is incorrect.</p>
            <a href="/">Go to Homepage</a>
          </div>
        </body>
        </html>
      `);
    }

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Expired</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding: 50px; }
            .container { max-width: 500px; margin: 0 auto; background: rgba(30, 41, 59, 0.7); padding: 40px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px); }
            h1 { color: #fbbf24; margin-bottom: 20px; }
            p { color: #94a3b8; font-size: 16px; line-height: 1.6; }
            a { display: inline-block; margin-top: 25px; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.2s; }
            a:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>410 - Link Expired</h1>
            <p>This shortened link reached its expiration date and is no longer active.</p>
            <a href="/">Go to Homepage</a>
          </div>
        </body>
        </html>
      `);
    }

    url.clicks += 1;
    await url.save();

    logVisit(url._id, req);

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during redirection');
  }
};

const os = require('os');
exports.getServerIp = (req, res) => {
  try {
    const interfaces = os.networkInterfaces();
    let ipAddress = '127.0.0.1';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          ipAddress = iface.address;
          break;
        }
      }
      if (ipAddress !== '127.0.0.1') {
        break;
      }
    }
    res.json({ serverIp: ipAddress });
  } catch (err) {
    console.error('Error fetching server IP:', err);
    res.status(500).json({ msg: 'Server error retrieving IP' });
  }
};
