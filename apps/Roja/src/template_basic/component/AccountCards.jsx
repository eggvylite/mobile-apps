import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions, ActivityIndicator, RefreshControl, Alert, AppState, Pressable, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CommonFunction from '../../utill/CommonFunction';
import BaseModal from './BaseModel';
import { getDate } from '../../hook/useDashboardUtils';
import { generateReports, getavgMonthlydailybalance } from '../../constants/content';
import { apiformatDate, formatDate } from '../../utill/Utills';
import moment from 'moment';
import timezone from 'moment-timezone'

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.66;
const CARD_HEIGHT = 150;
const CARD_GAP = 16;
const MODAL_CARD_HEIGHT = height * 0.8;

// Mock Data - Local accounts data

const bankColors = [
  ['#ad5389', '#3c1053'],
  ['#2b5876', '#4e4376']
]

const AccountCards = () => {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { bankdata, bankloading, bankerror } = useSelector((state) => state.bank);
  const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { page, size, records, hasMore, firstTransDate } = useSelector((state) => state.statement);
  const [statement, setStatement] = useState([])
  const date = new Date()


  const changeformat = (date) => {
    var dt = moment(new Date(date)).format('YYYY-MM-DD');
    return dt
  }



  const accountTransactions = useMemo(() => {
    return records.filter(item =>
      item.account_guid === selectedCard?.guid &&
      item.bank_id === selectedCard?.bank_id
    );
  }, [records, selectedCard?.guid, selectedCard?.bank_id]);


  const recentTransactions = useMemo(() => {
    return accountTransactions.slice(0, 3);
  }, [accountTransactions]);


  const accountInfo = useMemo(() => {
    const { begin, end } = getDate(date);

    const monthlyTransactions = accountTransactions.filter(item => {
      const txDate = changeformat(item.transacted_at);
      return txDate >= begin && txDate <= end;
    });



    const balance = getavgMonthlydailybalance(monthlyTransactions);
    const { monthlyReport } = generateReports(monthlyTransactions);


    const monthKey = apiformatDate(date);
    const transactionSum = monthlyReport[monthKey]


    return {
      ...balance,...transactionSum

    };
  }, [accountTransactions, date]);





  const closeModal = () => {
    setModalVisible(false);
    setSelectedCard(null);
  };


  const openCardDetails = (card) => {
    console.log('Opening card details for:', card.type);

    setSelectedCard(card);
    setModalVisible(true);
  };

  // Handle scroll
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
    return (
      bankdata?.records?.find(
        item => item?._id === selectedCard?.bank_id
      )?.bank_name ?? ''
    );
  }, [bankdata?.records, selectedCard?.bank_id]);

  const renderDetailedCard = () => {
    if (!selectedCard) return null;

    return (
      <BaseModal title={`Account Activity Overview`} visible={modalVisible} onClose={closeModal}>

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



            <Pressable style={styles.section} onPress={() => {
              closeModal()
            }}>
              <Text style={styles.sectionTitle}>Account Summary</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Available Balance</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(selectedCard.balance)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Bank</Text>
                  <Text style={styles.infoValue}>{CommonFunction.captialize(bankName.toLowerCase())}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Account Type</Text>
                  <Text style={styles.infoValue}>{selectedCard.type}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Routing Number</Text>
                  <Text style={styles.infoValue}>XXXX{CommonFunction.slicenum(selectedCard.account_number)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Avg Daily Balance</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(accountInfo?.dayavg || selectedCard.balance)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Avg Monthly Balnce</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(accountInfo?.monavg || selectedCard.balance)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Money In</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(accountInfo?.credit || 0)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Money Out</Text>
                  <Text style={styles.infoValue}>{storedata?.currency}{CommonFunction.formatamount(accountInfo?.debit || 0)}</Text>
                </View>

              </View>
            </Pressable>

            {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx, index) => {
                    console.log(tx)
                    const isCredit = tx.type === 'CREDIT' ? true : false
                    return (
                      <View key={tx.id || index} style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                          <View style={styles.transactionIcon}>
                            <Icon
                              name={isCredit ? 'call-received' : 'call-made'}
                              size={16}
                              color={isCredit ? '#4CAF50' : '#FF5252'}
                            />
                          </View>
                          <View style={styles.transactionDetails}>
                            <Text style={styles.transactionDesc}>{tx.category}</Text>
                            <Text style={styles.transactionDate}>{formatDateTime(tx.transacted_at)} {formatTime(tx.transacted_at)}</Text>
                          </View>
                        </View>
                        <View style={styles.transactionRight}>
                          <Text style={[
                            styles.transactionAmount,
                            isCredit ? styles.positiveAmount : styles.negativeAmount
                          ]}>
                            {tx.amount}
                          </Text>

                        </View>
                      </View>
                    )
                  }
                  )
                ) : (
                  <Text style={styles.noTransactions}>No transactions yet</Text>
                )}
              </View> */}







          </ScrollView>
        </LinearGradient>

      </BaseModal>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading your accounts...</Text>
      </View>
    );
  }



  // Main render
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsWrapper}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"

      >
        {defaccount.map((card, key) => (
          <TouchableOpacity
            key={card._id}
            activeOpacity={0.9}
            onPress={() => {
              const data = { ...card, color: bankColors[key] }
              openCardDetails(data)
            }}
          >
            <LinearGradient
              colors={bankColors[key] || ['#ad5389', '#3c1053']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              {/* Decorative circles */}
              <View style={styles.circleTopRight}>
                <View style={[styles.circle, {
                  borderWidth: 21,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  width: 98,
                  height: 98
                }]} />
              </View>

              <View style={styles.circleBottomLeft}>
                <View style={[styles.circle, {
                  borderWidth: 21,
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  width: 124,
                  height: 124
                }]} />
              </View>

              {/* Icons */}
              <View style={styles.iconGroup}>
                <View style={styles.iconContainer}>
                  <Entypo name="star" size={10} color="#FFF" style={{ opacity: 0.5 }} />
                  <Entypo name="star" size={6} color="#FFF" style={{ opacity: 0.39, marginLeft: 8 }} />
                </View>
                <View style={styles.iconContainer}>
                  <Entypo name="triangle-up" size={8} color="#FFF" style={{ opacity: 0.5 }} />
                  <Entypo name="triangle-down" size={6} color="#FFF" style={{ opacity: 0.39, marginLeft: 10 }} />
                </View>
                <View style={[styles.largeCircle, { backgroundColor: 'rgba(255, 255, 255, 0.19)' }]} />
              </View>

              {/* Card content */}
              <Text style={styles.cardTitleSmall}>{card.type} Account</Text>
              <Text style={styles.cardAccountSmall}>XX{CommonFunction.slicenum(card.account_number)}</Text>
              <Text style={styles.cardBalanceSmall}>Balance: {storedata?.currency}{CommonFunction.formatamount(card?.balance || 0)}</Text>


              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>View Account</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Page indicators */}
      <View style={styles.carouselIndicators}>
        {defaccount.map((_, index) => (
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
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  emptySubText: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
  },
  cardsWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: CARD_GAP,
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
    left: Platform.OS === 'ios'? 195:175,
    top:   -29,
  },
  circleBottomLeft: {
    position: 'absolute',
    left: -48,
    top: 76,
  },
  circle: {
    borderRadius: 50,
    borderStyle: 'solid',
  },
  iconGroup: {
    position: 'absolute',
    left: Platform.OS === 'ios'? 225:200,
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
    position: 'absolute',
    textTransform: 'uppercase',
    left: 9,
    top: 20,
    width: 178,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardAccountSmall: {
    position: 'absolute',
    left: 10,
    top: 40,
    width: 178,
    color: '#ebe8e8',
    fontSize: 10,
    fontWeight: '500',
  },
  cardBalanceSmall: {
    position: 'absolute',
    left: 10,
    top: 60,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardHolderSmall: {
    position: 'absolute',
    left: 10,
    top: 70,
    color: 'white',
    fontSize: 8,
    opacity: 0.8,
  },
  cardButton: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -69.5 }],
    top: 95,
    width: 139,
    height: 27,
    borderRadius: 3,
    borderWidth: 0.4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  cardButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  dotIndicatorActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#373737',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailedCardWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  detailedCard: {

    borderRadius: 20,
  },
  detailedCardContent: {
    padding: 20,
  },
  cardFrontSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankLogo: {
    width: 50,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankLogoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardAccount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 5,
  },
  cardBalance: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 15,
  },
  accountType: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 5,
  },
  cardNumber: {
    color: 'white',
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 20,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    marginBottom: 2,
  },
  cardValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoGrid: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  infoValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDesc: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionDate: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: '#4CAF50',
  },
  negativeAmount: {
    color: '#FF5252',
  },
  transactionStatus: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    marginTop: 2,
  },
  noTransactions: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 80,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

export default AccountCards;