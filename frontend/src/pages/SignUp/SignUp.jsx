import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/Auth";

export default function SignUp() {
    const { register, handleSubmit } = useForm();
    const { signUp } = useAuth();

    function onSubmit({ email, password }) {
        signUp(email, password).catch((err) => {});
    }
    return (
        <div>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("email")} />
                <input {...register("password")} type="password" />
                <button>Sign up</button>
            </form>
        </div>
    );
}
