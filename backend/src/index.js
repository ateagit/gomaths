require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
import registerLobbyHandler from "./LobbyHandler";
import { createServer } from "http";
import { Server } from "socket.io";
import registerGameHandler from "./GameHandler";
import leaderboard from "./routes/Leaderboard";
import { sequelize } from "./db";
import User from "./models/User";
import Activity from "./models/Activity";
const admin = require("firebase-admin");

const firebaseKey = JSON.parse(process.env.FIREBASE_KEY);
firebaseKey.private_key = firebaseKey.private_key.replace(/\\n/g, "\n");

admin.initializeApp({
    credential: admin.credential.cert(firebaseKey),
});

sequelize
    .authenticate()
    .then(async () => {
        console.log("connected to db..");
        await sequelize.sync({ force: true });
    })
    .catch((e) => console.error(":(", e));

app.use(cors());
app.use("/leaderboard", leaderboard);
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

// accept socket io connections
io.on("connection", handleConnection);

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        next(new Error("not authorized"));
    }

    admin
        .auth()
        .verifyIdToken(token)
        .then(async (u) => {
            // use user.uid to retrieve db id and attach to socket

            const [user, created] = await User.findOrCreate({
                where: {
                    uid: u.uid,
                },
                defaults: {
                    uid: u.uid,
                    email: u.email,
                    totalPoints: 0,
                },
            });

            socket.player = user.id;

            next();
        })
        .catch((err) => console.error(err));
});

function handleConnection(socket) {
    registerLobbyHandler(io, socket);
    registerGameHandler(io, socket);
}
// event handler for joining a game of a certain level.
// if existing game, join
// if no game, make one.
// set timer for 10 seconds after which the game starts (with bots if necessary)

httpServer.listen(3000);
console.log("listening...");
