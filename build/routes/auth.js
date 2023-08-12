"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Path: './api/login'
// 
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/', authController_1.login.login);
router.post('/checkDoubleAuthentication', authController_1.login.checkDoubleAuthentication);
//  router.post('/google',
//  [
//      check('token',"El token de google obligatorio").not().isEmpty(),
//      validarCampos.validarCamposFun
//  ],
//  login.googleSingIn
// )
// router.get('/renew',
//     validarJWT,
//     login.renewToken
// )
// router.get('/fecha',
//     // validarJWT,
//     login.verificarTiempoSesion
// )
router.get('/confirmEmail/:emailVerified', authController_1.login.confirmEmail);
router.post('/forget-password', authController_1.login.forgetPassword);
// router.get('/new-password/:tokenPassword',login.checkTokenPassword)
router.route('/new-password/:tokenPassword').get(authController_1.login.checkTokenPassword).post(authController_1.login.newPassword);
module.exports = router;
