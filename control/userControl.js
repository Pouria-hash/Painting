const User = require('../models/user');
const passport = require('passport');


module.exports.registerForm = (req, res) => {
    res.render('user/register')
}

module.exports.registr = async (req, res) => {
    const { username, email, password } = req.body;
    const u = new User({ username, email })
    const registerUser = await User.register(u, password)
    req.logIn(registerUser, err => {
        if (err) return next(err)
    })
    req.flash('success', 'Wellcome')
    res.redirect('/painting')
}

module.exports.loginForm = (req, res) => {
    res.render('user/login')
}

module.exports.loginUser = (req, res) => {
    const foundPath = req.session.returnTo || '/painting'
    delete req.session.returnTo
    req.flash('success', 'Wellcome Back')
    res.redirect(foundPath)
}

module.exports.logoutUser = (req, res) => {
    req.logOut()
    req.flash('success', 'GoodBye')
    res.redirect('/painting')
}