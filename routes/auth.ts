// Path: './api/login'
// 
import { Router } from "express";
import { login } from '../controllers/authController';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-jwt';

 const router = Router();


 router.post('/',
    [
        check('email',"El email es oligatorio").isEmail(),
        check('password',"El password es obligatorio").not().isEmpty(),
        validarCampos.validarCamposFun
    ],
    login.login
 )

 router.post('/checkDoubleAuthentication',login.checkDoubleAuthentication);


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

router.get('/confirmEmail/:emailVerified',login.confirmEmail)
router.post('/forget-password',login.forgetPassword);
// router.get('/new-password/:tokenPassword',login.checkTokenPassword)
router.route('/new-password/:tokenPassword').get(login.checkTokenPassword).post(login.newPassword);

module.exports = router;