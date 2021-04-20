module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('info', 'Please log in to use this feature');
        res.redirect('/auth');
    }
}