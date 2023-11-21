const express = require('express')
const router = require('express').Router()
const authControllers = require('../controllers/authControllers')
const verifyJWT = require('../middleware/verifyJWT')



router.route('/login').post(authControllers.loginEditorialController)
router.route('/signup').post(authControllers.signUpForAdmin)
router.route('/logout').post(authControllers.logoutUserController)
router.route('/admin').get(authControllers.adminChecker)

router.use(verifyJWT)
router.route('/all').get(authControllers.getAlleUser)
router.route('/create').put(authControllers.createUserController)
router.route('/update/:id').patch(authControllers.updateEditorials)
router.route('/delete/:id').delete(authControllers.deleteEditoriaMember)


module.exports = router