import { validationResult } from "express-validator";
import { Request, Response } from 'express';


class ValidarCampos {
    
    validarCamposFun = (req:Request,res:Response,next:any) => {

        //Verificar si hay errores en el midelware
        const errores =validationResult(req);
        if(!errores.isEmpty()){
            return res.status(400).json({
                ok:false,
                errores:errores.mapped()
            })
        }
        
        next();
    }

 
}

export const validarCampos = new ValidarCampos();
