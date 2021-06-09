import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../contexts/Auth";

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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("email")} />
                <input {...register("password")} type="password" />
                {errors.form && <p>{errors.form.message}</p>}
                <button>Login</button>
            </form>
        </div>
    );
}
