import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Dimensions, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';
import SubmitBtn from './SubmitBtn';
import { useDispatch, useSelector } from 'react-redux';
import { themeColors } from '../Common';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import CommonIcon from '../../common_component/Commonicons';
import useFeatureFlow from '../../hook/useFeatureGate';
import { WORKFLOW_CONSTANT } from '../../constants/workflowConstents';
import useSubscriptionLabelsHook from '../../hook/Labels/useSubscriptionlabelhook';
import CommonFunction from '../../utill/CommonFunction';
import api from '../../service/api';
import { fetchcurrentsubscription } from '../../redux/slices/subscriptionSlice';

const { width, height } = Dimensions.get('window')

const CancelSubscription = ({ visible, onClose, onSubmit, onLoading, offLoading }) => {
  const { subscriptionreason } = useSelector((state) => state.menuicons);

  const [reason, setReason] = useState('')
  const [reasontxt, setReasontxt] = useState('')
  const { workflow } = useFeatureFlow(WORKFLOW_CONSTANT.CANCELSUBSCRIPTION);
  const { cancelsubscription } = useSubscriptionLabelsHook()
  const [isConfirmscreen, setIsConfirmscreen] = useState(false)
  const [isLoading, setIsloading] = useState(false)
  const [cancelOption, setCanceloption] = useState('')
  const { subscription } = useSelector((state) => state.subscription);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const dispatch = useDispatch()



  useEffect(() => {
    setReason('')
    setReasontxt('')
    setCanceloption('Billing-cycle')
  }, [visible])

  const handleClose = () => {
    onClose();
  };

  const cancelarry = [
    { title: cancelsubscription?.immediatltytitle, describtion: cancelsubscription?.immediatlydesc, type: 'Immediately' },
    { title: cancelsubscription?.billendtitle, describtion: cancelsubscription?.billenddesc, type: 'Billing-cycle' },
  ]

  const unsubscribe = async () => {
    onLoading()
    try {
      setIsloading(true)
      const [os, deviceName, ip] = await Promise.all([
        CommonFunction.getOS(),
        CommonFunction.getdevicename(),
        CommonFunction.getipaddress(),

      ])
      const payload = {
        id: subscription.id,
        customer_id: storedata?.id,
        reason: reasontxt,
        device_name: deviceName,
        reasontype: reason?.id,
        platform: os,
        type: cancelOption,
        ip: ip
      }

      console.log(payload)




      const response = await api.post(
        `subscribed_customers/unsubscribe/${subscription.id}`, payload
      )

      CommonFunction.message(response.data.message)
      if (payload?.type === 'Immediately') {
        onSubmit(payload?.type)
        onClose()

      } else {
        dispatch(fetchcurrentsubscription())
        onClose()
      }






    } catch (error) {
      console.log(error)
      CommonFunction.message(error?.response?.data?.message)
    } finally {
      offLoading()
      setIsloading(false)
    }
  }


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>

        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ margin: 10 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ marginBottom: 20, padding: 10, borderRadius: 30, backgroundColor: '#F1F5F9' }}>
                  <CommonIcon family={'FontAwesome5'} name={'crown'} size={24} color={themeColors?.primarColor} />
                </View>
                <Text style={styles.modalTitle}>{isConfirmscreen ? cancelsubscription?.confirmtitle : cancelsubscription?.canceltitle}</Text>
                <Text style={[styles.reasonLabel, { marginTop: 10, fontWeight: 'normal', fontSize: getFontSize(13), textAlign: 'center' }]}>{isConfirmscreen ? cancelsubscription?.confirmdesc : cancelsubscription?.cancelsubstitle}</Text>
              </View>

              {
                isConfirmscreen ?
                  <View style={{ marginTop: 10, marginBottom: 20 }}>

                    <View style={[styles.reasonCard, { borderColor: '#e69d69' }]}>
                      <View style={{ justifyContent: 'center' }}>
                        <CommonIcon family={'FontAwesome'} name={'warning'} size={24} color={'#f97316'} />
                      </View>
                      <View style={{ flex: 1, marginStart: 15 }}>
                        <Text style={[styles.modalTitle, { fontSize: getFontSize(15), color: '#f97316' }]}>{cancelsubscription?.warningtitle}</Text>
                        <View style={{ marginTop: 5 }}>
                          <Text style={[styles.reasonLabel, { fontSize: getFontSize(14), color: '#c58456', letterSpacing: 0.3 }]}>{cancelsubscription?.warningdesc}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                      <Text style={[styles.reasonLabel, { fontSize: getFontSize(16) }]}>{cancelsubscription?.canceloption}</Text>
                    </View>


                    {
                      workflow === 'Immediately' &&
                      cancelarry?.map((value, key) => {
                        const isCheck = value?.type === cancelOption
                        return (
                          <Pressable onPress={() => {
                            setCanceloption(value?.type)
                          }} style={[styles.reasonCard, isCheck && { borderColor: themeColors?.primarColor }]} key={key}>
                            <View>
                              <Icon name={isCheck ? 'radio-btn-active' : 'radio-btn-passive'} color={isCheck ? themeColors?.primarColor : '#ccc'} size={20} />
                            </View>
                            <View style={{ marginStart: 10, justifyContent: 'center', flex: 1 }}>
                              <Text style={[styles.modalTitle, { fontSize: getFontSize(15), fontFamily: fontsFamily.semiboldFont }]}>{value?.title}</Text>
                              <View style={{ marginTop: 5 }}>
                                <Text style={[styles.featureText]}>{value?.describtion}</Text>
                              </View>
                            </View>

                          </Pressable>
                        )
                      })
                    }

                    <View style={[styles.reasonCard]}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <CommonIcon family={'Fontisto'} name="close" size={18} color={themeColors.primarColor} />
                          </View>
                          <View style={{ marginStart: 10 }}>
                            <Text style={[styles.reasonLabel, { fontFamily: fontsFamily.boldFont }]}>{cancelsubscription?.lossaccess}</Text>
                          </View>
                        </View>

                        <View style={{ marginTop: 5 }}>

                          {subscription?.plan_featureLabel?.length > 0 &&
                            subscription.plan_featureLabel.map((feature, index) => {


                              if (!feature || feature.trim() === '') {
                                return null;
                              }

                              return (
                                <View key={index} style={styles.featureRow}>
                                  <View style={[styles.featureCheck, { backgroundColor: '#F1F5F9', padding: 5 }]}>
                                    <CommonIcon family={'AntDesign'} name="close" size={14} color={themeColors.primarColor} />
                                  </View>

                                  <Text style={styles.featureText}>
                                    {feature.trim()}
                                  </Text>
                                </View>
                              );
                            })}

                        </View>
                      </View>
                    </View>

                    {
                      reason?.name &&
                      <View style={[styles.reasonCard]}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row' }}>
                            <View>
                              <CommonIcon family={'Feather'} name="message-circle" size={18} color={themeColors.primarColor} />
                            </View>
                            <View style={{ marginStart: 10 }}>
                              <Text style={[styles.modalTitle, { fontSize: getFontSize(15) }]}>{cancelsubscription?.reasoncancel}</Text>
                            </View>
                          </View>
                          <View style={{ marginTop: 10 }}>
                            <Text style={[styles.reasonLabel, { fontWeight: 'normal', fontSize: getFontSize(13) }]}>{reason?.name}</Text>
                          </View>



                        </View>

                      </View>

                    }


                  </View> :
                  <View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                      {
                        subscriptionreason?.map((value, key) => {
                          const isCheck = value?.name === reason?.name
                          return (
                            <Pressable onPress={() => {
                              setReason(value)
                            }} style={[styles.reasonCard, isCheck && { borderColor: themeColors?.primarColor }]} key={key}>
                              <View>
                                <Icon name={isCheck ? 'radio-btn-active' : 'radio-btn-passive'} color={isCheck ? themeColors?.primarColor : '#ccc'} size={20} />
                              </View>
                              <View style={{ marginStart: 10, justifyContent: 'center', flex: 1 }}>
                                <Text style={styles.reasonLabel}>{value?.name}</Text>
                              </View>
                              {
                                isCheck &&
                                <View style={{ justifyContent: 'center' }}>
                                  <Feather name={'check'} color={themeColors?.primarColor} size={20} />
                                </View>
                              }

                            </Pressable>
                          )
                        })
                      }
                    </View>

                    {
                      reason?.name?.toLocaleLowerCase() === 'other' &&
                      <View style={{ marginTop: 10, marginBottom: 20 }}>
                        <Text style={[styles.reasonLabel, { fontWeight: 'normal', fontSize: getFontSize(14) }]}>{cancelsubscription?.textinputlabel}</Text>
                        <View style={styles.amountInputContainer}>
                          <TextInput
                            style={styles.amountInput}
                            placeholder="Tell us more"
                            placeholderTextColor="#94A3B8"
                            multiline={true}
                            value={reasontxt}
                            onChangeText={(text) => {
                              setReasontxt(text);
                            }}
                          />
                        </View>
                      </View>
                    }

                  </View>
              }






            </View>
          </ScrollView>

          {
            isConfirmscreen ?
              <View style={{ flexDirection: 'row', marginStart: 10, marginTop: 20 }}>
                <TouchableOpacity
                  style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transaparnt', borderRadius: 10, borderColor: themeColors?.primarColor, borderWidth: 1, marginEnd: 10 }]}
                  onPress={() => {
                    setIsConfirmscreen(false)
                  }}
                >
                  <View style={{ marginEnd: 10 }}>
                    <Feather name={'arrow-left'} size={18} color={themeColors.primarColor} />
                  </View>


                  <Text style={[styles.categoryName,]}>{cancelsubscription?.back}</Text>


                </TouchableOpacity>

                <SubmitBtn disabled={isLoading} prefix={true} iconName={'trash-2'} text={cancelsubscription?.confirmcancel} style={{ width: width * 0.45, height: 50 }} submit={() => {
                  unsubscribe()

                }} />
              </View> :
              <View style={{ flexDirection: 'row', marginStart: 10 }}>
                <TouchableOpacity
                  style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transaparnt', borderRadius: 10, borderColor: themeColors?.primarColor, borderWidth: 1, marginEnd: 10 }]}
                  onPress={() => {
                    onClose()
                  }}
                  activeOpacity={0.9}>

                  <Text style={[styles.categoryName,]}>{cancelsubscription?.cancel}</Text>


                </TouchableOpacity>

                <SubmitBtn disabled={reason ? false : true} text={cancelsubscription?.continue} iconName={'arrow-right'} style={{ width: width * 0.45, height: 50, opacity: reason ? 1 : 0.5 }} submit={() => {
                  setIsConfirmscreen(true)
                }} />
              </View>
          }



        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  reasonCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginTop: 15
  },

  featureCheck: {
    padding: 3,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  featureText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    color: '#334155',
    flex: 1,
  },
  reasonLabel: {
    fontSize: getFontSize(15),
    fontWeight: '500',
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 16,
    height: height * 0.75,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont,
    color: '#0F172A',
  },
  categoryInfo: {
    marginBottom: 20,
  },
  categoryName: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    marginBottom: 2,
  },
  categoryGroup: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    marginBottom: 8,
  },
  amountInputContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    marginTop: 5
  },
  currencySymbol: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.semiboldFont,
    color: '#64748B',
    marginRight: 6,
  },
  amountInput: {

    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
    padding: 0,
  },
  errorText: {
    color: '#DC2626',
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.mediumFont,
    marginTop: 6,
  },
  quickAmounts: {
    marginBottom: 24,
  },
  quickAmountsLabel: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.mediumFont,
    color: '#64748B',
    marginBottom: 10,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.semiboldFont,
    color: '#3F2B96',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    height: 80,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
  },
});
export default CancelSubscription;