let express = require('express');
let router = express.Router();
let assignController = require("../controllers/assignment.js")

// User authentication
function requireAuth(req, res, next) {
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}

/*Read*/
router.get('/', assignController.displayList); /* Display assignment list*

/*Create*/
router.get('/add/', requireAuth, assignController.displayCreate); /* Display assignment add page*/
router.post('/add', requireAuth, assignController.runCreate); /* Post form data and reflect changes */

/*Update*/
router.get('/edit/:id', requireAuth, assignController.displayUpdate); /* Display assignment update page*/
router.post('/edit/:id', requireAuth, assignController.runUpdate); /* Post form data and reflect changes */

/*Delete*/
router.get('/delete/:id', requireAuth, assignController.runDelete); /* Delete item */

/*Show*/
router.get('/show/:id', assignController.displayShow); /* Show requested item in full detail */
router.post('/show/:id', requireAuth, assignController.runShow); /* Post form data and reflect changes */

module.exports = router;
