const express = require('express');
const router = express.Router();
var query = require('../config/query');
const crypto = require("crypto");


router.get('/channel', (req, res, next) => {
    console.log(req.query.id);
    var id = req.query.id;
    let request = `SELECT * FROM chats WHERE id=${id}`;
    console.log(request);
    let values = []; // Values OK
    query(request, values, (err, rows, result) => {
        if (err) {
            console.log(err);
            res.status(300).send({
                msg: err,
                success: false
            });
            return;
        }  else {
            let request = `SELECT * FROM "${rows[0].code}" ORDER BY id`;
            query(request, values, (err, rows, result) => {
                if (err) {
                    console.log(err);
                    res.status(300).send({
                        msg: err,
                        success: false
                    });
                }  else {
                    res.status(200).send({
                        List: result.rows,
                        success: true
                    });
                }
            });
        }
    });
});

router.get('/', (req, res, next) => {
    console.log(req.query.id);
    var id = req.query.id;
    let request = "Select chats.id, chats.name, public.user.username AS admin, chats.admin AS admin_id , chats.code, chats.users FROM chats LEFT OUTER JOIN public.user ON CAST(chats.admin AS INTEGER) = public.user.id WHERE users @> '{" + id + "}'";
    let values = []; // Values OK
    query(request, values, (err, rows, result) => {
        if (err) {
            console.log(err);
            res.status(300).send({
                msg: err,
                success: false
            });
        } else if (result.rowCount == 0) {
            res.status(400).send({
                msg: "Error: database is empty",
                success: false
            });
        } else {
            res.status(200).send({
                List: result.rows,
                success: true
            });
        }
    });
});


router.post('/create', (req, res) => {
    const { Name, Admin } = req.body;
    let errors = [];
    console.log(req.body);
    if (!Name || !Admin) {
        errors.push({ msg: 'Veuillez remplir tous les champs' });
        res.status(400).send({
            errors,
            success: false
        });
        return;
    } else {

        const id = crypto.randomBytes(16).toString("hex");
        console.log("CREATE TABLE public." + id + " (id serial NOT NULL, username varchar, message varchar) ");
        var queryValues2 = [];
        query("INSERT INTO public.chats (name, admin, code,users) values('" + Name + "', '" + Admin + "', '" + id + "', '{" + Admin + "}')", queryValues2, (err, rows) => {
            if (err) {
                errors.push({ msg: err })
                res.status(400).send({
                    errors,
                    success: false
                });
                return;
            } else {
                query('CREATE TABLE public."' + id + '" (id serial NOT NULL, username varchar, message varchar) ', queryValues2, (err, rows) => {
                    if (err) {
                        errors.push({ msg: err })
                        res.status(400).send({
                            errors,
                            success: false
                        });
                        return;
                    } else {
                        res.status(200).send({
                            success: true
                        });
                        return;
                    }
                });
            }
        });
    }
});


router.post('/invite', (req, res) => {
    const { mail, channel_id } = req.body;
    let errors = [];
    console.log(req.body);
    if (!mail || !channel_id) {
        errors.push({ msg: 'Veuillez remplir tous les champs' });
        res.status(400).send({
            errors,
            success: false
        });
        return;
    } else {
        query(`SELECT id FROM public.user WHERE email='${mail}'`, [], (err, rows) => {
            if (err) {
                errors.push({ msg: err })
                res.status(400).send({
                    errors,
                    success: false
                });
                return;
            } else {
                query(`UPDATE chats SET users = array_append(users, CAST(${rows[0].id} AS bigint)) WHERE id=${channel_id}`, [], (err, rows) => {
                    if (err) {
                        errors.push({ msg: err })
                        res.status(400).send({
                            errors,
                            success: false
                        });
                        return;
                    } else {
                        res.status(200).send({
                            success: true
                        });
                        return;
                    }
                });
            }
        });
    }
});

module.exports = router;