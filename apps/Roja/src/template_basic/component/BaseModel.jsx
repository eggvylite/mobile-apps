// components/BaseModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { themeColors } from '../Common';

const BaseModal = ({ visible, onClose, title, children,type,style }) => {
        const checkbgColor = () => {
            if (type === 'Credit') {
                return '#E5FFE4'
            } else {
                return '#FFE3E3'
            }
        }

        const textColor=()=>{
              if (type === 'Credit') {
                return '#10B981'
            } else {
                return themeColors?.negativeColor
            }
        }


    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={[styles.modalOverlay]}
                activeOpacity={1}
                onPress={onClose}
            >
                {/* stop press-through from closing when tapping inside the box */}
                <TouchableOpacity activeOpacity={1} style={[styles.filterModal]}>
                    <View style={styles.filterHeader}>
                        <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={styles.filterTitle}>{title}</Text>
                        {
                            type &&
                              <View style={{marginStart:10, backgroundColor:checkbgColor(),padding:5,paddingStart:10,paddingEnd:10,borderRadius:15}}>
                          <Text style={[styles.filterTitle,{fontSize:14,color:textColor()}]}>{type}</Text>
                          </View>
                        }
                      
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* this is where different content goes each time */}
                    <View style={styles.filterOptions}>
                        {children}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    filterModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
    },
    filterOptions: {
        gap: 4,
    },
});

export default BaseModal;