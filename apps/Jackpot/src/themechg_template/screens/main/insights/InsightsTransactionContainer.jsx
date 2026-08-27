import { StyleSheet, Text, View, Image, Dimensions, } from 'react-native'
import React, { useContext } from 'react'
import getStyles from '../../../styles';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { getFontSize } from '../../../../constants/Font';
import CloudImage from '../../../../utill/CloudImage';

const InsightsTransactionContainer = (props) => {

  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  var { styles, geticonSize, textColor, } = getStyles(themeColors);

  return (
    <View style={{ borderTopLeftRadius: 20, borderBottomEndRadius: 20, marginTop: '10%', borderColor: props.color, borderWidth: 1, padding: 15, margin: 5, backgroundColor: props?.color }}>
      <View style={{ flexDirection: 'row', marginStart: 10, marginEnd: 10 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: themeColors?.white, height: 25, width: 25, alignItems: 'center', justifyContent: 'center' }}>
              {/* <Image source={{ uri: props.image }} resizeMode='contain' style={{ height: 20, width: 20, tintColor: props.imgcolor }} /> */}

              {
                props.iconsfamily === 'FontAwesome' ?
                  <FontAwesome name={props.iconname} color={themeColors.dark} size={geticonSize} /> :
                  props.iconsfamily === 'AntDesign' ?
                    <AntDesign name={props.iconname} color={themeColors.dark} size={geticonSize} /> :
                    props.iconsfamily === 'MaterialIcons' ?
                      <MaterialIcons name={props.iconname} color={themeColors.dark} size={geticonSize} /> :
                      props.iconsfamily === 'MaterialCommunityIcons' ?
                        <MaterialCommunityIcons name={props.iconname} color={themeColors.dark} size={geticonSize} /> :
                        props.iconsfamily === 'FontAwesome5' ?
                          <FontAwesome5 name={props.iconname} color={themeColors.dark} size={geticonSize} /> :
                          props.iconsfamily === 'Ionicons' ?
                            <Ionicons name={props.iconname} color={themeColors.dark} size={geticonSize} /> :
                            <CloudImage
                              style={{ height: 20, width: 20, tintColor: props.imgcolor }}
                              page='main'
                              cloudSource={props.image } />
                //  <Image source={{ uri: props.image }} resizeMode='contain' style={{ height: 20, width: 20, tintColor: props.imgcolor }} />
              }

            </View>
            <View style={{ justifyContent: 'center', marginStart: 10 }}>
              <Text style={styles.insightscontainhead}>{props.labelamt ? props.label + ' ' + props.labelamt : props.label}</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end', start: 5 }}>
          {
            props.onClick &&
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
              props.onClick()
            }}>
              <Text style={styles.insightscontainhead}>View all</Text>
              <View style={{ start: 5, justifyContent: 'center' }}>
                <AntDesign name="right" color={themeColors?.card_secondary_color} size={16} />
              </View>

            </TouchableOpacity>
          }

        </View>
      </View>

      <View style={{ marginTop: 20, flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center', borderEndWidth: 1 }}>
          <Text style={[styles.insightscontainsubhead,]}>{props.label === 'Budgets' ? 'More Per Month' : props.label === 'Spending Categories' ? 'Most Spending' : props.label === 'Variance' ? 'Budget' : props.label === 'Tags' ? 1 < props.count ? 'Total Tags' : 'Total Tag' : 1 < props.count ? 'Total Transactions' : 'Total Transaction'}</Text>
          <Text style={[styles.insightscontainsubheadvalue]}>{props.transaction}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.insightscontainsubhead}>{props.label === 'Budgets' ? 'More Per Year' : props.label === 'Spending Categories' ? 'Least Spending' : props.label === 'Variance' ? 'Actual' : 'Amount'}</Text>
          <Text style={styles.insightscontainsubheadvalue}>{props.amount}</Text>
        </View>

      </View>

    </View>

  )
}

export default InsightsTransactionContainer