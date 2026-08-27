import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderIOS from '../../../common_component/HeaderIOS';
import { getOTP } from '../../../constants/Loginapi';
import { ErrorContext } from '../../../context/ErrorContext';
import { themeColors } from '../../Common';
import { fontsFamily } from '../../../constants/fontsFamily';
import { getFontSize } from '../../../constants/Font';
import CommonFunction from '../../../utill/CommonFunction';
import { useIsFocused } from '@react-navigation/native';
import { getFcmToken } from '../../../service/NotificationServices';
import SubmitBtn from '../../component/SubmitBtn';
import useLoginLabels from '../../../hook/Labels/useLoginLabels';



const { width } = Dimensions.get('window');

const Login = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoding] = useState(false)
    const { changeErrmsg } = useContext(ErrorContext);
    const {title,description,btnName,navigateContent,navigateLinkName,label } = useLoginLabels()
    const isFoucused = useIsFocused()



    useEffect(() => {

        setIsLoding(false)
    }, [isFoucused])

    const getDetails = () => {
        setIsLoding(false)
    }

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const cleaned = value.replace(/[^\d]/g, '');
        const len = cleaned.length;
        if (len < 4) return cleaned;
        if (len < 7) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    };

    const handlePhoneChange = (text) => {
        setPhoneNumber(formatPhoneNumber(text));
    };

    const handleSignIn = async () => {
        if (phoneNumber) {
            setIsLoding(true)
            var phone = `+1${CommonFunction.removePattern(phoneNumber)}`

            const payload = {
                device_id: await CommonFunction.getDeviceID(),
                phone: phone,
                device_name: CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress(),
                device_token: await getFcmToken(),
            };

            console.log(payload)

            try {
                await getOTP(navigation, payload)
            } catch (err) {
                setIsLoding(false)
                if (500 < err?.response?.status) {
                    changeErrmsg('error')
                }
            }
        }

    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flexContainer}
            >

                <View style={styles.logoSection}>
                    <HeaderIOS />
                </View>



                <View style={styles.card}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{description}</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{label}</Text>

                        <View style={styles.phoneInputWrapper}>
                            <View style={styles.flagContainer}>
                                <Text style={styles.flagIcon}>🇺🇸</Text>
                                <Text style={styles.countryCode}>+1</Text>
                                <View style={styles.divider} />
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="(212) 555-5555"
                                placeholderTextColor="#BBB"
                                keyboardType="phone-pad"
                                maxLength={14}
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
                                editable={!isLoading}
                            />
                        </View>
                    </View>

                    <SubmitBtn
                        text={isLoading ? 'Loading ...' : btnName}
                        disabled={isLoading}
                        disableGradient={isLoading}
                        submit={handleSignIn}
                    />

                  
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{navigateContent}</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            disabled={isLoading}
                        >
                            <Text style={styles.signUpLink}> {navigateLinkName}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.backgroudColor
    },
    flexContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoSection: {
        marginBottom: 30,
    },
    logo: {
        width: 180,
        height: 80,
    },
    card: {
        width: width * 0.9,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 25,
        shadowColor: '#4A2A63',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: getFontSize(24),
        fontWeight: '800',
        color: '#333',
        fontFamily: fontsFamily.regularFont,
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: getFontSize(14),
        color: '#888',
        fontFamily: fontsFamily.regularFont,
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 25,
    },
    label: {
        fontSize: getFontSize(13),
        color: themeColors?.textinputlabelColor,
        fontWeight: '700',
        fontFamily: fontsFamily.regularFont,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EEE',
        height: 60,
    },
    flagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
    },
    flagIcon: {
        fontSize: 20,
        marginRight: 5,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
    },
    divider: {
        width: 1,
        height: 25,
        backgroundColor: '#DDD',
        marginLeft: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 10,
        fontSize: 17,
        color: '#333',
        fontWeight: '500',
    },
    signInButton: {
        height: 60,
        backgroundColor: themeColors.primarColor,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4A2A63',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        opacity: 0.6,
    },
    signInText: {
        color: '#FFF',
        fontSize: getFontSize(18),
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    footerText: {
        color: '#777',
        fontSize: 14,
    },
    signUpLink: {
        color: themeColors?.primarColor,
        fontSize: getFontSize(14),
        fontWeight: '800',
    },
});

export default Login;