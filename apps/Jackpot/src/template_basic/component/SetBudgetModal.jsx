import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';
import SubmitBtn from './SubmitBtn';
import appLog from '../../constants/logger';

const SetBudgetModal = ({ visible, onClose, category, onSave, loading }) => {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setBudgetAmount(category?.budget || '');
      setError('');
    }
  }, [category]);

  const handleSave = () => {
    const amount = String(budgetAmount).trim();

    if (!budgetAmount || !/^[0-9]+$/.test(budgetAmount)) {
      Alert.alert('Alert', 'Please enter a valid budget amount');
      return;
    }

    onSave(amount);
    setBudgetAmount('');
    setError('');
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
        style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {category?.assigned > 0 ? 'Edit Budget' : 'Set Budget'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="x" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {category && (
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryGroup}>{category.group_name || 'Category'}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Monthly Budget</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={budgetAmount?.toString() || ''}
                onChangeText={(text) => {
                  setBudgetAmount(text);
                  setError('');
                }}
                maxLength={8}
                autoFocus
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.quickAmounts}>
            <Text style={styles.quickAmountsLabel}>Quick select</Text>
            <View style={styles.quickAmountsRow}>
              {[100, 200, 500, 1000].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAmountButton}
                  onPress={() => {
                    setBudgetAmount(amount.toString());
                    setError('');
                  }}>
                  <Text style={styles.quickAmountText}>${amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          <SubmitBtn
            text={category?.budget > 0 ? 'Update Budget' : 'Set Budget'}
            submit={handleSave}
            disabled={loading}
            disableGradient={loading}
          />

          {/* <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['#3F2B96', '#3F2B96']}
              style={styles.saveButtonGradient}>
              <Text style={styles.saveButtonText}>
                {category?.budget > 0 ? 'Update Budget' : 'Set Budget'}
              </Text>
            </LinearGradient>
          </TouchableOpacity> */}
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
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.semiboldFont,
    color: '#64748B',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: getFontSize(18),
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
export default SetBudgetModal;