import { useState } from "react";

import Play from "./pages/Play/Play";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SocketProvider from "./contexts/Socket";

function App() {
    const [playerName, setPlayerName] = useState();
    return (
        <SocketProvider>
            <Router>
                <Switch>
                    <Route path="/play">
                        <Play playerName={playerName} />
                    </Route>
                    <Route path="/">
                        <Home setPlayerName={setPlayerName} />
                    </Route>
                </Switch>
            </Router>
        </SocketProvider>
    );
}

export default App;
