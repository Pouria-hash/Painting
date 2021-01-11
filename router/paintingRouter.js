const express = require('express');
const router = express.Router();
const wrapAsync = require('../utily/wrapAsync');
const { isLoggedIn, validatePainting, isAuthor } = require('../utily/middleware')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
const painting = require('../control/paintingControl')



router.get('/', wrapAsync(painting.indexPage))

router.get('/new', isLoggedIn, painting.newPaintingForm)

router.post('/', isLoggedIn, upload.array('Image'), validatePainting, wrapAsync(painting.createNewPainting))

router.get('/:id', wrapAsync(painting.showPainting))

router.get('/:id/edit', isAuthor, isLoggedIn, wrapAsync(painting.editPaintingForm))

router.patch('/:id', isAuthor, isLoggedIn, upload.array('images'), validatePainting, wrapAsync(painting.editPainting))


router.delete('/:id', isAuthor, isLoggedIn, wrapAsync(painting.deletePainting))

module.exports = router;