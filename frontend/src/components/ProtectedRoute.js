import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

export default function ProtectedRoute({ children, ...rest }) {
    const { user, loading } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) =>
                loading ? (
                    <p>Loading...</p>
                ) : user ? (
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
