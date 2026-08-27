import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderIOS from '../../../common_component/HeaderIOS';
import api from '../../../service/api';
import CommonFunction from '../../../utill/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generatePIN } from '../../../constants/Loginapi';
import SubmitBtn from '../../component/SubmitBtn';

const { width } = Dimensions.get('window');

const CreatePIN = ({ navigation, route }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [showPin, setShowPin] = useState(false);
  const pinInputRefs = useRef([]);
  const confirmInputRefs = useRef(null);
  const [isLoading, setIsLoading] = useState(false)
  const info = route?.params



  useEffect(() => {
    getDetails()
  }, []);

  const getDetails = () => {
    setTimeout(() => {
      if (pinInputRefs?.current[0]) {
        pinInputRefs?.current[0].focus();
      }
    }, 100);
  }

  const resetPIN = () => {
    Alert.alert(
      'PIN Mismatch',
      'The PIN and Confirm PIN do not match.',
      [
        {
          text: 'OK',
          onPress: () => {
            setPin(['', '', '', '', '', ''])
            setConfirmPin(['', '', '', '', '', ''])
            setStep(1)
            getDetails()
          },
        },
      ]
    );

  }


  const createPIN = async (pin) => {
    Keyboard.dismiss()
    setIsLoading(true)
    let payload = {
      pin: pin,
      device_id: await CommonFunction.getDeviceID(),
      phone: route?.params?.phone,
      device_name: CommonFunction.getdevicename(),
      platform: CommonFunction.getOS(),
      ipaddress: await CommonFunction.getipaddress()
    }


    try {
      await generatePIN(navigation, payload)
        setIsLoading(false)
    } catch (error) {
       setIsLoading(false)
      console.log(error?.response?.data)
    }

    // api.post('customerlogin/pin_gen', payload).then((response) => {
    //   const data = response.data
    //   if (response.status === 203) {
    //     navigation.navigate("SwitchDevice", { deviceInfo: data.deviceInfo, message: data.message, title: data.title, deviceId: deviceId, phone: props.route.params.phNum })
    //   } else {
    //     CommonFunction.storeData('@cusLoginInfo', data.data)
    //     navigation.navigate('Main', { cusId: data.user, isShowbio: 'Yes' })
    //   }
    //   navigation.navigate('Main')
    // }).catch((err) => {
    //   console.log(err)

    // })


  }

  const handlePinChange = (text, index, isConfirm = false) => {
    if (isConfirm) {
      const newConfirmPin = [...confirmPin];
      newConfirmPin[index] = text.slice(-1);
      setConfirmPin(newConfirmPin);

      if (text && index < 5) {
        confirmInputRefs.current[index + 1].focus();
      }


      if (text && index === 5) {

        const fullConfirmPin = [...newConfirmPin.slice(0, 5), text].join('');
        const fullConfirmPin1 = [...pin.slice(0, 5), text].join('');
        if (fullConfirmPin.length === 6) {
          if (fullConfirmPin1 === fullConfirmPin) {
            Keyboard.dismiss();
            setTimeout(() => {
              createPIN(fullConfirmPin)
            }, 300);
          } else {
            resetPIN()
          }

        }
      }
    } else {
      const newPin = [...pin];
      newPin[index] = text.slice(-1);
      setPin(newPin);

      if (text && index < 5) {
        pinInputRefs.current[index + 1]?.focus();
      }

      if (text && index === 5) {
        Keyboard.dismiss();
        setTimeout(() => {
          setStep(2);
          setTimeout(() => {
            if (confirmInputRefs.current[0]) {
              confirmInputRefs.current[0].focus();
            }
          }, 100);
        }, 300);
      }
    }
  };

  const handleKeyPress = (e, index, isConfirm = false) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (isConfirm) {
        if (!confirmPin[index] && index > 0) {
          confirmInputRefs.current[index - 1].focus();
        }
      } else {
        if (!pin[index] && index > 0) {
          pinInputRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  const handleSubmitEditing = (index, isConfirm = false) => {
    if (isConfirm) {
      if (index === 5) {
        const fullConfirmPin = confirmPin.join('');
        if (fullConfirmPin.length === 6) {
          // navigation.replace('MainTabs');
          createPIN(fullConfirmPin)
        }
      } else if (confirmPin[index] && index < 3) {
        confirmInputRefs.current[index + 1]?.focus();
      }
    } else {
      if (index === 5) {
        const fullPin = pin.join('');
        if (fullPin.length === 6) {
          setStep(2);
          setTimeout(() => {
            if (confirmInputRefs.current[0]) {
              confirmInputRefs.current[0].focus();
            }
          }, 100);
        }
      } else if (pin[index] && index < 5) {
        pinInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSetPin = () => {
    const fullPin = pin.join('');
    const fullConfirmPin = confirmPin.join('');
    if (fullPin.length === 6 && fullConfirmPin.length === 6) {
      if (fullPin === fullConfirmPin) {
        Keyboard.dismiss();

        createPIN(fullConfirmPin)
      } else {
        resetPIN()
        console.log('PIN Mismatch')

      }
      // navigation.replace('MainTabs');
    }
  };

  const renderPinDots = (pinArray, isConfirm) => {
    return (
      <View style={styles.pinContainer}>
        {pinArray.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (isConfirm) {
                if (!confirmInputRefs.current) {
                  confirmInputRefs.current = [];
                }
                confirmInputRefs.current[index] = ref;
              } else {
                if (!pinInputRefs.current) {
                  pinInputRefs.current = [];
                }
                pinInputRefs.current[index] = ref;
              }
            }}
            style={[
              styles.pinInput,
              digit !== '' && styles.pinInputFilled
            ]}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry={!showPin}
            value={digit}
            onChangeText={(text) => handlePinChange(text, index, isConfirm)}
            onKeyPress={(e) => handleKeyPress(e, index, isConfirm)}
            onSubmitEditing={() => handleSubmitEditing(index, isConfirm)}
            returnKeyType={index === 3 ? "done" : "next"}
            blurOnSubmit={false}
            selectTextOnFocus
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexContainer}
      >
        {/* Custom Back Button with Circle Background */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Keyboard.dismiss();
            if (step === 2) {
              setStep(1);
              setTimeout(() => {
                if (pinInputRefs.current[3]) {
                  pinInputRefs.current[3].focus();
                }
              }, 100);
            } else {
              navigation.goBack();
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonCircle}>
            <Icon name="arrow-left" size={24} color="#4A2A63" />
          </View>
        </TouchableOpacity>

        {/* Top Logo Area */}
        <View style={styles.logoSection}>
          <HeaderIOS />
        </View>

        {/* PIN Card */}
        <View style={styles.card}>
          <Text style={styles.title}>
            {step === 1 ? 'Create Your PIN' : 'Confirm Your PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Set a 6-digit PIN for quick access'
              : 'Enter the same PIN again to confirm'}
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.pinHeader}>
              <Text style={styles.label}>
                {step === 1 ? 'Create PIN' : 'Confirm PIN'}
              </Text>
              <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                <Icon
                  name={showPin ? 'eye-off' : 'eye'}
                  size={20}
                  color="#4A2A63"
                />
              </TouchableOpacity>
            </View>

            {step === 1
              ? renderPinDots(pin, false)
              : renderPinDots(confirmPin, true)
            }
          </View>

          {step === 2 && (
            <SubmitBtn
              text={isLoading ? 'Loading' : 'Set PIN & Continue'}
              submit={handleSetPin}
              disabled={isLoading}
              disableGradient={isLoading}
            />

            // <TouchableOpacity
            //   style={styles.setPinButton}
            //   activeOpacity={0.9}
            //   onPress={handleSetPin}
            // >
            //   <Text style={styles.setPinText}>Set PIN & Continue</Text>
            // </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFF',
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
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
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
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
  pinHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  setPinButton: {
    height: 60,
    backgroundColor: '#4A2A63',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A2A63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  setPinText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0E8F5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: '#4A2A63',
    fontSize: 12,
    lineHeight: 16,
  },
});

export default CreatePIN;