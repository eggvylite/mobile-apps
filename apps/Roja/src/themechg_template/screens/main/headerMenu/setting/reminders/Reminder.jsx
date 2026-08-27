import { FlatList, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, Image, TextInput, Alert } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import getStyles from '../../../../../styles';
import GradientBackground from '../../../../../component/GradientBackground';
import CommonHeader from '../../../../../component/CommonHeader';
import { getFontSize } from '../../../../../../constants/Font';
import { fontsFamily } from '../../../../../../constants/fontsFamily';
import NoRecord from '../../../../../component/NoRecord';
import { Menu } from "react-native-paper";
import { fetchReminder } from '../../../../../../redux/slices/reminderSlice';
import CommonFunction from '../../../../../../utill/CommonFunction';
import CommonIcon from '../../../../../component/Commonicons';
import { content } from '../../../../../../constants/content';
import { useBackHandler } from '@react-native-community/hooks';
import { appuseBackHandler } from '../../../../../../utill/appuseBackHandler';
import api from '../../../../../../service/api';




const Reminder = (props) => {
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  const { styles } = getStyles(themeColors);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { reminderdata, reminderoading, remindererror } = useSelector((state) => state.reminder);
  const paramsdata = props?.route?.params
  const [remindedata, setremaindata] = useState([])
  const { allbankaccountlist, } = useSelector((state) => state.getaccount);
  const dispatch = useDispatch()
  const [id, setid] = useState('')



  appuseBackHandler(() => {
    props?.navigation.goBack();
    return true;
  });

  useEffect(() => {
    if (0 < reminderdata?.length) {
      const pendingremaingdata = reminderdata.filter((obj) => obj.status === 'Pending')
      setremaindata(pendingremaingdata)
    } else {
      setremaindata([])
    }
  }, [reminderdata])

  const calculateDaysAgo = (date) => {
    if (date) {
      const now = new Date();
      const Due = new Date(date);
      const differenceInTime = now - Due;
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays;
    }

  };



  const formatchDate = (date) => {
    const d = new Date(date);
    return `On ${d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })}`;
  };

  const getbgcolor = (date) => {
    var countdays = calculateDaysAgo(date)
    if (countdays === 0) {
      // return themeColors?.danger
      return themeColors?.bglight
    } else if (0 < countdays) {
      return themeColors?.warning
    } else {
      return themeColors?.bglight
    }

  }

  const getcolor = (date) => {
    var countdays = calculateDaysAgo(date)
    // if (countdays === 0) {
    //   return '#fff'

    // } else if (0 < countdays) {
    //   return '#000000'
    // } else {
    //   return '#000'
    // }
    return '#000'
  }

  const payReminder = (value) => {
    api.get('dashboard/remindermarkaspaid/' + value?._id).then((res) => {
      console.log(res.data)
      dispatch(fetchReminder())
      CommonFunction.message(res?.data?.message)
      console.log(res?.data)
    }).catch((err) => {
      console.log(err.response.data)

    })

  }

  async function setmarkset(value) {

    Alert.alert(
      "Alert",
      "Do you want to mark it as paid?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("No Pressed"),
          style: "cancel"
        },
        {
          text: "Mark as Paid",
          onPress: () => payReminder(value)
        }
      ],
      { cancelable: true }
    );


  }

  const backActionHandler = () => {
    navigationBack()
    return true;
  };

  useBackHandler(backActionHandler)


  const navigationBack = () => {
    props?.navigation.goBack()
  }


  return (
    <GradientBackground>
      <View style={styles.container}>
        <CommonHeader back={'yes'} title={paramsdata ? paramsdata?.title : 'Bill Reminders'} onBackPress={() => navigationBack()} />
        {
          0 < remindedata.length ?
            <ScrollView>
              {
                remindedata.map((value, key) => {
                  if (value && value?.date) {
                    const accountDetails = value?.account_id
                    var number = ''
                    if (accountDetails?.account_number) {
                      number = ' -  XX' + CommonFunction.slicenum(accountDetails?.account_number)
                    } else {
                      number = ' - ' + content.manual
                    }
                    const daysAgo = calculateDaysAgo(value.date);
                    let displayText = "";
                    let dispalypast = '';
                    if (value.status !== "Paid") {
                      if (daysAgo > 0 && daysAgo <= 7) {
                        // Past within 7 days
                        if (1 < daysAgo) {
                          displayText = `${daysAgo} days ago`;
                        } else {
                          displayText = `${daysAgo} day ago`;
                        }
                      }
                      else if (daysAgo > 7) {
                        // Past more than 7 days
                        displayText = `${formatchDate(value.date)}`;
                      }
                      else if (daysAgo === 0) {
                        displayText = "Today";
                      }
                      else if (daysAgo < 0 && Math.abs(daysAgo) <= 7) {
                        // Future within 7 days
                        if (1 < daysAgo) {
                          displayText = `Due In ${Math.abs(daysAgo)} days`;
                        } else {
                          displayText = `Due In ${Math.abs(daysAgo)} day`;
                        }
                      }
                      else {
                        // Future more than 7 days (e.g., -13)
                        displayText = `${formatchDate(value.date)}`;
                      }
                    }

                    if (daysAgo > 0) {
                      dispalypast = 'Past'
                    } else {
                      dispalypast = ''
                    }

                    return (
                      <Pressable style={{ backgroundColor: themeColors?.card_list_bg, padding: 20, margin: 5, borderRadius: 8, paddingStart: 15, marginTop: 10, marginStart: 15, marginEnd: 15 }} key={key}
                        onPress={() => props?.navigation.navigate('ViewBill', { item: value, screen: 'dash' })}>


                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <View style={{ flex: 1 }}>

                            <View >
                              <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(14), fontFamily: fontsFamily.semiboldFont }}>{value.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                              <View>
                                <CommonIcon family={'FontAwesome'} name={'bank'} size={12} color={themeColors?.card_secondary_color} />
                              </View>
                              <View style={{ marginStart: 10 }}>
                                <Text style={[styles.textchg, { fontSize: getFontSize(12), marginTop: 0, color: themeColors?.card_secondary_color, fontWeight: 'normal' }]}>{value?.account_id?.type}{number}</Text>
                              </View>
                            </View>
                          </View>

                          <View style={{ flex: 1, alignItems: 'flex-end', marginEnd: 10 }}>
                            <View >
                              <Text style={{ color: getcolor(value?.date), fontSize: getFontSize(14), color: themeColors?.card_secondary_color }}>{displayText}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                              <Text style={[styles.textchg, { fontSize: getFontSize(16), color: themeColors?.card_secondary_color, marginTop: 0 }]}>{storedata.currency}{CommonFunction.formatamount(value.amount)}</Text>

                            </View>

                          </View>
                          <View style={{ justifyContent: 'center' }}>
                            <CommonIcon family={'Entypo'} name={'chevron-right'} color={themeColors?.bgbtn} size={20} />
                          </View>
                        </View>

                      </Pressable>
                    )
                  }
                })
              }
            </ScrollView>

            // <FlatList
            //     data={remindedata}
            //     keyExtractor={(item) => item?._id}
            //     renderItem={renderItem}
            //     initialNumToRender={10}
            //     maxToRenderPerBatch={10}
            //     windowSize={5}
            //     removeClippedSubviews={false}

            // />

            :


            <NoRecord />

        }

      </View>

    </GradientBackground>
  )
}

export default Reminder


