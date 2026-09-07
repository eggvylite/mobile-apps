import { Animated, StyleSheet, View, Easing, Image, Alert, StatusBar, Dimensions } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonFunction from '../../../utill/CommonFunction';
import { Chase } from "react-native-animated-spinkit";
import { useDispatch, useSelector } from 'react-redux';
import { fetchcolor } from '../../../redux/slices/appcolorSlice';
import CloudImage from '../../../utill/CloudImage';
import api from '../../../service/api';
import { getFcmToken } from '../../../service/NotificationServices';
import { ErrorContext } from '../../../context/ErrorContext';
import { fetchmenuSevice } from '../../../redux/slices/menuiconSlice';
import { getLoginInfo } from '../../../service/storage';
import { themeColors } from '../../Common';
import { requestLocationPermission, requestNotificationPermission } from '../../../service/permissions';
import { getOTP } from '../../../constants/Loginapi';
import { fetchScreenLabels } from '../../../redux/slices/applabelsSlice';
import { fetchLabel } from '../../../redux/slices/labelSlice';
import appLog from '../../../constants/logger';



const Splash = ({ navigation }) => {
  const fadeInMove = useRef(new Animated.Value(0)).current;
  const fadeOutMove = useRef(new Animated.Value(1)).current;
  const translateXMove = useRef(new Animated.Value(0)).current;
  const secondImageFadeIn = useRef(new Animated.Value(0)).current;
  const { themedata } = useSelector((state) => state.appcolor);
  const secondImageTranslateX = useRef(new Animated.Value(100)).current;
  const { onbordcontent } = useSelector((state) => state.menuicons);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth)
  const { changeErrmsg } = useContext(ErrorContext);
  const { width, height } = Dimensions.get('window')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchmenuSevice())
    dispatch(fetchLabel())
    dispatch(fetchcolor())
  }, [])



  useEffect(() => {
    Animated.sequence([

      Animated.timing(fadeInMove, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(800),


      Animated.parallel([
        Animated.timing(fadeOutMove, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateXMove, {
          toValue: -200,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ]),
      Animated.delay(100),


      Animated.parallel([
        Animated.timing(secondImageFadeIn, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(secondImageTranslateX, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);



  useEffect(() => {
    getDetails()

  }, [])

  const removeSeesion = () => {
    let keys = ['@cusLoginInfo'];
    AsyncStorage.multiRemove(keys, (err) => {
      if (err) {
        console.log(err)
      }
      navigation.navigate('Login')
    });
  }

  const getDetails = async () => {
    await AsyncStorage.setItem('main', 'splashscreen')

    if (Platform.OS === 'android') {
      requestNotificationPermission();
    }

    // requestLocationPermission();


    requestNotificationPermission()
    setTimeout(async () => {
      const loginfo = await getLoginInfo()
      if (loginfo && loginfo.phone) {
        console.log('hello')
        const payload = {
          device_id: await CommonFunction.getDeviceID(),
          phone: CommonFunction.decryptString(loginfo.phone),
          splash: 1,
          device_name: CommonFunction.getdevicename(),
          device_token: await getFcmToken()
        }
        console.log(payload)

        try {
          await getOTP(navigation, payload)
        } catch (error) {
          if (error?.response?.status < 500) {
            removeSeesion()
          } else {
            changeErrmsg('error')
          }
          removeSeesion()
        }



      } else {
        console.log('hello 1')
        api.get('contents/getstartscreen').then(res => {

          if (0 < res.data?.data?.length) {
            navigation.navigate('Intro', { intro: res.data })
          } else {
            navigation.navigate('Login')
          }


        }).catch(err => {
          changeErrmsg('error')
          console.log(err)

        })

      }
    }, 3000)

  }




  return (
    <View style={{
      flex: 1,
      backgroundColor: themeColors.backgroudColor
    }}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <View style={{ flex: 1.8, alignItems: 'center', justifyContent: 'center' }}>



        {
           themedata?.logo ?
            <CloudImage
              style={{ width: 200, height: 110 }}
              page='login'
              cloudSource={themedata.logo} /> :
            <Image source={require('../../../../assets/images/jackpot-logo.png')}  style={[splashstyles.image, { width: 200, height: 100 }]} resizeMode='contain' />
        }


      </View>


      <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', bottom: 50 }}>
        <Chase
          style={Platform.OS === 'ios' ? { width: width * 1, height: height * 0.06 } : { width: 50, height: 50, }}
          color={themeColors.primarColor} />
      </View>
    </View>


  );
};

export default Splash;

