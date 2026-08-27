import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, StatusBar, Animated, Dimensions, Switch, useWindowDimensions, } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { themeColors } from '../../../Common';
import api from '../../../../service/api';
import appLog from '../../../../constants/logger';
import { updateAuthdata } from '../../../../redux/slices/authSlice';
import { getLoginInfo } from '../../../../service/storage';
import { getFontSize } from '../../../../constants/Font';
import { fontsFamily } from '../../../../constants/fontsFamily';
import CommonFunction from '../../../../utill/CommonFunction';
import * as Keychain from 'react-native-keychain';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { termsURL } from '../../../../service/environment';


const { width } = Dimensions.get('window');

export default function AppSettings() {
  const navigation = useNavigation();
  const [bottomActiveTab, setBottomActiveTab] = useState('budget');
  const { buttomnavigationbar, settingmenu, sidehead } = useSelector((state) => state.menuicons)
  const { storedata } = useSelector((state) => state.auth);
  const { cusDetails, loading, error } = useSelector((state) => state.customer);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const dispatch = useDispatch()
  const [isBiomatric, setIsbiomatric] = useState(false)
  const [headMenu, setheadMenu] = useState([])
  const [settings, setSettings] = useState({
    biometric: true,
    notifications: true,
    darkMode: false,
    autoLock: true,
  });
  const switchScale = width < 380 ? 0.7 : 0.6;
  const switchScale1 = width < 380 ? 0.9 : 0.8;


  const fadeAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const data = sidehead.filter((obj) => obj.id === '6a79a773b310e3af6368f4a0' || obj.id === '6a79a781b310e3af6368f4a1')
    setheadMenu(data)

  }, [sidehead])

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);


  const toggleSwitch = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChangePIN = () => {
    alert('Navigate to Change PIN screen');
  };


  const navigateScreen = (id) => {
    if (id === '674823adb2253a1fd8a5b6e7') {
      navigation.navigate('ChangePIN')
    } else if (id === '67482434b2253a1fd8a5b7b4') {
      CommonFunction.openWeb(termsURL, themeColors)
    }
  }

  const renderIcon = (subvalue, geticonSize = 20, color = "#64748B") => {

    return <View>
      {
        subvalue.iconfamily === 'FontAwesome' ?
          <FontAwesome name={subvalue.appicon} color={color} size={geticonSize} /> :
          subvalue.iconfamily === 'AntDesign' ?
            <AntDesign name={subvalue.appicon} color={color} size={geticonSize} /> :
            subvalue.iconfamily === 'MaterialIcons' ?
              <MaterialIcons name={subvalue.appicon} color={color} size={geticonSize} /> :
              subvalue.iconfamily === 'MaterialCommunityIcons' ?
                <MaterialCommunityIcons name={subvalue.appicon} color={color} size={geticonSize} /> :
                subvalue.iconfamily === 'FontAwesome5' ?
                  <FontAwesome5 name={subvalue.appicon} color={color} size={geticonSize} /> :
                  subvalue.iconfamily === 'Ionicons' ?
                    <Ionicons name={subvalue.appicon} color={color} size={geticonSize} /> :
                    subvalue.iconfamily === 'Feather' ?
                      <Feather name={subvalue.appicon} color={color} size={geticonSize} /> :
                      <Image source={{ uri: imgApi + 'content/original/' + subvalue.image }} style={{ height: 20, width: 20, tintColor: color }} resizeMode='contain' />
      }
    </View>
  };



  const renderSettingItem = (subvalue) => (
    <TouchableOpacity
      style={styles.settingItem}
      activeOpacity={subvalue.id === '6981b7c31445f81db0b4b3e9' ? 1 : 0.7}
      onPress={()=>{
        navigateScreen(subvalue?.id)
      }}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          {renderIcon(subvalue, 16, "#3c3cd6")}
        </View>
        <Text style={styles.settingLabel}>{subvalue?.name}</Text>
      </View>
      {subvalue.id === '6981b7c31445f81db0b4b3e9' ? (
        <Switch
          disabled={storedata?.biometric_status === 'Yes' && isBiomatric ? true : false}
          value={isBiomatric}
          onValueChange={updatebiomatric}
          color={themeColors.menu_active_bg}
          thumbColor={thumbColor()}
          trackColor={{ false: falseColor(), true: themeColors?.primarColor }}
          style={{ transform: [{ scaleX: switchScale1 }, { scaleY: switchScale1 }], }}
        />
      ) : subvalue.id === '6a79a952b310e3af6368f4a2' ?
        <View>
          <Text style={styles.versionText}>{CommonFunction.getAppversion()}</Text>
        </View>
        : (
          <Feather name="chevron-right" size={20} color="#94A3B8" />
        )}
    </TouchableOpacity>
  );

  const falseColor = () => {
    return "#767577"
  }

  const thumbColor = (value) => {
    if (storedata?.biometric_status === 'Yes' && isBiomatric) {
      return "#ffffff"
    } else {
      return "#f4f3f4"
    }

  }

  const updatebiomatric = async () => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();

      console.log('Biometry Type:', biometryType);

      if (!biometryType) {
        CommonFunction.message('No biometric authentication available');
        return false;
      }


      await saveTokenWithBiometric();

    } catch (error) {
      onClose();
      console.log('Error checking biometric:', error);
      CommonFunction.message('Biometric setup failed. Please try again.');
      return false;
    }

  }

  const saveTokenWithBiometric = async () => {
    var store = await getLoginInfo()
    try {

      await Keychain.setGenericPassword('user', store.id, {
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
        authenticationPrompt: {
          title: 'Authenticate to enable biometric login',
          // subtitle: 'Use your fingerprint or Face ID to enable biometric login',
          // description: 'Secure login using Face ID or Fingerprint', // optional
        },
      }); ''
      if (Platform.OS === 'ios') {
        await Keychain.getGenericPassword({
          authenticationPrompt: { title: 'Confirm Biometric Setup' },
        });
      }



      const changdata = { ...storedata, biometric_status: 'Yes' }
      CommonFunction.storeData('@cusLoginInfo', changdata)
      dispatch(updateAuthdata(changdata))
      const payload = {
        biostatus: "Yes"
      }
      const response = await api.post('customer/updatebiometric/' + storedata?.id, payload)
      console.log(response.data)
      setIsbiomatric(true)
      console.log('✅ Biometric login enabled');
    } catch (error) {
      console.log('Error enabling biometric:', error);

      await Keychain.resetGenericPassword();
      const payload = {
        biostatus: "No"
      }
      const changdata = { ...storedata, biometric_status: 'No' }
      CommonFunction.storeData('@cusLoginInfo', changdata)
      dispatch(updateAuthdata(changdata))
      const response = await api.post('customer/updatebiometric/' + storedata?.id, payload)
      console.log(response.data)



      // if (message.includes('cancel') || message.includes('canceled') || message.includes('cancelled')) {
      //     Alert.alert('Biometric Setup Canceled', 'You canceled biometric setup. You can enable it later in settings.');
      // }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="App Settings"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {
          headMenu.map((item, index) => {
            return (
              <View style={styles.section} key={index}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconContainer,item.id === '6a79a781b310e3af6368f4a1' && {backgroundColor:'#ECFDF5'}]}>
                    {
                      renderIcon(item, 16,  item.id === '6a79a781b310e3af6368f4a1' ? "#10B981": "#3c3cd6")
                    }
                  </View>
                  <Text style={styles.sectionTitle}>{item.name}</Text>
                </View>
                <View style={styles.sectionContent}>
                  {
                    settingmenu.map((subvalue, subkey) => {
                      if (subvalue.group === item.id) {
                        return (
                          <View key={subkey}>
                            {renderSettingItem(subvalue)}
                          </View>
                        )
                      }

                    })
                  }

                </View>

              </View>
            )

          })
        }


        <View style={styles.bottomPadding} />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  // Section
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  sectionIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: getFontSize(14),
    fontFamily:fontsFamily.regularFont,
    fontWeight: '600',
    color: '#0F172A',
  },
  sectionContent: {
    paddingHorizontal: 4,
  },
  // Setting Item
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: getFontSize(14),
    fontFamily:fontsFamily.regularFont,
    fontWeight: '500',
    color: '#0F172A',
  },
  versionText: {
    fontSize: getFontSize(14),
    fontFamily:fontsFamily.regularFont,
    color: '#94A3B8',
    fontWeight: '500',
  },
  // Logout Button
  logoutButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  logoutText: {
    fontSize: getFontSize(15),
    fontFamily:fontsFamily.regularFont,
    fontWeight: '600',
    color: '#DC2626',
  },
  bottomPadding: {
    height: 20,
  },
});