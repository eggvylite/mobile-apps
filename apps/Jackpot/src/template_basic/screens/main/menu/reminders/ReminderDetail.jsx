import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Animated, Dimensions, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../../component/TopBar';
import { themeColors } from '../../../../Common';
import CommonFunction from '../../../../../utill/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { content } from '../../../../../constants/content';
import moment from 'moment';
import { cancelBill, deleteBill, markasPaid } from '../../../../../constants/Reminderapi';
import CommonIcon from '../../../../../common_component/Commonicons';
import PromptModel from '../../../../component/PromptModel';
import GradientCard from '../../../../component/GradientCard';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../constants/Font';
import appLog from '../../../../../constants/logger';
import { BottomContext } from '../../../../../context/BottomContext';
import { SubscriptionDetailsSkeleton } from '../../subscription/component/SubscriptionLoader';
import { RimanderDetailsSkeleton } from './RimanderDetailsSkeleton';
import { appuseBackHandler } from '../../../../../utill/appuseBackHandler';

const { width } = Dimensions.get('window');

export default function ReminderDetail({ }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { reminder } = route.params || {};
  const { reminderdata, reminderoading, remindererror } = useSelector((state) => state.reminder);
  const [isPaid, setIsPaid] = useState(false);
  const [details, setDetails] = useState('')
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [billHistory, setBillhistory] = useState([])
  const { billdata, billloading } = useSelector((state) => state.bill);
  const dispatch = useDispatch()
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false)
  const [isCancel, setIsCancel] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const { enableMenu, disableMenu } = useContext(BottomContext);
  const cancelContent = 'Ending this reminder will only mark it as completed. It will not delete the reminder or its associated history'
  const deleteContent = "Once it's deleted, you won't be able to recover it"
  const [marlaspaidLoading, setMarkaspaidLoading] = useState(false)

  const getReminderStatus = () => reminder?.status || ''
  const reminderStatus = getReminderStatus();
  const statusBgColor = reminderStatus.toLowerCase() === 'active' ? '#D1FAE5' : '#F1F5F9';
  // const statusTextColor = reminderStatus.toLowerCase() === 'active' ? '#10B981' : '#64748B';



  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);


  const statusTextColor = useMemo(() => {
    return details?.status?.toLowerCase() === 'active' ? '#10B981' : '#64748B';
  }, [details?.status])


  useEffect(() => {
    const billone = billdata?.find((item) => item?._id === reminder?.bill_id || item?._id === reminder?._id)
    console.log(billone)
    setDetails(billone)
    disableMenu()
  }, [billdata, reminder])

  useEffect(() => {
    if (0 < reminderdata?.length) {
      const historydata = reminderdata.filter((obj) => obj.bill_id === details?._id).reverse();
      setBillhistory(historydata)
    } else {
      setBillhistory([])
    }

  }, [reminderdata, details])


  const formatDate = (date) => {
    return date ? moment(date).format(storedata?.format) : ''
  }


  appuseBackHandler(() => {
    onBackscreen()
    return true;
  });


  const onBackscreen = () => {
    enableMenu()
    navigation.goBack()
  }


  if (!reminder) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>No reminder found</Text>
      </SafeAreaView>
    );
  }



  const payReminder = async (value) => {
    setMarkaspaidLoading(true)
    try {
      const paid = await markasPaid(value, dispatch)
      setMarkaspaidLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      setMarkaspaidLoading(false)
    }

  }




  const handleMarkAsPaid = (value) => {
    Alert.alert(
      'Mark as Paid',
      'Are you sure you want to mark this as paid?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Mark Paid',
          onPress: () => {
            payReminder(value)
            // setIsPaid(true);
            // Alert.alert('Success', 'Reminder marked as paid!');
          }
        }
      ]
    );
  };

  const handleDelete = async () => {
    setloading(true)
    try {
      const billDelete = await deleteBill(details, dispatch)
      navigation.replace('Reminders')
      CommonFunction.message(billDelete?.data?.message ?? '')
      setIsDelete(false)
    } catch (error) {
      setIsDelete(false)
      CommonFunction.message(error?.response?.data?.message ?? '')
    } finally {
      setloading(false)
    }

  };

  const handleCancel = async () => {
    setloading(true)
    try {
      const cancel = await cancelBill(details, dispatch)
      setIsCancel(false)

      CommonFunction.message(cancel?.data?.message ?? '')
    } catch (error) {
      CommonFunction.message(error?.response?.data?.message ?? '')
      setIsCancel(false)

    } finally {
      setloading(false)
    }
  };

  const DetailRow = ({ label, value, icon }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailRowLeft}>
        <View style={styles.detailIconContainer}>
          <Feather name={icon} size={14} color="#2A1B6D" />
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  );

  const PaymentHistoryItem = ({ item }) => {

    const accountDetails = item?.account_id
    var number = ''
    if (accountDetails?.account_number) {
      number = ' -  XX' + CommonFunction.slicenum(accountDetails?.account_number)
    } else {
      number = ' - ' + content.manual
    }
    var displayText = `${formatchDate(item.date)}`;

    return (
      <View style={styles.paymentHistoryItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.paymentHistoryTitle}>{item.name}</Text>
          <View style={{ marginTop: 10, flexDirection: 'row' }}>
            <View style={{ justifyContent: 'center' }}>
              <FontAwesome name={'calendar'} size={14} color={'#000'} />
            </View>
            <View style={{ marginStart: 10, justifyContent: 'center' }}>
              <Text style={styles.paymentHistoryDate}>{displayText}</Text>
            </View>

          </View>
          {
            accountDetails?.account_number &&
            <View style={{ marginTop: 10, flexDirection: 'row' }}>
              <View style={{ justifyContent: 'center' }}>
                <FontAwesome name={'bank'} size={14} color={'#000'} />
              </View>
              <View style={{ marginStart: 10, justifyContent: 'center' }}>
                <Text style={styles.paymentHistoryDate}>{accountDetails?.type} - {number}</Text>
              </View>

            </View>
          }

        </View>
        <View style={styles.paymentHistoryRight}>
          <Text style={styles.paymentHistoryAmount}>{storedata?.currency}{CommonFunction.formatamount(item?.amount || 0)}</Text>
          <View style={[styles.paymentStatusBadge, { backgroundColor: '#D1FAE5' }]}>
            <View style={[styles.paymentStatusDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.paymentStatusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    )
  };




  const { pendingBill, paidBill } = useMemo(() => {
    const pendingBill = [];
    const paidBill = [];

    billHistory?.forEach(item => {
      const status = item?.status?.toLowerCase();

      if (status === 'pending') pendingBill.push(item);
      if (status === 'paid') paidBill.push(item);
    });

    return { pendingBill, paidBill };
  }, [details, billHistory]);

  const formatchDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })}`;
  };


  const calculateDaysAgo = (date) => {
    if (date) {
      const now = new Date();
      const Due = new Date(date);
      const differenceInTime = now - Due;
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays;
    }

  };


  const getcolor = (date) => {
    var countdays = calculateDaysAgo(date)
    if (countdays === 0) {
      return themeColors?.danger
    } else if (0 < countdays) {
      return themeColors?.warning
    } else {
      return '#000'
    }

  }

  const editReminder = () => {
    navigation.navigate('AddReminderForm', { selectItem: reminder, screen: 'edit' })
  }



  return (
    <SafeAreaView style={styles.safeArea}  >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="View Reminder"
        showBack={true}
        edit={reminder?.status === 'Active' && paidBill.length === 0 ? () => {
          editReminder()
        } : ''}
        onBackPress={() => {
          onBackscreen()
        }}
      />
      {
        billloading ? <RimanderDetailsSkeleton /> : <Animated.ScrollView
          style={[styles.scrollView, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {
            pendingBill.slice(0, 1).map((value, key) => {


              const accountDetails = value?.account_id

              var number = ''
              if (accountDetails?.account_number) {
                number = 'XX' + CommonFunction.slicenum(accountDetails?.account_number)
              } else {
                number = content.manual
              }
              if (value && value?.date && value?.status === 'Pending') {
                const daysAgo = calculateDaysAgo(value.date);
                let displayText = "";
                let dispalypast = '';

                if (value.status !== "Paid") {
                  if (daysAgo > 0 && daysAgo <= 7) {
                    if (1 < daysAgo) {
                      displayText = `${daysAgo} days ago`;
                    } else {
                      displayText = `${daysAgo} day ago`;
                    }

                  }
                  else if (daysAgo > 7) {
                    displayText = `${formatchDate(value.date)}`;
                  }
                  else if (daysAgo === 0) {
                    displayText = "Today";
                  }
                  else if (daysAgo < 0 && Math.abs(daysAgo) <= 7) {
                    // Future within 7 days
                    if (1 < Math.abs(daysAgo)) {
                      displayText = `Due In ${Math.abs(daysAgo)} days`;
                    } else {
                      displayText = `Due In ${Math.abs(daysAgo)} day`;
                    }

                  }
                  else {
                    // Future more than 7 days (e.g., -13)
                    displayText = `${formatchDate(value.date)}`;
                  }
                }

                if (daysAgo > 0) {
                  dispalypast = 'Past'
                } else {
                  dispalypast = ''
                }

                return (
                  <GradientCard>
                    <View style={styles.headerBankSection}>
                      <View style={{
                        flexDirection: 'row', borderBottomWidth: 0.3,
                        borderBottomColor: '#fff', paddingBottom: 15
                      }}>
                        <View style={styles.bankIconContainer}>
                          <FontAwesome name="bank" size={16} color="#FFFFFF" />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                          <Text style={styles.headerBankText}>{value?.account_id?.type} - {number}</Text>
                        </View>
                      </View>
                      <View style={{ marginTop: 10, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.headerTitle}>{value?.name}</Text>
                          <Text style={styles.headerDate}>Next : {displayText}</Text>
                        </View>
                        <View>
                          <Text style={styles.headerAmount}>{storedata?.currency}{CommonFunction.formatamount(value.amount)}</Text>
                        </View>

                      </View>
                      {
                        marlaspaidLoading ? <View style={{ alignItems: 'flex-end' }}>
                          <TouchableOpacity style={{ backgroundColor: '#25A135', borderRadius: 8 }} onPress={() => {

                          }}>
                            <Text style={[styles.headerAmount, { fontSize: getFontSize(14), padding: 8, paddingStart: 20, paddingEnd: 20 }]}>Loading...</Text>
                          </TouchableOpacity>

                        </View> : <View style={{ alignItems: 'flex-end' }}>
                          <TouchableOpacity style={{ backgroundColor: '#25A135', borderRadius: 8 }} onPress={() => {
                            handleMarkAsPaid(value)
                          }}>
                            <Text style={[styles.headerAmount, { fontSize: getFontSize(14), padding: 8, paddingStart: 20, paddingEnd: 20 }]}>Mark as Paid</Text>
                          </TouchableOpacity>

                        </View>
                      }


                    </View>


                  </GradientCard>
                )
              }

            })
          }



          <View style={styles.detailsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Feather name="info" size={16} color="#2A1B6D" />
              </View>
              <Text style={styles.sectionTitle}>Reminder Details</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                <View style={[styles.statusDot, { backgroundColor: statusTextColor }]} />
                <Text style={[styles.statusBadgeText, { color: statusTextColor }]}>{details?.status}</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <DetailRow label="Name" value={reminder?.name} icon="file-text" />
              <DetailRow label="Amount" value={`${storedata?.currency || ''}${CommonFunction.formatamount(reminder?.amount || 0)}`} icon="dollar-sign" />
              <DetailRow label="Category" value={details?.category_id?.category} icon="tag" />
              <DetailRow label="Type" value={details?.type} icon="file" />
              <DetailRow label="Start Date" value={formatDate(details?.startdate)} icon="calendar" />
              <DetailRow label="End Date" value={formatDate(details?.enddate)} icon="calendar" />
              <DetailRow label="Recurrence" value={details?.frequency} icon="repeat" />
              <DetailRow label="Occurrence Details" value={details?.occurance} icon="clock" />
            </View>
          </View>

          {/* Payment History Section */}
          {paidBill && paidBill.length > 0 && (
            <View style={styles.historySection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="clock" size={16} color="#2A1B6D" />
                </View>
                <Text style={styles.sectionTitle}>Payment History</Text>
              </View>

              {paidBill.map((item, index) => (
                <PaymentHistoryItem key={index} item={item} />
              ))}
            </View>
          )}



          <View style={styles.bottomPadding} />


        </Animated.ScrollView>
      }






      {/* Fixed Action Buttons at Bottom */}
      {
        !billloading && <View style={styles.fixedActionContainer}>
          {
            details?.status === 'Active' &&
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: 'transparant', borderWidth: 1, borderColor: themeColors?.bgbtn }]}
              onPress={() => {
                setIsCancel(true)
              }}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center' }}>
                  <CommonIcon name="cancel" family="MaterialDesignIcons" size={16} color={themeColors.bgbtn} />
                </View>
                <View style={{ marginStart: 5 }}>
                  <Text style={[styles.cancelButtonText, { color: themeColors.bgbtn }]}>Cancel</Text>
                </View>
              </View>
            </TouchableOpacity>
          }


          <TouchableOpacity
            style={[styles.cancelButton, { marginStart: 10, backgroundColor: themeColors?.negativeColor }]}
            onPress={() => {
              setIsDelete(true)
            }}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ justifyContent: 'center' }}>
                <CommonIcon name="trash-outline" family="Ionicons" size={16} color={'#fff'} />
              </View>
              <View style={{ marginStart: 5 }}>
                <Text style={styles.cancelButtonText}>Delete</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>
      }


      <PromptModel
        visible={isCancel || isDelete}
        loading={loading}
        head={isCancel ? 'Cancel Reminder' : 'Delete Reminder'}
        subhead={isCancel ? 'Are you sure you want to cancel this reminder?' : 'Are you sure you want to delete this reminder?'}
        content={isCancel ? cancelContent : deleteContent}
        onClose={() => {
          setIsCancel(false)
          setIsDelete(false)
        }}
        onSubmit={() => {
          isCancel ? handleCancel() : handleDelete()

        }}
      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  // Header Card - Redesigned
  headerCard: {
    borderRadius: 20,
    padding: 4
  },
  // Bank Section
  headerBankSection: {
    margin: 15,

  },
  bankIconContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerBankText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: getFontSize(13),
    color: '#fff',
  },
  headerManualBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  headerManualText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: fontsFamily.boldFont,
    textTransform: 'uppercase',
  },
  // Title Section
  headerTitleSection: {
    marginTop: 0,
    margin: 15,

  },
  headerTitle: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerDate: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 13,
    color: '#FFFFFF',
  },
  // Amount Section
  headerAmountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    margin: 15,
    marginBottom: 0
  },
  headerAmount: {
    fontFamily: fontsFamily.boldFont,
    fontSize: getFontSize(18),
    color: '#FFFFFF',
  },
  headerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  headerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  headerStatusText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 12,
    color: '#FFFFFF',
  },
  // Mark as Paid Button
  markPaidButton: {
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: 10
  },
  markPaidGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    height: 40,
    width: 150,
    borderRadius: 14,
  },
  markPaidText: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 14,
    color: '#FFFFFF',
  },
  // Details Section
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    marginTop: 15,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 15,
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusBadgeText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 11,
    color: '#10B981',
  },
  detailsGrid: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#64748B',
  },
  detailValue: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#0F172A',
  },
  // History Section
  historySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  paymentHistoryTitle: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 14,
    color: '#0F172A',
  },
  paymentHistoryDate: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  paymentHistoryRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paymentHistoryAmount: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 14,
    color: '#0F172A',
  },
  paymentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  paymentStatusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  paymentStatusText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 10,
    color: '#10B981',
  },
  bottomPadding: {
    height: 10,
  },
  // Fixed Action Buttons
  fixedActionContainer: {
    marginTop: 10,
    marginStart: 15,
    marginEnd: 15,
    flexDirection: 'row',

  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 15,
    color: '#fff',
  },
  deleteButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  deleteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    borderRadius: 14,
  },
  deleteButtonText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 15,
    color: '#FFFFFF',
  },
});