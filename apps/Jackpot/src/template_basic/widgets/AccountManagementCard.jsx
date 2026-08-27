import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Feather';
import CommonIcon from '../../common_component/Commonicons';
import { appName } from '../../service/environment';
import { fontsFamily } from '../../constants/fontsFamily';


const AccountManagementOption = React.memo(
  ({ icon, iconContainerStyle, title, titleStyle, description, onPress }) => (
    <TouchableOpacity
      style={styles.accountManagementOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.accountManagementIconContainer, iconContainerStyle]}>
        {icon}
      </View>
      <View style={styles.accountManagementTextContainer}>
        <Text style={[styles.accountManagementOptionTitle, titleStyle]}>{title}</Text>
        <Text style={styles.accountManagementOptionDescription}>{description}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#94A3B8" />
    </TouchableOpacity>
  )
);

const AccountManagementCard = React.memo(({ onConnectAnother, onDeleteAccount, showBank = false, head, description }) => (
  <View style={styles.accountManagementCard}>
    <Text style={styles.accountManagementTitle}>{head}</Text>
    <Text style={styles.accountManagementSubtitle}>
      {description}
    </Text>
    {
      showBank && <>
        <View style={styles.accountManagementDivider} />

        <AccountManagementOption
          icon={<FontAwesome5 name="university" size={20} color="#3F2B96" />}
          title="Connect Another Account"
          description="Link another checking account"
          onPress={onConnectAnother}
        />

      </>
    }

    <View style={styles.accountManagementDivider} />

    <AccountManagementOption
      icon={<CommonIcon  family={'MaterialCommunityIcons'} name="bank-off" size={20} color="#DC2626" />}
      iconContainerStyle={styles.deleteIconContainer}
      title="Disconnect Bank Account"
      titleStyle={styles.deleteText}
      description={`Disconnect this bank account from your ${appName} profile`}
      onPress={onDeleteAccount}
    />
  </View>
));

export default AccountManagementCard;


const styles = StyleSheet.create({
  // ─── Account Management Card ──────────────────────
  accountManagementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accountManagementTitle: {
    fontSize: 18,
    fontFamily: fontsFamily.boldFont,
    color: '#111827',
    marginBottom: 4,
  },
  accountManagementSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  accountManagementDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  accountManagementOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  accountManagementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  deleteIconContainer: {
    backgroundColor: '#FEE2E2',
  },
  accountManagementTextContainer: {
    flex: 1,
  },
  accountManagementOptionTitle: {
    fontSize: 14,
    fontFamily: fontsFamily.semiboldFont,
    color: '#111827',
    marginBottom: 2,
  },
  accountManagementOptionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  deleteText: {
    color: '#DC2626',
  },

  // ─── Connect Bank Card ──────────────────────────────
  connectBankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
  },
  connectBankHeader: {
    marginBottom: 24,
  },
  connectBankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFFDFF',
    borderRadius: 13.5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  connectBankPillText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 12,
    color: '#000',
  },
  connectBankTitle: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 22,
    color: '#000',
    lineHeight: 28,
    marginBottom: 14,
  },
  connectBankHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  connectBankDescription: {
    flex: 1,
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 12,
    color: '#535353',
    lineHeight: 21,
    paddingRight: 8,
  },
  connectBankIllustration: {
    width: 129,
    height: 132,
    position: 'relative',
    flexShrink: 0,
  },
  connectBankWalletImage: {
    width: 130,
    height: 120,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  connectBankDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#93C5FD',
  },
  connectBankDot1: {
    width: 5,
    height: 5,
    top: 8,
    right: 30,
  },
  connectBankDot2: {
    width: 4,
    height: 4,
    top: 60,
    right: 2,
  },
  connectBankDot3: {
    width: 3,
    height: 3,
    bottom: 1,
    right: 16,
    backgroundColor: '#F9D24A',
  },
  connectBankBenefits: {
    marginBottom: 20,
  },
  connectBankBenefitsTitle: {
    fontSize: 20,
    fontFamily: fontsFamily.boldFont,
    color: '#111827',
    marginBottom: 12,
  },
  connectBankPricing: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  connectBankPricingTitle: {
    fontSize: 15,
    fontFamily: fontsFamily.semiboldFont,
    color: '#111827',
    marginBottom: 8,
  },
  connectBankPricingDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  connectBankPricingHighlight: {
    fontFamily: fontsFamily.boldFont,
    color: '#3F2B96',
  },
  connectBankPricingImportant: {
    fontFamily: fontsFamily.boldFont,
    color: '#DC2626',
  },
});