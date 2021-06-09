import { v4 as uuid } from "uuid";
import { startGame } from "./GameHandler";
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
            });
        }

        lobby.status = "IN-GAME";

        startGame(io, socket, lobby);
    }

    function handleLobbyJoin({ level, name }, cb) {
        // check if lobby for level exists
        let openLobby = lobbies[level].find((l) => l.status === "OPEN");
        // if it dosent create a lobby
        if (!openLobby) {
            openLobby = {
                lobbyId: uuid(),
                status: "OPEN",
                players: [],
                maxPlayers: 4,
                timeout: false,
            };
            lobbies[level].push(openLobby);
        }

        openLobby.players.push(name);

        io.in(openLobby.lobbyId).emit("lobby:newPlayer", {
            // players: lobby.players,
            player: name,
        });

        socket.lobbyId = openLobby.lobbyId;
        socket.player = name;

        if (openLobby.players.length >= openLobby.maxPlayers) {
            status = "CLOSED";
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
