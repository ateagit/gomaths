import { createContext, useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";

const AuthContext = createContext();

const firebaseConfig = {
    apiKey: "AIzaSyAMAOY8w_EaBzn2m95rVdp-lfojnY547CQ",
    authDomain: "go-maths-dev.firebaseapp.com",
    projectId: "go-maths-dev",
    storageBucket: "go-maths-dev.appspot.com",
    messagingSenderId: "137949778276",
    appId: "1:137949778276:web:c0142b22f90971f880ea71",
    measurementId: "G-0LBRYL055X",
};

firebase.initializeApp(firebaseConfig);

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    function setDisplayName(name) {
        return firebase.auth().currentUser.updateProfile({
            displayName: name,
        });
    }

    function signUp(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    function signIn(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    function signOut() {
        return firebase.auth().signOut();
    }

    function getToken() {
        return firebase.auth().currentUser.getIdToken(true);
    }

    useEffect(() => {
        const unsub = firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(user);
            } else {
                // User is signed out
                setUser(undefined);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signUp,
                signOut,
                getToken,
                loading,
                setDisplayName,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
