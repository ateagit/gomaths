import styles from "./Button.module.css";
import classnames from "classnames";

export default function Button({ children, className, onClick, variant }) {
    return (
        <button
            className={classnames(
                { [styles.secondary]: variant === "secondary" },
                styles.button,
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
