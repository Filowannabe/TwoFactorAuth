const express = require('express')

const SecurityController = require('./securityController')

const router = express.Router();

router.post('/security/verify', SecurityController.verify);
router.post('/security/validate', SecurityController.validate);
router.post('/security/register', SecurityController.register);
router.get('/', SecurityController.sayHi);

module.exports = router