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
        // check('email',"El email es oligatorio").isEmail(),
        // check('password',"El password es obligatorio").not().isEmpty(),
        validarCampos.validarCamposFun
    ],
    login.ingresa
 )

 router.post('/dobleAuthenticacion',login.comprobarDobleAuthenticacion);


 router.post('/google',
 [
     check('token',"El token de google obligatorio").not().isEmpty(),
     validarCampos.validarCamposFun
 ],
 login.googleSingIn

 
)

router.get('/renew',
    validarJWT,
    login.renewToken
)

router.get('/fecha',
    // validarJWT,
    login.verificarTiempoSesion
)

router.get('/confirmar/:tokenDoble',login.confirmar)
router.post('/olvide-password',login.olvidePassword);
router.route('/nuevo-password/:tokenDoble').get(login.comprobarTokenValidacion).post(login.nuevoPassword);

module.exports = router;