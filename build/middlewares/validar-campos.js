"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCampos = void 0;
const express_validator_1 = require("express-validator");
class ValidarCampos {
    constructor() {
        this.validarCamposFun = (req, res, next) => {
            //Verificar si hay errores en el midelware
            const errores = (0, express_validator_1.validationResult)(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({
                    ok: false,
                    errores: errores.mapped()
                });
            }
            next();
        };
    }
}
exports.validarCampos = new ValidarCampos();
