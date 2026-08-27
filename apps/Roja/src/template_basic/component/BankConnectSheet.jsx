import { StyleSheet, Text, View, Modal, Animated, Dimensions, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'
import DateTimePicker, { DateTimePickerAndroid, } from '@react-native-community/datetimepicker';
import SubmitBtn from './SubmitBtn'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import { apiformatDate } from '../../utill/Utills';
import BaseModal from './BaseModel';
import ConnectBank from '../screens/main/connect_bank_account/ConnectBank';

const BankConnectSheet = ({ visible, onClose, onApply, value, screen }) => {
    const { width, height } = Dimensions.get('window')
    return (
        <BaseModal visible={visible}
            onClose={onClose}
            title="Bank Connect">
            <View style={{height: height * 0.48, backgroundColor:'#fff'}}>
                <ConnectBank screen={'bottom'} />
            </View>


        </BaseModal>
    )

}

export default BankConnectSheet



