// import {Schema, model} from 'mongoose';
import { Sequelize, DataTypes, Optional, Model } from 'sequelize';
import { sequelize } from '../util/sequelize';
import { IUsuario } from '../interfaces/user';

// Modelo de usuarios ademas de sequelize ayudara a implementar un CRUD  
export class User extends Model<IUsuario> implements IUsuario {

    public id_user!: number;
    public name!: number;
    public email!: string;
    public password!: string;
    public confirmed!: boolean;
    public email_verified!: string;
    public multi_factor_authentication!: string;
    public father_last_name!: string;
    public mother_last_name!: string;
    public age!: string;
    public date_birth!: Date;
    public avatar!: string;
}

User.init(
    {
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        confirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        email_verified: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        multi_factor_authentication: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        father_last_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mother_last_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        date_birth: {
            type: DataTypes.DATE,
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'user',
        tableName: 'user',
        timestamps: false
    }
)



// export default model<IUsuario>('Usuario',)

