import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/Auth";
import ContentBox from "../../components/ContentBox/ContentBox";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import styles from "../Login/Login.module.css";
import { useHistory } from "react-router";

export default function SignUp() {
    const { register, handleSubmit } = useForm();
    const { signUp, setDisplayName } = useAuth();
    const history = useHistory();

    async function onSubmit({ email, password, name }) {
        await signUp(email, password)
            .then((user) => setDisplayName(name))
            .catch((err) => {});

        history.push("/");
    }
    return (
        <div className={styles.wrapper}>
            <ContentBox>
                <div className={styles.headingWrapper}>
                    <h1 className={styles.heading}>Sign up</h1>
                    <Link to="/login" className={styles.link}>
                        Already have an account?
                    </Link>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input {...register("name")} placeholder="Name..." />

                    <Input {...register("email")} placeholder="Email..." />
                    <Input
                        {...register("password")}
                        type="password"
                        placeholder="Password..."
                    />
                    <Button>Continue</Button>
                </form>
            </ContentBox>
        </div>
    );
}
