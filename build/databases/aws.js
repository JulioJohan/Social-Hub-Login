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
exports.getFileUrl = exports.getFile = exports.getFiles = exports.uploadFile = void 0;
// importando el sdk para poder tener comunicacion con aws service
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
//configuracion del S3 para AWS S3
const configurationS3 = new client_s3_1.S3Client({
    // Region
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
});
const uploadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    // Leyendo un archivo
    console.log(file);
    // const stream:fs.ReadStream = fs.createReadStream(file.tempFilePath);
    // console.log(file)
    // Especificar donde se guarda el archivo
    const uploadParams = {
        // especificacione del nombre del bucket donde se guardara los archivos
        Bucket: process.env.AWS_BUCKET_NAME,
        // Nombre del archivo
        Key: `users/${file.name}`,
        // contenido del archivo
        Body: file.data
    };
    // PutObjectCommand es la operacion para subir un archivo
    const command = new client_s3_1.PutObjectCommand(uploadParams);
    // Mandado el put a AWS
    const result = yield configurationS3.send(command);
    // Mandando en respuesta el resultado en AWS
    console.log(result);
});
exports.uploadFile = uploadFile;
// Obtener una lista de los archivos
const getFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    // Enviando el bucket en el que tendra nuestras imagens     
    const listObject = new client_s3_1.ListObjectsCommand({ Bucket: `${process.env.AWS_BUCKET_NAME}` });
    // enviamos la petición 
    const result = yield configurationS3.send(listObject);
    // regresa el resultado
    return result;
});
exports.getFiles = getFiles;
// Obtener Archivo por id
const getFile = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        // El nombre del archivo
        Key: fileName
    });
    const result = yield configurationS3.send(command);
    // const resultado = Buffer.from(result.Body).toString('utf8');
    return result;
});
exports.getFile = getFile;
const getFileUrl = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        // El nombre del archivo
        Key: fileName
    });
    const s3 = new client_s3_1.S3Client({
        region: process.env.AWS_BUCKET_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        }
    });
    const result = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
    return result;
});
exports.getFileUrl = getFileUrl;
