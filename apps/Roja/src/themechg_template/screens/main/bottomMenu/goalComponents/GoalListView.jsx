import React, { memo, useCallback } from 'react';
import { View, Text, Pressable, RefreshControl, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import CommonIcon from '../../../../component/Commonicons';
import { getFontSize } from '../../../../../constants/Font';
import GoalCard from '../../../../component/GoalCard';
import { commondateformat } from '../../../../../utill/Utills';
import GoalEmtyScreen from '../../../../component/GoalEmtyScreen';

function GoalListView({
  goalList,
  filteredGoals,
  refreshing,
  onRefresh,
  onScroll,
  insetsBottom,
  navigation,
  themeColors,
  currency,
  onOutFund,
  onDelete,
}) {
  const renderItem = useCallback(
    ({ item }) => {
      const progress = Math.min(item?.savedamount + item?.spent / item.amount, 1);
      return (
        <Pressable onPress={() => navigation.replace('ViewGoal', { item })}>
          <GoalCard
            title={item.name}
            data={item}
            progress={progress}
            currentSavings={item?.savedamount ?? 0}
            targetGoal={item?.amount}
            spentAmount={item?.spent}
            stillToSave={(item?.amount || 0) - (item?.savedamount || 0) - (item?.spent || 0)}
            targetDate={commondateformat(item?.targetdate)}
            editenable
            icon={item}
            currency={currency}
            outFountPress={() => onOutFund(item)}
            deletePress={() => onDelete(item)}
            viewonPress={() => navigation.navigate('ViewGoal', { item })}
            addfontPress={() => navigation.navigate('AddFunds', { item })}
            editPress={() => navigation.navigate('CreateGoalformscreen', { item, edit: 'yes' })}
          />
        </Pressable>
      );
    },
    [navigation, currency, onOutFund, onDelete],
  );

  if (!goalList.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GoalEmtyScreen onPress={() => navigation.navigate('CreateGoal')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {filteredGoals.length ? (
        <Animated.FlatList
          data={filteredGoals}
          keyExtractor={(item) => item?._id}
          onScroll={onScroll}
          bounces={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#502c3d', '#00BCD4', '#FFC107']}
              progressBackgroundColor="#E0E0E0"
              tintColor={themeColors?.text_secondary}
              titleColor={themeColors?.text_secondary}
            />
          }
          contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 10, paddingBottom: insetsBottom + 30 }}
          renderItem={renderItem}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: themeColors?.text_secondary, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14) }}>
            No Record available
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={{ position: 'absolute', right: 20, bottom: 30, height: 50, width: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors?.bgbtn }}
        onPress={() => navigation.navigate('CreateGoal')}
      >
        <CommonIcon name="add-outline" family="Ionicons" color={themeColors?.btn_text_color} />
      </TouchableOpacity>
    </View>
  );
}

export default memo(GoalListView);
