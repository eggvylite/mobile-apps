import React, { useContext } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { fontsFamily } from '../../constants/fontsFamily';
import getStyles from '../styles';
import { useSelector } from 'react-redux';


const LabelledInput = (props) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles } = getStyles(themeColors)
    if (props.prefilLabel) {

        return (
            <View>
                <Text style={styles.label}>{props.label}</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={{
                        position: 'relative', width: '20%', textAlign: 'center',
                        fontFamily: fontsFamily.mediumFont,
                        fontSize: 18, paddingTop: 14, backgroundColor: '#fff', elevation: 1, borderWidth: 0, borderColor: '#2680EB', color: "#000", borderTopLeftRadius: 14, borderBottomLeftRadius: 14
                    }}>{props.prefilLabel}</Text>
                    <TextInput
                        onChangeText={props.onChangeText}
                        multiline={props.multiline ? props.multiline : false}
                        numberOfLines={props.multiline ? 4 : 1}
                        secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
                        keyboardType={props.keyboardType ? props.keyboardType : 'default'}
                        style={{ ...styles.textInput, ...props.inputStyle, width: '80%', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} />
                </View>
                {props.errorMessage && <Text style={{ color: 'red', fontStyle: 'italic' }}>{props.errorMessage}</Text>}
            </View>
        )
    } else {
        return (
            <View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.label}>{props.label}</Text>
                    {props.required && <Text style={{ ...styles.label, color: "red" }}> *</Text>}

                </View>

                {props.keyboardType != 'phone-pad' && <TextInput
                    multiline={props.multiline ? props.multiline : false}
                    numberOfLines={props.multiline ? 4 : 1}
                    onChangeText={props.onChangeText}
                    editable={props.edit}
                    placeholder={props.placeholder}
                    placeholderTextColor={'#000'}
                    secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
                    keyboardType={props.keyboardType ? props.keyboardType : 'default'}
                    value={props.value}
                    style={[styles.textInput, props.inputStyle, { backgroundColor: props.edit == false ? '#ccdff0' : '#f3f3f3', }]}
                />}
                {props.errorMessage && <Text style={{ color: 'red', fontStyle: 'italic' }}>{props.errorMessage}</Text>}
            </View>
        )
    }

}



export default LabelledInput
