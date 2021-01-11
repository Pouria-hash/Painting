const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utily/wrapAsync')
const { validateReview, reviewAuthor } = require('../utily/middleware')
const review = require('../control/reviewControl')


router.post('/', validateReview, wrapAsync(review.newReview))

router.delete('/:reviewId', reviewAuthor, wrapAsync(review.deleteReview))


module.exports = router;