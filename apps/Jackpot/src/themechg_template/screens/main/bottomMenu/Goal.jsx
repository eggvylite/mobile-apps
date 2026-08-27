import React, { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { useGoalData } from './goalComponents/useGoalData';
import GoalCardSkeleton from './goalComponents/GoalCardSkeleton';
import getStyles from '../../../styles';
import GradientBackground from '../../../component/GradientBackground';
import CommonHead from '../../../component/CommonHead';
import GoalListView from './goalComponents/GoalListView';
import DeleteGoalModal from './goalComponents/DeleteGoalModal';
import WithdrawSheet from './goalComponents/WithdrawSheet';
import GoalFilterTabs from './goalComponents/GoalFilterTabs';
import TwowayCustomtab from '../../../component/TwowayCustomtab';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';


const GoalAccountChartView = lazy(() => import('./goalComponents/GoalAccountChartView'));

const spendAsset = require('../../../../../assets/images/s.png');
const withdrawAsset = require('../../../../../assets/images/s1.png');

function ChartFallback({ themeColors }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
            <View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: themeColors?.cardbg }} />
        </View>
    );
}

export default function Goal({ navigation }) {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme;
    const { styles: appstyle } = getStyles(themeColors);
    const insets = useSafeAreaInsets();

    const [activeIndex, setActiveIndex] = useState(0);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [targetGoal, setTargetGoal] = useState(null);
    const [activeGoal, setActiveGoal] = useState(null);
    const sheetRef = useRef(null);
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({ onScroll: (e) => (scrollY.value = e.contentOffset.y) });

    const { goalList, goalaccount, goalloading, storedata, filteredGoals, btnName, setBtnName, refreshing, refresh, deleting, deleteGoal } =
        useGoalData();

    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });

    useFocusEffect(
        useCallback(() => {
            setActiveIndex(0);
            setBtnName('All');
        }, []),
    );

    const handleDeleteConfirm = useCallback(() => {
        setIsDeleteModal(false);
        if (targetGoal) deleteGoal(targetGoal);
    }, [targetGoal, deleteGoal]);

    if (goalloading || deleting) {
        return (
            <GoalCardSkeleton themeColors={themeColors} gradientOff={themedata?.gradient === 'No'} appstyle={appstyle} navigation={navigation} />
        );
    }

    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                <CommonHead title="Goals" back="no" navigation={navigation} screen="Goal" />

                <KeyboardAvoidingView style={appstyle.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    {goalList.length > 0 && (
                        <View style={{ margin: 10 }}>
                            <TwowayCustomtab activeIndex={activeIndex} onChange={setActiveIndex} />
                        </View>
                    )}

                    {goalList.length > 0 && activeIndex === 0 && (
                        <GoalFilterTabs active={btnName} onChange={setBtnName} themeColors={themeColors} />
                    )}

                    {activeIndex === 0 ? (
                        <GoalListView
                            goalList={goalList}
                            filteredGoals={filteredGoals}
                            refreshing={refreshing}
                            onRefresh={refresh}
                            onScroll={scrollHandler}
                            insetsBottom={insets.bottom}
                            navigation={navigation}
                            themeColors={themeColors}
                            currency={storedata?.currency}
                            onOutFund={(item) => {
                                setActiveGoal(item);
                                sheetRef.current?.open();
                            }}
                            onDelete={(item) => {
                                setTargetGoal(item);
                                setIsDeleteModal(true);
                            }}
                        />
                    ) : (
                        <Suspense fallback={<ChartFallback themeColors={themeColors} />}>
                            <GoalAccountChartView goalList={goalList} goalaccount={goalaccount} themeColors={themeColors} currency={storedata?.currency} />
                        </Suspense>
                    )}
                </KeyboardAvoidingView>

                <DeleteGoalModal visible={isDeleteModal} onClose={() => setIsDeleteModal(false)} onConfirm={handleDeleteConfirm} themeColors={themeColors} />

                <WithdrawSheet ref={sheetRef} themeColors={themeColors} navigation={navigation} activeGoal={activeGoal} assets={{ spend: spendAsset, withdraw: withdrawAsset }} />
            </View>
        </GradientBackground>
    );
}
