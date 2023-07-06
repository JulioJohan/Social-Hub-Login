"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// import {Schema, model} from 'mongoose';
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../util/sequelize");
// Modelo de usuarios ademas de sequelize ayudara a implementar un CRUD  
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id_user: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    confirmed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    email_verified: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
    },
    multi_factor_authentication: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
    },
    father_last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    mother_last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    date_birth: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'user',
    tableName: 'user',
    timestamps: false
});
// export default model<IUsuario>('Usuario',)
