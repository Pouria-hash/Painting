const express = require('express');
const router = express.Router();
const wrapAsync = require('../utily/wrapAsync')
const User = require('../models/user');
const passport = require('passport');




// router.get('/fakeuser', async (req, res) => {
//     const user = new User({ username: 'pouria', email: 'pooria@gmail.com' })
//     const newUser = await User.register(user, 'monkey')
//     console.log(newUser)
//     res.send('ok')
// })

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const u = new User({ username, email })
    const registerUser = await User.register(u, password)
    req.logIn(registerUser, err => {
        if (err) return next(err)
    })
    req.flash('success', 'Wellcome')
    res.redirect('/painting')
}))

router.get('/login', (req, res) => {
    res.render('user/login')
})

// google sign in (broken)

// router.get("/auth/google", passport.authenticate("google", {
//     scope: ["profile", "email"]
// }));

// router.get("/api/auth/google/redirect", passport.authenticate('google', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//     req.flash('success', 'Wellcom Back')
//     res.redirect('/painting')
// });

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const foundPath = req.session.returnTo || '/painting'
    delete req.session.returnTo
    req.flash('success', 'Wellcome Back')
    res.redirect(foundPath)
})



router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success', 'GoodBye')
    res.redirect('/painting')
})

module.exports = router