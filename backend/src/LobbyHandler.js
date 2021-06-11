import { v4 as uuid } from "uuid";
import { startGame } from "./GameHandler";
import User from "./models/User";
export const lobbies = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
};

export default function registerLobbyHandler(io, socket) {
    function transitionLobbyToGame(lobby) {
        // if lobby has no players delete it...
        if (!lobby.players.length) {
            return;
        }

        // fill with bots.
        let botCount = 1;
        while (lobby.players.length < lobby.maxPlayers) {
            const botName = `BOT ${botCount}`;
            lobby.players.push(`BOT ${botCount}`);
            botCount++;
            io.in(lobby.lobbyId).emit("lobby:newPlayer", {
                // players: lobby.players,
                player: botName,
                avatar: "🤖",
            });
        }

        lobby.status = "IN-GAME";

        startGame(io, socket, lobby);
    }

    async function handleLobbyJoin({ level, avatar }, cb) {
        // check if lobby for level exists
        let openLobby = lobbies[level].find((l) => l.status === "OPEN");
        // if it dosent create a lobby
        if (!openLobby) {
            openLobby = {
                lobbyId: uuid(),
                status: "OPEN",
                level,
                players: [],
                maxPlayers: 4,
                timeout: false,
            };
            lobbies[level].push(openLobby);
        }

        const user = await User.findByPk(socket.player);
        user.avatar = avatar;
        await user.save();

        openLobby.players.push(socket.player);

        io.in(openLobby.lobbyId).emit("lobby:newPlayer", {
            // players: lobby.players,
            player: socket.player,
            avatar: user.avatar,
        });

        socket.lobbyId = openLobby.lobbyId;

        if (openLobby.players.length >= openLobby.maxPlayers) {
            openLobby.status = "CLOSED";
        }

        const lobbyWaitTime = 5000;

        if (!openLobby.timeout) {
            setTimeout(() => {
                transitionLobbyToGame(openLobby);
            }, lobbyWaitTime);
            openLobby.timeout = true;
        }

        // socket subscribes to lobby events
        socket.join(openLobby.lobbyId);
        cb({ lobby: openLobby });
    }

    socket.on("lobby:join", handleLobbyJoin);
}
