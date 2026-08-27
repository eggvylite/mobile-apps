import React, { useContext,useState,useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import { useSelector } from 'react-redux';

const PercentageBar = ({
  navigation,
  head,
  percentage,
  height,
  backgroundColor,
  completedColor,
  label,
  budget,
  actual,
  header
}) => {
  const [getPercentage, setPercentage] = useState('');
  const [getheight, setHeight] = useState(height);
  const [getBackgroundColor, setBackgroundColor] = useState(backgroundColor);
  const [getCompletedColor, setCompletedColor] = useState(completedColor);
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme


  useEffect(() => {
      setPercentage(percentage)
      sliceValue()
  }, [percentage])

  const sliceValue=()=>{
  //   const number=percentage.split('%')
    return parseInt(percentage)

  }

  const percent=()=>{
     if(actual > budget && budget != 0) {
          return 100
     } else {
      var test = actual * 100 / budget
      return Math.round(test);
     }
  }

  
  const headerpercent=(data)=>{
      if(100 <= percentage) {
          return 100
      } else {
          return data
      }
      

  }


  return (
      <View>
          <View style={{ justifyContent: 'center' }}>
              <View
                  style={{
                      width: '100%',
                      borderRadius: 14,
                      height: 6,
                      marginVertical: 10,
                      backgroundColor: getBackgroundColor,
                      borderColor: getBackgroundColor,
                      borderWidth: 1,
                  }}
              />

      


              <View
                  style={{
                      width:head === 'yes'? percentage +'%' : header === 'yes' ? headerpercent(percentage):  percent() ? percent() + '%' : 0,
                      height: 6,
                      borderRadius: 5,
                      backgroundColor:head === 'yes' || header === 'yes' ? getCompletedColor : actual < budget ? themeColors?.bgbtn: themeColors?.danger,
                      position: 'absolute',
                  }}
              >

              </View>




              
              {
                  label &&
                  <View style={{ position: 'absolute', start: percent() === 100 ? percent()-5 +'%' :  percent()+'%'}}>
                      <View style={{bottom:20}}>
                          <View style={{backgroundColor:themeColors.buttonBgColor,padding:5,borderRadius:5,end:13,alignItems:'center',justifyContent:'center'}}>
                          <Text style={{ color: '#fff', fontSize: getFontSize(12),fontFamily:fontsFamily.boldFont}}>{Platform.OS === 'android' ? getPercentage+'%' : getPercentage }</Text>
                          </View>
                      </View>
                  </View>

              }


          </View>
      </View>
  );
};

export default PercentageBar;
