const { Sequelize, Model, DataTypes } = require("sequelize");
import { sequelize } from "../db";
import User from "./User";

const Activity = sequelize.define("Activity", {
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

User.hasMany(Activity);

export default Activity;
