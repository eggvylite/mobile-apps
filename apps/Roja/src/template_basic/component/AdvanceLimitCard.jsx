import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Modal, ScrollView, Alert, ActivityIndicator, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useDashboardUtils } from '../../hook/useDashboardUtils';
import { useSelector } from 'react-redux';
import CommonFunction from '../../utill/CommonFunction';
import BaseModal from './BaseModel';
import CashCard from './CashCard';
import appLog from '../../constants/logger';
import OutstandingCard from '../screens/main/dashboard/componets/OutstandingCard';

const AdvanceLimitCard = () => {
  const navigation = useNavigation();
  const { advhistory } = useSelector((state) => state.advancehistory || {});
  const { themeColors, storedata, formatAmount } = useDashboardUtils();
  const { subscription } = useSelector((state) => state.subscription || {});
  const { storedata: loginfo } = useSelector((state) => state.auth || {});
  const { dashboardLabel } = useSelector((state) => state.labels || {});
  const { totalBill, activeSub, minAmount, maxAmount } = useSelector((state) => state.advance || {});
  const { cusDetails, cusloading } = useSelector((state) => state.customer);



  if (cusDetails?.subscription === "Yes" || subscription?.status === "Active") {
    return (
      <View >
        {/* {
          totalBill === 0 ? <CashCard type={'advance'} amount={activeSub?.plan_cash_upto} onClick={() => {
            navigation?.navigate('GetAdvance')
          }} /> : <CashCard type={'bill'} amount={totalBill} onClick={() => {
            navigation?.navigate('GetAdvance')
          }} />
        } */}

        <OutstandingCard
          outstandingBalance={totalBill}
          advanceCount={advhistory?.length || 0}
          advanceHistory={advhistory}
          totalAdvanceTaken={activeSub?.used_advance || 0}
          maxAdvanceAmount={activeSub?.plan_cash_upto || 0}
          isCarouselItem={true} />

        {/* <CashCard type={'advance'} amount={activeSub?.plan_cash_upto} total={totalBill} onClick={() => {
            navigation?.navigate('GetAdvance')
          }} /> */}


      </View>
    );
  }


  if (cusDetails?.subscription === "No" || subscription?.status === "Failed") {

    return (
      <View >
        <CashCard type={'nosuscribtion'} amount={cusDetails?.advance || 0} onClick={() => {
          navigation?.navigate('Plan')
        }} />

      </View>
    );
  }

};

const styles = StyleSheet.create({

});

export default AdvanceLimitCard;