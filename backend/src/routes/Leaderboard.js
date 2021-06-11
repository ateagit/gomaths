import express from "express";
import { sequelize } from "../db";
import Activity from "../models/Activity";

const router = express.Router();

router.get("/:period", async (req, res) => {
    const period = req.params.period;
    if (!period || !["daily", "weekly", "alltime"].includes(period)) {
        return res
            .status(400)
            .send("400: Period must be one of day/week/alltime");
    }

    let dateQuery = "";

    switch (period) {
        case "daily":
            dateQuery = `WHERE "Activities"."createdAt">=current_date`;
            break;
        case "weekly":
            dateQuery = `WHERE "Activities"."createdAt" >= current_date - 7`; // this is 8 including today
            break;
    }
    const [results, metadata] = await sequelize.query(`
    SELECT "User".email as name,
        SUM("points") as points
        FROM "Activities"
		INNER JOIN "User" ON "UserId"="User".id
		${dateQuery}
        GROUP BY "User".email
        ORDER BY SUM("points") DESC LIMIT 10
    `); // TODO inefficinet should join after sum is calculated.

    res.status(200).send(results);
});

export default router;
