import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

export default function ProtectedRoute({ children, ...rest }) {
    const { user } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) =>
                user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
}
