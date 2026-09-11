import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  UIManager,
  Modal
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import TopBar from '../../../component/TopBar';
import CloudImage from '../../../../utill/CloudImage';
import CommonFunction from '../../../../utill/CommonFunction';
import api from '../../../../service/api';
import LinearGradient from 'react-native-linear-gradient';
import { fetchAccount } from '../../../../redux/slices/accountSlice';
import { fetchBank, updateBank } from '../../../../redux/slices/bankSlice';
import { fetchCategory } from '../../../../redux/slices/categorySlice';
import { fetchBudgetcategory } from '../../../../redux/slices/budgetcategorySlice';
import { fetchElgibleoffers } from '../../../../redux/slices/elgibleofferSlice';
import { fetchOffers } from '../../../../redux/slices/offerSlice';
import { fontsFamily } from '../../../../constants/fontsFamily';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Account() {
  const navigation = useNavigation();
  const { accountdata } = useSelector((state) => state.account);
  const { bankdata } = useSelector((state) => state.bank);
  const { storedata } = useSelector((state) => state.auth);
  const [account, setaccount] = useState([])
  const [banklist, setBanklist] = useState([])
  const [accountToSetDefault, setAccountToSetDefault] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  useEffect(() => {
    if (bankdata) {
      setBanklist(bankdata.records)
    }
  }, [bankdata])

  useEffect(() => {
    getDetails()
  }, [])

  const getDetails = async () => {
    if (!accountdata || !bankdata) {
      dispatch(fetchAccount())
      dispatch(fetchBank())
    }
  }

  useEffect(() => {
    if (accountdata) {
      setaccount(accountdata.records)
    }
  }, [accountdata])

  const createSnapshot = async () => {
    try {
      const payload = {
        customerId: storedata?.id,
      };
      await api.post('user_snapshort/create', payload);
      dispatch(fetchElgibleoffers());
      dispatch(fetchOffers());
    } catch (err) {
      console.log('Snapshot error:', err?.response);
    }
  };

  const defaultAccount = async (acc) => {
    setIsConfirmModalOpen(false);

       const updatad = banklist.map((obj) => obj?._id === acc.bank_id ? { ...obj, bank_default: 'Yes' } : {
                ...obj, bank_default: 'No'
            })

            const updatad1 = account.map((obj) => obj?._id === acc._id ? { ...obj, account_default: 'Yes' } : {
                ...obj, account_default: 'No'
            })

            updatad.sort((a, b) => b.bank_default.localeCompare(a.bank_default));


            setBanklist(updatad)
            setaccount(updatad1)

            dispatch(updateBank({ records: updatad }))

    try {
      const response = await api.get(
        `customerlogin/setdefaultaccount/${storedata.user}/${acc._id}?platform=${CommonFunction.getOS()}&device_name=${await CommonFunction.getdevicename()}&ipaddress=${await CommonFunction.getipaddress()}`
      );

      if (response.status === 200) {
        CommonFunction.message(response.data.message || "Default account updated");
        await createSnapshot();
        dispatch(fetchBank());
        dispatch(fetchAccount());
        dispatch(fetchCategory());
        dispatch(fetchBudgetcategory());
      } else {
        CommonFunction.message("Unable to process request", "danger");
      }
    } catch (err) {
      CommonFunction.message("Something went wrong", "danger");
    } finally {
      setAccountToSetDefault(null);
    }
  };

  const handleAccountSelect = (acc) => {
    if (acc.account_default === 'Yes') return;
    setAccountToSetDefault(acc);
    setIsConfirmModalOpen(true);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <TopBar
        title="Accounts"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />




      <View style={styles.container}>
        <Animated.ScrollView
          style={[styles.scrollView, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >


          {
            0 < banklist.length ?
              banklist.map((values, key) => {
                if (values?.bank_name) {
                  return (
                    <View key={key} style={styles.chirpContainer}>
                      <View style={styles.chirpHeader}>
                        <CloudImage
                          style={styles.chirpLogo}
                          page='bank'
                          cloudSource={values?.bank_name === 'chirpbank' ? 'chirp.png'
                            : values.bank_name === 'bank_of_america' ? 'bank_of_america.png' :
                              'bankicon.png'} />
                        <Text style={styles.chirpHeaderText}>{values?.bank_name === 'chirpbank' ? 'Chirp Test Bank' : values?.bank_name === 'bank_of_america' ? 'Bank of America' : CommonFunction.captialize(values?.bank_name)}</Text>

                      </View>


                      {
                        account?.map((value, accKey) => {
                          if (values?._id === value.bank_id) {
                            return (
                              <TouchableOpacity
                                key={accKey}
                                style={[
                                  styles.chirpAccountCard,
                                  value.account_default === 'Yes' && styles.chirpAccountCardSelected
                                ]}
                                onPress={() => handleAccountSelect(value)}
                                activeOpacity={0.7}
                              >
                                <View style={styles.chirpAccountLeft}>
                                  <View style={[styles.chirpAccountIconContainer, { backgroundColor: '#EBF5FF' }]}>
                                    <Feather name="credit-card" size={18} color="#3B82F6" />
                                  </View>
                                  <View>
                                    <View style={styles.chirpAccountTypeRow}>
                                      <Text style={styles.chirpAccountType}>
                                        {value.type + ' - ' + CommonFunction.slicenum(value.account_number)}
                                      </Text>
                                      {
                                        value.account_default === 'Yes' &&
                                        <View style={styles.chirpPrimaryBadge}>
                                          <Text style={styles.chirpPrimaryBadgeText}>Primary</Text>
                                        </View>
                                      }

                                    </View>
                                    <Text style={styles.chirpRoutingText}>Routing No: {value?.routing_number}</Text>
                                  </View>
                                </View>

                                <View style={styles.chirpAccountRight}>
                                  <View style={[
                                    styles.radioButton,
                                    value.account_default === 'Yes' && styles.radioButtonSelected
                                  ]}>
                                    {value.account_default === 'Yes' && (
                                      <View style={styles.radioButtonInner} />
                                    )}
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )
                          }
                        })
                      }

                    </View>
                  )
                }
              }) : <></>
          }

          <View style={styles.bottomPadding} />
        </Animated.ScrollView>

        <Modal
          visible={isConfirmModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsConfirmModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setIsConfirmModalOpen(false)}
            />
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Set as Default?</Text>
                <TouchableOpacity
                  onPress={() => setIsConfirmModalOpen(false)}
                  style={styles.modalClose}
                >
                  <Feather name="x" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.warningIconContainer}>
                <View style={styles.warningIcon}>
                  <Feather name="alert-circle" size={40} color="#3c3cd6" />
                </View>
              </View>

              <Text style={styles.warningSubtitle}>
               Are you sure you want to make this your default account? It will be automatically used for all future transactions.
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsConfirmModalOpen(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmButton,{height:40}]}
                  onPress={() => defaultAccount(accountToSetDefault)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#3c3cd6', '#2633a7']}
                    style={[styles.confirmGradient,{height:40,paddingVertical:0}]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.confirmButtonText}>Set as Default</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>


    </SafeAreaView>
  );
}


// import { fontsFamily } from '../../../constants/fontsFamily';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 8,
  },
  topBarTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 18,
    color: '#0F172A',
    marginLeft: 4,
  },
  // Chirp Account
  chirpContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chirpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chirpLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  chirpHeaderText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 16,
    color: '#0F172A',
    flex: 1,
  },
  chirpHeaderBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  chirpHeaderBadgeText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 12,
    color: '#64748B',
  },
  chirpBankName: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
    paddingLeft: 4,
  },
  chirpAccountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chirpAccountCardSelected: {
    borderColor: '#2A1B6D',
    backgroundColor: '#EEF2FF',
  },
  chirpAccountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chirpAccountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chirpAccountTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chirpAccountType: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 14,
    color: '#0F172A',
  },
  chirpRoutingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  chirpPrimaryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 8,
  },
  chirpPrimaryBadgeText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 10,
    color: '#2A1B6D',
  },
  chirpAccountRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Radio Button
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioButtonSelected: {
    borderColor: '#2A1B6D',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A1B6D',
  },
  // Selected Account Details
  selectedAccountContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedAccountTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
  },
  selectedAccountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedAccountRowLast: {
    borderBottomWidth: 0,
  },
  selectedAccountLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  selectedAccountValue: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#0F172A',
  },
  bottomPadding: {
    height: 20,
  },
  // FAB Button
  fabButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0b0b42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 999,
  },
  fabGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Bottom Navigation
  bottomNavContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  bottomTabContent: {
    alignItems: 'center',
  },
  bottomTabLabel: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  bottomTabLabelActive: {
    color: '#2A1B6D',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 20,
    color: '#0F172A',
  },
  modalClose: {
    padding: 4,
  },
  warningIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 15,
    color: '#64748B',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirmGradient: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 15,
    color: '#FFFFFF',
  },
});
