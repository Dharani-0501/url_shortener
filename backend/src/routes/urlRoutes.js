const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUrlShorten } = require('../middleware/validationMiddleware');

router.post('/shorten', authMiddleware, validateUrlShorten, urlController.shortenUrl);
router.get('/', authMiddleware, urlController.getUrls);
router.get('/server-ip', authMiddleware, urlController.getServerIp);
router.put('/:id', authMiddleware, urlController.editUrl);
router.delete('/:id', authMiddleware, urlController.deleteUrl);

module.exports = router;
