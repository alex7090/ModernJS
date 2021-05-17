const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
var query = require('../config/query');



router.post('/login', (req, res, next) => {
    const { Email, Password} = req.body;
    let errors = [];
    if (Email == undefined || Password == undefined) {
        errors.push({
            msg: "Invalid usage."
        })
        res.status(400).send({
            errors,
            success: false
        });
        return;
    }
    query("select exists(select 1 from public.user where email='" + Email + "')", [], (err, rows, result) => {
        if (err) {
            errors.push({
                msg: err
            });
            res.status(300).send({
                errors,
                success: false
            });
        } else if (result.rows[0].exists == false) {
            errors.push({
                msg: "Error: Wrong email"
            })
            res.status(401).send({
                errors,
                success: false
            });
        } else {
            query("SELECT * FROM public.user WHERE email='" + Email + "'", [], (err, rows, result) => {
                if (err) {
                    errors.push({
                        msg: err
                    })
                    res.status(300).send({
                        errors,
                        success: false
                    });
                } else {
                    bcrypt.compare(Password, result.rows[0].password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {

                            res.status(200).json({
                                ID: result.rows[0].id,
                                Username: result.rows[0].username,
                                Email: result.rows[0].email
                            });
                        } else {
                            errors.push({
                                msg: "Error: Wrong password"
                            })
                            res.status(401).send({
                                errors,
                                success: false
                            });
                        }
                    });
                }
            });
        }
    });
});





router.post('/register', (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    let errors = [];
    console.log(req.body);
    if (!email || !password || !username) {
        errors.push({ msg: 'Veuillez remplir tous les champs' })
    }
    var TMPpassword = password;
    if (errors.length > 0) {
        res.status(400).send({
            errors,
            success: false
        });
        return;
    } else {
        var queryValues = [];
        query("select exists(select 1 from public.user where email='" + email + "')", queryValues, (err, rows) => {
            if (err) {
                errors.push({ msg: err })
                res.status(400).send({
                    errors,
                    success: false
                });
                return;
            }
            if (rows[0].exists == true) {
                errors.push({ msg: "Email is already used" })
                res.status(400).send({
                    errors,
                    success: false
                });
                return;
            } else {
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        //Set Password to Hash
                        var new_password = hash;
                        //Save the User
                        var queryValues2 = [];
                        query("INSERT INTO public.user (username, email, password) values('" + username + "', '" + email + "', '" + new_password + "')", queryValues2, (err, rows) => {
                            res.status(200).send({
                                success: true
                            });
                            return;
                        });
                    }));
            }
        });
    }
});


module.exports = router;