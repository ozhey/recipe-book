import { createContext, useContext, useState, useEffect } from 'react';
import { fireAuth } from "../util/firebase.js";

const AppContext = createContext();

const AppStateWrapper = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState({});

    useEffect(() => {
        fireAuth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('You are logged in!');
                setUser(user);
            } else {
                console.log('No user is logged in.');
                setUser(null);
            }
        });
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