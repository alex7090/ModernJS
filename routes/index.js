
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');


router.get('/test' , ensureAuthenticated, (req, res) => {
    res.send('You are logged in !');

});

router.get('/' , (req, res) => {
    res.render('chat');

});

module.exports = router;