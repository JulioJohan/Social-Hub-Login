import { Sequelize } from 'sequelize';


// Conexion a a la base de datos mediante el orm Sequelize
// nos ayuda a poder conenctarnos mediante Lenguanje SQL
export const dataBaseConnection = async () => {
    
    const conexion = new Sequelize(`${process.env.DATABASE}`,`${process.env.SQL_USER_NAME}`,`${process.env.SQL_PASSWORD}`,{
        host:`${process.env.SQL}`,
        dialect:'mysql',
        port: 7028
    });

    try {
        await conexion.authenticate();
        console.log('Conexión de la base de datos SQL conectada');
    } catch (error) {
        console.log(error)
    }

}