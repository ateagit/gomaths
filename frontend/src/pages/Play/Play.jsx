import { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useHistory, useParams } from "react-router-dom";
import styles from "./Play.module.css";
import { useSocket } from "../../contexts/Socket";
import ReactModal from "react-modal";
import useGameState from "../../hooks/useGameState";
import ContentBox from "../../components/ContentBox/ContentBox";
import Button from "../../components/Button/Button";
import { useAuth } from "../../contexts/Auth";
import Modal from "../../components/Modal/Modal";
import { useUser } from "../../contexts/User";

const renderCustomAxisTick = ({ x, y, payload }) => {
    return (
        <svg
            x={x - 106 / 2 - 60}
            y={y - 106 / 2}
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            width="106"
            height="106"
            viewBox="0 0 106 106"
            fill="none"
        >
            <circle cx="53" cy="53" r="53" fill="#454ADE" />
            <circle cx="52.5" cy="53.5" r="37.5" fill="white" />
            <foreignObject className={styles.avatarWrapper}>
                <p className={styles.avatar}>{payload.value}</p>
            </foreignObject>
            {/* <path d="M19 89.76H87V21.76H19V89.76Z" fill="url(#pattern0)" />
            <defs>
                <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                >
                    <use href="#image0" transform="scale(0.015625)" />
                </pattern>
                <image
                    id="image0"
                    width="64"
                    height="64"
                    href="data:image/png;base64,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"
                />
            </defs> */}
        </svg>
    );
};

export default function Play({ playerName }) {
    const [{ question, stage, scores, players, timer }, dispatch] =
        useGameState();

    const { user } = useAuth();
    const { avatar, name, userId } = useUser();
    const { level } = useParams();
    const history = useHistory();

    const graphScores = Object.entries(scores).map(([player, val]) => ({
        avatar: players.find((p) => p.id == player)?.avatar,
        player,
        score: val.score,
    }));
    console.log(players);

    console.log(graphScores);

    const socket = useSocket();

    const answerInputRef = useRef();

    useEffect(() => {
        const i = setInterval(() => {
            dispatch({ type: "decrement-timer" });
        }, 1000);

        return () => {
            clearInterval(i);
        };
    }, [dispatch]);

    useEffect(() => {
        socket.on("lobby:newPlayer", ({ player: id, avatar }) => {
            dispatch({ type: "add-player", player: { id, avatar } });
        });

        socket.on("game:countdown", ({ cd }) => {
            dispatch({ type: "countdown", countdown: cd });
        });

        socket.on("game:start", ({ cd, question, lobbyId: lobby }) => {
            dispatch({ type: "game-start", gameLength: cd });
            dispatch({ type: "new-question", question });
        });

        socket.on("game:scores", ({ scores }) => {
            dispatch({ type: "update-scores", scores });
        });

        socket.on("game:end", ({ scores }) => {
            dispatch({ type: "update-scores", scores });
            dispatch({ type: "game-end" });
        });

        return () => {
            socket.removeAllListeners("lobby:newPlayer");
            socket.removeAllListeners("game:countdown");
            socket.removeAllListeners("game:start");
            socket.removeAllListeners("game:scores");
            socket.removeAllListeners("game:end");
        };
    }, [socket, dispatch]);

    const firstRender = useRef(true);

    // run every time stage changes... e.g. a game runs
    useEffect(() => {
        if (firstRender.current) {
            dispatch({ type: "add-player", player: { id: userId, avatar } });

            // this would of been fired from home page...
            // TODO change so you dont need this.
            firstRender.current = false;
            return;
        }
        if (stage === "LOBBY") {
            socket.emit(
                "lobby:join",
                {
                    level: Number.parseInt(level),
                    name: user.displayName,
                    avatar,
                },
                ({ lobby }) => {}
            );
        }
    }, [stage]);

    useEffect(() => {
        const input = answerInputRef.current;
        if (!input) {
            return;
        }
        function onKeyUp(event) {
            console.log(socket.id);

            if (event.key === "Enter") {
                socket.emit(
                    "game:answer",
                    { answer: parseInt(input.value) },
                    (question) => {
                        if (question) {
                            dispatch({ type: "new-question", question });
                        }
                        answerInputRef.current.value = null;
                    }
                );
            }
        }
        input.addEventListener("keyup", onKeyUp);

        return () => {
            input.removeEventListener("keyup", onKeyUp);
        };
    }, [scores, playerName, stage]);

    let heading;

    if (stage === "IN_GAME" || stage === "POST_GAME") {
        heading = (
            <div className={styles.qa}>
                <h1 className={styles.question}>{question}</h1>
                <input
                    ref={answerInputRef}
                    className={styles.answer}
                    type="number"
                />
            </div>
        );
    } else if (stage === "LOBBY") {
        heading = (
            <div className={styles.qa}>
                <h1>Waiting for players...</h1>
            </div>
        );
    } else if (stage === "COUNTDOWN") {
        heading = (
            <div className={styles.qa}>
                <h1>{timer}</h1>
            </div>
        );
    }
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.logo}>GO</div>
                <div className={styles.timer}>
                    {stage === "IN_GAME" && timer}
                </div>
            </header>

            {heading}

            <ResponsiveContainer width="90%" height={500}>
                <BarChart data={graphScores} layout="vertical">
                    <XAxis type="number" />
                    <YAxis
                        dataKey="avatar"
                        tick={renderCustomAxisTick}
                        type="category"
                        width={150}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Bar
                        dataKey="score"
                        barSize={100}
                        fill="#454ADE"
                        radius={[10, 10, 10, 10]}
                    />
                </BarChart>
            </ResponsiveContainer>
            <Modal isOpen={stage === "POST_GAME"}>
                <h1 className={styles.modalHeading}>Scoreboard 🎉</h1>
                {graphScores
                    ?.sort((a, b) => b.score - a.score)
                    .map((s, idx) => (
                        <p className={styles.scoreSummary}>
                            {idx + 1}. {s.player}
                            <span>{s.score} points </span>
                        </p>
                    ))}

                <Button onClick={() => dispatch({ type: "reset" })}>
                    Play again!
                </Button>
                <Button variant="secondary" onClick={() => history.push("/")}>
                    Back to Home!
                </Button>
            </Modal>
        </div>
    );
}
