import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  LogBox,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderIOS from '../../../common_component/HeaderIOS';
import { themeColors } from '../../Common';
import CommonFunction from '../../../utill/CommonFunction';
import api from '../../../service/api';
import { getFontSize } from '../../../constants/Font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, persistor } from '../../../redux/store/store';
import { useSelector } from 'react-redux';
import { getLoginInfo } from '../../../service/storage';
import { forgotmobileOTP, loginPIN } from '../../../constants/Loginapi';
import SubmitBtn from '../../component/SubmitBtn';

const { width } = Dimensions.get('window');

LogBox.ignoreLogs(['Warning: ...', 'Another warning...']);
LogBox.ignoreAllLogs();

function LoginPIN({ navigation, route }) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [record, setRecord] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pinInputRefs = useRef([]);
  const info = route.params;
  const { storedata } = useSelector((state) => state.auth);

  const isPinComplete = pin.join('').length === 6;

  useEffect(() => {
    getDetails();
  }, [info]);

  const getDetails = async () => {
    const load = {
      device_id: await CommonFunction.getDeviceID(),
      phone: info?.phone,
      device_name: CommonFunction.getdevicename(),
      platform: CommonFunction.getOS(),
      ipaddress: await CommonFunction.getipaddress(),
    };

    console.log(load)
    setRecord(load);

    setTimeout(() => {
      pinInputRefs?.current[0]?.focus();
    }, 100);
  };

  const forgotOTP = async () => {
    try {
      await forgotmobileOTP(navigation, record);
    } catch (err) {
      console.log(err?.response);
    }
  };

  const resetPIN = () => {
    pinInputRefs?.current[0]?.focus();
    setPin(['', '', '', '', '', '']);
  };

  const navigationCheck = () => {
    const keys = ['date', 'dashboard'];
    AsyncStorage.multiRemove(keys, () => {
      navigation.navigate('Main');
    });
  };

  const verifyPIN = async (code) => {
    const payload = { ...record, pin: code };

    if (code.length !== 6) return;

    Keyboard.dismiss();
    setIsLoading(true);

    if (route?.params?.pin) {
      if (CommonFunction.decryptString(route?.params?.pin) === code) {
        navigationCheck();
      } else {
        setIsLoading(false);
        setRecord('');
        resetPIN();
        CommonFunction.message('Incorrect PIN. Please try again', 'danger');
      }
    } else {
      try {
        await loginPIN(navigation, payload);
      } catch (err) {
        setIsLoading(false);
        resetPIN();
        console.log(err?.response);
      }
    }
  };

  const handlePinChange = (text, index) => {
    const newPin = [...pin];
    newPin[index] = text.slice(-1);
    setPin(newPin);

    if (text && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }

    if (text && index === 5) {
      Keyboard.dismiss();
      const fullPin = [...newPin.slice(0, 5), text].join('');
      setTimeout(() => {
        verifyPIN(fullPin);
      }, 300);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmitEditing = (index) => {
    if (index === 5) {
      const fullPin = pin.join('');
      if (fullPin.length === 6) {
        setTimeout(() => {
          verifyPIN(fullPin);
        }, 100);
      }
    } else if (pin[index] && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }
  };

  const handleSetPin = () => {
    const fullPin = pin.join('');
    if (fullPin.length === 6) {
      verifyPIN(fullPin);
    }
  };

  const logoutsession = async () => {
    const info = await getLoginInfo();
    const cusid = storedata?.id || info?.id;
    const keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];

    const clearAndLogout = () => {
      AsyncStorage.multiRemove(keys, () => {});
      store.dispatch({ type: 'auth/logout' });
      persistor.purge();
      CommonFunction.logout(navigation);
    };

    if (cusid) {
      const payload = { biostatus: 'No' };
      try {
        await api.post(`customer/updatebiometric/${cusid}`, payload);
        clearAndLogout();
      } catch (e) {
        clearAndLogout();
      }
      return;
    }

    CommonFunction.logout(navigation);
  };

  const renderPinDots = () => {
    return (
      <View style={styles.pinContainer}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (!pinInputRefs.current) pinInputRefs.current = [];
              pinInputRefs.current[index] = ref;
            }}
            style={[styles.pinInput, digit !== '' && styles.pinInputFilled]}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry={!showPin}
            value={digit}
            onChangeText={(text) => handlePinChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onSubmitEditing={() => handleSubmitEditing(index)}
            returnKeyType={index === 5 ? 'done' : 'next'}
            blurOnSubmit={false}
            selectTextOnFocus
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {!route.params?.pin && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                Keyboard.dismiss();
                navigation.goBack();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.backButtonCircle}>
                <Icon name="arrow-left" size={24} color="#4A2A63" />
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.flexContainer}>
            <HeaderIOS />

            <View style={styles.card}>
              <Text style={styles.navTitles}>Enter Your PIN</Text>
              <Text style={styles.subtitle}>
                Enter your 6-digit PIN to continue
              </Text>

              <View style={styles.inputContainer}>
                <View style={styles.pinHeader}>
                  <Text style={styles.label}>Enter PIN</Text>
                  <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                    <Icon
                      name={showPin ? 'eye-off' : 'eye'}
                      size={20}
                      color="#4A2A63"
                    />
                  </TouchableOpacity>
                </View>

                {renderPinDots()}
              </View>

              <TouchableOpacity
                style={{ alignItems: 'flex-end', marginBottom: 15 }}
                onPress={() => forgotOTP()}
              >
                <Text style={styles.editLink}>Forgot PIN?</Text>
              </TouchableOpacity>

              {isPinComplete && (
                <SubmitBtn
                  text={isLoading ? 'Loading' : 'Continue'}
                  submit={handleSetPin}
                  disabled={isLoading}
                  disableGradient={isLoading}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Footer stays fixed at bottom regardless of keyboard state */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => logoutsession()}>
          <Text style={styles.editLink}>Login to another account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  editLink: {
    color: themeColors?.primarColor,
    fontSize: getFontSize(14),
    fontWeight: '800',
  },
  backButton: {
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A2A63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  navTitles: {
    fontSize: getFontSize(24),
    fontWeight: '800',
    color: themeColors.primarytextColor,
    textAlign: 'center',
    marginTop: 10,
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
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  pinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    color: '#4A2A63',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  pinInput: {
    width: 40,
    height: 55,
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  pinInputFilled: {
    borderColor: '#4A2A63',
    backgroundColor: '#FFF',
  },
  setPinText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPIN;