const express = require('express');
const router = express.Router();
const wrapAsync = require('../utily/wrapAsync')
const User = require('../models/user');
const passport = require('passport');
const user = require('../control/userControl')



// router.get('/fakeuser', async (req, res) => {
//     const user = new User({ username: 'pouria', email: 'pooria@gmail.com' })
//     const newUser = await User.register(user, 'monkey')
//     console.log(newUser)
//     res.send('ok')
// })

router.get('/register', user.registerForm)

router.post('/register', wrapAsync(user.registr))

router.get('/login', user.loginForm)

// google sign in (broken)

// router.get("/auth/google", passport.authenticate("google", {
//     scope: ["profile", "email"]
// }));

// router.get("/api/auth/google/redirect", passport.authenticate('google', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//     req.flash('success', 'Wellcom Back')
//     res.redirect('/painting')
// });

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser)



router.get('/logout', user.logoutUser)

module.exports = router