import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../contexts/Auth";
import ContentBox from "../../components/ContentBox/ContentBox";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

export default function Login() {
    const history = useHistory();
    let location = useLocation();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();
    const { signIn } = useAuth();

    async function onSubmit({ email, password }) {
        signIn(email, password)
            .then(() => {
                let { from } = location.state || { from: { pathname: "/" } };

                history.replace(from);
            })
            .catch((err) => {
                setError("form", {
                    type: "manual",
                    message: "User details incorrect",
                });
            });
    }
    return (
        <div className={styles.wrapper}>
            <ContentBox>
                <div className={styles.headingWrapper}>
                    <h1 className={styles.heading}>Login</h1>
                    <Link to="/signup" className={styles.link}>
                        Create a new account
                    </Link>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input {...register("email")} placeholder="Email..." />
                    <Input
                        {...register("password")}
                        type="password"
                        placeholder="Password..."
                    />
                    {errors.form && <p>{errors.form.message}</p>}
                    <Button>Continue</Button>
                </form>
            </ContentBox>
        </div>
    );
}
