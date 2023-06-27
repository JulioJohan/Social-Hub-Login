//Ruta: '/api/usuarios'

import { Router } from "express";
import { userController } from '../controllers/userController';
import {check} from 'express-validator';
import { validarCampos } from "../middlewares/validar-campos";
import { validarJWT } from '../middlewares/validar-jwt';

//rutas
const router: Router = Router();


router.get('/findById',userController.findById)

router.delete('/deleteUser/:id',userController.deleteUser)

// router.get('/',validarJWT ,usuarioController.getUsuarios );
router.post('/createUser',
    [       
        //primero es el campo, segundo es el mensaje
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('password','El password es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        // validarCampos.validarCamposFun

    ],
userController.createUser);

router.put('/updateUser/:id',
[       
    // validarJWT,
    // validarAdminRoleOUsuarios,
    //primero es el campo, segundo es el mensaje
    check('name','El nombre es obligatorio').not().isEmpty(),
    // check('role','El role es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    validarCampos.validarCamposFun,


],
userController.updateUser);

// router.delete('/eliminarUsuario/:id',
// [validarJWT],
// [       
//     //primero es el campo, segundo es el mensaje
//     // check('nombre','El nombre es obligatorio').not().isEmpty(),
//     // check('role','El role es obligatorio').not().isEmpty(),
//     // check('email','El email es obligatorio').isEmail(),
//     // validarCampos.validarCamposFun

// ],
// userController.eliminarUsuario);




//exportar el router porque lo ocupa el index
module.exports = router;