import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, Animated } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../constants/Font';


const SortSheet = ({
    sheetRef, isOpen, sort, sortval, setSortval, themeColors, appstyle, textColor, closeSheet,
}) => {
    const sheetFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen === 'open') {
            sheetRef?.current?.open();
            Animated.timing(sheetFade, { toValue: 1, duration: 280, useNativeDriver: true }).start();
        } else {
            sheetRef?.current?.close();
            sheetFade.setValue(0);
        }
    }, [isOpen]);

    const dismiss = () => {
        closeSheet();
        sheetRef.current.close();
    };

    return (
        <RBSheet
            ref={sheetRef}
            closeOnDragDown={false}
            closeOnPressMask={false}
            animationType="fade"
            openDuration={280}
            closeDuration={220}
            height={sort?.length > 3 ? 340 : 240}
            customStyles={{ draggableIcon: { backgroundColor: '#000' }, container: { backgroundColor: textColor } }}
        >
            <Animated.View style={[appstyle.primaryBackground, {
                opacity: sheetFade,
                transform: [{ translateY: sheetFade.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            }]}>
                <TouchableOpacity
                    style={{ position: 'absolute', end: 10, zIndex: 1, backgroundColor: themeColors.bgbtn, padding: 3, borderRadius: 15, top: 10 }}
                    onPress={dismiss}>
                    <Ionicons name="close" size={18} color={themeColors.btn_text_color} />
                </TouchableOpacity>

                <ScrollView style={{ padding: 15 }}>
                    {sort.map((value, key) => (
                        <Pressable
                            key={key}
                            style={{ marginTop: 10, flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 10, borderColor: themeColors?.iconbg }}
                            onPress={() => { setSortval(value.value); dismiss(); }}>
                            <View style={{
                                backgroundColor: value.value === sortval ? themeColors?.bgbtn : 'transparent',
                                borderWidth: value.value === sortval ? 0 : 1,
                                borderColor: themeColors?.card_secondary_color,
                                height: 15, width: 15, borderRadius: 50, top: 3,
                            }} />
                            <View style={{ marginStart: 10, justifyContent: 'center' }}>
                                <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16) }}>
                                    {value.label}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>

                <View style={{ alignItems: 'flex-end', padding: 20, marginBottom: 20 }}>
                    <TouchableOpacity
                        style={[appstyle.filterapplycancelBtn, { backgroundColor: themeColors?.white, flex: 0, borderColor: themeColors.bgbtn, borderWidth: 1, alignItems: 'center', padding: 8, paddingStart: 15, paddingEnd: 15, end: 20 }]}
                        onPress={() => { setSortval(''); dismiss(); }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name="refresh" size={20} color={themeColors?.bgbtn} />
                            <Text style={[appstyle.filterapplycancelBtnTxt, { color: themeColors?.bgbtn, marginStart: 10 }]}>Reset</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </RBSheet>
    );
};

export default SortSheet;
