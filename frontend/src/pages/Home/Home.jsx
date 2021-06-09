import styles from "./Home.module.css";
import { useHistory } from "react-router-dom";

import { Fragment, useRef, useState, useEffect } from "react";
import { useDrag } from "react-use-gesture";
import { useForm } from "react-hook-form";
import { useTransition, animated } from "@react-spring/web";
import { config } from "@react-spring/web";
import { io } from "socket.io-client";
import { useSocket } from "../../contexts/Socket";
import { useAuth } from "../../contexts/Auth";

const levels = [
    {
        level: 1,
        name: "Basic 😆",
    },
    {
        level: 2,
        name: "Double Digits 😀",
    },
    {
        level: 3,
        name: "Subtraction 🤣",
    },
    {
        level: 4,
        name: "Multiplication 😛",
    },
    {
        level: 5,
        name: "Assortment 😜",
    },
];

const avatars = ["😻", "🐶", "🐺", "🐵"];

export default function LevelsCarousel({ setPlayerName }) {
    const levelsRef = useRef();
    const popperRef = useRef();
    const avatarBtnRef = useRef();
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    let history = useHistory();

    const transitions = useTransition(open, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.stiff,
    });

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            level: "1",
            avatar: "😻",
        },
    });

    const socket = useSocket();

    const watchAvatar = watch("avatar");

    const bind = useDrag((state) => {
        state.event.preventDefault();
        levelsRef.current.scrollLeft -= state.delta[0];
    });

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (
                popperRef.current &&
                !popperRef.current.contains(event.target) &&
                open &&
                event.target !== avatarBtnRef.current
            ) {
                setOpen(false);
            }
        }
        if (open) {
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    function onSubmit({ level, avatar, name }) {
        history.push("/play");

        socket.emit("lobby:join", { level, name }, ({ lobby }) => {});
    }

    console.log(user);
    // Bind it to a component
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.appName}>GO Maths</h1>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <h1>Welcome {user.displayName || user.email}</h1>
                <h1 className={styles.formHeading}>
                    To get started, please choose an avatar, enter your name and
                    a maths level
                </h1>

                <div className={styles.avatarBox}>
                    <div className={styles.relativeWrapper}>
                        <div
                            ref={avatarBtnRef}
                            className={styles.avatar}
                            onClick={() => setOpen(!open)}
                        >
                            {watchAvatar}
                        </div>
                        {/* {open && ( */}
                        {transitions((springStyles, item) => {
                            return (
                                item && (
                                    <animated.div
                                        ref={popperRef}
                                        style={springStyles}
                                        className={styles.chooseAvatar}
                                    >
                                        {avatars.map((a) => (
                                            <Fragment key={a}>
                                                <label htmlFor={a}>
                                                    <input
                                                        id={a}
                                                        className={styles.input}
                                                        type="radio"
                                                        {...register("avatar")}
                                                        value={a}
                                                    />
                                                    <span
                                                        className={
                                                            styles.avatarIcon
                                                        }
                                                    >
                                                        {a}
                                                    </span>
                                                </label>
                                            </Fragment>
                                        ))}
                                    </animated.div>
                                )
                            );
                        })}
                    </div>
                </div>
                {/* <input
                    className={styles.name}
                    type="text"
                    {...register("name", { required: true, maxLength: 20 })}
                    placeholder="Name..."
                />
                {errors.name && (
                    <span className={styles.error}>
                        The name is required and must be less than 20 characters
                    </span>
                )} */}

                <div className={styles.levelBox} ref={levelsRef} {...bind()}>
                    {levels.map((l) => (
                        <Fragment key={l.level}>
                            <label htmlFor={l.level} className={styles.label}>
                                <input
                                    className={styles.input}
                                    type="radio"
                                    {...register("level")}
                                    id={l.level}
                                    value={l.level}
                                />
                                <span className={styles.levelText}>
                                    Level {l.level}: {l.name}
                                </span>
                            </label>
                        </Fragment>
                    ))}
                </div>

                <input
                    className={styles.submitBtn}
                    type="submit"
                    value="Start Game"
                />
            </form>
        </div>
    );
}
