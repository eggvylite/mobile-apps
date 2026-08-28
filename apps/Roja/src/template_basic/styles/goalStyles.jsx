import { Platform, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import CommonFunction from '../../utill/CommonFunction';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';
const { width, height } = Dimensions.get('window');
import { themeColors } from '../Common';

const goalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  totalProgressCard: {
    borderRadius: 14,
    marginTop: 10,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  totalProgressLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalProgressIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalProgressTitle: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#FFFFFF',
  },
  addGoalButton: {
    padding: 4,
    end: Platform.OS === 'ios' ? 20 : 5
  },
  addButtonCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 6,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 13,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: '600', no fontFamily
    color: '#0F172A',
  },
  progressBarBg: {
    backgroundColor: '#F1F5F9',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  totalProgressAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
    padding: 15,
    paddingStart: 5,
    paddingBottom: 0
  },
  totalCurrentAmount: {
    fontSize: getFontSize(24),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'700'
    color: '#FFFFFF',
  },
  totalTargetAmount: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.regularFont,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  targetDate: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  totalProgressBarContainer: {
    marginBottom: 10,
    // end:Platform.OS === 'ios'? 10:5,
  ...(Platform.OS === 'ios' ? { end: 10 } : { end: 5 }),
    padding: 10,
    paddingTop: 0
  },
  monthlyContribution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  monthlyContributionText: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    flex: 1,
  },
  timeProgress: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timeProgressText: {
    fontSize: getFontSize(10),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  goalProgressSection: {
    marginBottom: 12,
  },
  totalProgressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  totalProgressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  goalTitle: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  goalStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalStatusText: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  goalAmountItem: {
    alignItems: 'center',
    flex: 1,
  },
  goalAmountLabel: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    marginBottom: 4,
  },
  goalAmountValue: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'700'
    color: '#0F172A',
    textAlign: 'center',
    flex: 1,
  },
  modalBody: {
    paddingVertical: 20,
  },
  modalGoalName: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 24,
  },
  accountSelectorButton: {
    width: '100%',
    height: 150,
    borderRadius: 14,
    overflow: 'hidden', // important — clips gradient to rounded corners
  },
  accountSelectorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // pushes chevron to far right
    paddingVertical: 12,
    paddingHorizontal: 14,
    height: 100,
    borderRadius: 10
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalProgressPercent: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  totalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 18 : 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  totalStat: {
    alignItems: 'center',
    flex: 1,
  },
  totalStatLabel: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  totalStatValue: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'700'
    color: '#FFFFFF',
    marginBottom: Platform.OS === 'ios' ? 15 : 0
  },
  totalStatDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    position: 'relative',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#F8FAFC',
  },
  tabIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // FIXED: dropped the Platform.OS fontWeight hack. Use real font files
  // instead so both platforms render an identical weight.
  tabText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.boldFont,
    color: '#64748B',
  },
  activeTabText: {
    fontFamily:  fontsFamily.boldFont, // use an ExtraBold/Black file if you have one, else fall back to boldFont
    color: '#0F172A',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -4,
    left: 20,
    right: 20,
    height: 2,
    borderRadius: 1,
  },
  totalProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  goalModalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  goalModalCurrencySymbol: {
    fontSize: getFontSize(32),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
    marginRight: 8,
  },
  goalModalAmountInput: {
    fontSize: getFontSize(36),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'700'
    color: '#0F172A',
    textAlign: 'center',
    padding: 0,
  },
  errortext: {
    margin: 5,
    color: themeColors?.negativeColor,
    fontFamily: fontsFamily.boldFont,
    fontSize: getFontSize(12),
    marginStart: 10
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  quickAmountButton: {
    padding: 10,
    marginStart: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#3F2B96',
  },
  modalInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalInfoLabel: {
    fontSize: 16,
    fontFamily: fontsFamily.mediumFont, // was: fontWeight: '500', no fontFamily
    color: '#64748B',
  },
  modalInfoValue: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.mediumFont, // was: regularFont + fontWeight:'500' (conflict)
    color: '#0F172A',
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 24,
  },
  circleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  circleInner: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: getFontSize(28),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'700'
    marginBottom: 2,
  },
  percentageLabel: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.mediumFont, // was: regularFont + fontWeight:'500' (conflict)
    color: '#64748B',
  },
  modernProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  achievementBadge: {
    position: 'absolute',
    top: 10,
    right: 80,
    backgroundColor: '#34C759',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modernMetricsGrid: {
    flexDirection: 'row',
    marginBottom: 20,
    marginStart: 10,
    marginEnd: 10
  },
  modernMetricCard: {
    flex: 0.5,
    padding: 15,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F8FAFC'
  },
  modernMetricLabel: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.mediumFont, // was: regularFont + fontWeight:'500' (conflict)
    color: '#64748B',
    marginBottom: 6,
  },
  modernMetricValue: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'700'
    color: '#0F172A',
  },
  modernDetailsCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modernDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modernDetailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernDetailContent: {
    flex: 1,
  },
  modernDetailLabel: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    marginBottom: 2,
  },
  modernDetailValue: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
  },
  modernStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  modernStatusText: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
  },
  scrollContentWithPadding: {
    paddingBottom: 20,
  },
  modernGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  modernIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernGoalImage: {
    width: 55,
    height: 55,
  },
  goalsList: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 20,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  goalHeaderInfo: {
    flex: 1,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  goalImage: {
    width: '100%',
    height: '100%',
  },
  modernTextContainer: {
    flex: 1,
  },
  modernGoalName: {
    fontSize: getFontSize(22),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'700'
    color: '#0F172A',
    marginBottom: 6,
  },
  modernCategoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  modernCategoryText: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.mediumFont, // was: regularFont + fontWeight:'500' (conflict)
    color: '#64748B',
  },
  transactionsCard: {

    borderRadius: 12,
    padding: 10,

  },
  transactionsTitle: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: '600', no fontFamily
    color: '#0F172A',
    marginBottom: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transactionLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  transactionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.mediumFont, // was: regularFont + fontWeight:'500' (conflict)
    color: '#0F172A',
  },
  transactionAmount: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  transactionAccountText: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  transactionTime: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.regularFont,
    color: '#94A3B8',
  },
  transactionNote: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  fixedBottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  fixedButtonsRow: {
    flexDirection: 'row',
  },
  fixedActionButton: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    // shadowColor: '#000',
    backgroundColor: '#34C759',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
    // elevation: 5,
  },
  fixedButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  fixedButtonText: {
    fontSize: 15,
    marginStart: 5,
    fontFamily: fontsFamily.boldFont, // was: fontWeight: '700', no fontFamily
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  accountGroup: {
    marginBottom: 20,
  },
  accountGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  accountGroupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountGroupName: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
  },
  accountGroupBalance: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  accountGoalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accountGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  accountGoalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 10,
  },
  accountGoalImage: {
    width: 20,
    height: 20,
  },
  accountGoalInfo: {
    flex: 1,
  },
  accountGoalName: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
    marginBottom: 2,
  },
  accountGoalProgress: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  accountGoalStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accountGoalStatusText: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
  },
  accountGoalBar: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  accountGoalFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyStateButton: {
    marginTop: 24,
    borderRadius: 30,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    width: 180,
    height: 50
  },
  emptyStateButtonText: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#FFFFFF',
  },
  addNewGoalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  addNewGoalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  addNewGoalText: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#3F2B96',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    shadowColor: '#3F2B96',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 90,
  },
  accountSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center', // vertically centers icon with text block
    flex: 1,
    bottom: 10
  },
  accountSelectorIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountSelectorLabel: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    marginBottom: 2,
  },
  accountSelectorValue: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
  },
  disabledButton: {
    opacity: 0.5,
  },
  accountSelectorModal: {
    maxHeight: '70%',
  },
  accountList: {
    paddingVertical: 20,
    gap: 12,
  },
  accountItem: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedAccountItem: {
    borderColor: '#3F2B96',
    borderWidth: 2,
  },
  accountItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.boldFont, // was: regularFont + fontWeight:'600'
    color: '#0F172A',
    marginBottom: 2,
  },
  accountBalance: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 25,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fontsFamily.boldFont, // was: fontWeight: "700", no fontFamily
    color: "#000000",
    textAlign: "center",
    lineHeight: 32,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  categoryCard: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  categoryCardSelected: {
    borderColor: "#4A90E2",
    backgroundColor: "#F0F8FF",
  },
  categoryIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
  categoryTitle: {
    fontSize: 13,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#000000",
    textAlign: "center",
  },
  // Renamed (was duplicated with the "selectedCheck" used on targetTypeCard
  // below — duplicate keys in StyleSheet.create silently overwrite, so this
  // was previously dead code).
  categorySelectedCheck: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  ormContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#64748B",
    marginBottom: 8,
    marginLeft: 4,
  },
  customInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#64748B",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#0F172A",
    paddingVertical: 16,
  },
  targetTypeContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  targetTypeTitle: {
    fontSize: 14,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#64748B",
    marginBottom: 12,
    marginLeft: 4,
  },
  targetTypeCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  targetTypeCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  targetTypeCardSelected: {
    borderColor: "#0A84FF",
    backgroundColor: "#F8FAFC",
  },
  targetTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  targetTypeCardTitle: {
    fontSize: 16,
    fontFamily: fontsFamily.boldFont, // was: fontWeight: "700", no fontFamily
    color: "#0F172A",
    marginBottom: 4,
  },
  targetTypeCardTitleSelected: {
    color: "#0A84FF",
  },
  targetTypeCardDesc: {
    fontSize: 12,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "#64748B",
    lineHeight: 16,
  },
  selectedCheck: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dateText: {
    fontSize: 16,
    fontFamily: fontsFamily.mediumFont, // was: fontWeight: "500", no fontFamily
    color: "#0F172A",
  },
  calculatedCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  calculatedLabel: {
    fontSize: 14,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  calculatedAmount: {
    fontSize: 28,
    fontFamily: fontsFamily.boldFont, // was: fontWeight: "700", no fontFamily
    color: "#FFFFFF",
    marginBottom: 4,
  },
  calculatedNote: {
    fontSize: 12,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  estimatedCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  estimatedLabel: {
    fontSize: 14,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  estimatedDate: {
    fontSize: 24,
    fontFamily: fontsFamily.boldFont, // was: fontWeight: "700", no fontFamily
    color: "#FFFFFF",
    marginBottom: 4,
  },
  estimatedNote: {
    fontSize: 12,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  formaccountsList: {
    gap: 10,
  },
  formformaccountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  formaccountItemSelected: {
    borderColor: "#0A84FF",
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
  },
  formaccountLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  formaccountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  formaccountDetails: {
    flex: 1,
  },
  formaccountName: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#0F172A",
    marginBottom: 4,
  },
  formaccountBank: {
    fontSize: 13,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "#64748B",
  },
  formaccountRightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  formbalanceText: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.boldFont, // was: fontWeight: "700", no fontFamily
    color: "#0F172A",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0A84FF",
    alignItems: "center",
    justifyContent: "center",
  },
  addformaccountButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#0A84FF",
    borderStyle: "dashed",
    marginTop: 4,
  },
  addformaccountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  addformaccountText: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#0A84FF",
  },
  notesInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    textAlignVertical: "top",
    minHeight: 100,
  },
  createButton: {
    backgroundColor: "#5A21F1",
    borderRadius: 12,
    paddingVertical: 18,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#5A21F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowColor: "#CBD5E1",
  },
  createButtonText: {
    fontSize: 18,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#FFFFFF",
  },
  modalFormOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalFormContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modaFormlHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalFormTitle: {
    fontSize: 18,
    fontFamily: fontsFamily.boldFont,
    color: "#0F172A",
  },
  modalForm: {
    marginBottom: 10,
  },
  modalFormGroup: {
    marginBottom: 16,
  },
  modalFormLabel: {
    fontSize: 14,
    fontFamily: fontsFamily.semiboldFont,
    color: "#64748B",
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: fontsFamily.regularFont,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  modalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalCurrencySymbol: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont,
    color: "#64748B",
    marginRight: 8,
  },
  modalAmountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont,
    color: "#0F172A",
    paddingVertical: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  saveButton: {
    backgroundColor: "#0A84FF",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont,
    color: "#64748B",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont,
    color: "#FFFFFF",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  datePickerLabel: {
    fontSize: 14,
    fontFamily: fontsFamily.semiboldFont,
    color: "#64748B",
    marginBottom: 8,
    textAlign: "center",
  },
  datePickerScroll: {
    maxHeight: 200,
  },
  datePickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 2,
  },
  datePickerItemSelected: {
    backgroundColor: "#0A84FF",
  },
  datePickerItemText: {
    fontSize: 16,
    fontFamily: fontsFamily.regularFont, // was missing
    color: "#0F172A",
  },
  datePickerItemTextSelected: {
    color: "#FFFFFF",
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
  },
  dateConfirmButton: {
    backgroundColor: "#0A84FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 15
  },
  dateConfirmButtonText: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont, // was: fontWeight: "600", no fontFamily
    color: "#FFFFFF",
  },
  formContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  require: {
    color: themeColors?.negativeColor,
    fontSize: getFontSize(14)
  },
})

export default goalStyles;