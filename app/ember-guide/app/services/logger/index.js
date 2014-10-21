//logging
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json: true,
            timestamp: true
        }),
        new winston.transports.File({
            filename: appGlobals.config.get('logger').filename,
            json: true
        })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({
            json: true,
            timestamp: true
        }),
        new winston.transports.File({
            filename: appGlobals.config.get('logger').errorFilename,
            json: true
        })
    ],
    exitOnError: false
});

module.exports = logger;