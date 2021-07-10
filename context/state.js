import { createContext, useContext, useState, useEffect } from 'react';
import { firebase } from "../util/firebase.js";

const AppContext = createContext();

const AppStateWrapper = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState({});

    useEffect(() => {
        // Listen authenticated user
        const unsubscriber = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const { uid, email } = firebaseUser;
                fetch(`/api/users/${uid}`)
                    .then((res) => res.json())
                    .then((result) => setUser(result))
                    .catch((error) => console.log(error))
            } else {
                setUser(null)
                console.log('signed out');
            }
        })
        return () => unsubscriber()
    }, [])

    return (
        <AppContext.Provider value={{ theme, user, setTheme, setUser }} >
            {children}
        </AppContext.Provider>
    );
}

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppStateWrapper, useAppContext };