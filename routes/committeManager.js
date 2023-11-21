const express = require('express')
const router = require('express').Router()
const committeManagerControllers = require('../controllers/committeManagerControllers')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/all').get(committeManagerControllers.getAllCommitteMember)

router.use(verifyJWT)
router.route('/insert').put(committeManagerControllers.createNewCommitteMember)
router.route('/update/:id').patch(committeManagerControllers.editCommitteMember)
router.route('/delete/:id').delete(committeManagerControllers.deleteCommitteMember)

module.exports = router