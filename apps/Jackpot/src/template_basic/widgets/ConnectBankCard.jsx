import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, Image, } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import useConnectBank from '../../hook/useConnectBank';
import BankConnectSheet from '../component/BankConnectSheet';
import { FLOW_STATE } from '../../hook/workFlowhook';
import SubmitBtn from '../component/SubmitBtn';
import { useConnectBankWorkFlow } from '../../hook/useConnectBankWorkFlow';
import { useSelector } from 'react-redux';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';

const { width } = Dimensions.get('window');

export default function ConnectBankCard({ onConnectBankPress, screen }) {
    const navigation = useNavigation();
    const { bankConnect_Component } = useSelector((state) => state.labels || {});
    const { loading, loaderLabel, featureState, isBanSheet, isBankSheetClose, handleTriggerConnectBank } =
        useConnectBank({ navigation });
    const {
        workflow,
        showBank,
        setShowBank,
    } = useConnectBankWorkFlow();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleAddManually = () => {
        handleTriggerConnectBank();
    };

    return (
        <View style={[styles.safeArea, { backgroundColor: '#fff', margin: 10, padding: 20, borderRadius: 20 }]}>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../../assets/images/connect-bank.png')}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />
                </View>
            </View>


            <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>{bankConnect_Component?.labels?.[0]?.message}</Text>
                <Text style={styles.subTitle}>
                    {bankConnect_Component?.labels?.[1]?.message}
                </Text>
            </View>
            {
 
                <View>
                    {
                        showBank && <SubmitBtn style={screen && { width: '60%', start: '20%' }} iconName={'check-circle'} text={bankConnect_Component?.labels?.[2]?.message} submit={onConnectBankPress} loading={loading} loaderLabel={loaderLabel} />
                    }

                </View>

            }


            {featureState !== FLOW_STATE.HIDDEN && !screen && (
                <View>
                    {
                        showBank && <View style={[styles.dividerContainer, { marginTop: 20 }]}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>
                    }


                    <TouchableOpacity
                        style={styles.manualButton}
                        onPress={handleAddManually}
                        activeOpacity={0.7}
                    >
                        <View style={styles.manualButtonContent}>
                            <View style={styles.manualIconContainer}>
                                <Feather name="user" size={20} color="#3c3cd6" />
                            </View>
                            <Text style={styles.manualButtonText}>Add Account Manually</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>
            )}

            <BankConnectSheet visible={isBanSheet} onClose={isBankSheetClose} />
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        width: 160,
        height: 160,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleSection: {
        marginBottom: 32,
    },
    mainTitle: {
        fontSize: getFontSize(22),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: getFontSize(15),
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        fontSize: getFontSize(14),
        color: '#94A3B8',
        paddingHorizontal: 16,
        fontWeight: '500',
    },
    manualButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 24,
    },
    manualButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    manualIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    manualButtonText: {
        fontSize: getFontSize(15),
        fontWeight: '600',
        color: '#0F172A',
    },
});
