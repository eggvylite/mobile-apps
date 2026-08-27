// src/components/SetBudgetModal.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';
import { useForm, Controller } from 'react-hook-form';
import { content } from '../../constants/content';
import CommonFunction from '../../utill/CommonFunction';
import getStyles from '../styles';

const SetBudgetModal = ({ visible, onClose, category, onSave, totalBalance, formatCurrency }) => {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [error, setError] = useState('');
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme;
  const { styles: appstyle, geticonSize } = getStyles(themeColors);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { control, handleSubmit, reset, register, formState: { errors } } =
    useForm({ mode: 'onBlur' });
  const [record, setRecord] = useState('')





  useEffect(() => {
    if (category) {
      // setBudgetAmount(category.budget);
      // setError('');
      const data = {
        budget: category?.budget
      }
      setRecord(data)
    }
  }, [category]);


  useEffect(() => {
    reset(record)
  }, [record])

  const handleSave = () => {
    onSave(record)
    onClose();
  };

  const handleClose = () => {
    setBudgetAmount('');
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.modalOverlay,]}>
        <View style={[styles.modalContent, { backgroundColor: themeColors?.backgroundcolor }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(18), color: themeColors.text_primary }]}>
              {category?.budget > 0 ? 'Edit Budget' : 'Set Budget'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="x" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {category && (
            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryName, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16), color: themeColors.text_primary }]}>{category.category}</Text>
              <Text style={[styles.categoryGroup, { fontFamily: fontsFamily.regularFont, fontSize: getFontSize(13), color: themeColors.text_primary }]}>{category.group_name}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(14), color: themeColors.text_primary }]}>Monthly Budget</Text>
            <View style={[styles.amountInputContainer, { backgroundColor: themeColors?.inputprimary, borderColor: themeColors?.inputprimary }]}>
              <Text style={[styles.currencySymbol, { color: themeColors?.inputsecondary }]}>{storedata?.currency}</Text>
              <TextInput
                style={[styles.amountInput, { fontSize: getFontSize(18), color: themeColors.text_primary }]}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                returnKeyType="done"   // shows Done button
                onSubmitEditing={handleSubmit(handleSave)}  // trigger function
                keyboardType="decimal-pad"
                value={record?.budget ? record?.budget?.toString() : ''}
                maxLength={7}
                {...register("budget", {
                  required: content.fieldrequire,
                  validate: {
                    validNumber: (value) =>
                      /^\d+(\.\d+)?$/.test(value) || "Only numbers and decimal values are allowed",
                    minValue: (value) =>
                      parseFloat(value) >= 1 || `Minimum budget amount must be ${storedata?.currency}${CommonFunction.formatamount(1)}`,
                  },
                })}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9.]/g, ""); // removes special characters
                  setRecord({ ...record, budget: cleaned });
                }}
                autoFocus
              />
            </View>
            {errors.budget && <Text style={styles.errorText}>{errors.budget.message}</Text>}
          </View>

          <View style={styles.quickAmounts}>
            <Text style={[styles.quickAmountsLabel, { color: themeColors?.text_primary }]}>Quick select</Text>
            <View style={styles.quickAmountsRow}>
              {[100, 200, 500, 1000].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.quickAmountButton,{backgroundColor:themeColors?.cardbg,borderColor:themeColors?.cardbg}]}
                  onPress={() => {
                    setRecord({ ...record, budget: amount })
                  }}>
                  <Text style={[styles.quickAmountText,{color: themeColors?.card_text_color}]}>{storedata?.currency}{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={appstyle.newbgbtn} onPress={handleSubmit(handleSave)}>
            <Text style={appstyle.newbtnText}>
              {category?.budget > 0 ? 'Update Budget' : 'Set Budget'}
            </Text>
          </TouchableOpacity>
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
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 16,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  categoryInfo: {
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  categoryGroup: {
    fontSize: 13,
    color: '#64748B',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    color: '#0F172A',
    padding: 0,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  quickAmounts: {
    marginBottom: 24,
  },
  quickAmountsLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
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
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3F2B96',
  },
  saveButton: {
    borderRadius: 12,

  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SetBudgetModal;