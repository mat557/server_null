const express = require('express')
const router = require('express').Router()
const studentsManagerControllers = require('../controllers/studentManagerControllers')


router.route('/studentby/:id').get(studentsManagerControllers.getSingleStudent)
router.route('/all').get(studentsManagerControllers.getAllStudent)
router.route('/insert').put(studentsManagerControllers.insertStudentData)
router.route('/edit/:id').patch(studentsManagerControllers.EditStudentData)
router.route('/delete/:id').delete(studentsManagerControllers.deleteStudent)


module.exports = router