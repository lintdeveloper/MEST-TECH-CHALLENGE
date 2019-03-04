const express = require('express'),
      router = express.Router(),
      multipart = require('connect-multiparty'),
      multipartMiddleware = multipart(),
      cloudinary = require('cloudinary'),
      {ensureAuthenticated} = require('../config/auth');
      controller = require('../controllers/house.controllers')

/* Models */
const { House } = require('../models/house');

/* GET /houses */
router.get('/', controller.index);

/** GET /houses/new  */
router.get("/new", ensureAuthenticated, controller.new);

/** GET /houses/:id */
router.get('/:id', controller.id);

/** GET /houses/update */
router.get('/:id/update', ensureAuthenticated, controller.update);

/** Updates the route /houses/:id */
router.post('/update', ensureAuthenticated, controller.postUpdate);

/** GET /houses */

/** DELETE /houses/:id */
router.post('/delete', ensureAuthenticated, controller.delete);


/** POST /houses */
router.post('/', multipartMiddleware, ensureAuthenticated, controller.postHouse);


module.exports = router;
