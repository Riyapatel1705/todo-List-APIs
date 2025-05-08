import { Sequelize, DataTypes } from "sequelize";
import { db } from "../db.js";
import { User } from "./User.js";


export const Todo = db.define(
  'Todo',
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User, // Name of the model referenced
        key: 'user_id', // Primary key of the referenced model
      },
      allowNull: false,
    },
    todo_id:{
        type:DataTypes.UUID,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4,
    },
    title:{
        type:DataTypes.STRING,
        allowNull:true
    },
    task: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
      defaultValue: "Pending", // Default to not completed
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull:false, // 3 days from current date
    },
    priority:{
        type:DataTypes.TEXT,
        allowNull:false,
        defaultValue:"High",
        validate:{
            isIn:[["High","medium","Low"]]
        }
    }
  },
  {
    timestamps: true,
    tableName: "todos",
  }
);

/*// Establishing the relationship between User and Todo models
Todo.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Todo, { foreignKey: 'user_id' });

export { Todo };*/
