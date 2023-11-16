const express = require('express')
const router = require('express').Router()
const committeManagerControllers = require('../controllers/committeManagerControllers')


router.route('/all').get(committeManagerControllers.getAllCommitteMember)
router.route('/insert').put(committeManagerControllers.createNewCommitteMember)
router.route('/update/:id').patch(committeManagerControllers.editCommitteMember)
router.route('/delete/:id').delete(committeManagerControllers.deleteCommitteMember)

module.exports = router