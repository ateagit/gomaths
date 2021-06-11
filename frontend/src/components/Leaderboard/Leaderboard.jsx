import React, { useEffect, useState } from "react";
import styles from "./Leaderboard.module.css";
import classnames from "classnames";

export default function Leaderboard() {
    const [period, setPeriod] = useState("daily");
    const [leaderboard, setLeaderBoard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        async function getLeaderboards() {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:3000/leaderboard/${period}`
                );
                setLeaderBoard(await res.json());
                setLoading(false);
            } catch {
                setLoading(false);
                setError("Error retrieving leaderboard...");
            }
        }
        getLeaderboards();
    }, [period]);
    function handlePeriodChange(e) {
        setPeriod(e.target.value);
    }
    return (
        <>
            <h1 className={styles.modalHeading}>Leaderboards 🎉</h1>
            <div className={styles.timeCategories}>
                <label htmlFor={"daily"} className={styles.label}>
                    <input
                        className={styles.input}
                        type="radio"
                        id={"daily"}
                        value="daily"
                        name="category"
                        checked={period === "daily"}
                        onChange={handlePeriodChange}
                    />
                    <span className={styles.levelText}>Daily</span>
                </label>
                <label htmlFor={"weekly"} className={styles.label}>
                    <input
                        className={styles.input}
                        type="radio"
                        id={"weekly"}
                        value="weekly"
                        name="category"
                        checked={period === "weekly"}
                        onChange={handlePeriodChange}
                    />
                    <span className={styles.levelText}>Monthly</span>
                </label>
                <label htmlFor={"All Time"} className={styles.label}>
                    <input
                        className={styles.input}
                        type="radio"
                        value="alltime"
                        id={"All Time"}
                        name="category"
                        checked={period === "alltime"}
                        onChange={handlePeriodChange}
                    />
                    <span className={styles.levelText}>All Time</span>
                </label>
            </div>
            <div>
                {loading ? (
                    <h2>Loading...</h2>
                ) : error ? (
                    <h2> {error} </h2>
                ) : !leaderboard.length ? (
                    <h2> Noones on the leaderboard! </h2>
                ) : (
                    leaderboard.map((p, idx) => (
                        <h3
                            className={classnames({
                                [styles.first]: idx === 0,
                                [styles.second]: idx === 1,
                                [styles.third]: idx === 2,
                                [styles.leaderboardEntry]: true,
                            })}
                        >
                            {idx + 1}. {p.name} <span>{p.points} points</span>
                        </h3>
                    ))
                )}
            </div>
        </>
    );
}
