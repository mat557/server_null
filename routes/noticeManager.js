const express = require('express')
const router = require('express').Router()
const verifyJWT = require('../middleware/verifyJWT')
const noticeManagerControllers = require('../controllers/noticeManagerControllers')



router.route('/single/:id').get(noticeManagerControllers.getSingleNotice)
router.route('/all').get(noticeManagerControllers.getAllNotices)

router.use(verifyJWT)
router.route('/insert').put(noticeManagerControllers.insertNotice)
router.route('/update/:id').patch(noticeManagerControllers.editNotice)
router.route('/delete/:id').delete(noticeManagerControllers.deleteNotice)


module.exports = router