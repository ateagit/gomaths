import registerLobbyHandler from "./LobbyHandler";

import { createServer } from "http";
import { Server } from "socket.io";
import registerGameHandler from "./GameHandler";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

// accept socket io connections
io.on("connection", handleConnection);

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
