if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const ExpressError = require('./utily/ExpressError')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
// const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const User = require('./models/user')



const paintingRouter = require('./router/paintingRouter')
const reviewRouter = require('./router/reviewRouter')
const userRouter = require('./router/userRouter')

const secret = process.env.SECRET
const googleID = process.env.GOOGLE_CLIENT_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET
const dbUse = process.env.DB_USE
// 'mongodb://localhost:27017/Canvas'
mongoose.connect(dbUse, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log('mongosoe connection open')
    })
    .catch((e) => {
        console.log('mongoose connection error', e)
    })

app.engine('ejs', engine)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(helmet({ contentSecurityPolicy: false }))


const store = new MongoStore({
    url: dbUse,
    secret: secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log('session store error', e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httponly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

// google sign in(broken)

// passport.use(new GoogleStrategy({
//     clientID: googleID,
//     clientSecret: googleSecret,
//     callbackURL: "/api/auth/google/redirect"
// },
//     async (accessToken, refreshToken, profile, done) => {
//         console.log(profile)
//         return done(null, profile)
//     }
// ));


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next()
})


app.use('/painting', paintingRouter)
app.use('/painting/:id/reviews', reviewRouter)
app.use('/', userRouter)



app.get('/', (req, res) => {
    res.render('home')
})


app.use('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { status = 505 } = err;
    if (!err.message) err.message = 'inavalid data'
    res.status(status).render('error', { err })
})

app.listen(5000, () => {
    console.log('serving in port 5000')
})