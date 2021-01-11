const session = require('express-session')
const ExpressError = require('./ExpressError')
const { paintingSchema, reviewSchema } = require('./validSchema')
const Painting = require('../models/painting')
const Review = require('../models/reviews')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must loggedin')
        return res.redirect('/login')
    }
    next()
}


module.exports.validatePainting = (req, res, next) => {
    const { error } = paintingSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 500)
    } next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const p = await Painting.findById(id)
    if (!p.author.equals(req.user._id)) {
        req.flash('error', 'You have not permision')
        res.redirect(`/painting/${id}`)
    } next()
}

module.exports.reviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You have not permision')
        res.redirect(`/painting/${id}`)
    } next()
}
