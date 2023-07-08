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
exports.uploadFile = void 0;
const firebase_1 = require("../databases/firebase");
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.files.multimedia;
    try {
        console.log(file);
        const response = yield (0, firebase_1.uploadFileFirebase)(file);
        console.log(response);
    }
    catch (error) {
        console.log("Error Inesperado");
        return res.json({
            ok: false,
            msg: 'Error insesperado en subir el archivo'
        });
    }
    return res.json({
        ok: true,
        msg: 'El archivo se subio correctamente'
    });
});
exports.uploadFile = uploadFile;
