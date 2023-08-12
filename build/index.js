"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const config_1 = require("./databases/config");
require('dotenv').config();
//Crear el servidor de express
const app = (0, express_1.default)();
//configurar cors
const corsOptions = {
    origin: 'http://localhost:4200',
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, express_fileupload_1.default)());
(0, config_1.dataBaseConnection)();
//Lectura y parseo del body
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
//Rutas
//requiero la rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/aws', require('./routes/aws'));
app.use('/api/firebase', require('./routes/firebase'));
app.use('/api/login', require('./routes/auth'));
// req lo que se solicita
// res va a responder al cliente
app.listen(process.env.PORT_BACKEND, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT_BACKEND);
});
