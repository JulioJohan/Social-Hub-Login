"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize(`${process.env.DATABASE}`, `${process.env.SQL_USER_NAME}`, `${process.env.SQL_PASSWORD}`, {
    host: `${process.env.SQL}`,
    dialect: 'mysql',
    port: 7028
});
