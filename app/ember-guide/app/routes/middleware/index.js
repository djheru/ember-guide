// Middleware to play with req and res before rendering the page
var _ = require('underscore');
module.exports = {

    "isLoggedIn": function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('dangerMessage', 'Please log in to get access to secure pages.')
        res.redirect('/');
    },
    "flashAlert": function (req, res, next) {
        var flashMessages = {};
        var messageTypes = ['success', 'info', 'warning', 'danger'];
        var type;
        _.each(messageTypes, function (msgType) {
            type = msgType + 'Message';
            flashMsg = req.flash(type)
            flashMessages[type] = (_.isArray(flashMsg)) ?
                flashMsg.join("\n<br />") : flashMsg;
        });
        res.locals.flashMessages = flashMessages;
        return next();
    },
    "flashForm": function (req, res, next) {
        var errors = req.flash('formErrors');
        res.locals.formErrors = function (fieldName) {
            return errors.indexOf(fieldName) >= 0;
        }
        return next();
    },
    "flashBody": function (req, res, next) {
        var body = req.flash('formBody')[0];
        res.locals.formBody = function (fieldName) {
            return (_.has(body, fieldName)) ? body[fieldName] : '';
        }
        return next();
    }
}
