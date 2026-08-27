import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  Keyboard,
  Alert
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import { useForm } from 'react-hook-form';
import { duration } from 'moment';
import GradientBackground from '../../../../component/GradientBackground';
import CommonHeader from '../../../../component/CommonHeader';
import { getFontSize } from '../../../../../constants/Font';
import Loader from '../../../../component/Loader';
import CommonFunction from '../../../../../utill/CommonFunction';
import { fetchOutstanding, fetchadvanceActiveSubscription } from '../../../../../redux/slices/advenceSlice';
import Svg, { Path } from 'react-native-svg';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { RadioButton } from 'react-native-paper';
import { fetchNotication,resetNotification } from '../../../../../redux/slices/notificationSlice';
import Paymentsuccess from '../../../../component/Paymentsuccess';
import RBSheet from "react-native-raw-bottom-sheet";
import getStyles from '../../../../styles';
import { getFcmToken } from '../../../../../service/NotificationServices';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { resetTransaction } from '../../../../../redux/slices/transactionSlice';
import PaymentCardlist from '../../../../component/PaymentCardlist';
import AddPaymentCard from '../../../../component/AddPaymentCard';
import { BottomContext } from '../../../../../context/BottomContext';
import { useBackHandler } from '@react-native-community/hooks';
import { getLoginInfo } from '../../../../../service/storage';
import api from '../../../../../service/api';


const { width, height } = Dimensions.get('window');



const Getadvance = ({ navigation, route }) => {


  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  var { styles, geticonSize, textColor, } = getStyles(themeColors);

  const [amount, setAmount] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState('Instant_funding');
  const [loading, setLoading] = useState(false);
  // const { data } = useSelector((state) => state.customer);
  const dispatch = useDispatch()
  const { control, trigger, register, handleSubmit, reset, resetField, formState: { errors } } = useForm({});
  const [getsetting, setsettings] = useState('');
  const [loginfo, setcusinfo] = useState('');
  const [loader, setloader] = useState(false);
  const [paymensucces, setpaymentsuccess] = useState(false)
  const [paymentmessage, setpaymentmessage] = useState('')
  const refRBCardSheet = useRef()
  const [data, setData] = useState('')
  const { defcardpm } = useSelector(state => state.payment);
  const [cardOpen, setcardOpen] = useState(false)
  const { enableMenu, disableMenu } = useContext(BottomContext);
  const { totalBill, activeSub, minAmount, maxAmount } = useSelector((state) => state.advance);


  const currency = route?.params?.currency;
  const keyboardHeight = useSharedValue(0);





  useEffect(() => {
    const details = {
      type: 'get',
      amount: disAmount(),
      pmcard: defcardpm
    }
    setData(details)

  }, [toggleCheckBox])

  async function apiServices(params) {

    dispatch(fetchOutstanding())

    dispatch(fetchadvanceActiveSubscription())
  }



  const navigationBack = () => {
    if (cardOpen) {
      setcardOpen(false)
      enableMenu()
      refRBCardSheet?.current?.open()
    } else {
      navigation.goBack()
    }
  }

  const backActionHandler = () => {
    navigationBack()
    return true;
  };

  useBackHandler(backActionHandler)





  useEffect(() => {
    reset(getsetting);
  }, [getsetting]);

  const handleInputChange = (name, value) => {
    setsettings({ ...getsetting, [name]: value });
  };


  const getCash = async (obj) => {

    refRBCardSheet?.current?.close()
    const usercustomer = await getLoginInfo()
    setloader(true)

    const payload = {
      advance_amount: activeSub?.plan_cash_upto,
      customer_id: usercustomer.id,
      payment_mode: toggleCheckBox,
      // remarks: getsetting.remark,
      device_name: CommonFunction.getdevicename(),
      platform: CommonFunction.getOS(),
      ipaddress: await CommonFunction.getipaddress(),
      pm: obj.cardno
    }





   api.post('advances/' + usercustomer.id, payload)
      .then(function (response) {
        let data = response.data;
        dispatch(resetNotification())
        setpaymentmessage(data.message)
        dispatch(fetchOutstanding())
        dispatch(fetchadvanceActiveSubscription())
        setpaymentsuccess(true)
        setloader(false);
        dispatch(resetTransaction())
        dispatch(resetAdvTransaction())
        dispatch(fetchNotication(100))


      })
      .catch(err => {
        console.log(err.response, '-----');
        setloader(false);
        CommonFunction.message(err.response.data.message, 'danger');
        console.log(err.response.data);

      });

  }

  const disAmount = () => {
    var amt = 0
    if (toggleCheckBox == 'Instant_funding') {
      amt = Number(activeSub?.plan_cash_upto) - Number(activeSub?.plan_instant_funding_price)
    } else {
      amt = activeSub?.plan_cash_upto
    }

    return CommonFunction.formatamount(amt)

  }

  if (loader) {
    return <Loader label={'Loading'} />
  }




  if (paymensucces) {

    return (
      <Paymentsuccess data={paymentmessage} title={'Advance'} />
    )
  } else {
    return (
      <GradientBackground>

        <View style={styles.container} >
          <CommonHeader
            title={cardOpen ? "Add New Payment Method" : "Get  Advance"}
            back={'yes'}
            onBackPress={() => {
              navigationBack()
            }}
          />
          {
            cardOpen ?
              <AddPaymentCard
                onExit={() => {
                  setcardOpen(false)
                  refRBCardSheet?.current?.open()
                  enableMenu()
                }}
                disable={(obj) => {
                  const details = {
                    ...data, pmcard: obj
                  }
                  setData(details)
                  refRBCardSheet?.current?.open()
                  setcardOpen(false)
                }}
              /> :
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                style={{ flex: 1 }}>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="handled"
                  style={{ flex: 1, margin: 10 }}>



                  <Animated.View style={[styles.container]}>
                    <View style={styles.topSpacer} />

                    <View style={styles.innerWrapper}>
                      <View style={styles.floatingBox} >
                        <View style={{ backgroundColor: 'white', height: 80, width: 80, borderRadius: 50 }}>
                          <Image source={require('../../../../../../assets/images/cash.png')} style={{ height: 70, width: 70 }} resizeMode='contain' />
                        </View>

                      </View>
                      <Svg
                        height="40"
                        width="100%"
                        viewBox="0 0 300 40"
                        preserveAspectRatio="none"
                      >

                        <Path
                          d="M0 40
                                 Q0 0 10 0
                                 H110
                                 A40 40 0 0 0 190 0
                                 H260
                                 Q500 0 300 10
                                 V80
                                 H0
                                 Z"
                          fill={themeColors?.cardbg}
                        />

                      </Svg>
                      <View style={styles.contentBox} >

                        <View style={{}}>
                          <Text style={[styles.title, { fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(16), lineHeight: 22, color: themeColors?.card_text_color }]}>
                            You are Approved for
                          </Text>


                          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                            <View
                              onPress={() => props.navigation.navigate('Plan')}
                              style={{ padding: 15, backgroundColor: themeColors?.inputprimary, justifyContent: "center", alignItems: 'center', flexDirection: 'row', borderRadius: 5, }}  >

                              <Text style={{ color: themeColors?.inputsecondary, fontFamily: 'Roboto-Bold', fontSize: getFontSize(18), }}> {currency}{CommonFunction.formatamount(activeSub?.plan_cash_upto)}</Text>
                            </View>
                          </View>



                          <View style={{ marginTop: 20, alignItems: 'center', marginBottom: 20 }}>

                            {activeSub?.plan_instant_fund == 'yes' ? (
                              <TouchableOpacity
                                style={{ flexDirection: 'row', marginTop: 15 }}
                                onPress={() => setToggleCheckBox('Instant_funding')}>
                                <View style={{ justifyContent: 'flex-start' }}>
                                  <RadioButton.Android
                                    value={'Instant_funding'}
                                    color={themeColors.bgbtn}
                                    uncheckedColor={themeColors?.card_text_color}
                                    status={toggleCheckBox === 'Instant_funding' ? 'checked' : 'unchecked'}
                                    onPress={() => setToggleCheckBox('Instant_funding')}
                                    lineWidth={2}

                                  />
                                </View>
                                <View style={{ flex: 1, marginStart: 10, }}>
                                  <Text
                                    style={[

                                      {
                                        fontSize: getFontSize(16),
                                        lineHeight: 28,
                                        fontFamily: fontsFamily.regularFont, color: themeColors?.card_text_color
                                      },
                                    ]}>
                                    Instant Funding


                                  </Text>
                                  <Text
                                    style={[

                                      {
                                        lineHeight: 22,
                                        fontSize: getFontSize(13),
                                        marginBottom: 5, fontFamily: fontsFamily.regularFont, color: themeColors?.card_text_color
                                      },
                                    ]}>
                                    {currency}{CommonFunction.formatamount(activeSub?.plan_instant_funding_price)} convenience fee • Typically available within minutes

                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ) : (
                              <Text
                                style={[

                                  { fontSize: getFontSize(14), height: 24, fontFamily: fontsFamily.regularFont, color: themeColors?.card_text_color },
                                ]}>
                                Payment will be processed with ACH method.(If you need
                                instant fund you should subscribe any plan with instant fund
                                feature.)
                              </Text>
                            )}


                            <TouchableOpacity
                              style={{ flexDirection: 'row', marginTop: 15 }}
                              onPress={() => setToggleCheckBox('ACH')}>
                              <View >
                                <RadioButton.Android
                                  value={'ACH'}
                                  color={themeColors.bgbtn}
                                  uncheckedColor={themeColors?.card_text_color}
                                  status={toggleCheckBox === 'ACH' ? 'checked' : 'unchecked'}
                                  onPress={() => setToggleCheckBox('ACH')}
                                  lineWidth={2}
                                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}

                                />
                              </View>
                              <View style={{ flex: 1, marginStart: 10, }}>
                                <Text
                                  style={[

                                    {
                                      fontSize: getFontSize(16),
                                      lineHeight: 28, fontFamily: fontsFamily.regularFont, color: themeColors?.card_text_color
                                    },
                                  ]}>
                                  Standard ACH Transfer


                                </Text>
                                <Text
                                  style={[

                                    {
                                      fontSize: getFontSize(13),
                                      marginBottom: 5,
                                      lineHeight: 22, fontFamily: fontsFamily.regularFont, color: themeColors?.card_text_color
                                    },
                                  ]}>
                                  No fee • Typically available in 2–3 business days


                                </Text>
                              </View>
                            </TouchableOpacity>


                          </View>


                          <View
                            style={{
                              alignItems: 'center',
                              marginHorizontal: 25,
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                refRBCardSheet?.current?.open()
                              }}
                              style={[

                                {
                                  marginBottom: 40,
                                  backgroundColor: themeColors.bgbtn,
                                  height: 45,
                                  justifyContent: 'center',
                                  alignItems: 'center', padding: 10, borderRadius: 5
                                },
                              ]}>
                              <Text style={[{ color: themeColors?.btn_text_color, fontSize: getFontSize(14), fontFamily: 'Roboto-Bold', marginRight: 10, marginStart: 10 }]}>
                                Get Advance {currency}{disAmount()}
                              </Text>
                            </TouchableOpacity>
                          </View>

                        </View>


                      </View>
                    </View>
                  </Animated.View>




                </ScrollView>


              </KeyboardAvoidingView>
          }

        </View>
        <RBSheet
          ref={refRBCardSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          useNativeDriver={true}
          height={500}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: themeColors?.cardbg
            },
            draggableIcon: {
              backgroundColor: themeColors?.card_text_color,
            },


          }}>



          <View style={{ flex: 1, borderRadius: 30, padding: 10 }}>

            <PaymentCardlist
              data={data}
              addCard={() => {
                setcardOpen(true)
                refRBCardSheet?.current?.close()
              }}
              onCloseSheet={() => {
                refRBCardSheet?.current?.close()
              }}
              onComplete={(obj) => {
                getCash(obj)
              }}
            />


          </View>

        </RBSheet>
      </GradientBackground>
    );
  }



};

export default Getadvance;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  container: {
    flex: 1,
  },
  topSpacer: {
    height: height * 0.1,
  },
  innerWrapper: {
    padding: 10,
    position: 'relative',
  },
  floatingBox: {
    backgroundColor: 'transparent',
    height: height * 0.13,
    width: width * 0.25,
    position: 'absolute',
    zIndex: 1,
    top: -height * 0.07,
    left: width * 0.350,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    backgroundColor: '#E9F5FF',

    // borderRadius: 16,
    padding: 20,
  },
});

