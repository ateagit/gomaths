import styles from "./Input.module.css";
import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
    return <input ref={ref} {...props} className={styles.input} />;
});

export default Input;
