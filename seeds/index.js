const mongoose = require('mongoose')
const Painting = require('../models/painting')

mongoose.connect('mongodb://localhost:27017/Canvas', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log('mongosoe connection open')
    })
    .catch((e) => {
        console.log('mongoose connection error', e)
    })





const seeds = async () => {
    await Painting.deleteMany({})

    return Painting.insertMany([
        {
            title: 'Cows and the River',
            image: 'https://images.unsplash.com/photo-1586537049236-b212dc756931?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=620&q=80',
            description: 'Aliquam ligula orci, consequat a dignissim in, pulvinar id nibh. Nam orci ante, vestibulum faucibus gravida ac, egestas non mi. Cras commodo lectus ac eros porta, ut egestas lorem ultricies. Integer vitae cursus ipsum, vitae condimentum risus. Phasellus dui nisi, maximus ac urna et, accumsan luctus quam. Duis lectus magna, mattis sed finibus eget, lacinia id justo. Praesent eu lobortis urna. Fusce egestas scelerisque dapibus. Integer consequat dui eget nibh dignissim, tristique mollis erat scelerisque. Aenean posuere urna dictum efficitur placerat'
            , author: '5ff808e6c0b8ce0c2c4b45e9'
        },
        {
            title: 'Winter Children',
            image: 'https://images.unsplash.com/photo-1586536672467-686dd4fabacb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=604&q=80',

            description: 'So how did the classical Latin become so incoherent? According to McClintock, a 15th century typesetter likely scrambled part of Ciceros De Finibus in order to provide placeholder text to mockup various fonts for a type specimen book.'
            , author: '5ff808e6c0b8ce0c2c4b45e9'
        }])
}
seeds()
    .then((e) => {
        console.log(e)
    })