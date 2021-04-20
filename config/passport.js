const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var query = require('../config/query');


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            query('SELECT * FROM public.user WHERE email=$1', [email], (err, rows) => {
                if (err) return done(null, false);
                if (rows.length > 0) {
                    const first = rows[0]
                    bcrypt.compare(password, first.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, first);
                        } else {
                            return done(null, false, { message: "Incorrect Password" });
                        }
                    });
                } else {
                    return done(null, false, { message: "That Email is not registered"})
                }
            });

        })
    );


    // Sérialisation de l'utilisateur ( lors de la connection )
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Désérialisation de l'utilisateur ( lors de la deconnection )
    passport.deserializeUser((id, done) => {
        query('SELECT * FROM public.user WHERE id = $1', [parseInt(id, 10)], (err, rows) => {
            if (err) return done(err);
            done(null, rows[0])
        });
    });
}