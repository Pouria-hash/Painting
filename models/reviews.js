const mongoose = require('mongoose')
const { Schema } = mongoose


const reviewSchema = new Schema({
    rate: Number,
    text: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Review = mongoose.model('Review', reviewSchema)


module.exports = Review