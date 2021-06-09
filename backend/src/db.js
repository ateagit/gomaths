require("dotenv").config();

const { Sequelize, Model, DataTypes } = require("sequelize");

export const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING);
