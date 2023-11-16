const express = require('express')
const router = require('express').Router()
const committeManagerControllers = require('../controllers/committeManagerControllers')


router.route('/all').get(committeManagerControllers.getAllCommitteMember)
router.route('/insert').put(committeManagerControllers.createNewCommitteMember)
// router.route('/update/teacher').post(committeManagerControllers.loginUserController)
// router.route('/delete/teacher').delete(committeManagerControllers.logoutUserController)

module.exports = router