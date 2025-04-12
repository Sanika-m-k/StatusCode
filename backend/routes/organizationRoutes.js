const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { createOrganization } = require('../controllers/organizationController');

router.use(authenticate);
router.post('/create', createOrganization);


module.exports = router;