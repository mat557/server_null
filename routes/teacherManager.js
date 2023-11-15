const express = require('express')
const router = require('express').Router()
const teacherManagerControllers = require('../controllers/teacherManagerControllers')



router.route('/teacherby/:id').get(teacherManagerControllers.getSingleTeacher)
router.route('/all').get(teacherManagerControllers.getAllTeacher)
router.route('/insert').put(teacherManagerControllers.insertTeachersData)
router.route('/edit').patch(teacherManagerControllers.EditTeacherData)
router.route('/delete/:id').delete(teacherManagerControllers.deleteTeacher)

module.exports = router
