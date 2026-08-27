import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Button, Image, Text, useColorScheme, TouchableOpacity, NativeModules, Dimensions, StyleSheet, Pressable, Platform, StatusBar, BackHandler, ActivityIndicator } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Entypo from 'react-native-vector-icons/Entypo';
import { useBackHandler } from "@react-native-community/hooks";
import AsyncStorage from '@react-native-async-storage/async-storage';
import getStyles from '../../styles';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import CloudImage from '../../../utill/CloudImage';



const Intro = (props) => {

  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [btnState, setbtnState] = useState(false)
  const [imageload, setImageload] = useState(true)
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  var { styles } = getStyles(themedata.theme);



  const backActionHandler = async () => {
    BackHandler.exitApp()
    return true;
  };

  useBackHandler(backActionHandler)

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    if (swiperRef.current) {
      if (props.route.params.intro?.data.length - 1 === index) {
        setbtnState(true)
      } else {
        setbtnState(false)
      }

      swiperRef.current.scrollToIndex({ index });
    }
  };

  const handleButtonClick = () => {
    setImageload(true)
    if (props.route.params.intro?.data.length - 2 === currentIndex) {
      setbtnState(true)
    }

    if (currentIndex < props.route.params.intro?.data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (swiperRef.current) {
        swiperRef.current.scrollToIndex({ index: currentIndex + 1 });
      }
    }
  };


  const nextPage = () => {
    props.navigation.navigate('Login')
  }


  useEffect(() => {
    const backAction = async () => {
      await AsyncStorage.setItem('extent', 'image')
      BackHandler.exitApp()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);






  return (
    <SafeAreaView style={styles.whiteContainer}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Pressable style={{ flex: 1, alignItems: 'flex-end', end: 30, justifyContent: 'center' }} onPress={() => nextPage()}>
          <Text style={styles.getStratskipfont}>Skip</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>


        <SwiperFlatList
          ref={swiperRef}
          data={props.route.params.intro?.data}
          renderItem={({ item }) => {

            return (
              <View style={styles.getStartchild}>
                <CloudImage
                  style={styles.getstartImage}
                  type='intro'
                  page='login'
                  cloudSource={item.logo} />

                <View style={{ alignItems: 'center', marginTop: 10 }}>
                  <Text style={[styles.getStarttitle, { color: themeColors?.text_primary }]}>{item.name}</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: 20, marginStart: 30, marginEnd: 30 }}>
                  <Text style={[styles.getStartDescription, { color: themeColors?.text_primary }]}>{item.description}</Text>
                </View>
              </View>
            )
          }
          }
          index={currentIndex}
          onChangeIndex={({ index }) => { setCurrentIndex(index) }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: 70 }}>
          {props.route.params.intro?.data?.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => { setImageload(true), handleDotClick(index) }}>
              <View
                style={[styles.dot, {
                  backgroundColor: index === currentIndex ? themeColors.bgbtn : 'grey',
                  marginHorizontal: 4,
                  opacity: index !== currentIndex ? 0.4 : 1
                }]}
              />
            </TouchableOpacity>
          ))}
        </View>

      </View>



      <View style={{ alignItems: 'center', bottom: 20 }}>
        {
          props.route.params.intro?.data?.length - 1 === currentIndex ?
            <Pressable style={styles.btnbg} onPress={() => nextPage()}>
              <Text style={[styles.btnText, { color: themeColors?.btn_text_color }]}>Get Started</Text>
            </Pressable> :
            <Pressable style={styles.btnbg} onPress={handleButtonClick}>
              <Text style={[styles.btnText, { color: themeColors?.btn_text_color }]}>Next</Text>
            </Pressable>


        }



      </View>
      <View style={{ height: 20 }}></View>
    </SafeAreaView>


  );
};


export default Intro;
