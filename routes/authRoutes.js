const express = require('express')
const router = require('express').Router()
const authControllers = require('../controllers/authControllers')


router.route('/create/user').put(authControllers.createUserController)
router.route('/login/user').post(authControllers.loginUserController)
router.route('/logout/user').post(authControllers.logoutUserController)
router.route('/refresh/user').get(authControllers.getSingleUserByToken)


module.exports = router