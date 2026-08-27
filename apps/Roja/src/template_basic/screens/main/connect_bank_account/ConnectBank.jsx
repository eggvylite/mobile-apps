import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity,
    ScrollView,

    StatusBar,
    Animated,
    Dimensions,
    Image
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import SubmitBtn from '../../../component/SubmitBtn';
import { FLOW_STATE } from '../../../../hook/workFlowhook';
import useFeatureFlow from '../../../../hook/useFeatureGate';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import useConnectBank from '../../../../hook/useConnectBank';
import BankConnectSheet from '../../../component/BankConnectSheet';
import { useConnectBankWorkFlow } from '../../../../hook/useConnectBankWorkFlow';


const { width } = Dimensions.get('window');

export default function ConnectBank(props) {
    const { themeColors, loading, loaderLabel, featureState, isBanSheet, isBankSheetClose, connectBankSheetRef, subscriptionSheetRef, handleConnectPress, handleTriggerConnectBank, handleConnectBankConfirm, enableMenu } = useConnectBank(props);
    const navigation = useNavigation();
    const [bottomActiveTab, setBottomActiveTab] = useState('budget');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const screen = props?.screen || ''
    const {
        workflow,
        showBank,
        setShowBank,
    } = useConnectBankWorkFlow();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);




    const handleConnectInstantly = () => {
        alert('Connecting to your bank...');
    };

    const handleAddManually = () => {
        handleTriggerConnectBank()
    };

    return (
        <SafeAreaView style={[styles.safeArea, screen === 'bottom' && { backgroundColor: '#fff' }]}>

            {
                !screen &&
                <TopBar
                    title="Connect Accounts"
                    showBack={true}
                    onBackPress={() => navigation.goBack()}
                />
            }


            <Animated.ScrollView
                style={[styles.scrollView, { opacity: fadeAnim }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, screen && {

                    margin: screen !== 'bottom' ? 20 : 0,
                    borderRadius: screen !== 'bottom' ? 14 : 0
                }]}
            >
                {/* Header Image */}
                <View style={{ alignItems: 'center' }}>
                    <View style={[styles.imageContainer]}>
                        <Image
                            source={require('../../../../../assets/images/connect-bank.png')}
                            style={styles.mainImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Connect your bank account</Text>
                    <Text style={styles.subTitle}>
                        Instantly access updates, simplify budgeting, and gain spending insights.
                    </Text>
                </View>

                {/* Connect Instantly Button */}

                {
                    showBank && <SubmitBtn
                        text="Connect Instantly" submit={() => {
                            handleConnectPress()
                        }} />
                }


                {
                    featureState !== FLOW_STATE.HIDDEN && screen !== 'bottom' &&
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
                }




                {
                    !screen &&
                    <View>
                        <View style={styles.securitySection}>
                            <View style={styles.securityItem}>
                                <View style={styles.securityIconContainer}>
                                    <Feather name="lock" size={16} color="#10B981" />
                                </View>
                                <Text style={styles.securityText}>Secure connection</Text>
                            </View>
                            <View style={styles.securityItem}>
                                <View style={styles.securityIconContainer}>
                                    <Feather name="lock" size={16} color="#10B981" />
                                </View>
                                <Text style={styles.securityText}> Bank-level encryption</Text>
                            </View>
                            <View style={styles.securityItem}>
                                <View style={[styles.securityIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                    <Feather name="x-circle" size={16} color="#EF4444" />
                                </View>
                                <Text style={styles.securityText}>*No passwords stored</Text>
                            </View>
                        </View>
                        <View style={styles.bottomPadding} />
                    </View>


                }
                <BankConnectSheet visible={isBanSheet} onClose={isBankSheetClose} />


            </Animated.ScrollView>


        </SafeAreaView>
    );


}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    mainImage: {
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        width: 160,
        height: 160,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    connectTitle: {
        fontWeight: '600',
        fontSize: 18,
        color: '#1B1B1B',
        textAlign: 'center',
        marginBottom: 8
    },
    connectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5A21F1',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 42
    },
    btnIcon: {
        marginRight: 8
    },
    connectBtnText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#FFFFFF'
    },
    connectSubtitle: {
        fontWeight: '500',
        fontSize: 13,
        color: '#646464',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20
    },
    connectBankCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingVertical: 24,
        paddingHorizontal: 20,
        marginVertical: 12
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },
    // Header Image
    headerImageContainer: {
        width: width * 0.6,
        height: width * 0.5,
        marginBottom: 24,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    // Title Section
    titleSection: {

        marginBottom: 32,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    // Connect Button
    connectButton: {
        width: '100%',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 20,
    },
    connectButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    connectButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    // Divider
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
        fontSize: 14,
        color: '#94A3B8',
        paddingHorizontal: 16,
        fontWeight: '500',
    },
    // Manual Button
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
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },
    // Security Section
    securitySection: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        gap: 8,
    },
    securityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    securityIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    securityText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    bottomPadding: {
        height: 20,
    },
});