"use strict";
//Ruta: '/api/usuarios'
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
//rutas
const router = (0, express_1.Router)();
router.get('/findById', userController_1.userController.findById);
router.delete('/deleteUser', userController_1.userController.deleteUser);
// router.get('/',validarJWT ,usuarioController.getUsuarios );
router.post('/createUser', [
    //primero es el campo, segundo es el mensaje
    (0, express_validator_1.check)('name', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    // validarCampos.validarCamposFun
], userController_1.userController.createUser);
router.put('/updateUser/:id', [
    // validarJWT,
    // validarAdminRoleOUsuarios,
    //primero es el campo, segundo es el mensaje
    (0, express_validator_1.check)('name', 'El nombre es obligatorio').not().isEmpty(),
    // check('role','El role es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    validar_campos_1.validarCampos.validarCamposFun,
], userController_1.userController.updateUser);
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
