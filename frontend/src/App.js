import { useState } from "react";
import "./App.css";
import Play from "./pages/Play/Play";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SocketProvider from "./contexts/Socket";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

import AuthProvider from "./contexts/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProvider from "./contexts/User";

function App() {
    const [playerName, setPlayerName] = useState();
    return (
        <UserProvider>
            <AuthProvider>
                <SocketProvider>
                    <Router>
                        <Switch>
                            <ProtectedRoute path="/play/:level">
                                <Play playerName={playerName} />
                            </ProtectedRoute>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/signup">
                                <SignUp />
                            </Route>
                            <ProtectedRoute path="/">
                                <Home setPlayerName={setPlayerName} />
                            </ProtectedRoute>
                        </Switch>
                    </Router>
                </SocketProvider>
            </AuthProvider>
        </UserProvider>
    );
}

export default App;
