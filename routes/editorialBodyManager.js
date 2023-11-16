const express = require('express')
const router = require('express').Router()
const editiorialManagerControllers = require('../controllers/editiorialManagerControllers')


router.route('/all').get(committeManagerControllers.getAllEditorials)
router.route('/insert').put(editiorialManagerControllers.createNewEditorials)
router.route('/update/:id').patch(editiorialManagerControllers.editCommitteMember)
router.route('/delete/:id').delete(editiorialManagerControllers.deleteCommitteMember)


module.exports = router