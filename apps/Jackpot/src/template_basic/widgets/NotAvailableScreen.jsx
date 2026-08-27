import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { fontsFamily } from '../../constants/fontsFamily'
import SubmitBtn from '../component/SubmitBtn'
import { useNavigation } from '@react-navigation/native'
import useFeatureWorkInfoLabel from '../../hook/useFeatureInfoWorkLablehook'

const NotAvailableScreen = ({ title, description }) => {
  const navigation = useNavigation()
  const { featureLabel } = useFeatureWorkInfoLabel()

  return (
    <ScrollView contentContainerStyle={styles.detailedScrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.detailedContainer}>
        <View style={styles.imageContainer}>
          <Image source={require('../../../assets/images/unavailablenew.png')} style={styles.detailedImage} />
        </View>

        <Text style={styles.head}>
          {featureLabel?.name || "Currently Unavailable"}
        </Text>
        <Text style={styles.detailedSubheader}>
          {featureLabel?.description || "We're sorry, but this feature isn't available at the moment."}
        </Text>


        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles?.button}>
          <Text style={styles?.buttontext}> Back to Dashboard </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  )
}

export default NotAvailableScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailedScrollContent: {
    flexGrow: 1,
  },
  detailedContainer: {

    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  detailedImage: {
    height: 220,
    width: 220,
    resizeMode: 'contain',
    marginBottom: 20
  },
  closeIconBadge: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: '#C06C84',
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: '#121212'
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: 'cover'
  },
  head: {
    color: '#121212',
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center'
  },
  subheader: {
    color: 'gray',
    marginTop: 10,
    fontFamily: fontsFamily.regularFont,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginHorizontal: 50,
    lineHeight: 22
  },
  detailedSubheader: {
    color: 'gray',
    marginTop: 15,
    fontFamily: fontsFamily.regularFont,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 30,
    lineHeight: 20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#3E16AC',
    padding: 15,
    borderRadius: 10
  },
  buttontext: {
    color: '#ffff',
    fontSize: 14,
    fontWeight: 'bold'
  }
})