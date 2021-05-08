import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const AppStateWrapper = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState({});

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