import { evaluate } from "mathjs";

const gameStates = {};

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(level) {
    const operators = ["+", "-", "*"];

    let a;
    let b;
    let operator;

    switch (level) {
        case 1:
            a = randInt(1, 10);
            b = randInt(1, 10);
            operator = "+";
            break;

        case 2:
            a = randInt(1, 99);
            b = randInt(1, 99);
            operator = "+";
            break;

        case 3:
            a = randInt(1, 99);
            b = randInt(1, 99);
            operator = "-";
            break;

        case 4:
            a = randInt(1, 12);
            b = randInt(1, 12);
            operator = "*";
            break;

        case 5:
            a = randInt(1, 12);
            b = randInt(1, 12);
            operator = operators[randInt(0, operators.length - 1)];
            break;
    }

    const question = `${a} ${operator} ${b}`;
    const answer = evaluate(`${a} ${operator} ${b}`);

    return { question, answer };
}

export function startGame(io, socket, lobby) {
    const initialCountdown = 3000;
    io.to(lobby.lobbyId).emit("game:countdown", {
        cd: initialCountdown / 1000,
    });

    const scores = {};

    lobby.players.forEach(
        (p) =>
            (scores[[p]] = {
                score: 0,
            })
    );

    gameStates[[lobby.lobbyId]] = {
        qa: [generateQuestion(1)],
        scores,
    };

    setTimeout(() => {
        io.to(lobby.lobbyId).emit("game:start", {
            cd: 60,
            num: 1,
            question: gameStates[lobby.lobbyId].qa[0].question,
            lobbyId: lobby.lobbyId,
        });

        setTimeout(() => {
            console.log("ending..");
            io.to(lobby.lobbyId).emit("game:end", {
                scores: gameStates[lobby.lobbyId].scores,
            });
        }, 20000);
    }, initialCountdown);
}

function getScores(lobbyId) {
    const scores = [];
    for (let p in gameStates[lobbyId].scores) {
        scores.push({
            pla,
        });
    }
    return scores;
}

function getScore(lobbyId, playerName) {
    return gameStates[lobbyId].scores[playerName].score;
}

function incrementScore(lobbyId, playerName) {
    gameStates[lobbyId].scores[playerName].score++;
}

// qa is 0 indexed
function getAnswer(lobbyId, questionNum) {
    return gameStates[lobbyId].qa[questionNum].answer;
}

// get question, if it dosent exist generate one.
function getQuestion(lobbyId, questionNum) {
    if (!gameStates[lobbyId].qa[questionNum]) {
        gameStates[lobbyId].qa.push(generateQuestion(5));
    }
    return gameStates[lobbyId].qa[questionNum].question;
}

export default function registerGameHandler(io, socket) {
    socket.on("game:answer", ({ answer }, cb) => {
        const { player: playerName, lobbyId } = socket;

        const questionNum = getScore(lobbyId, playerName);
        const correctAnswer = getAnswer(lobbyId, questionNum);

        if (correctAnswer === answer) {
            incrementScore(lobbyId, playerName);
            cb(getQuestion(lobbyId, getScore(lobbyId, playerName)));
            io.to(lobbyId).emit("game:scores", {
                scores: gameStates[lobbyId].scores,
            });
            return;
        } else {
            cb(false);
            return;
        }
    });
}
