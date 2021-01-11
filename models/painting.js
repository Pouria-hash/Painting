const { string } = require('joi');
const mongoose = require('mongoose')
const Review = require('./reviews')
const { Schema } = mongoose;


const imageSchema = new Schema({
    url: String,
    filename: String
})

const paintingSchema = new Schema({
    title: String,
    image: String,
    images: [imageSchema],
    description: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})




paintingSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})



const Painting = mongoose.model('Painting', paintingSchema);
module.exports = Painting;