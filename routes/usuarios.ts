//Ruta: '/api/usuarios'

import { Router } from "express";
import { usuarioController } from '../controllers/usuarioController';
import {check} from 'express-validator';
import { validarCampos } from "../middlewares/validar-campos";
import { validarJWT, validarAdminRole, validarAdminRoleOUsuarios } from '../middlewares/validar-jwt';

//rutas
const router: Router = Router();


router.get('/',validarJWT ,usuarioController.getUsuarios );
router.post('/guardarUsuario',
    [       
        //primero es el campo, segundo es el mensaje
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('password','El password es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        validarCampos.validarCamposFun

    ],
usuarioController.guardarUsuario);

router.put('/actualizarUsuario/:id',
[       
    validarJWT,
    validarAdminRoleOUsuarios,
    //primero es el campo, segundo es el mensaje
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('role','El role es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    validarCampos.validarCamposFun,


],
usuarioController.actualizarUsuario);

router.delete('/eliminarUsuario/:id',
[validarJWT,validarAdminRole],
[       
    //primero es el campo, segundo es el mensaje
    // check('nombre','El nombre es obligatorio').not().isEmpty(),
    // check('role','El role es obligatorio').not().isEmpty(),
    // check('email','El email es obligatorio').isEmail(),
    // validarCampos.validarCamposFun

],
usuarioController.eliminarUsuario);




//exportar el router porque lo ocupa el index
module.exports = router;