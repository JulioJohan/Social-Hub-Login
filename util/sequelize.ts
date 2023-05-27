import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(`${process.env.DATABASE}`,`${process.env.SQL_USER_NAME}`,`${process.env.SQL_PASSWORD}`,{
    host:`${process.env.SQL}`,
    dialect:'mysql',
    port: 7028
});
