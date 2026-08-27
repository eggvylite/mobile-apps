// GlobalBottomSheet.js
import React, { createContext, useRef, useContext, useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const BottomSheetContext = createContext();
export const useBottomSheet = () => useContext(BottomSheetContext);

export const GlobalBottomSheetProvider = ({ children }) => {
    const refRBSheet = useRef();
    const [RenderComponent, setRenderComponent] = useState(null);
    const [height, setHeight] = useState(300);
    const [customStyles, setCustomStyles] = useState({});
    const [key, setKey] = useState(Date.now());
       const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme

    const openSheet = (Component, sheetHeight = 300, styles = {}, props = {}) => {
        setKey(Date.now());
        setRenderComponent(() => () => <Component {...props} />);
        setHeight(sheetHeight);
        setCustomStyles(styles);
        refRBSheet.current?.open();
    };

    const closeSheet = () => refRBSheet.current?.close();

    return (
        <BottomSheetContext.Provider value={{ openSheet, closeSheet }}>
            {children}

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={height}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                        backgroundColor:themeColors?.cardbg
                        // backgroundColor: customStyles.backgroundColor || '#fff',
                        // ...customStyles?.container,
                    },
                    draggableIcon: {
                        backgroundColor: customStyles.draggableIconColor || '#000',
                        ...customStyles?.draggableIcon,
                    },
                }}
            >
                <View key={key} style={{ flex: 1, }}>
                    {RenderComponent ? <RenderComponent /> : null}
                </View>
            </RBSheet>
        </BottomSheetContext.Provider>
    );
};
