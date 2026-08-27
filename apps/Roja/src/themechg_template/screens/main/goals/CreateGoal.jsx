import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import getStyles from '../../../styles';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFontSize } from '../../../../constants/Font';
import CommonIcon from '../../../component/Commonicons';
import { useDispatch, useSelector } from 'react-redux';
import CommonHead from '../../../component/CommonHead';
import GradientBackground from '../../../component/GradientBackground';
import { fetchmenuSevice } from '../../../../redux/slices/menuiconSlice';
import { BottomContext } from '../../../../context/BottomContext';
import { content } from '../../../../constants/content';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';
import CloudImage from '../../../../utill/CloudImage';






const { width } = Dimensions.get('window');
const containerSize = width / 4 - 15;
const imageSize = containerSize * 0.6;



const CreateGoal = ({ navigation }) => {
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  const { styles: appstyle } = getStyles(themeColors);
  const insets = useSafeAreaInsets();
  const { goaltragets } = useSelector((state) => state.menuicons)
  const dispatch = useDispatch()
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { enableMenu, disableMenu } = useContext(BottomContext);


  useEffect(() => {
    if (!goaltragets?.length) {
      dispatch(fetchmenuSevice())
    }

  }, [dispatch])


  appuseBackHandler(() => {
    navigation.goBack();
    return true;
  });


  const GoalRenderItem = React.memo(({ item, index }) => {



    return (
      <Pressable

        onPress={() => {
          navigation.navigate('CreateGoalformscreen', { item: item })
        }}
        key={index}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: themeColors?.cardbg, opacity: pressed ? 0.6 : 1 },
        ]}
      >

        <View
          style={[styles.imagecontainer,]}
        >
          {
            item?.image &&
            <CloudImage
              style={styles.image}
              page='goal'
              cloudSource={item?.image} />
          }



        </View>

        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              fontFamily: fontsFamily.semiboldFont,
              fontSize: getFontSize(12),
              color: themeColors?.card_text_color,
              textAlign: 'center',
            }}
          >
            {item.name}
          </Text>
        </View>
      </Pressable>
    );
  });



  return (
    <GradientBackground>

      <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
        <CommonHead title={'Create a Goal'} back={'yes'} navigation={navigation} screen={'CreateGoal'} onBackPress={() => navigation.replace('Goal')} />

        <KeyboardAvoidingView
          style={appstyle.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >


          <View style={appstyle.container}>
            <Text style={{ margin: 10, marginTop: 20, color: themeColors?.text_primary, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(16) }}>
              What are you saving for?
            </Text>
            {
              0 < goaltragets?.length && <FlatList
                key={3}
                data={goaltragets}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                renderItem={({ item, index }) => <GoalRenderItem item={item} index={index} />}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                contentContainerStyle={{
                  paddingTop: 10,
                  paddingHorizontal: 10,
                  paddingBottom: insets.bottom + 30,
                }}
              />
            }
          </View>

        </KeyboardAvoidingView>

      </View>
    </GradientBackground>

  )
}

export default CreateGoal

const styles = StyleSheet.create({
  headerWrapper: { padding: 10, backgroundColor: "#FEF7FF", flexDirection: "row" },
  titleText: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) },
  image: {
    resizeMode: 'contain',
    width: imageSize * 0.8,
    height: imageSize * 0.8
  },
  imagecontainer: {
    backgroundColor: '#fff',
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#c9effcff',
    flex: 1,
    margin: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: containerSize,
  }
})