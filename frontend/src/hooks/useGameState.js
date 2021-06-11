import { useReducer } from "react";

const initialState = {
    question: undefined,
    stage: "LOBBY",
    scores: {},
    players: [],
    timer: undefined,
};

function reducer(state, action) {
    switch (action.type) {
        case "reset":
            return {
                ...initialState,
            };
        case "add-player":
            return {
                ...state,
                players: state.players.concat(action.player),
                scores: {
                    ...state.scores,
                    [action.player.id]: 0,
                },
            };
        case "remove-player": {
            const { [action.player]: removedPlayer, filteredScores } =
                state.scores;
            return {
                ...state,
                players: state.players.filter((p) => p.id !== action.player),
                scores: filteredScores,
            };
        }
        case "decrement-timer": {
            return {
                ...state,
                timer: state.timer - 1,
            };
        }
        case "countdown": {
            return {
                ...state,
                stage: "COUNTDOWN",
                timer: action.countdown,
            };
        }
        case "game-start": {
            return {
                ...state,
                stage: "IN_GAME",
                timer: action.gameLength,
            };
        }
        case "update-scores": {
            return {
                ...state,
                scores: { ...action.scores },
            };
        }
        case "new-question": {
            return {
                ...state,
                question: action.question,
            };
        }
        case "game-end": {
            return {
                ...state,
                stage: "POST_GAME",
            };
        }
        default:
            throw new Error("Invalid reducer action");
    }
}

export default function useGameState() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return [state, dispatch];
}
