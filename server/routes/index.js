let express = require('express');
let router = express.Router();
let indexController = require("../controllers/index.js")

// Display home page
router.get('/', indexController.displayHP);

// Display error pages
router.get('*', indexController.displayErr);

// Display (get) authentication login page
router.get('/login', indexController.displayLoginPage);
// Post login page
router.post('/login', indexController.processLoginPage);

// Display (get) authentication register page
router.get('/register', indexController.displayRegisterPage);
// Post authentication register page
router.post('/register', indexController.processRegisterPage);

// Display (get) authentication logout page
router.get('/logout', indexController.displayLogoutPage);

module.exports = router;
