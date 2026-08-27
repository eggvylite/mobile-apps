import React, { useEffect, useState, useRef, useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Dimensions, Modal, StyleSheet } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { Text, View, Image, useWindowDimensions, TouchableOpacity, AppState, useColorScheme, Alert } from 'react-native'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/redux/store/store';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { navigationRef } from './src/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchcolor } from './src/redux/slices/appcolorSlice';
import { getLoginInfo } from './src/service/storage';
import api from './src/service/api';
import moment from 'moment';
import NetInfo from "@react-native-community/netinfo";
import RBSheet from "react-native-raw-bottom-sheet";
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SocketProvider, SocketContext } from './src/context/SocketContext';
import { UserProvider, UserContext } from './src/context/UserContext';
import { ErrorContext, ErrorProvider } from './src/context/ErrorContext';
import { BottomProvider } from './src/context/BottomContext';
import getStyles from './src/themechg_template/styles';
import * as Keychain from 'react-native-keychain';
import { fontsFamily } from './src/constants/fontsFamily';
import { getFontSize } from './src/constants/Font';
import CommonFunction from './src/utill/CommonFunction';
import { usePushNotification } from './src/service/NotificationServices';
import ThemeRoute from './src/themechg_template/navigation/Route';
import BasicTemplate from './src/template_basic/navigation/Route'
import { GlobalBottomSheetProvider } from './src/themechg_template/component/GlobalBottomSheet';
import axios from 'axios';
import { socketurl } from './src/service/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from './src/template_basic/component/CustomModal';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { resetToLogin } from './src/template_basic/navigation/NavigationService';


const { height, width } = Dimensions.get('window')


const App = () => {
    usePushNotification()
    const refRBSheet = useRef();
    const [netStat, setNetStat] = useState("");
    const { height, width } = useWindowDimensions()
    const [intLoading, setIntLoading] = useState(false)
    const [start, setStart] = useState('')
    const appState = useRef(AppState.currentState);
    const dispatch = useDispatch();
    const { themedata, themeloading, themeerror } = useSelector((state) => state.appcolor);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { error } = useSelector((state) => state.menuicons);
    const { cuserror } = useSelector((state) => state.customer);
    const { message, changeMsg } = useContext(SocketContext);
    const [errMsg, setErrmsg] = useState('')
    const [isModal, setIsmodal] = useState(false)
    const { errorMsg, clearerrMsg } = useContext(ErrorContext);
    const { settingcms } = useSelector((state) => state.menuicons)


    useEffect(() => {
        if (message && message === 'logout') {
            sendDeviceId()
        }
    }, [message]);


    const ACTIVE_TEMPLATE = 'template_basic';

    const renderTemplate = () => {
        switch (ACTIVE_TEMPLATE) {
            case 'theme_template':
                return <ThemeRoute />;
                ''
            case 'template_basic':
                return <BasicTemplate />;

            default:
                return <ThemeRoute />;
        }
    };


    useEffect(() => {
        console.log(cuserror)
        if (cuserror === 'Rejected') {
            alertSession()
        }

    }, [cuserror])


    const alertSession = () => {
        Alert.alert(
            'Alert!',
            'Something went wrong. Please try again later',
            [
                {
                    text: 'OK',
                    onPress: () => resetScreen(),
                },
            ]
        );
    }




    useEffect(() => {
        monitorAppState()

        dispatch(fetchcolor())
    }, [])

    useEffect(() => {
        if (themeerror || errorMsg || error) {
            setErrmsg('err')
            refRBSheet.current.open()
        }

    }, [themeerror, errorMsg, error])



    useEffect(() => {
        storeIdletime()
    }, [settingcms])

    const storeIdletime = async () => {
        var idletime = settingcms?.idletime || 10
        await AsyncStorage.setItem('idletime', JSON.stringify(idletime))
    }



    const monitorAppState = () => {
        const appStateListener = AppState.addEventListener(
            'change',
            async nextAppState => {
                const mainsc = await AsyncStorage.getItem('main')
                var info = await getLoginInfo()
                if (nextAppState === 'inactive' || nextAppState === 'background') {
                    if (info) {
                        const dt = new Date().toISOString()
                        AsyncStorage.setItem('storetime', dt)
                    }

                }


                if (nextAppState === 'active') {

                    sendDeviceId()

                    const storedt = await AsyncStorage.getItem('storetime')
                    const idTime = await AsyncStorage.getItem('idletime')
                    if (!storedt) {

                        console.log('No stored time found', nextAppState);
                        return;
                    }

                    const storedDateObj = new Date(storedt);

                    if (isNaN(storedDateObj)) {
                        console.log('Invalid stored date');
                        return;
                    }

                    const currentdt = new Date();
                    const diffInMs = currentdt - storedDateObj;
                    const diffInMinutes = diffInMs / (1000 * 60);
                    if (Number(idTime) <= diffInMinutes && mainsc === 'mainscreen') {
                        setIsmodal(true)
                    }




                }
            },
        );

        return () => appStateListener.remove();
    };


    const resetScreen = async () => {
        setErrmsg('')
        clearerrMsg()
        setIsmodal(false)
        const removekey = ['storetime', 'main']
        await AsyncStorage.multiRemove(removekey)
        refRBSheet.current.close()
        navigationRef.current?.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Splash' }],
            })
        );
    }



    const sendDeviceId = async () => {
        setStart('')
        changeMsg()
        const loginfo = await getLoginInfo()
        if (loginfo && loginfo.phone) {
            const payload = {
                phone: loginfo.phone,
                device_id: await CommonFunction.getDeviceID()
            }
            axios.post(socketurl + '/checkdevice', payload).then(async (res) => {
                if (res.status === 202) {
                    const biometryType = await Keychain.getSupportedBiometryType();
                    console.log(biometryType)
                    if (biometryType !== null) {
                        const payload = {
                            biostatus: "No"
                        }
                        const response = await api.post(`customer/updatebiometric/${storedata.id}`, payload)
                        store.dispatch({ type: 'auth/logout' }); // reset Redux state
                        persistor.purge();
                        await CommonFunction.clearBiometricToken()
                    }


                    let keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];
                    AsyncStorage.multiRemove(keys, (err) => {
                        navigationRef.current?.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Switchlogout', params: res.data }],
                            })
                        );
                    });
                }
            }).catch((err) => {
                console.log(err.response.data)
            })
        }

    }

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetStat(state.isConnected ? "Connected" : "Disconnected");
            if (state.isConnected)
                refRBSheet.current?.close();
            else
                refRBSheet.current?.open();

        });
        return () => {
            unsubscribe()
        }
    }, [netStat])

    function checkNetworkConnection() {

        setIntLoading(true)

        setTimeout(() => {
            NetInfo.fetch().then(state => {

                if (state.isConnected) {
                    setIntLoading(false)
                    refRBSheet.current.close()
                } else {
                    setIntLoading(false)
                    refRBSheet.current.open()
                }
            });
        }, 3000);
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AlertNotificationRoot>
                <NavigationContainer ref={navigationRef}>
                    <RBSheet
                        ref={refRBSheet}
                        closeOnDragDown={false}
                        closeOnPressMask={false}
                        height={height}
                        customStyles={{
                            draggableIcon: {
                                backgroundColor: "#fff"
                            }
                        }}
                    >
                        {
                            errMsg ? <View style={{ height: height, width: '100%', borderRadius: 12, alignItems: "center", justifyContent: "center", padding: 20, marginTop: 0, paddingTop: 0 }}>

                                <Image source={require('./assets/images/no-internet.jpg')} style={{ alignSelf: 'center', width: width * 0.6, resizeMode: 'contain', backgroundColor: '#444', maxHeight: width * 0.6 }} />
                                <Text style={styles?.title}>Whoops!</Text>
                                <Text style={[styles?.textCenter, { color: '#000' }]}>Something went wrong. Please try again later.</Text>
                                <TouchableOpacity style={[styles?.btn]} onPress={() => resetScreen()}>
                                    <Text style={styles?.textCenter}>Try again</Text>
                                </TouchableOpacity>

                            </View> :
                                <View style={{ height: height, width: '100%', borderRadius: 12, alignItems: "center", justifyContent: "center", padding: 20, marginTop: 0, paddingTop: 0 }}>

                                    <Image source={require('./assets/images/no-internet.jpg')} style={{ alignSelf: 'center', width: width * 0.6, resizeMode: 'contain', backgroundColor: '#444', maxHeight: width * 0.6 }} />
                                    <Text style={styles?.title}>Whoops!</Text>
                                    {netStat && netStat == "Disconnected" && <Text style={[styles?.textCenter, { color: '#000', marginHorizontal: 10 }]}>You are offline. Please check your connection and try again</Text>}
                                    {netStat && netStat == "Connected" && <Text style={styles?.textCenter}>Your network connection is back!</Text>}
                                    <TouchableOpacity style={[styles?.btn]} onPress={checkNetworkConnection}>
                                        <Text style={styles?.textCenter}>Try again</Text>
                                    </TouchableOpacity>
                                </View>
                        }


                    </RBSheet>

                    <Modal
                        visible={isModal}
                        transparent={true}
                        animationType="fade"

                    >
                        <View style={styles.modalOverlay}>
                            <TouchableOpacity
                                style={styles.modalBackdrop}
                                activeOpacity={1}

                            />
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Session Expired!</Text>

                                </View>

                                <View style={styles.warningIconContainer}>
                                    <View style={styles.warningIcon}>
                                        <Feather name="alert-circle" size={40} color="#DC2626" />
                                    </View>
                                </View>

                                <Text style={styles.warningSubtitle}>
                                    Your session has expired. Please login again to continue using the app
                                </Text>

                                <View style={styles.modalActions}>

                                    {
                                        <TouchableOpacity
                                            style={[styles.confirmButton, { height: 40 }]}
                                            onPress={() => {
                                                resetToLogin()
                                                setIsmodal(false)
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <LinearGradient
                                                colors={['#EF4444', '#DC2626']}
                                                style={[styles.confirmGradient, { height: 40, paddingVertical: 0, flexDirection: 'row', alignItems: 'center' }]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                            >

                                                <Text style={styles.confirmButtonText}>Done</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>
                        </View>
                    </Modal>


                    {renderTemplate()}
                </NavigationContainer>
            </AlertNotificationRoot>
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(14),
        textAlign: 'center',
        marginBottom: 12,
        color: 'black'
    },
    textCenter: {
        fontSize: getFontSize(16),
        lineHeight: 25,
        color: "#fff",
        textAlign: "center"
    },
    btn: {
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: width - width / 5,
        backgroundColor: "#000", marginTop: 40
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center'
    },
    modalClose: {
        padding: 4,
    },
    warningIconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    warningIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    warningSubtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    confirmButton: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
    },
    confirmGradient: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
})




export default () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <GlobalBottomSheetProvider>
                <PaperProvider>
                    <SafeAreaProvider>
                        <SocketProvider>
                            <ErrorProvider>
                                <BottomProvider>
                                    <UserProvider>
                                        <App />
                                    </UserProvider>
                                </BottomProvider>
                            </ErrorProvider>
                        </SocketProvider>
                    </SafeAreaProvider>
                </PaperProvider>
            </GlobalBottomSheetProvider>
        </PersistGate>
    </Provider>
)