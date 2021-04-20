
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');


router.get('/' , (req, res) => {
    res.render('login');

});

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth',
        failureFlash: true
    })(req, res, next);
});


router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/auth');
});


module.exports = router;