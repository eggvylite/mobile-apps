import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { themeColors } from '../Common';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import Icon from 'react-native-vector-icons/Feather';

export default function SubmitBtn(props) {
    const {
        submit,
        text,
        iconName,
        style,
        textStyle,
        disabled = false,
        prefix=false,
        gradientColors,
        disableGradient = false,
        order
    } = props;

    const content = (
        <>
            <View>
                <Text style={[styles.submitButtonText, textStyle, disabled && { color: '#aca3a3' }]}>{text}</Text>
            </View>
            {iconName && (
                <View style={{ marginStart: 10 }}>
                    <Icon name={iconName} size={18} color="#FFFFFF" />
                </View>
            )}
        </>
    );

    const prefixIcon_content = (
        <>
            {iconName && (
                <View >
                    <Icon name={iconName} size={text === 'Link' ? 14 : 16} color="#FFFFFF" />
                </View>
            )}
            <View style={{ marginStart: 10 }}>
                <Text style={[styles.submitButtonText, textStyle, disabled && { color: '#aca3a3' }]}>{text}</Text>
            </View>

        </>
    );

    const containerStyle = [
        styles.container,
        style
    ];

    return (
        <TouchableOpacity
            onPress={disabled ? undefined : submit}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {disableGradient ? (
                <View style={[containerStyle, { backgroundColor: themeColors?.buttonLightbackColor }]}>
                    {content}
                </View>
            ) : (
                <LinearGradient
                    colors={gradientColors || themeColors?.gradientColor}
                    style={containerStyle}
                >
                    {
                        text === 'Add' || text === 'Link' || text === 'Create Tag' || text ==='Unlink' || text === 'Connect Now' || prefix ? prefixIcon_content : content

                    }

                </LinearGradient>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 56,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {

    },
    submitButtonText: {
        color: '#fff',
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
    },
})