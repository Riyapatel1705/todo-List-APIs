import { Sequelize } from "sequelize";

export const db=new Sequelize("todo","new","new@71",{
    host:"localhost",
    dialect:"mysql"
});