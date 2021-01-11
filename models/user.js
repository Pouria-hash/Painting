const mongoose = require('mongoose')
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchame = new Schema({
    email: {
        type: String,

    }
})

userSchame.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchame)


module.exports = User