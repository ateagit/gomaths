import styles from "./Button.module.css";
import classnames from "classnames";

export default function Button({ children, className, onClick }) {
    return (
        <button
            className={classnames(styles.button, className)}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
