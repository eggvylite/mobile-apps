import React, { createContext, useState, useEffect } from "react";
export const BottomContext = createContext();

export const BottomProvider = ({ children }) => {
    const [isMenu, setIsmenu] = useState(true)

    useEffect(() => {
        enableMenu()
    }, [])

    const enableMenu = async () => {
        setIsmenu(true)
    };

    const disableMenu=async()=>{
        setIsmenu(false)
    }
    return (
        <BottomContext.Provider value={{ isMenu, enableMenu,disableMenu }}>
            {children}
        </BottomContext.Provider>
    );
};