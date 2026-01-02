const userModel = require('../models/user');

module.exports.createUser = async ({
    firstname, lastname, email, password

}) => {
    if (!firstname || !lastname || !email || !password) {
        throw new Error('All filds are required');
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        }, email,
        password
    })
    return user;
}