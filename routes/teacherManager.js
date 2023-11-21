const express = require('express')
const router = require('express').Router()
const teacherManagerControllers = require('../controllers/teacherManagerControllers')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/all').get(teacherManagerControllers.getAllTeacher)

router.use(verifyJWT)
router.route('/insert').put(teacherManagerControllers.insertTeachersData)
router.route('/edit/:id').patch(teacherManagerControllers.EditTeacherData)
router.route('/delete/:id').delete(teacherManagerControllers.deleteTeacher)

module.exports = router
