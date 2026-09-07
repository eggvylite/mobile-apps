import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions, ActivityIndicator, Pressable, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import CommonFunction from '../../utill/CommonFunction';
import BaseModal from './BaseModel';
import { getDate } from '../../hook/useDashboardUtils';
import { generateReports, getavgMonthlydailybalance } from '../../constants/content';
import { apiformatDate } from '../../utill/Utills';
import moment from 'moment';
import { fontsFamily } from '../../constants/fontsFamily';
import OutstandingCard from '../screens/main/dashboard/componets/OutstandingCard';
import appLog from '../../constants/logger';
import { getFontSize } from '../../constants/Font';
import useDashboardLablehook from '../../hook/Labels/useDashboardLablehook';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;
const CARD_GAP = 10;
const CARD_HEIGHT = 180;

const bankColors = [
  ['#ad5389', '#3c1053'],
  ['#2b5876', '#4e4376'],
  ['#1a2980', '#26d0ce'],
  ['#090f38', '#05033e']
];

const AccountCards = () => {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { cusDetails, loading, error } = useSelector((state) => state.customer);
  const { bankdata } = useSelector((state) => state.bank);
  const { defaccount, accountloading } = useSelector((state) => state.account);
  const { storedata } = useSelector((state) => state.auth);
  const { totalBill, activeSub, maxAmount } = useSelector((state) => state.advance || {});
  const { advhistory } = useSelector((state) => state.advancehistory || {});
  const { records } = useSelector((state) => state.statement);
  const { accoounts } = useDashboardLablehook()

  const date = new Date();

  const changeformat = (date) => {
    var dt = moment(new Date(date)).format('YYYY-MM-DD');
    return dt;
  };

  const accountTransactions = useMemo(() => {
    if (!selectedCard) return [];
    return records.filter(item =>
      item.account_guid === selectedCard?.guid &&
      item.bank_id === selectedCard?.bank_id
    );
  }, [records, selectedCard?.guid, selectedCard?.bank_id]);

  const accountInfo = useMemo(() => {
    if (!selectedCard) return null;
    const { begin, end } = getDate(date);

    const monthlyTransactions = accountTransactions.filter(item => {
      const txDate = changeformat(item.transacted_at);
      return txDate >= begin && txDate <= end;
    });

    const balance = getavgMonthlydailybalance(monthlyTransactions);
    const { monthlyReport } = generateReports(monthlyTransactions);

    const monthKey = apiformatDate(date);
    const transactionSum = monthlyReport[monthKey];

    return {
      ...balance, ...transactionSum
    };
  }, [accountTransactions, selectedCard, date]);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCard(null);
  };

  const openCardDetails = (card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(index);
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (CARD_WIDTH + CARD_GAP),
        animated: true,
      });
      setActiveIndex(index);
    }
  };

  const bankName = useMemo(() => {
    if (!selectedCard) return '';
    return (
      bankdata?.records?.find(
        item => item?._id === selectedCard?.bank_id
      )?.bank_name ?? ''
    );
  }, [bankdata?.records, selectedCard?.bank_id]);

  const allCards = useMemo(() => {
    const cards = [];
    if (defaccount) {
      defaccount.forEach((acc, index) => {
        cards.push({
          type: 'account',
          data: { ...acc, color: bankColors[index % bankColors.length] }
        });
      });
    }

    return cards;
  }, [defaccount]);

  
  const renderDetailedCard = () => {
    if (!selectedCard) return null;

    return (
      <BaseModal title={accoounts?.account_activity} visible={modalVisible} onClose={closeModal}>
        <LinearGradient
          colors={selectedCard.color}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.detailedCard}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.detailedCardContent}
          >
            <Pressable style={styles.section} onPress={closeModal}>
              <Text style={[styles.sectionTitle,{color: 'white'}]}>{accoounts?.account_summery}</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{accoounts?.avb_balance}</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(selectedCard.balance)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{accoounts?.bank}</Text>
                  <Text style={styles.infoValue}>{CommonFunction.captialize(bankName.toLowerCase())}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{accoounts?.account_type}</Text>
                  <Text style={styles.infoValue}>{selectedCard.type}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{accoounts?.routingnumber}</Text>
                  <Text style={[styles.infoValue,{letterSpacing: 2}]} >{accoounts?.xacount}{CommonFunction.slicenum(selectedCard.account_number)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{accoounts?.avgdailybalance}</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(accountInfo?.dayavg || selectedCard.balance)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{accoounts?.avgmonthlybalance}</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(accountInfo?.monavg || selectedCard.balance)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{accoounts?.moneyin}</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(accountInfo?.credit || 0)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{accoounts?.moneyout}</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(accountInfo?.debit || 0)}</Text>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </BaseModal>
    );
  };

  if (accountloading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3F2B96" />
        <Text style={styles.loadingText}>Loading your accounts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',margin:15}}>
        <View style={{flex:1}}>
        <Text style={styles.sectionTitle}>{accoounts?.bank_accounts}</Text>
        </View>

        <View style={{justifyContent:'center'}}>
          <Text>{allCards.length} { 1 < allCards.length ? accoounts?.accounts : accoounts?.account}</Text>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsWrapper}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
      >
        
        {allCards.map((item, index) => {
        
          const card = item.data;

          if (card) {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => openCardDetails(card)}
                style={{ marginRight: CARD_GAP }}
              >
                <LinearGradient
                  colors={card.color}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                 
                  <View style={{ margin: 20, }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitleSmall}>{CommonFunction.captialize(card.type?.toLowerCase())} {accoounts?.accountbalance}</Text>
                        <View style={{ marginTop: 5 }}>
                          <Text style={[styles.cardBalanceSmall, { color: '#fff' }]}>{storedata?.currency}{CommonFunction.formatamount(card?.balance || 0)}</Text>
                        </View>
                      </View>
                      <View>
                        <FontAwesome name="bank" size={25} color="#fff" />
                      </View>
                    </View>


                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                      <Text style={[styles.cardAccountSmall, { letterSpacing: 2 }]}>{accoounts?.xacount} {CommonFunction.slicenum(card.account_number)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.cardButtonText, { textTransform: 'uppercase', fontFamily: fontsFamily.regularFont, fontSize: getFontSize(9) }]}>{accoounts?.accountholdername}</Text>
                        <Text style={[styles.cardButtonText, { textTransform: 'uppercase', marginTop: 5, fontSize: getFontSize(14) }]} numberOfLines={1}>{cusDetails?.firstname} {cusDetails?.lastname}</Text>
                      </View>
                      <View style={{ justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', gap: 5 }}>
                          <Feather name='eye' color={'#fff'} size={14} />
                          <Text style={styles.cardButtonText}>{accoounts?.view}</Text>
                        </View>
                      </View>
                    </View>
                  </View>


                  {/* 
                  <Text style={styles.cardAccountSmall}>XX{CommonFunction.slicenum(card.account_number)}</Text> */}
                  {/* <View style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>View Account</Text>
                  </View> */}
                </LinearGradient>
              </TouchableOpacity>


            );
          }

        })}
      </ScrollView>

      {/* Page indicators */}
      <View style={styles.carouselIndicators}>
        {allCards.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={[
              styles.dotIndicator,
              activeIndex === index && styles.dotIndicatorActive,
            ]}
          />
        ))}
      </View>

      {/* Detailed card modal */}
      {renderDetailedCard()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: CARD_HEIGHT + 40,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    fontFamily: fontsFamily.mediumFont,
  },
  cardsWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  circleTopRight: {
    position: 'absolute',
    right: -20,
    top: -29,
  },
  circleBottomLeft: {
    position: 'absolute',
    left: -48,
    top: 100,
  },
  circle: {
    borderRadius: 50,
    borderStyle: 'solid',
  },
  iconGroup: {
    position: 'absolute',
    right: 20,
    top: 8,
    width: 30,
    height: 26,
    alignItems: 'flex-end',
  },
  iconContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  largeCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  cardTitleSmall: {
    color: 'white',
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.semiboldFont,
  },
  cardAccountSmall: {
    color: '#ebe8e8',
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.mediumFont,
  },
  cardBalanceSmall: {
    fontSize: 18,
    fontFamily: fontsFamily.boldFont,
  },
  cardButton: {
    bottom: 15,
    left: 15,
    right: 15,
    height: 32,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardButtonText: {
    color: 'white',
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.mediumFont,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  dotIndicatorActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3F2B96',
  },
  detailedCard: {
    borderRadius: 20,
    margin: 10,
  },
  detailedCardContent: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontsFamily.semiboldFont,
    fontWeight: '00',
    color: '#1b1b1b',

  },
  infoGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginTop:15,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  infoValue: {
    color: 'white',
    fontSize: 14,
    fontFamily: fontsFamily.mediumFont,
  },
});

export default AccountCards;
