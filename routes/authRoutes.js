const express = require('express')
const router = require('express').Router()
const authControllers = require('../controllers/authControllers')


router.route('/all').get(authControllers.getAlleUser)
router.route('/admin').get(authControllers.adminChecker)
router.route('/create').put(authControllers.createUserController)
router.route('/update/:id').patch(authControllers.updateEditorials)
router.route('/login').post(authControllers.loginEditorialController)
router.route('/logout').post(authControllers.logoutUserController)
router.route('/refresh').get(authControllers.getSingleUserByToken)
router.route('/delete/:id').delete(authControllers.deleteEditoriaMember)


module.exports = router