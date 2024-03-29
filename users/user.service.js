﻿const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const errorHandler = require('_middleware/error-handler');


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'email or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.email }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    try {
        if (await db.User.findOne({ where: { email: params.email } })) {
            throw 'email "' + params.email + '" is already taken';
        }
    
        // hash password
        if (params.password) {
            params.hash = await bcrypt.hash(params.password, 10);
        }
    
        // save user
        await db.User.create(params);
    } catch (e) {
       errorHandler(e)
    }
    // validate
 
}

async function update(id, params) {
    const user = await getUser(id);

    // const emailChanged = params.email && user.email !== params.email;
    // if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
    //     throw 'email "' + params.email + '" is already taken';
    // }

    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}