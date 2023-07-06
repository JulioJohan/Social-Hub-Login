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
exports.uploadFileFirebase = void 0;
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
// Claves de la configuracion de 
const firebaseConfig = {
    apiKey: process.env.API_KEY_FIREBASE,
    authDomain: process.env.AUTH_DOMAIN_FIREBASE,
    projectId: process.env.PROJECT_ID_FIREBASE,
    storageBucket: process.env.STORAGE_BUCKET_FIREBASE,
    messagingSenderId: process.env.MESSAGING_SENDER_ID_FIREBASE,
    appId: process.env.APP_ID_FIREBASE
};
// inicializar firebase aplicacion con nuestras credenciales
(0, app_1.initializeApp)(firebaseConfig);
// obteniendo nuestro storage
const storage = (0, storage_1.getStorage)();
// Subir una iamgen 
const uploadFileFirebase = (file) => __awaiter(void 0, void 0, void 0, function* () {
    // 
    const storageRef = (0, storage_1.ref)(storage, `users/${file.name}`);
    const snapshot = yield (0, storage_1.uploadBytes)(storageRef, file.data);
    const url = yield (0, storage_1.getDownloadURL)(snapshot.ref);
    return url;
});
exports.uploadFileFirebase = uploadFileFirebase;
