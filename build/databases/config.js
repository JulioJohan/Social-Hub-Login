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
exports.dataBaseConnection = void 0;
const sequelize_1 = require("sequelize");
// Conexion a a la base de datos mediante el orm Sequelize
// nos ayuda a poder conenctarnos mediante Lenguanje SQL
const dataBaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const conexion = new sequelize_1.Sequelize(`${process.env.DATABASE}`, `${process.env.SQL_USER_NAME}`, `${process.env.SQL_PASSWORD}`, {
        host: `${process.env.SQL}`,
        dialect: 'mysql',
        port: 7028
    });
    try {
        yield conexion.authenticate();
        console.log('Conexión de la base de datos SQL conectada');
    }
    catch (error) {
        console.log(error);
    }
});
exports.dataBaseConnection = dataBaseConnection;
