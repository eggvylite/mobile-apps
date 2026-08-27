import { Platform, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import CommonFunction from '../utill/CommonFunction';
import { fontsFamily } from '../constants/fontsFamily';
import { getFontSize } from '../constants/Font';
const { width, height } = Dimensions.get('window');
const getStyles = (themeColors) => {
  const deviceType = CommonFunction.getDeviceType()
  const iconSize = CommonFunction.getDeviceType() === 'Tablet' ? Math.min(width, height) * 0.03 : 20



  return {
    styles: StyleSheet.create({
      whiteContainer: {
        flex: 1,
        backgroundColor: themeColors?.backgroundcolor
      },
      labeltext: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(14),
        color: themeColors?.text_primary
      },
      getStratskipfont: {
        fontFamily: fontsFamily.regularFont,
        color: themeColors?.text_primary,
        fontWeight: Platform.OS === 'android' ? '700' : '500',
        fontSize: getFontSize(18)
      },
      getStarttitle: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(20),
        fontWeight: '700',
        textAlign: 'center',
        color: 'black'
      },
      getStartDescription: {
        fontFamily: fontsFamily.mediumFont,
        textAlign: 'center',
        fontSize: getFontSize(16),
        lineHeight: deviceType === 'Handset' ? Platform.OS === 'android' ? 26 : 24 : 40,
        color: themeColors?.text_primary
      },
      dot: {
        height: 8,
        width: 8,
        borderRadius: 5,
        backgroundColor: themeColors?.dark,
        marginHorizontal: 5,
      },
      btnbg: {
        backgroundColor: themeColors?.bgbtn,
        padding: Platform.OS === 'android' ? 13 : 15,
        borderRadius: 8,
        alignItems: 'center',
        width: width * 0.5,
        fontFamily: fontsFamily.boldFont
      },
      btnText: {
        color: themeColors?.btn_text_color,
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(14),
      },
      getstartImage: {
        width: width, height: height * 0.3, bottom: 40
      },
      getStartchild: {
        width,
        justifyContent: 'center'
      },
      scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center'
      },
      dashboardFrame: {
        backgroundColor: themeColors?.dashboardBannerbgColor,
        padding: 10,
        height: 90,
        borderRadius: 8,
        marginStart: 10,
        marginEnd: 10
      },
      dashbaordBalIconbg: {
        backgroundColor: themeColors?.dashboardBalanceIconBgClor,
        borderRadius: 50,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
      },
      dashboardLine: {
        marginStart: 13,
        marginEnd: 10,
        borderEndWidth: 2,
        borderRadius: 8,
        borderEndColor: themeColors?.menuinactive
      },
      dashboardamountLable: {
        color: '#1A1731',
        fontWeight: '400',
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(13)
      },
      moneyInAmt: {
        color: themeColors?.text_secondary,
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(15)
      },

      moneyOut: {
        color: themeColors?.text_secondary,
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(15)
      },
      signUpTitle: {
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(22),
        color: themeColors?.text_secondary
      },
      signUpsubTitle: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(18),
        marginTop: 20,
        fontWeight: '700',
        color: themeColors?.text_primary,
        textAlign: "center"
      },
      primaryBackground: {
        flex: 1,
        backgroundColor: themeColors?.backgroundcolor
      },
      textInputContainer: {
        marginTop: 20,
        width: deviceType === 'Handset' ? Platform.OS === 'android' ? width * 0.8 : width * 0.8 : width * 0.6,
        backgroundColor: themeColors?.inputprimary,
        padding: Platform.OS === 'android' ? 5 : 15,
        borderRadius: 8,
        paddingStart: 17,
        justifyContent: 'center',
        // borderWidth: 1,
        color: themeColors?.inputsecondary,
        borderColor: themeColors?.btnborder
      },
      textInputColor: {
        color: themeColors?.inputsecondary,
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(16),
      },
      tickbgColor: {
        justifyContent: 'center',
        marginEnd: 5,
        backgroundColor: themeColors?.bgbtn,
        alignItems: 'center',
        borderRadius: 50,
        padding: 4
      },
      placeholderStyle: {
        end: 6,
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.mediumFont,
        color: 'grey',
      },
      text: {
        fontFamily: fontsFamily.regularFont,
        color: themeColors?.text_primary,
        fontSize: getFontSize(14),
      },
      errortext: {
        margin: 5,
        color: themeColors?.danger,
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(12),
        marginStart: 10
      },
      selectText: {
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(14),
        color: themeColors?.inputsecondary,
      },
      lifont: {
        color: themeColors?.text_primary,
        fontFamily: fontsFamily.mediumFont,
        textAlign: 'justify',
        lineHeight: 25,
        bottom: 3,
        fontSize: getFontSize(14)
      },
      pfont: {
        color: themeColors?.text_primary,
        fontFamily: fontsFamily.regularFont,
        textAlign: 'justify',
        lineHeight: 25,
        fontSize: getFontSize(14)
      },
      inputLabel: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(15),
        marginTop: 15,
        color: themeColors?.text_secondary
      },
      cell: {
        backgroundColor: themeColors?.inputprimary,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        marginStart: 10,
        borderRadius: 5,
        color: themeColors?.inputsecondary,
        lineHeight: 38,
        fontFamily: getFontSize(18)
      },
      otpInput: {
        color: themeColors?.inputsecondary,
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(16),
      },
      pinCodePlaceHolder: {
        width: 40,
        height: 40,
        backgroundColor: themeColors?.inputprimary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
      },
      pinCodeMask: {
        padding: 5,
        borderRadius: 25,
        backgroundColor: themeColors?.text_secondary
      },
      modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      alertBox1: {
        width: width * 0.8,
        padding: 20,
        backgroundColor: themeColors?.cardbg,
        borderRadius: 10,
        elevation: 5,
      },
      textHeader: {
        fontSize: getFontSize(16),
        fontWeight: '600',
        color: themeColors?.text_secondary,
        fontFamily: fontsFamily?.regularFont
      },
      tabBarBgStyle: {
        height: Platform.OS == 'ios' ? deviceType === 'Handset' ? 80 : 100 : 70,
        paddingBottom: Platform.OS == 'ios' ? 15 : 6,
        backgroundColor: themeColors?.tabbg
      },
      tabBarstyle: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.mediumFont,
      },
      centerButton: {
        top: -20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 35,
        backgroundColor: themeColors?.menu_active_bg,
        elevation: 8,
      },
      tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      },
      textchg: {
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(13),
        marginTop: 5,
        fontWeight: Platform.OS === 'android' ? '700' : '500',
        color: themeColors?.text_primary
      },
      dashboardIcon: {
        width: 20,
        height: 20,
      },

      alerttext: {
        fontFamily: fontsFamily.regularFont,
        color: themeColors?.text_secondary,
        fontSize: getFontSize(14),
      },

      topSpacer: {
        height: height * 0.1,
      },
      innerWrapper: {
        padding: 10,
        position: 'relative',
      },
      floatingBox: {
        backgroundColor: 'transparent',
        height: height * 0.13,
        width: width * 0.25,
        position: 'absolute',
        zIndex: 1,
        top: -height * 0.07,
        left: width * 0.350,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
      },
      contentBox: {
        backgroundColor: themeColors?.cardbg,
        padding: 20,
      },
      tabtag: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        // paddingTop: 13,
        // paddingBottom: 13,
        borderRadius: 8,
        // paddingStart: 18,
        // paddingEnd: 18
      },
      insightsTabTxt: {
        fontFamily: fontsFamily.semiboldFont,
        color: themeColors?.text_secondary,
        fontSize: getFontSize(16)
      },
      insightsTabContainer: {
        backgroundColor: themeColors?.tabbg,
        borderRadius: 8,
        padding: 8
      },
      reportTitle: {
        fontFamily: fontsFamily.boldFont,
        color: themeColors?.card_text_color,
        fontSize: getFontSize(16)
      },
      insightsMonthContainer: {
        alignItems: 'center', marginBottom: 20, marginTop: 20
      },
      insightValue: {
        color: themeColors?.bg_light_text,
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.boldFont
      },
      insightsMonthbg: {
        backgroundColor: themeColors?.bglight,
        padding: 15,
        borderRadius: 20,
        paddingStart: 25,
        paddingEnd: 25
      },
      tooltip: {
        position: 'absolute',
        top: height * 0.05,
        start: width * 0.3,
        backgroundColor: 'grey',
        padding: 10,
        zIndex: 1,
        borderRadius: 8
      },
      require: {
        color: themeColors?.danger,
        fontSize: getFontSize(14)
      },

      insightBarColordiff: {
        height: deviceType === 'Handset' ? height * 0.025 : height * 0.02,
        width: deviceType === 'Handset' ? width * 0.05 : width * 0.03
      },
      insightLabel: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(14),
        color: themeColors?.card_text_color,
        marginStart: 5
      },
      insightscontainhead: {
        fontFamily: fontsFamily.semiboldFont,
        color: themeColors?.card_secondary_color,
        fontSize: getFontSize(15)
      },
      insightscontainsubhead: {
        fontFamily: fontsFamily.mediumFont,
        color: themeColors?.card_secondary_color,
        opacity: 0.8,
        fontSize: getFontSize(12), marginBottom: 5
      },
      insightscontainsubheadvalue: {
        fontFamily: fontsFamily.mediumFont,
        color: themeColors?.card_secondary_color,
        marginTop: 5,
        fontSize: getFontSize(12), opacity: 0.8
      },
      insightsPieChart: {
        height: deviceType === 'Handset' ? 10 : 15,
        width: deviceType === 'Handset' ? 10 : 15,
        borderRadius: 30
      },
      dropdownreport: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        // backgroundColor: themeColors?.bglight,
        backgroundColor:themeColors?.cardbg,
        borderColor: '#F5F5F5',
        borderWidth: 1
      },
      reportDropText: {
        fontFamily: fontsFamily.regularFont,
        color: themeColors?.bg_light_text,
        fontSize: getFontSize(16),
        fontWeight: '500'
      },
      downloadbackground: {
        backgroundColor: themeColors?.bgbtn,
        borderRadius: 80,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'

      },
      filterBackground: {
        backgroundColor: themeColors?.bgbtn,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 80,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
      },
      listTitle: {
        fontFamily: fontsFamily.mediumFont,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: getFontSize(18),
        color: themeColors?.text_primary
      },

      container: {
        flex: 1,
        backgroundColor: themeColors?.gradient === 'No' ? themeColors?.backgroundcolor : 'transparent'

      },
      daterangeincreaseDecrease: {
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(16),
        color: themeColors?.bg_light_text
      },

      cardfilterdate: {
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(16),
        color: themeColors?.card_text_color
      },

      reportText: {
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(14),
        color: themeColors?.card_secondary_color
      },
      filterButton: {
        flex: 1,
        borderColor: themeColors?.bgbtn,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        marginStart: 10
      },
      filterTextInputContainer: {
        backgroundColor: themeColors?.white,
        borderWidth: 1,
        borderColor: '#DBDBDB',
        height: height * 0.06,
        marginTop: 5,
        justifyContent: 'center',
        borderRadius: 8,
        paddingLeft: 12,
      },
      filterInpuText: {
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(14),
        color: themeColors?.text_secondary
      },
      filterapplycancelBtn: {
        flex: 1,
        backgroundColor: themeColors?.warning,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center'
      },
      filterapplycancelBtnTxt: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(16),
        color: themeColors?.btn_text_color
      },
      accountName: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.semiboldFont,
        marginTop: 8,
        color: themeColors?.text_secondary

      },
      YaxisLabelTextStyle: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.semiboldFont,
        color: themeColors?.card_text_color
      },
      XaxisLabelTextStyle: {
        width: CommonFunction.getDeviceType() === 'Handset' ? width * 0.19 : width * 0.09,
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.semiboldFont,
        color: themeColors?.card_text_color,
        end: 5
      },
      notificationcardbg: {
        backgroundColor: themeColors?.cardbg,
        borderColor: themeColors?.bgbtn,

        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        marginTop: 10
      },
      notificationTitleTxt: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(16),
        color: themeColors?.card_text_color
      },
      notificationtitlebg: {
        flex: 1,
        justifyContent: 'center',
        marginStart: 10
      },
      faqQus: {
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(16),
        marginEnd: 5,
        lineHeight: 25,
        color: themeColors?.card_secondary_color
      },
      faqAns: {
        fontSize: getFontSize(16),
        fontWeight: '400',
        marginEnd: 5,
        lineHeight: 25,
        fontFamily: fontsFamily.regularFont,
        color: themeColors?.card_secondary_color,
      },
      setBudgetBtnbg: {
        marginTop: 30,
        backgroundColor: themeColors?.bgbtn,
        padding: 20,
        width: 150,
        alignItems: 'center',
        borderRadius: 5
      },

      setBugetText: {
        fontFamily: fontsFamily.regularFont,
        color: themeColors?.text_secondary,
        fontSize: getFontSize(16)
      },
      advtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: themeColors?.card_text_color
      },
      topSpacer: {
        height: height * 0.1,
      },
      scrollContainer: {
        flexGrow: 1,
      },
      title: {
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(14),
        textAlign: 'center',
        marginBottom: 12,
        color: 'black'
      },
      primaryAccount: {
        fontFamily: fontsFamily.boldFont,
        color: themeColors?.card_text_color,
        fontSize: getFontSize(15),
      },
      settingsSubtitle: {
        color: themeColors?.text_secondary,
        fontSize: getFontSize(18),
        fontFamily: fontsFamily.boldFont
      },



      loadertext: {
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(16),
        color: themeColors?.text_primary,
        marginTop: 10
      },
      bankListBackground: {
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomColor: themeColors?.bglight,
        borderBottomWidth: 2,
        paddingTop: 10
      },


      // today change M2

      editprofile: {
        color: themeColors?.white,
        fontFamily: fontsFamily.boldFont,
        fontWeight: '500',
        fontSize: getFontSize(14)
      },
      changeicon: {
        borderWidth: 1,
        backgroundColor: themeColors?.bgbtn,
        borderColor: themeColors?.bgbtn,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        bottom: 40,
        right: -50
      },

      banklistfont: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(14),
        color: themeColors?.card_secondary_color
      },
      textInput: {
        backgroundColor: themeColors?.inputprimary,
        borderRadius: 8,
        height: 55,
        fontSize: getFontSize(14),

        color: themeColors?.inputsecondary,
        fontFamily: fontsFamily.regularFont,
        paddingLeft: 16
      },
      dropdown1: {
        backgroundColor: themeColors?.bglight,
        borderRadius: 8,
        height: 50,
        paddingLeft: 12,
      },
      selectedTextStyle: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.mediumFont,
        color: themeColors?.inputsecondary
      },
      inputSearchStyle: {
        height: 40,
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.mediumFont,
        color: themeColors?.inputsecondary
      },
      iconStyle: {
        width: 20,
        height: 20,
        end: 10
      },
      label: {
        marginVertical: 12,
        fontSize: getFontSize(16),
        fontWeight: '400',
        fontFamily: fontsFamily.mediumFont,
        color: themeColors?.card_text_color,
      },

      textCenter: {
        fontSize: getFontSize(16),
        lineHeight: 25,
        color: "#fff",
        textAlign: "center"
      },
      btn: {
        backgroundColor: themeColors?.btn,
        padding: 15,
        borderRadius: 30,
        alignItems: 'center'
      },
      dropdownItemText: {
        color: themeColors?.inputsecondary,
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(16),

      },
      offerback: {
        borderRadius: 30, justifyContent: 'center',
        padding:5,backgroundColor:'#EDF5FF'
      },
      offertext: {
        color: themeColors?.card_secondary_color,
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(14),
      },
      offersrow: {
        flexDirection: 'row',
        marginTop: 15
      },
      offerslabelstart: {
        flex: 1, marginStart: 10,
        justifyContent:'center'
      },
      newbgbtn: {
        padding: Platform.OS === 'ios' ? 18 : 15,
        backgroundColor: themeColors?.bgbtn,
        alignItems: 'center',
        justifyContent: 'centers',
        borderRadius: 12,
      },
      newbtnText: {
        color: themeColors?.btn_text_color,
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.mediumFont
      },


      input1: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 6,
      },
      overlay1: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.3)",
      },
      container1: {
        backgroundColor: "#fff",
        paddingBottom: 20,
      },
      header1: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
      },
      cancel1: {
        color: "#999",
        fontSize: 16,
      },
      done1: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
      },
      sidehead: {
        color: themeColors?.text_primary, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14)
      },




      scrollView: {
        flex: 1,
      },
      scrollContent: {
        paddingBottom: 30,
      },
      formContainer: {
        paddingHorizontal: 16,
        marginTop: 16,
      },
      formGroup: {
        marginBottom: 16,
      },
      formLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#64748B",
        marginBottom: 8,
        marginLeft: 4,
      },
      customInput: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
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
        fontWeight: "600",
        color: "#64748B",
        marginRight: 8,
      },
      amountInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: "#0F172A",
        paddingVertical: 16,
      },
      // Target Type Styles
      targetTypeContainer: {
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 8,
        marginEnd: 10
      },
      targetTypeTitle: {
        fontSize: 14,
        fontWeight: "600",
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
        backgroundColor: themeColors?.cardbg,
        borderRadius: 16,
        padding: 16,
        borderWidth: 0

      },
      targetTypeCardSelected: {
        backgroundColor: themeColors?.cardbg,
        borderColor: themeColors?.bgbtn,
        borderWidth: 2
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
        fontSize: getFontSize(16),
        fontWeight: "700",
        fontFamily: fontsFamily.semiboldFont,
        color: themeColors?.text_primary,
        marginBottom: 4,
      },
      targetTypeCardTitleSelected: {
        color: themeColors?.bgbtn
      },
      targetTypeCardDesc: {
        fontSize: 12,
        color: "#64748B",
        lineHeight: 16,
      },
      selectedCheck: {
        position: "absolute",
        top: 12,
        right: 12,
      },
      // Date Picker
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
      datePickerLeft: {
        flexDirection: "row",
        alignItems: "center",
      },
      dateIcon: {
        marginRight: 12,
      },
      dateText: {
        fontSize: 16,
        color: "#0F172A",
        fontWeight: "500",
      },
      // Duration Display
      durationContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 16,
      },
      durationText: {
        fontSize: 14,
        color: "#0F172A",
        fontWeight: "500",
        marginLeft: 8,
      },
      // Calculated Card for Set Mode
      calculatedCard: {
        marginTop: 16,
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
      },
      calculatedLabel: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 8,
      },
      calculatedAmount: {
        fontSize: 28,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 12,
      },
      calculatedDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 8,
      },
      calculatedDetailItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      },
      calculatedDetailText: {
        fontSize: 11,
        color: "rgba(255,255,255,0.8)",
      },
      // Estimated Card for Don't Set Mode
      estimatedCard: {
        marginTop: 16,
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
      },
      estimatedLabel: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 8,
      },
      estimatedDate: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 4,
      },
      estimatedNote: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
        textAlign: "center",
      },
      // Account List
      accountsList: {
        marginTop: 10,
      },
      accountItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: themeColors?.cardbg,
        borderRadius: 14,
        padding: 16,
        marginTop: 8,
        marginEnd: 10

      },
      accountItemSelected: {
        borderColor: "#0A84FF",
        backgroundColor: "#F8FAFC",
        borderWidth: 2,
      },
      accountLeftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
      },
      accountIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
      },
      accountDetails: {
        flex: 1,
      },
      accountName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F172A",
        marginBottom: 4,
      },
      accountBank: {
        fontSize: 13,
        color: "#64748B",
      },
      accountRightSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      },
      balanceText: {
        fontSize: 16,
        fontWeight: "700",
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
      // Add Account Button
      addAccountButton: {
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
      addAccountIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
      },
      addAccountText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0A84FF",
      },
      // Notes Input
      notesInput: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#0F172A",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        textAlignVertical: "top",
        minHeight: 100,
      },
      // Create Button
      createButton: {
        backgroundColor: "#5F2B80",
        borderRadius: 12,
        paddingVertical: 18,
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#5F2B80",
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
        fontWeight: "600",
        color: "#FFFFFF",
      },
      // Modal Styles
      modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        width: "100%",
        maxWidth: 400,
      },
      modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "700",
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
        fontWeight: "600",
        color: "#64748B",
        marginBottom: 8,
      },
      modalInput: {
        backgroundColor: "#F8FAFC",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
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
        fontWeight: "600",
        color: "#64748B",
        marginRight: 8,
      },
      modalAmountInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
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
        fontWeight: "600",
        color: "#64748B",
      },
      saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
      },





    }),
    geticonSize: iconSize,
    textColor: 'black'

  }


}
export default getStyles;