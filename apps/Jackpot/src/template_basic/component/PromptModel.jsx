import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';
import SubmitBtn from './SubmitBtn';
import CommonIcon from '../../common_component/Commonicons';
import { themeColors } from '../Common';

const PromptModel = ({ visible, onClose, content, onSubmit, loading, head, subhead }) => {


    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {head}
                        </Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Icon name="x" size={22} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Text style={[styles.modalTitle, { fontSize: getFontSize(15), fontWeight: '600', }]}>
                            {subhead}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={[styles.modalTitle, { fontSize: getFontSize(14),color:'rgba(112, 114, 116, 0.87)' ,lineHeight:22,fontFamily:fontsFamily.regularFont}]}>
                            {content}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 40, marginBottom: 10 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                borderRadius: 14,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: themeColors?.bgbtn,
                                marginEnd: 5
                            }}
                            onPress={() => {
                                onClose()
                            }}
                            activeOpacity={0.7}
                        >
                           <Text style={[styles.cancelButtonText, { color: themeColors.bgbtn }]}>No</Text>
                        </TouchableOpacity>
                        <View style={{marginStart:10}}>
                            {
                                loading ? <SubmitBtn style={{ height: 50,width:180 }} text={'Loading...'} submit={()=>{

                            }}  />: <SubmitBtn style={{ height: 50,width:180 }} text={'Yes'} submit={()=>{
                                onSubmit()
                                onClose()
                            }}  />
                            }

                        </View>

                    </View>


                </View>




            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.semiboldFont,

        color: '#0F172A',
    },
    cancelButtonText:{
        fontFamily:fontsFamily.semiboldFont,
        color:'#0000'
    }

});

export default PromptModel;