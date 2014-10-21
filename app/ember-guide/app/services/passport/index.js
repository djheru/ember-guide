//Passport Config

module.exports = function (passport, User) {
    require('./facebook')(passport, User);
    require('./google')(passport, User);
    require('./github')(passport, User);
    require('./local')(passport, User);
    require('./session')(passport, User);
    require('./twitter')(passport, User);
};
