import { Sequelize, DataTypes } from 'sequelize';
import { db } from '../db.js';
export const User = db.define(
  'User',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Make it auto-incrementing
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // Email validation
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,  // Ensure password is required
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW, // Use Sequelize.NOW for current timestamp
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    updated_by:{
        type:DataTypes.STRING,
        allowNull:true,
    }
  },
  {
    // Sequelize options
    timestamps: false, // Disable automatic timestamps management
    tableName: 'users', // Optional: Set a custom table name
  }
);
