// import {Schema, model} from 'mongoose';
import { IUsuario } from '../interfaces/usuario';
import { Sequelize,DataTypes } from 'sequelize';
import { sequelize } from '../util/sequelize';

// Modelo de usuarios ademas de sequelize ayudara a implementar un CRUD  
export const User = sequelize.define('User',{

    idUser:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrementIdentity:true,        
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    confirmed:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    emailVerified:{
        type:DataTypes.STRING,
        allowNull:false
    },
    multiFactorAuthentication:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fatherLastName:{
        type:DataTypes.STRING,
        allowNull:true
    },
    motherLastName:{
        type:DataTypes.STRING,
        allowNull:true
    },
    age:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    dateBirth:{
        type:DataTypes.DATE,
        allowNull:true
    },
    avatar:{
        type:DataTypes.STRING,
        allowNull:true
    }
})

// export default model<IUsuario>('Usuario',)

