"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsController = void 0;
const aws_1 = require("../databases/aws");
// Prubas para AWS
class AwsController {
    // Controller para probar y subir archivos
    uploadFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.files.multimedia;
            console.log(file);
            let response;
            try {
                // response = await uploadFile(file);
            }
            catch (error) {
                console.log(error);
                return res.json({
                    ok: false,
                    msg: 'No se puedo subir el archivo, error inesperado'
                });
            }
            res.json({
                response,
                ok: true,
                msg: 'El archivo a AWS se subió correctamente'
            });
        });
    }
    getFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyImage = req.params.keyImage;
            console.log(keyImage);
            let response;
            try {
                response = yield (0, aws_1.getFileUrl)(keyImage);
                console.log(response);
            }
            catch (error) {
                console.log(error);
                return res.json({
                    ok: false,
                    msg: 'No se puedo obtener el archivo, error inesperado'
                });
            }
            res.status(200).json(response);
            // res.json({
            //     response:response,
            //     ok:true,
            //     msg:'Se consultó correctamente'
            // })
        });
    }
}
exports.awsController = new AwsController();
