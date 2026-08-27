import { View, ScrollView, Dimensions, StyleSheet, Platform, Text, Image, useWindowDimensions, Animated, BackHandler, TouchbleOpacity, Alert, Pressable, StatusBar } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import GradientBackground from '../../../../component/GradientBackground';
import CommonHeader from '../../../../component/CommonHeader';
import { Button } from 'react-native-paper';
import { getFontSize } from '../../../../../constants/Font';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomer } from '../../../../../redux/slices/customerSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import CommonFunction from '../../../../../utill/CommonFunction';
import { fetchAdvancesListHistory } from '../../../../../redux/slices/advanceTransSlice';
import { fetchOutstanding, fetchadvanceActiveSubscription,fetchactivesubscription } from '../../../../../redux/slices/advenceSlice';
import moment from 'moment';
import timezone from 'moment-timezone';
import NoRecord from '../../../../component/NoRecord';
import Icon from 'react-native-vector-icons/Feather';
import Loader from '../../../../component/Loader';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import ChoosePlan from '../../../../component/ChoosePlan';
import { fetchChoosePlan } from '../../../../../redux/slices/choosePlanSlice';
import { fetchcurrentsubscription } from '../../../../../redux/slices/subscriptionSlice';
import AntDesign from 'react-native-vector-icons/AntDesign'
import getStyles from '../../../../styles';
import Plan from '../../../../component/Plan';
import { fetchNotication } from '../../../../../redux/slices/notificationSlice';
import { fetchAuth,updateAuthdata } from '../../../../../redux/slices/authSlice';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { BottomContext } from '../../../../../context/BottomContext';
import { useBackHandler } from '@react-native-community/hooks';
import { getLoginInfo } from '../../../../../service/storage';




export default function Advance(props) {
  const { cusDetails, loading, error } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  const [isCardtite, setIscardTitle] = useState(false)
  var { styles } = getStyles(themeColors);
  const { width, height } = Dimensions.get('window');
  const [loading1, setLoading] = useState(false)
  const [loginfo, setloginfo] = useState('');
  const { plandata, planeloading, planeerror } = useSelector((state) => state.chooseplan);
  const [isPlanpage, setIsplanPage] = useState(false)
  const { subscription, subloading } = useSelector((state) => state.subscription);
  const { totalBill, activeSub, minAmount, maxAmount } = useSelector((state) => state.advance);
  const { advhistory, advloading } = useSelector((state) => state.advancehistory);
  const { paymentMethods } = useSelector(state => state.payment);
  const { enableMenu, disableMenu } = useContext(BottomContext);


  useEffect(() => {
    getDetails()

  }, [])



  const getDetails = async (data) => {

    var login = await getLoginInfo()
    if (login.plan === 'No') {
      setIsplanPage(true)


    }

    setloginfo(login);

  }



  useEffect(() => {
    if (subscription) {
      setLoading(false)
    }

  }, [subscription])








  const getCurrency = () => {
    return loginfo?.currency
      ? loginfo?.currency
      : null;
  };





  const changeDate = (date) => {
    const df = moment(new Date(date)).format(loginfo?.format)
    return df

  }


  const changeTime = (date) => {
    const df = moment.tz(date, loginfo?.zone).format('hh:mm A ');
    return df;
  };


  const navigationBack = () => {
     props.navigation.goBack(),
      enableMenu()

  }

  const backActionHandler = () => {
    navigationBack()
    return true;
  };

  useBackHandler(backActionHandler)






  const completdSub = async () => {
    setLoading(true)
    setIsplanPage(false)
    const data = {
      ...loginfo, plan: 'Yes'
    }
    dispatch(fetchAuth())
    setloginfo(data)

    dispatch(fetchOutstanding())
    dispatch(fetchcurrentsubscription())
    dispatch(fetchChoosePlan())
    dispatch(fetchadvanceActiveSubscription())
    setLoading(false)


  }


  const CardSkeleton = () => {
    return (
      <GradientBackground>
        <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
          {
            subscription && subscription?.status !== 'Active' ?
              <CommonHeader title={isPlanpage ? 'Choose Plan' : 'Get Cash Advance'} back={isPlanpage ? 'yes' : 'no'} onBackPress={() => setIsplanPage(false)} /> :
              <CommonHeader back={'yes'} title={isCardtite ? 'Add New Payment Method' : isPlanpage ? 'Choose Plan' : 'Get Cash Advance'} onBackPress={() => props?.navigation.goBack()} />

          }
          <View style={{ marginStart: 10, marginEnd: 10, }}>

            <SkeletonPlaceholder
              backgroundColor={themeColors?.cardbg}
              highlightColor={themeColors?.backgroundcolor}
            >
              <SkeletonPlaceholder.Item
                width={width * 0.9}
                height={250}
                borderRadius={10}
                marginTop={'18%'}
                marginStart={10}
                marginEnd={10}
              />
              <SkeletonPlaceholder.Item
                width={width * 0.9}
                height={40}
                borderRadius={10}
                marginTop={20}
                marginStart={10}
                marginEnd={10}
              />
              {[...Array(10)].map((_, index) => (
                <View
                  key={index}
                  style={{ flexDirection: 'row', marginTop: 20, marginStart: 10, marginEnd: 10 }}
                >
                  <View style={{ width: width * 0.9, height: 120, borderRadius: 10 }} />


                </View>
              ))}
            </SkeletonPlaceholder>
          </View>
        </View>
      </GradientBackground>

    );
  };



  if (subloading || loading1 || advloading) {
    return (
      <CardSkeleton />
    )
  }







  return (
    <GradientBackground>

      <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
        <StatusBar backgroundColor={themeColors?.statusbar} />


        
            {/* <CommonHeader title={isPlanpage ? 'Choose Plan' : 'Get Cash Advance'} back={isPlanpage ? 'yes' : 'no'} onBackPress={() => setIsplanPage(false)} /> : */}
            <CommonHeader back={'yes'} title={isCardtite ? 'Add New Payment Method' : isPlanpage ? 'Choose Plan' : 'Get Cash Advance'} onBackPress={() => {
              navigationBack()
            }} />

        



        {
          Object.keys(cusDetails).length !== 0 &&
          <View style={{ flex: 1 }}>
            {
              isPlanpage ?
                <Plan
                  addPaymentCard={(obj) => {
                    if (obj === 'add') {
                      setIscardTitle(true)
                    } else {
                      setIscardTitle(false)
                    }

                  }}
                  onChange={(obj) => {
                    if (obj === 'completed') {
                      completdSub()
                    } else {
                       setLoading(false)
                    }
                  }} />
                :
                <View style={{ flex: 1 }}>


                  {

                    Object.keys(plandata).length !== 0 && plandata?.features?.find((obj) => obj.id === '6811fd9203aa1e0c342025b2')?.available_for !== 'All_users' && isPlanpage ?
                      <ChoosePlan message={plandata.subscribed_customer_only} onClick={() => { setIsplanPage(true) }} /> :
                      // Object.keys(data2).length !== 0 && !data2.plan_features.includes('6811fd9203aa1e0c342025b2') ?
                      //   <ChoosePlan title={data2.noteligible} message={data2.noteligible} onClick={() => { setIsplanPage(true) }} info={loginfo} />

                      <ScrollView

                        showsVerticalScrollIndicator={false} style={{ flex: 1, margin: 10, }} contentContainerStyle={styles.scrollContainer}>

                        {loginfo && (
                          <View>

                            <View style={styles.container}>
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

                                <View style={styles.contentBox}>
                                  {
                                    subscription?.status === 'Expired' ||  subscription?.status === 'Failed' ?
                                      <View>


                                        {
                                          0 < totalBill ?
                                            <>
                                              <Text style={[styles.advtitle, { fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(14), lineHeight: 22 }]}>
                                                Your Total Outstanding
                                              </Text>


                                              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                                                <View

                                                  style={{ padding: 15, backgroundColor: themeColors?.inputprimary, justifyContent: "center", alignItems: 'center', flexDirection: 'row', borderRadius: 5, width: 200 }}  >
                                                  <Text style={{ color: themeColors?.inputsecondary, fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(18), marginEnd: 10 }}> {getCurrency()}{totalBill.toFixed(2)}</Text>

                                                </View>
                                              </View>

                                              <TouchableOpacity
                                                onPress={() => {
                                                  props.navigation.navigate('Payment')
                                                }}
                                                style={{ padding: 10, backgroundColor: themeColors.primaryColor, justifyContent: "center", alignItems: 'center', flexDirection: 'row', borderRadius: 5, flex: 1, marginHorizontal: 100, marginTop: 10 }}  >
                                                <Image  source={require('../../../../../../assets/images/pay.png')} style={{ height: 13, width: 15, marginRight: 5 }} resizeMode='contain' />
                                                <Text style={{ color: themeColors?.card_text_color, fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(14), marginEnd: 10 }}> Pay Now</Text>
                                              </TouchableOpacity>
                                            </>
                                            :
                                            <>
                                              <View>
                                                <View
                                                  style={{

                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                  }}>
                                                  <Text
                                                    style={[

                                                      { fontSize: getFontSize(14), color: themeColors?.card_text_color, marginTop: 20, textAlign: 'center', fontFamily: fontsFamily.semiboldFont },
                                                    ]}>
                                                    Oops! You have no subscription. So kindly subscribe any plan and get cash now.
                                                  </Text>
                                                </View>






                                              </View>

                                              <View

                                                style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center", padding: 10, marginBottom: 20 }}>


                                                  <TouchableOpacity
                                                    style={[{ backgroundColor: themeColors?.bgbtn, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 8, padding: 10 }]}
                                                    onPress={() => setIsplanPage(true)}>
                                                    <Text
                                                      style={[

                                                        { fontFamily: 'Roboto-Bold', textAlign: 'center', color: themeColors?.btn_text_color },
                                                      ]}>
                                                      Choose Plan{' '}
                                                    </Text>
                                                  </TouchableOpacity>





                                                  {0 < totalBill && (
                                                    <>


                                                      <TouchableOpacity
                                                        onPress={() => props.navigation.navigate('Payment')}
                                                        style={[{ backgroundColor: themeColors?.bgbtn, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 8, padding: 10 }]}
                                                      >
                                                        <Text style={{ fontFamily: 'Roboto-Bold', textAlign: 'center', color: themeColors?.btn_text_color }}>
                                                          Pay Due {getCurrency()}
                                                          {totalBill.toFixed(2)}{' '}
                                                        </Text>
                                                      </TouchableOpacity>

                                                    </>

                                                  )}

                                                </View>
                                              </View>


                                            </>

                                        }

                                      </View>
                                      :
                                      <View >



                                        {
                                          0 < totalBill ? <Text style={[styles.advtitle, { fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(14), lineHeight: 22 }]}>
                                            Current Outstanding
                                          </Text> : <Text style={[styles.advtitle, { fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(14), lineHeight: 22 }]}>
                                            You are Approved for
                                          </Text>
                                        }



                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                                          <View

                                            style={{ padding: 15, backgroundColor: themeColors?.inputprimary, justifyContent: "center", alignItems: 'center', flexDirection: 'row', borderRadius: 5, width: 200 }}  >
                                            {
                                              0 < totalBill ? <Text style={{ color: themeColors?.inputsecondary, fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(18), marginEnd: 10 }}> {getCurrency()}{totalBill.toFixed(2)}</Text> : <Text style={{ color: themeColors?.inputsecondary, fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(18), marginEnd: 10 }}> {getCurrency()}{activeSub?.plan_cash_upto.toFixed(2)}</Text>
                                            }

                                          </View>
                                        </View>


                                        {
                                          0 < totalBill && <TouchableOpacity
                                            onPress={() => {
                                              props.navigation.navigate('Payment')
                                            }}
                                            style={{ padding: 10, backgroundColor: themeColors?.bgbtn, justifyContent: "center", alignItems: 'center', flexDirection: 'row', borderRadius: 5, flex: 1, marginHorizontal: 80 }}  >
                                            <Image source={require('../../../../../../assets/images/pay.png')} style={{ height: 13, width: 15, marginRight: 5 }} resizeMode='contain' />
                                            <Text style={{ color: themeColors?.btn_text_color, fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(14), marginEnd: 10 }}> Pay Now</Text>
                                          </TouchableOpacity>
                                        }


                                        <View style={{ marginTop: 10, alignItems: "center", justifyContent: 'center' }}>



                                          {
                                            totalBill === 0 && <TouchableOpacity
                                              onPress={() => {

                                                if (0 < paymentMethods?.length) {
                                                  props.navigation.navigate('Getadvance', { mimamonu: minAmount, maxAmount: maxAmount, activeSub: activeSub, currency: getCurrency() })
                                                } else {
                                                  Alert.alert(
                                                    'No Payment Method Found',
                                                    'Please add a payment method to proceed further',
                                                    [
                                                      {
                                                        text: 'Cancel',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel',
                                                      },
                                                      {
                                                        text: 'Add Payment Method',
                                                        onPress: () =>
                                                          props.navigation.navigate('Payment', { account: 'yes' }),
                                                      },
                                                    ],
                                                  );
                                                }

                                              }}
                                              style={{ padding: 10, backgroundColor: themeColors?.bgbtn, justifyContent: "center", alignItems: 'center', flexDirection: 'row', paddingStart: 20, borderRadius: 5, marginStart: 10 }}  >
                                              <Image source={require('../../../../../../assets/images/pay.png')} style={{ height: 14, width: 15, marginRight: 5 }} resizeMode='contain' />
                                              <Text style={{ color: themeColors?.btn_text_color, fontFamily: 'Roboto-SemiBold', fontSize: getFontSize(14), marginEnd: 10 }}> Get Advance </Text>
                                            </TouchableOpacity>
                                          }


                                        </View>

                                        {/* {
                                          activeSub?.plan_cash_upto - activeSub?.used_advance > 0 && <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>

                                          </View>
                                        }

                                        {
                                          allrecord?.unpaidmsg && 0 < totalBill && <View style={{ marginTop: 20, alignItems: 'center', marginBottom: 20 }}>


                                            <Text style={{ color: themeColors?.card_text_color, fontFamily: fontsFamily.regularFont, fontSize: getFontSize(14), textAlign: 'justify', marginHorizontal: 10 }}>{allrecord?.unpaidmsg}</Text>

                                          </View>
                                        } */}



                                      </View>

                                  }




                                </View>
                              </View>
                            </View>


                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginHorizontal: 10 }}>


                              <Text
                                style={[

                                  {
                                    fontSize: getFontSize(16),
                                    fontFamily: 'Roboto-SemiBold',
                                    marginBottom: 20,
                                    color: themeColors?.text_primary
                                  },
                                ]}>
                                List of advances
                              </Text>



                              <Text

                                onPress={() => {
                                  props.navigation.navigate('AdvacnceHistory');
                                }}
                                style={[

                                  {
                                    fontSize: getFontSize(14),
                                    fontFamily: 'Roboto-SemiBold',
                                    marginBottom: 20,
                                    color: themeColors?.bgbtn
                                  },
                                ]}>
                                View All
                              </Text>
                            </View>



                            {0 < advhistory.length ? (
                              <View>
                                {advhistory.slice(0, 5).map((item, index) => {
                                  return (
                                    <Pressable
                                      onPress={() => props.navigation.navigate('AdvaceTransactiondetails', { data: item, customer: loginfo })}
                                      key={index} style={{ borderTopLeftRadius: 20, borderBottomRightRadius: 20, margin: 10 }}>
                                      <View style={{ borderTopLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: themeColors?.card_list_bg }} >
                                        <View style={{ flexDirection: 'row', padding: 5 }}>
                                          <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingStart: 10, paddingEnd: 10, paddingTop: 10, paddingBottom: 10 }}>
                                              {
                                                item?.transaction_id === "Free" ? <Text style={{ fontFamily: fontsFamily.semiboldFont, color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>
                                                  {

                                                    <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), color: themeColors?.card_secondary_color }}>{item?.transaction_id} </Text>
                                                  }

                                                </Text> : <Text style={{ fontFamily: fontsFamily.semiboldFont, color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>

                                                  {item?.txnmsg ? item?.txnmsg : 'N/A'}
                                                </Text>
                                              }


                                              {
                                                <View>
                                                  <Text
                                                    style={[

                                                      {
                                                        color: themeColors?.card_secondary_color,
                                                        fontFamily: fontsFamily.semiboldFont,
                                                        fontSize: getFontSize(14),
                                                      },
                                                    ]}>

                                                    {getCurrency()}{item?.advance_amount.toFixed(2)}
                                                  </Text>

                                                </View>
                                              }


                                            </View>

                                            <View style={{ flexDirection: 'row', flex: 1, paddingStart: 10, paddingEnd: 10, paddingBottom: 10 }}>
                                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont, fontSize: getFontSize(12), opacity: 0.5 }}>
                                                  Transaction On
                                                </Text>
                                                <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), marginTop: 5 }}>
                                                  {changeDate(item.advance_date) + '  ' + changeTime(item?.advance_date)}
                                                </Text>
                                              </View>

                                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont, fontSize: getFontSize(12), opacity: 0.5 }}>
                                                  Disbursement
                                                </Text>
                                                {
                                                  item?.advance_id === "Free" ? <Text style={{ color: 'black', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), marginTop: 5 }}>
                                                    NA
                                                  </Text> : <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), marginTop: 5, }}>
                                                    {getCurrency()}{item?.transaction_amount.toFixed(2)}
                                                  </Text>
                                                }


                                              </View>
                                            </View>
                                          </View>
                                          <View style={{ alignItems: 'center', justifyContent: 'center', end: 10, marginStart: 10 }}>
                                            <TouchableOpacity style={{ backgroundColor: themeColors?.iconbg, padding: 5, borderRadius: 50 }} onPress={() => props.navigation.navigate('AdvaceTransactiondetails', { data: item, customer: loginfo })}>
                                              <AntDesign name='right' color={themeColors?.iconcolor} size={13} />
                                            </TouchableOpacity>
                                          </View>
                                        </View>
                                      </View>
                                    </Pressable>


                                  );
                                })}
                              </View>
                            ) : (
                              <NoRecord />
                            )}
                          </View>
                        )}

                      </ScrollView>
                  }
                </View>

            }

          </View>

        }
      </View>
    </GradientBackground>

  )

}

