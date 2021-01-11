const Review = require('../models/reviews')
const Painting = require('../models/painting')


module.exports.newReview = async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body)
    const p = await Painting.findById(id)
    p.reviews.push(review)
    review.author = req.user;
    await p.save()
    await review.save()
    req.flash('success', 'successfully add review')
    res.redirect(`/painting/${id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Painting.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', 'successfully delete review')
    res.redirect(`/painting/${id}`)
}