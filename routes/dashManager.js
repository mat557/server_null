const express = require('express')
const router = require('express').Router()
const dashManagerControllers = require('../controllers/dashManagerControllers')


router.route('/insert/').put(dashManagerControllers.createNewCommitteMember)
router.route('/update/teacher').post(dashManagerControllers.loginUserController)
router.route('/delete/teacher').delete(dashManagerControllers.logoutUserController)

module.exports = router
