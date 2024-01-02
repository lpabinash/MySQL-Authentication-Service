const emailValidator = require('validator');

module.exports = isEmailValid;


async function isEmailValid(email) {
    const resp = await emailValidator.isEmail(email);
    return (resp)
   
}