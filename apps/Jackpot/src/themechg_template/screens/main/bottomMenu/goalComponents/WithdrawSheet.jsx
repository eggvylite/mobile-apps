import React, { forwardRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Divider } from 'react-native-paper';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import CommonIcon from '../../../../component/Commonicons';
import { getGoalTypes } from './goalConstants';
import { getFontSize } from '../../../../../constants/Font';


const WithdrawSheet = forwardRef(({ themeColors, navigation, activeGoal, assets }, ref) => {
  const goalTypes = getGoalTypes(assets);

  return (
    <RBSheet
      ref={ref}
      height={450}
      openDuration={250}
      customStyles={{ container: { borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: themeColors?.cardbg } }}
    >
      <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_text_color }}>
            Withdraw from Goal
          </Text>
          <Pressable onPress={() => ref?.current?.close()} style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, padding: 5 }}>
            <CommonIcon name="clear" family="MaterialIcons" color={themeColors?.iconcolor} />
          </Pressable>
        </View>
        <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />

        <Text style={{ fontSize: getFontSize(14), marginBottom: 10, color: themeColors?.card_text_color, fontFamily: fontsFamily.semiboldFont }}>
          How do you want to use this money?
        </Text>

        {goalTypes.map((item) => (
          <Pressable
            key={item.type}
            onPress={() => {
              navigation.navigate('Takeout', { item: activeGoal, type: item.type });
              ref?.current?.close();
            }}
            style={({ pressed }) => [{ backgroundColor: themeColors?.card_list_bg, marginVertical: 10, padding: 10, borderRadius: 5, opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: themeColors?.iconbg, justifyContent: 'center', alignItems: 'center' }}>
                <CommonIcon name={item.iconname} family={item.iconfamily} size={24} color={themeColors?.iconcolor} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 5, justifyContent: 'center' }}>
                <Text style={{ fontSize: getFontSize(14), color: themeColors?.card_secondary_color, fontFamily: fontsFamily.semiboldFont }}>{item.name}</Text>
                <Text style={{ fontSize: getFontSize(12), color: themeColors?.card_secondary_color, opacity: 0.5, marginTop: 5, lineHeight: 20 }}>{item.des}</Text>
              </View>
              <CommonIcon name="right" family="AntDesign" size={16} color={themeColors?.iconcolor} />
            </View>
          </Pressable>
        ))}
      </View>
    </RBSheet>
  );
});

export default WithdrawSheet;
