import { View, StatusBar } from "react-native";
import React, { useContext } from "react";
import { useSelector } from "react-redux";


export default function Statusbar() {
    const { themedata } = useSelector((state) => state.appcolor);


    return (
        <StatusBar backgroundColor={themedata?.theme?.statusbar} barStyle={themedata?.theme?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />


    )
}