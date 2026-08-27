import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import styles1 from './Offers.styles';
import CommonIcon from '../../../../component/Commonicons';

const FloatingSearchButton = memo(({ themeColors, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles1.floatingButton, { backgroundColor: themeColors.bgbtn }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <CommonIcon family={'FontAwesome'} name={'search'} size={20} color={themeColors.btn_text_color} />
        </TouchableOpacity>
    );
});

export default FloatingSearchButton;
