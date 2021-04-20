const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
var query = require('../config/query');


router.get('/register' , (req, res) => {
    res.render('register');
});


router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];
    console.log(req.body);
    if (!email || !password || !username || !password2) {
        errors.push({ msg: 'Veuillez remplir tous les champs' })
    }
    var TMPpassword = password;
    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email
        });
    } else {
        var queryValues = [];
        query("select exists(select 1 from public.user where email='" + email + "')", queryValues, (err, rows) => {
            if (err) {
                errors.push({ msg: err })
                res.render('register', {
                    errors,
                    username,
                    email
                });
            }
            if (rows[0].exists == true) {
                errors.push({ msg: "Email is already used" })
                res.send("Email is already used");
            } else {
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        //Set Password to Hash
                        var new_password = hash;
                        //Save the User
                        var queryValues2 = [];
                        query("INSERT INTO public.user (username, email, password) values('" + username + "', '" + email + "', '" + new_password + "')", queryValues2, (err, rows) => {
                            res.redirect('/auth/');
                        });
                    }));
            }
        });
    }
});


module.exports = router;