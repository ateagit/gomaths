require("dotenv").config();

const { Sequelize, Model, DataTypes } = require("sequelize");

import { sequelize } from "../db";

const User = sequelize.define(
    "User",
    {
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        totalPoints: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);

export default User;
