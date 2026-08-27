import React, { memo } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import CommonIcon from '../../../../component/Commonicons';
import styles1 from './Offers.styles';

const SearchBar = memo(({ themeColors, appstyle, value, onChangeText, onClear }) => {
    return (
        <View style={[styles1.searchContainer, { backgroundColor: themeColors?.inputprimary }]}>
            <View style={{ justifyContent: 'center' }}>
                <CommonIcon family={'FontAwesome'} name={'search'} size={20} color={themeColors.inputsecondary} />
            </View>
            <View style={{ flex: 1, marginStart: 10 }}>
                <TextInput
                    onChangeText={onChangeText}
                    value={value}
                    style={[appstyle.textInputColor, { color: themeColors?.inputsecondary, paddingVertical: 0 }]}
                    selectionColor={themeColors?.bgbtn}
                    placeholderTextColor={themeColors.vectorIconsColor}
                    placeholder="Search offers..."
                    autoFocus
                />
            </View>
            {value ? (
                <Pressable onPress={onClear} style={{ justifyContent: 'center' }}>
                    <CommonIcon family={'FontAwesome'} name={'close'} size={20} color={themeColors.inputsecondary} />
                </Pressable>
            ) : null}
        </View>
    );
});

export default SearchBar;
