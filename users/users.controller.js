const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const validateloginRequest=require('_middleware/validate-loginreq')
const authorize = require('_middleware/authorize')
const userService = require('./user.service');
const isEmailValid=require("_middleware/validate-email")

router.post('/api/v1/authenticate',authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
// router.get('/:id', authorize(), getById);
router.put('/updateUser', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        // role: Joi.string().valid('USER', 'SERVICECENTER')

    });
    validateloginRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        // firstName: Joi.string().required(),
        // lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
        // role: Joi.string().valid('USER', 'SERVICECENTER')
    });
    // isEmailValid(req,next)
    console.log("see->",req)
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

// function getById(req, res, next) {
//     userService.getById(req.params.id)
//         .then(user => res.json(user))
//         .catch(next);
// }

function updateSchema(req, res, next) {
    const schema = Joi.object({
        email:Joi.string().required(),
        password: Joi.string().min(6).empty('')
    });
    validateloginRequest(req, next, schema);
}

function update(req, res, next) {
    console.log(req.body)
    userService.update(req.body.email, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}