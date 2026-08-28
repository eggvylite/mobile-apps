import React, { useEffect, useRef, useContext, useState } from 'react';
import { View, Image, BackHandler, ToastAndroid, useWindowDimensions, Dimensions, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import DashboardRoute from '../../navigation/DashboardRoute';
import InsightRoute from '../../navigation/InsightsRoute';
import BudgetRoute from '../../navigation/BudgetRoute'
import { fetchmenuSevice } from '../../../redux/slices/menuiconSlice';
import GoalRoute from '../../navigation/GoalRoute'
import OffersRoute from '../../navigation/OffersRoute'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchCustomer } from '../../../redux/slices/customerSlice';
import { fetchTransaction } from '../../../redux/slices/transactionSlice';
import * as Keychain from 'react-native-keychain';
import CommonFunction from '../../../utill/CommonFunction';
import { fetchAuth, updateAuthdata } from '../../../redux/slices/authSlice';
import { fetchStatement, resetStatement, updateFirstTransDate } from '../../../redux/slices/statementSlice';
import { fetchCategory } from '../../../redux/slices/categorySlice';
import { fetchnamegetAccount } from '../../../redux/slices/getnameAccountSlice';
import { fetchBrandlogo } from '../../../redux/slices/brandlogoSlice';
import { fetchTag } from '../../../redux/slices/tagSlice';
import { fetchTagdescription } from '../../../redux/slices/tagdescriptionSlice';
import { BottomContext } from '../../../context/BottomContext';
import { fetchBudgetcategory } from '../../../redux/slices/budgetcategorySlice';
import { fetchOffers } from '../../../redux/slices/offerSlice';
import { fetchOffertype } from '../../../redux/slices/offertypeSlice';
import { fetchAccount } from '../../../redux/slices/accountSlice';
import { fetchReminder } from '../../../redux/slices/reminderSlice';
import { fetchgetAccount, fetchgetllAccount } from '../../../redux/slices/getmanulaccountSlice';
import { fetchgoalAccount, fetchgoallistAccount } from '../../../redux/slices/goalSlice';
import { fetchBills } from '../../../redux/slices/billSlice';
import { fetchDashboardmenu } from '../../../redux/slices/dashboardmenuSlice';
import { fetchcustomNotication } from '../../../redux/slices/notificationCustomSlice';
import { fetchAdvancesListHistory } from '../../../redux/slices/advanceTransSlice';
import { fetchadvanceActiveSubscription, fetchOutstanding } from '../../../redux/slices/advenceSlice';
import { fetchcurrentsubscription } from '../../../redux/slices/subscriptionSlice';
import { fetchChoosePlan } from '../../../redux/slices/choosePlanSlice';
import { fetchcreditScore } from '../../../redux/slices/scoreSlice';
import { fetchGoalhis } from '../../../redux/slices/goalhisSlice';
import { fetchLabel } from '../../../redux/slices/labelSlice';
import { fetchPaymentMethods } from '../../../redux/slices/paymentSlice';
import { fetchHanpickoffers } from '../../../redux/slices/offerHandSlice';
import { useNavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBank } from '../../../redux/slices/bankSlice';
import { fetchElgibleoffers } from '../../../redux/slices/elgibleofferSlice';
import { fetchOpenoffers } from '../../../redux/slices/openofferSlice';
import { getLoginInfo } from '../../../service/storage';
import api from '../../../service/api';
import { imgApi } from '../../../service/environment';
import { themeColors } from '../../Common';
import { fetchmanualAccount } from '../../../redux/slices/manualaccountSlice';
import { fetchFaq } from '../../../redux/slices/faqSlice';
import { fetchWorkflowLabels, fetchWorkflowSettings, fetchWorkflowInfoLabels } from '../../../redux/slices/workflowlableSilce';
import { fetchScreenLabels } from '../../../redux/slices/applabelsSlice';
import { fetchMarketplaceHandPickOffer } from '../../../redux/slices/merketplaceSlice';


const Tab = createBottomTabNavigator();
const screenHeight = Dimensions.get("window").height

const AnimatedTabIcon = ({ item, focused, renderIcon }) => {
    const animatedWidth = useSharedValue(focused ? 80 : 0);

    useEffect(() => {
        animatedWidth.value = withTiming(focused ? 80 : 0, { duration: 450 });
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: animatedWidth.value / 3,
            opacity: animatedWidth.value / 80,
        };
    });

    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            top: 1
        }}>
            <Animated.View style={[
                {
                    height: 2,
                    backgroundColor: themeColors.primarColor,
                    position: 'absolute',
                    top: Platform.OS === 'iOS' ? -4 : -6,
                    borderRadius: 1
                },
                animatedStyle
            ]} />
            {renderIcon(item, focused)}
        </View>
    );
};

export default function Main(props) {
    const dispatch = useDispatch();

    const { themedata } = useSelector((state) => state.appcolor);
    const { menudata, offers, handpickoffers, buttomnavigationbar, loading } = useSelector((state) => state.menuicons);
    const { page, size, records, hasMore, stloading, statementrecords } = useSelector((state) => state.statement);
    const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category)
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const { tagdata, tagloading, tagerror } = useSelector((state) => state.taglist);
    const { descripiondata, descriptionloading, descriptionerror } = useSelector((state) => state.tagdescription);
    const { cusDetails, error } = useSelector((state) => state.customer);
    const { brandata, brandloading, branderror } = useSelector((state) => state.brandlogo);
    const { budgetcategorydata } = useSelector((state) => state.budgetcategory);
    const { isMenu, toggleMenu, enableMenu, disableMenu } = useContext(BottomContext);
    const { dashboardmenudata, dashboardmenuloading, dashboardmenuerror } = useSelector((state) => state.dashboardmenu);
    const { notificationcustomdata, notificationcustomloading, notificationcustomerror } = useSelector((state) => state.notificationcustom);
    const { transdata, transpage, transtotalpage, transSize, timeline, transtotalitem, transloading, transerror, } = useSelector((state) => state.transaction);
     const { marketplacedata, marketPlaceCategory, marketplaceFeature,marketplaceFlag } = useSelector((state) => state.marketplace);
    const { advhistory, advpage, advtotalPages, advloading, advtotalItems, advsize } = useSelector((state) => state.advancehistory);
    const { scoredata, scoreloading, scorerror } = useSelector((state) => state.creditScore);
    const { handpickdata, handpickloading, handpickerror } = useSelector((state) => state.handpicks);
    const { plandata, planeloading, planeerror } = useSelector((state) => state.chooseplan);
    const { goalhisdata } = useSelector((state) => state.goalhistrory);
    const { label } = useSelector((state) => state.labels);
    // const [backPressCount, setBackPressCount] = useState(0);

    const isSmallDevice = screenHeight < 700;


    const navigationRef = useNavigationContainerRef();
    const [backPressCount, setBackPressCount] = useState(0);




    useEffect(() => {
        if (props?.route?.params?.isShowbio) {
            checkStoredCredentials();
        }
        getDetails()
        enableMenu()

    }, []);

    useEffect(() => {
        const loadData = async () => {
            const info = await getLoginInfo()
            if (!info) return;
            if (0 < statementrecords.length || page === -1) {
                var pageplus = page + 1
                dispatch(fetchStatement({ page: pageplus, size }));
            } else {
                var firstdata = records[records.length - 1]
                dispatch(updateFirstTransDate(firstdata?.transacted_at))
            }

        };

        loadData();
    }, [page]);




    useEffect(() => {
        const loadData = async () => {
            const info = await getLoginInfo()
            if (!info) return;
            if (transpage !== transtotalpage) {
                var pageplus = transpage + 1
                dispatch(fetchTransaction({ page: pageplus, size: transSize }));
            }

        };

        loadData();
    }, [transpage]);


    useEffect(() => {
        const loadData = async () => {
            const info = await getLoginInfo()
            if (!info) return;
            if (advpage !== advtotalPages) {
                var pageplus = advpage + 1
                dispatch(fetchAdvancesListHistory({ page: pageplus, size: advsize }));
            }

        };

        loadData();
    }, [advpage]);







    const getDetails = async () => {
        await AsyncStorage.setItem('main', 'mainscreen')



        dispatch(fetchAuth())
        dispatch(fetchnamegetAccount())

        dispatch(fetchScreenLabels())

        dispatch(fetchadvanceActiveSubscription())
        dispatch(fetchOutstanding())
        dispatch(fetchFaq())


        dispatch(fetchCustomer())

        dispatch(fetchOffers())

        dispatch(fetchReminder())

        dispatch(fetchOffertype())

        dispatch(fetchDashboardmenu())

        dispatch(fetchgetAccount())
        dispatch(fetchmanualAccount())

        dispatch(fetchWorkflowLabels())
        dispatch(fetchWorkflowSettings())
        dispatch(fetchWorkflowInfoLabels())

         if (!marketplaceFlag) {
            dispatch(fetchMarketplaceHandPickOffer())
        }


        dispatch(fetchBills())
        dispatch(fetchgetllAccount())
        dispatch(fetchgoalAccount())
        dispatch(fetchgoallistAccount())

        if (!accountdata) {
            dispatch(fetchAccount())
        }

        if (!categorydata) {
            dispatch(fetchCategory())
        }

        if (!brandata) {
            dispatch(fetchBrandlogo())
        }


        if (!tagdata) {
            dispatch(fetchTag())
        }

        if (!descripiondata) {
            dispatch(fetchTagdescription())
        }



        dispatch(fetchOutstanding())
        // dispatch(fetchadvanceActiveSubscription())

        dispatch(fetchcurrentsubscription())


        dispatch(fetchBank())


        dispatch(fetchBudgetcategory())

        dispatch(fetchcreditScore())



        dispatch(fetchPaymentMethods())


        dispatch(fetchHanpickoffers())


        dispatch(fetchOpenoffers())

        dispatch(fetchLabel())




        if (Object.keys(plandata).length === 0) {
            dispatch(fetchChoosePlan())
        }


        if (!goalhisdata) {
            dispatch(fetchGoalhis())
        }


        if (!notificationcustomdata) {
            dispatch(fetchcustomNotication())
        }

        if (!budgetcategorydata) {
            dispatch(fetchBudgetcategory())
        }

        if (!cusDetails) {
            dispatch(fetchCustomer())
        }

    }





    const checkStoredCredentials = async () => {
        try {
            const biometryType = await Keychain.getSupportedBiometryType();



            if (biometryType === null) {
                console.log('❌ No biometric authentication available.');
                return false;
            }

            if (Platform.OS === 'android') {
                const exists = await Keychain.getAllGenericPasswordServices();
                console.log(exists, '----->')
                if (exists && exists.length === 0) {
                    console.log('notoken', exists.length)
                    saveTokenWithBiometric()
                    // Optionally, trigger biometric login here
                } else {
                    console.log('token stored');
                }
            } else {
                saveTokenWithBiometric()
            }

        } catch (error) {
            console.log('Error checking biometric:', error);
            return false;
        }

    };





    const saveTokenWithBiometric = async () => {
        var store = await getLoginInfo()
        try {

            await Keychain.setGenericPassword('user', store.id, {
                accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
                authenticationPrompt: {
                    title: 'Authenticate to enable biometric login',
                },
            });

            // 🔹 Trigger biometric on iOS to confirm
            if (Platform.OS === 'ios') {
                await Keychain.getGenericPassword({
                    authenticationPrompt: { title: 'Confirm Biometric Setup' },
                });
            }
            const changdata = { ...store, biometric_status: 'Yes' }
            CommonFunction.storeData('@cusLoginInfo', changdata)
            dispatch(updateAuthdata(changdata))
            const payload = {
                biostatus: "Yes"
            }

            const response = await api.post(`customer/updatebiometric/${store.id}`, payload)
            console.log('✅ Biometric login enabled');
        } catch (error) {
            console.log('Error enabling biometric:', error);

            await Keychain.resetGenericPassword();
            const payload = {
                biostatus: "No"
            }
            let changdata = { ...store, biometric_status: 'No', later: 'Yes' }
            CommonFunction.storeData('@cusLoginInfo', changdata)
            dispatch(updateAuthdata(changdata))
            const response = await api.post('customer/updatebiometric/', payload)
            Alert.alert('Biometric Setup', 'You canceled biometric setup. You can enable it later in App Setting.');


        }

    };

    const routeMap = {
        '67481ef1b2253a1fd8a5b2d2': { name: 'DashboardRoute', component: DashboardRoute },
        '67481f0cb2253a1fd8a5b2ef': { name: 'InsightRoute', component: InsightRoute },
        '67481f26b2253a1fd8a5b30c': { name: 'BudgetRoute', component: BudgetRoute },
        '67481e5fb2253a1fd8a5b278': { name: 'OffersRoute', component: OffersRoute },
        '693a4da84f6242c90ad037bb': { name: 'GoalRoute', component: GoalRoute },
    };

    const renderIcon = (item, focused) => {
        const color = focused ? themeColors.primarColor : '#000';
        const size = 24;

        switch (item.iconfamily) {
            case 'FontAwesome':
                return <FontAwesome name={item.appicon} size={size} color={color} />;
            case 'MaterialIcons':
                return <MaterialIcons name={item.appicon} size={size} color={color} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={item.appicon} size={size} color={color} />;
            case 'FontAwesome5':
                return <FontAwesome5 name={item.appicon} size={size} color={color} />;
            case 'Ionicons':
                return <Ionicons name={item.appicon} size={size} color={color} />;
            case 'Octicons':
                return <Octicons name={item.appicon} size={size} color={color} />;
            default:
                return (
                    <Image
                        source={{ uri: imgApi + 'content/original/' + item.image }}
                        style={{ width: 24, height: 24, tintColor: color }}
                    />
                );
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                initialRouteName="DashboardRoute"
                backBehavior="initialRoute"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: [{ borderTopWidth: 0 }],
                    tabBarItemStyle: { flexDirection: 'column', },
                    tabBarVisibilityAnimationConfig: true,
                    tabBarActiveTintColor: themeColors.primarColor,
                    tabBarInactiveTintColor: '#000',
                    headerShown: false,
                    tabBarStyle: [styles.bottomNav, { display: isMenu ? 'flex' : 'none', height: isSmallDevice ? 60 : 70 }],
                    tabBarLabelStyle: [styles.navText]
                }}
            >
                {buttomnavigationbar.map((item) => {
                    if (
                        item.id === '67f7a30fb2fd34460818bb9a' ||
                        item.id === '68034215a37b714ea493f176'
                    ) {
                        return null;
                    }

                    const route = routeMap[item.id];
                    if (!route) return null;

                    return (
                        <Tab.Screen
                            key={item.id}
                            name={route.name}
                            component={route.component}
                            options={{
                                popToTopOnBlur: true,
                                tabBarLabel: item.name,
                                tabBarIcon: ({ focused }) => (
                                    <AnimatedTabIcon item={item} focused={focused} renderIcon={renderIcon} />
                                ),
                            }}
                        />
                    );
                })}
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 8,
    },
    iconContainer: {
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        width: 24,
    },
    icon: {
        width: 22,
        height: 22,
    },
    navText: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 7,
    },
    activeNavText: {
        color: '#5F2B80',
        fontWeight: '600',
    },
});



