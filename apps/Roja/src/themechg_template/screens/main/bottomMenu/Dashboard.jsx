import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  Suspense,
  lazy,
} from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  BackHandler,
  ToastAndroid,
  Dimensions,
} from "react-native";
import moment from "moment";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageViewing from "react-native-image-viewing";
import { useDispatch, useSelector } from "react-redux";
import timezone from "moment-timezone";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { SafeAreaView } from "react-native-safe-area-context";

import CommonFunction from "../../../../utill/CommonFunction";
import getStyles from "../../../styles";
import { getFontSize } from "../../../../constants/Font";
import { BottomContext } from "../../../../context/BottomContext";
import GradientBackground from "../../../component/GradientBackground";
import { apiformatDate } from "../../../../utill/Utills";
import { dropdownacc } from "../../../../utill/Utills";
import { generateReports, content, getavgMonthlydailybalance } from "../../../../constants/content";
import { getLoginInfo } from "../../../../service/storage";
import api from "../../../../service/api";

import { fetchChoosePlan } from "../../../../redux/slices/choosePlanSlice";
import { fetchactivePlan } from "../../../../redux/slices/activePlanSlice";
import { fetchcreditScore } from "../../../../redux/slices/scoreSlice";
import { fetchNotication } from "../../../../redux/slices/notificationSlice";
import { fetchAccount } from "../../../../redux/slices/accountSlice";
import { fetchStatement, resetStatement } from "../../../../redux/slices/statementSlice";
import { fetchCustomer } from "../../../../redux/slices/customerSlice";
import { fetchmenuSevice } from "../../../../redux/slices/menuiconSlice";
import { fetchReminder } from "../../../../redux/slices/reminderSlice";
import { fetchupdateeDate, fetchupdateStatement } from "../../../../redux/slices/newstatementSlice";
import { fetchBank } from "../../../../redux/slices/bankSlice";
import { fetchgetAccount, fetchgetllAccount, resetgetAccount } from "../../../../redux/slices/getmanulaccountSlice";
import { fetchAuth } from "../../../../redux/slices/authSlice";
import { fetchHanpickoffers } from "../../../../redux/slices/offerHandSlice";
import { fetchElgibleoffers } from "../../../../redux/slices/elgibleofferSlice";
import { fetchOffers } from "../../../../redux/slices/offerSlice";

import DashboardSkeleton from "./dashbordcomponets/DashboardSkeleton";
import { MonthPickerModal } from "./dashbordcomponets/DashboardModals";

const DashboardHeader = lazy(() => import("./dashbordcomponets/DashboardHeader"));
const AdvanceSubscriptionCard = lazy(() => import("./dashbordcomponets/AdvanceSubscriptionCard"));
const BankOverviewSection = lazy(() => import("./dashbordcomponets/BankOverviewSection"));
const CreditScoreCard = lazy(() => import("./dashbordcomponets/CreditScoreCard"));
const NoBankConnectedView = lazy(() => import("./dashbordcomponets/NoBankConnectedView"));
const DashboardModals = lazy(() => import("./dashbordcomponets/DashboardModals"));
const ReminderWidget = lazy(() => import("./dashbordcomponets/reminderWidget"));
const OfferCarousel = lazy(() => import("./dashbordcomponets/CommonComponents"));
const CommonOfferSection = lazy(() =>
  import("./dashbordcomponets/CommonComponents").then((m) => ({ default: m.CommonOfferSection }))
);


const SilentFallback = () => null;

function Dashboard({ navigation, route }) {
  const [dropmonth, setdropmonth] = useState("");
  const [tranbtn, setransbtn] = useState(true);
  const [insightBtn, setinsightBtn] = useState(true);
  const [budbtn, setbudbtn] = useState(false);
  const [date, setDate] = useState("");
  const [disDate, setdisDate] = useState("");
  const [show, setShow] = useState(false);
  const [endDate, setendDate] = useState("");
  const [endDate1, setendDate1] = useState("");
  const [menubar, setmenubar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [photo, setphoto] = useState("");
  const [loader, setloader] = useState(false);
  const [loginfo, setloginfo] = useState("");
  const [chart, setchart] = useState([]);
  const [chart1, setchart1] = useState([]);
  const [piechart, setpiechart] = useState([]);
  const [piechart1, setpiechart1] = useState([]);
  const [barChart, setbarchart] = useState([]);
  const [month, setmonth] = useState("");
  const [month1, setmonth1] = useState("");
  const [dismonth, setdismonth] = useState("");
  const [icon, seticons] = useState([]);
  const [accchg, setaccchg] = useState(false);
  const isFocused = useIsFocused();
  const [firstPage, setfirstPage] = useState("");
  const [storeaccount, setstoreaccount] = useState("");
  const [name, setname] = useState("");
  const [image, setImage] = useState("");
  const [oldMonth, setOldmonth] = useState("");
  const [clickcnt, setclickcnt] = useState(0);
  const [imgvisible, setimgVisible] = useState(false);
  const [account, setaccount] = useState([]);
  const [accId, setaccId] = useState("");
  const [menu, setmenu] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPage1, setCurrentPage1] = useState(0);
  const { height, width } = Dimensions.get("window");
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme;
  var { styles, geticonSize, textColor } = getStyles(themeColors);
  const [record, setRecord] = useState("");
  const [currentDot, setCurrentDot] = useState(0);
  const [ieLables, setieLables] = useState([]);
  const [incomeAmt, setincomeAmt] = useState([]);
  const [expensAmt, setexpenseAmt] = useState([]);
  const [dropChg, setdropChg] = useState(false);
  const dispatch = useDispatch();
  const { enableMenu } = useContext(BottomContext);
  const { data1, error1 } = useSelector((state) => state.chooseplan);
  const { scoredata, scoreloading, scorerror } = useSelector((state) => state.creditScore);
  const { notificationdata, notificationerror, notificationloading } = useSelector((state) => state.notification);
  const { reminderdata, reminderoading, remindererror } = useSelector((state) => state.reminder);
  const { offersdata, offersloading, offersnerror } = useSelector((state) => state.offers);
  const [cardKey, setcardKey] = useState("");
  const [futureDate, setfutureDate] = useState("");
  const [btnvisible, setbtnvisible] = useState(false);
  const [load, setload] = useState(false);
  const [getcardindex, setcardindex] = useState("");
  const [creditaount, setcreditamount] = useState(0);
  const [statements, setStatements] = useState("");
  const [recentTransation, setRecentTransaction] = useState([]);
  const [avgBal, setAvgbal] = useState("");
  const [firstTrans, setFirstTrans] = useState("");
  const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
  const { page, size, records, hasMore, firstTransDate } = useSelector((state) => state.statement);
  const { tagdata, tagloading, tagerror } = useSelector((state) => state.taglist);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { cusDetails, cusloading, cuserror } = useSelector((state) => state.customer);
  const { dashboard, offers, loanoffe, settingcms } = useSelector((state) => state.menuicons);
  const { bankdata, bankloading, bankerror, defbank } = useSelector((state) => state.bank);
  const { allrecord, cusData, totalBill, storePay, activeSub, minAmount, maxAmount, enabled } = useSelector((state) => state.advance);
  const [gllist, setglList] = useState([]);
  const { goalList, goalaccount } = useSelector((state) => state.goal);
  const [chval, setChval] = useState("");
  const [miniStatement, setminiStatement] = useState([]);
  const [offerssdata, setOfferdata] = useState([]);
  const [defbankid, setDefbankid] = useState("");
  const [categoryBudget, setCategorybudget] = useState([]);
  const [availBal, setAvailBal] = useState("");
  const [visible, setVisible] = useState(false);
  const [dashboardMenu, setDashboradmenu] = useState([]);
  const { getaccountdata, getaccount, getaccountloading, getaccounterror, networth } = useSelector((state) => state.getaccount);
  const { dashboardmenudata, dashboardmenuloading, dashboardmenuerror } = useSelector((state) => state.dashboardmenu);
  const { budgetcategorydata, budgetcategoryloading } = useSelector((state) => state.budgetcategory);
  const { openofferdata, openofferloading, openoffererror } = useSelector((state) => state.openoffers);
  const { subscription, allsubscription, subloading, suberror } = useSelector((state) => state.subscription);
  const description = "Instantly access updates, simplify budgeting, and gain spending Insights.";
  const [category, setCategory] = useState([]);
  const now = new Date();
  const [id, setid] = useState("");
  const [remindedata, setremaindata] = useState([]);
  const [accName, setaccName] = useState("");
  const [isConnect, setIisConnect] = useState(false);
  const [isShowoff, setIshowoff] = useState(true);
  const [accountArr, setAccountarr] = useState([]);
  const { brandata, brandloading, branderror } = useSelector((state) => state.brandlogo);
  const { dashboardLabel } = useSelector((state) => state.labels);
  const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category);
  const { handpickdata, handpickloading, handpickerror } = useSelector((state) => state.handpicks);
  const { allbankaccountlist } = useSelector((state) => state.getaccount);
  const [ishideRefresh, setIshiderefresh] = useState(false);
  const [isStatement, setIsStatemnet] = useState(false);
  const deftransactionimg = require("../../../../../assets/images/transaction-icon.jpg");
  const backPressCount = useRef(0);
  dayjs.extend(weekOfYear);
  const [offerRec, setOfferRec] = useState([]);
  const [advanceOffer, setAdvanceOffers] = useState([]);
  const scrollRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount.current === 0) {
          backPressCount.current = 1;
          ToastAndroid.show("Press again to exit", ToastAndroid.SHORT);
          setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);
          return true;
        }
        BackHandler.exitApp();
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    if (openofferdata) {
      const recdata =
        openofferdata?.records.filter((obj) => {
          const curDate = new Date();
          return curDate <= new Date(obj?.expiry);
        }) || [];
      setOfferRec(recdata);
    }
  }, [openofferdata]);

  useEffect(() => {
    if (0 < defaccount?.length) {
      const acc = dropdownacc(defaccount);
      setAccountarr(acc);
    }
  }, [defaccount]);

  useEffect(() => {
    getDetails();
    enableMenu();
  }, []);

  useEffect(() => {
    if (scoredata?.data?.score) {
      setcreditamount(scoredata?.data?.score);
      setcreditamount(scoredata?.data?.score);
    }
  }, [scoredata]);

  const bankConnect = (data) => {
    var info = data ? data : storedata;
    if (info?.request_status === "Yes") {
      setIisConnect(true);
    } else {
      setIshowoff(true);
      setIisConnect(false);
    }
  };

  useEffect(() => {
    setDashboradmenu(dashboardmenudata);
  }, [dashboardmenudata]);

  const checkColor = (type) => (type === "CREDIT" ? themeColors.success : themeColors.danger);

  function formatTime(date) {
    var zone = storedata.zone;
    return timezone(date).tz(zone).format("hh:mm a");
  }

  useEffect(() => {
    if (accountdata) {
      if (0 < defaccount?.length) {
        var defaccid = defaccount.find((obj) => obj.account_default === "Yes");
        setaccName(CommonFunction.captialize(defaccid?.type?.toLowerCase()));
        setDefbankid(defaccid.bank_id);
        setaccId(defaccid.guid);
        setAvailBal(defaccid.balance);
      }
    }
  }, [accountdata]);

  useEffect(() => {
    if (0 < reminderdata?.length) {
      const pendingremaingdata = reminderdata.filter((obj) => obj.status === "Pending");
      setremaindata(pendingremaingdata);
    } else {
      setremaindata([]);
    }
  }, [reminderdata]);

  const getAccount = () => {
    if (0 < defaccount?.length) {
      var defaccid = defaccount.find((obj) => obj.account_default === "Yes");
      setDefbankid(defaccid.bank_id);
      setaccId(defaccid.guid);
      setAvailBal(defaccid.balance);
    }
  };

  useEffect(() => {
    if (records && date) {
      const begin = getDate(date).begin;
      const end = getDate(date).end;
      const ch = records.filter((item) => {
        const txDate = changeformat(item.transacted_at);
        const matchAccount = item.account_guid === accId && item.bank_id === defbankid;
        const matchDate = txDate >= begin && txDate <= end;
        return matchAccount && matchDate;
      });

      const ch1 = records.filter((item) => item.account_guid === accId && item.bank_id === defbankid);
      setRecentTransaction(ch1);

      const accountrans = records.filter((item) => item.account_guid === accId && item.bank_id === defbankid);

      var firstdata = accountrans[accountrans.length - 1];
      setFirstTrans(firstTransDate);
      var debitTag = [];
      if (0 < tagdata?.records?.length) {
        debitTag = tagdata.records.filter((value) => value.tag_type === "DEBIT").map((value) => ({ ...value }));
      }

      setminiStatement(accountrans);
      const calculatebal = getavgMonthlydailybalance(ch);
      setAvgbal(calculatebal);
      setStatements(ch);
      setmonth(apiformatDate(date));

      if (0 < dashboard?.length) {
        let arrrid = {};
        dashboard.map((value, key) => {
          arrrid[value.id] = {
            name: value.name,
            image: value.image,
            bgcolor: value.bgcolor,
            logo: value.logo,
            appicon: value?.appicon,
            iconfamily: value?.iconfamily,
          };
        });
        setmenu(arrrid);
      }

      AsyncStorage.setItem("date", date.toISOString());
    }
  }, [date, accId, records]);

  useEffect(() => {
    if (0 < handpickdata?.records?.length) {
      setOfferdata(handpickdata?.records);
    }
    if (0 < offersdata?.records?.length) {
      const recdata =
        offersdata?.records?.filter((obj) => {
          const curDate = new Date();
          return curDate <= new Date(obj?.offer_id?.expiry);
        }) || [];
      setAdvanceOffers(recdata);
    }
  }, [handpickdata, offersdata]);

  useEffect(() => {
    if (defbank?.refreshtime) {
      const banktime = changeTime1(defbank?.refreshtime);
      const apptime = new Date();
      const zone = storedata.zone;
      const df = timezone(apptime).tz(zone);
      const current = new Date(df);
      setIshiderefresh(banktime.getTime() <= current.getTime());
    } else {
      setIshiderefresh(true);
    }
  }, [defbank]);

  const getDate = (date) => ({
    begin: moment(date).startOf("month").format("YYYY-MM-DD"),
    end: moment(date).endOf("month").format("YYYY-MM-DD"),
  });

  const changeformat = (date) => moment(new Date(date)).format("YYYY-MM-DD");

  const getDetails = async () => {
    var info = await getLoginInfo();
    setloginfo(storedata ? storedata : info);
    bankConnect(info);

    const fixdate = await AsyncStorage.getItem("date");
    setDate(fixdate ? new Date(fixdate) : new Date());
  };

  const changeTime1 = (time) => {
    if (time) {
      const date = new Date(time);
      date.setHours(date.getHours() + settingcms.refereshhours);
      const zone = storedata.zone;
      const df = timezone(date).tz(zone);
      return new Date(df.format());
    }
  };

  const { monthlyReport } = generateReports(statements);

  const showPicker = useCallback((value) => setShow(value), []);

  useEffect(() => {
    if (Object.keys(scoredata).length !== 0) {
      getScore();
    }
  }, [scoredata]);

  const getScore = () => {
    const firstDate = scoredata.data.createdAt;
    const currentDate = new Date();
    const futureDate = new Date(firstDate);
    futureDate.setDate(futureDate.getDate() + scoredata.refresh);
    const fd = moment(firstDate).add(scoredata.refresh, "day");
    const st = moment(currentDate);
    setfutureDate(fd);
    setbtnvisible(fd <= st);
  };

  const apiDate = (date) => moment(new Date(date)).format("YYYY-MM");

  const formatDate = (date) => moment(new Date(date)).format("MMM-YYYY");

  const displayDate1 = (rec) => moment(rec).format("MMMM - YYYY");

  const refreshScore = () => {
    setloader(true);
    const details = {
      firstname: "KARL",
      middlename: "E",
      lastname: "ARMSTRONG",
      dob: "1959",
      ssn: "111111111",
      line1: "1073 BUCKINGHAM DR",
      city: "CAROL STREAM",
      state: "IL",
      zipcode: "60188",
      requestor: "2222222",
    };
    setload(true);
    api
      .post("settings/savescore/" + loginfo.id, details)
      .then((res) => {
        dispatch(fetchcreditScore());
        setloader(false);
      })
      .catch((err) => {
        setloader(false);
        CommonFunction.message("Something went wrong. Please try again later.");
        console.log(err.response);
      });
  };

  const timezoneformat = (date) => {
    var zone = loginfo.zone;
    return timezone(date).tz(zone).format(loginfo?.format);
  };

  function formatDateTime(date) {
    var zone = loginfo.zone;
    return timezone(date).tz(zone).format("hh:mm a");
  }

  const calculateDaysAgo = (date) => {
    if (date) {
      const now = new Date();
      const Due = new Date(date);
      const differenceInTime = now - Due;
      return Math.floor(differenceInTime / (1000 * 3600 * 24));
    }
  };

  const getcolor = (date) => {
    var countdays = calculateDaysAgo(date);
    if (countdays === 0) {
      return themeColors?.danger;
    } else if (0 < countdays) {
      return themeColors?.warning;
    } else {
      return "#000";
    }
  };

  const formatchDate = (date) => {
    const d = new Date(date);
    return `On ${d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}`;
  };

  const payReminder = (value) => {
    api
      .post("dashboard/remindermarkaspaid/" + value?._id)
      .then((res) => {
        console.log(res.data);
        dispatch(fetchReminder());
        CommonFunction.message(res?.data?.message);
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  async function setmarkset(value) {
    Alert.alert(
      "Alert",
      "Do you want to mark it as paid?",
      [
        { text: "Cancel", onPress: () => console.log("No Pressed"), style: "cancel" },
        { text: "Mark as Paid", onPress: () => payReminder(value) },
      ],
      { cancelable: true }
    );
  }

  const onValueChange = useCallback(
    (event, newDate) => {
      if (event === "dismissedAction") {
        showPicker(false);
      } else {
        showPicker(false);
        const selectedDate = newDate || date;
        setTimeout(() => {
          setDate(selectedDate);
        }, 0);
      }
    },
    [date, showPicker]
  );

  const formatDateTras = (date) => {
    if (date && storedata) {
      return moment(date).format(storedata?.format);
    }
  };

  const getNewBankStatement = async () => {
    setloader(true);
    setIsStatemnet(false);
    try {
      const stadata = await dispatch(fetchupdateStatement({ code: defbank?.chirp_request })).unwrap();
      const stadate = await dispatch(fetchupdateeDate({ code: defbank?.chirp_request })).unwrap();

      if (stadata && stadate) {
        setloader(false);
        console.log("i am get statement completed");
        getOffers();
        dispatch(resetStatement());
        dispatch(fetchBank());
        dispatch(resetgetAccount());
        dispatch(fetchgetllAccount());
        dispatch(fetchAuth());
        dispatch(fetchgetAccount());
        dispatch(fetchAccount());
        dispatch(fetchHanpickoffers());
        setIshiderefresh(false);
      }
    } catch (error) {
      setloader(false);
      console.log("API error:", error);
    }
  };

  const getOffers = async () => {
    try {
      const payload = { customerId: storedata?.id };
      await api.post("user_snapshort/create", payload);
      await dispatch(fetchElgibleoffers());
      await dispatch(fetchOffers());
    } catch (err) {
      console.log(err?.response);
    }
  };

  return (
    <GradientBackground>
      <StatusBar
        backgroundColor={themeColors.statusbar}
        translucent={Platform.OS === "android" ? false : true}
        barStyle={themeColors?.themelogo === "Light" ? "light-content" : "dark-content"}
      />
      <SafeAreaView style={themedata?.gradient === "No" ? styles.primaryBackground : { flex: 1 }} edges={["top"]}>
        {loader || !loginfo || cusloading ? (
          <DashboardSkeleton />
        ) : (
          cusDetails &&
          loginfo && (
            <View style={{ flex: 1 }}>
              <Suspense fallback={<SilentFallback />}>
                <DashboardHeader
                  navigation={navigation}
                  cusDetails={cusDetails}
                  themeColors={themeColors}
                  styles={styles}
                  getFontSize={getFontSize}
                  geticonSize={geticonSize}
                  notificationdata={notificationdata}
                />
              </Suspense>

              <ImageViewing
                images={[{ uri: image }]}
                imageIndex={0}
                visible={imgvisible}
                onRequestClose={() => setimgVisible(false)}
              />

              {isConnect ? (
                <View style={{ flex: 1 }}>
                  <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                    <View style={{ marginStart: 10, marginEnd: 10, flex: 1 }}>
                      <Suspense fallback={<SilentFallback />}>
                        <AdvanceSubscriptionCard
                          navigation={navigation}
                          subscription={subscription}
                          loginfo={loginfo}
                          dashboardLabel={dashboardLabel}
                          storedata={storedata}
                          activeSub={activeSub}
                          totalBill={totalBill}
                          minAmount={minAmount}
                          maxAmount={maxAmount}
                          themeColors={themeColors}
                          styles={styles}
                          getFontSize={getFontSize}
                        />
                      </Suspense>
                    </View>

                    {dashboardMenu.map((value, key) => (
                      <View style={{ marginStart: 10, marginEnd: 10, marginBottom: 20 }} key={key}>
                        {value.id === "698ac4a20089bb58e806bc77" ? (
                          <View style={{ marginTop: 0 }}>
                            {0 < remindedata?.length && (
                              <Suspense fallback={<SilentFallback />}>
                                <ReminderWidget
                                  title={value?.name}
                                  remindedata={remindedata}
                                  navigation={navigation}
                                  themeColors={themeColors}
                                  getFontSize={getFontSize}
                                  calculateDaysAgo={calculateDaysAgo}
                                  formatchDate={formatchDate}
                                  getcolor={getcolor}
                                  storedata={storedata}
                                  content={content}
                                  styles={styles}
                                />
                              </Suspense>
                            )}
                          </View>
                        ) : value.id === "698ac48c0089bb58e806bc29" ? (
                          <Suspense fallback={<SilentFallback />}>
                            <BankOverviewSection
                              title={value?.name}
                              width={width}
                              themeColors={themeColors}
                              styles={styles}
                              getFontSize={getFontSize}
                              geticonSize={geticonSize}
                              accountArr={accountArr}
                              accId={accId}
                              setaccId={setaccId}
                              setShow={setShow}
                              formatDate={formatDate}
                              date={date}
                              availBal={availBal}
                              storedata={storedata}
                              menu={menu}
                              statements={statements}
                              avgBal={avgBal}
                              loginfo={loginfo}
                              monthlyReport={monthlyReport}
                              month={month}
                              recentTransation={recentTransation}
                              defbank={defbank}
                              brandata={brandata}
                              categorydata={categorydata}
                              deftransactionimg={deftransactionimg}
                              formatDateTras={formatDateTras}
                              formatTime={formatTime}
                              checkColor={checkColor}
                              navigation={navigation}
                              setIsStatemnet={setIsStatemnet}
                            />
                          </Suspense>
                        ) : value.id === "67402ad6be1acc2dccbf1261" ? (
                          <View>
                            {(0 < offerssdata?.length || 0 < advanceOffer?.length) && (
                              <View style={{ marginTop: key === 0 ? 20 : 0 }}>
                                <Suspense fallback={<SilentFallback />}>
                                  <CommonOfferSection
                                    title={value?.name}
                                    advanceOffer={advanceOffer}
                                    offers={offerssdata}
                                    themeColors={themeColors}
                                    getFontSize={getFontSize}
                                    onViewAll={() => navigation.navigate("OffersRoute", { screen: "Offers", params: { activeindex: 2 } })}
                                  />
                                </Suspense>
                              </View>
                            )}
                          </View>
                        ) : value.id === "67402ab3be1acc2dccbf1245" && 0 < offerRec.length ? (
                          <Suspense fallback={<SilentFallback />}>
                            <OfferCarousel
                              key={key}
                              item={value}
                              itemKey={key}
                              offerRec={offerRec}
                              themeColors={themeColors}
                              getFontSize={getFontSize}
                              styles={styles}
                              width={width}
                              height={height}
                              navigation={navigation}
                              CommonFunction={CommonFunction}
                            />
                          </Suspense>
                        ) : value.id === "67402afabe1acc2dccbf1299" ? (
                          <View
                            style={{
                              backgroundColor: themeColors?.cardbg,
                              borderRadius: 5,
                              marginTop: key === 0 ? 20 : 0,
                              paddingBottom: 20,
                            }}
                          >
                            <Suspense fallback={<SilentFallback />}>
                              <CreditScoreCard
                                title={value?.name}
                                creditaount={creditaount}
                                scoredata={scoredata}
                                btnvisible={btnvisible}
                                themeColors={themeColors}
                                styles={styles}
                                getFontSize={getFontSize}
                                navigation={navigation}
                                refreshScore={refreshScore}
                              />
                            </Suspense>
                          </View>
                        ) : (
                          <></>
                        )}
                      </View>
                    ))}

                    <MonthPickerModal
                      show={show}
                      onValueChange={onValueChange}
                      date={date}
                      minimumDate={
                        cusDetails.first_transaction?.transacted_at
                          ? new Date(cusDetails.first_transaction.transacted_at)
                          : new Date("2022-01-01")
                      }
                    />
                  </ScrollView>
                </View>
              ) : (
                <Suspense fallback={<SilentFallback />}>
                  <NoBankConnectedView
                    navigation={navigation}
                    isShowoff={isShowoff}
                    setIshowoff={setIshowoff}
                    bankConnect={bankConnect}
                    remindedata={remindedata}
                    themeColors={themeColors}
                    getFontSize={getFontSize}
                    calculateDaysAgo={calculateDaysAgo}
                    formatchDate={formatchDate}
                    getcolor={getcolor}
                    storedata={storedata}
                    styles={styles}
                    offerRec={offerRec}
                    width={width}
                    height={height}
                    CommonFunction={CommonFunction}
                  />
                </Suspense>
              )}

              <Suspense fallback={<SilentFallback />}>
                <DashboardModals
                  isStatement={isStatement}
                  setIsStatemnet={setIsStatemnet}
                  ishideRefresh={ishideRefresh}
                  settingcms={settingcms}
                  formatDateTras={formatDateTras}
                  changeTime1={changeTime1}
                  defbank={defbank}
                  formatDateTime={formatDateTime}
                  getNewBankStatement={getNewBankStatement}
                  themeColors={themeColors}
                />
              </Suspense>
            </View>
          )
        )}

        <MonthPickerModal
          show={show}
          onValueChange={onValueChange}
          date={date || new Date()}
          minimumDate={
            firstTrans
              ? new Date(firstTrans)
              : budgetcategorydata?.plans?.[0]?.createdAt
                ? new Date(budgetcategorydata?.plans?.[0]?.createdAt)
                : new Date()
          }
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

export default Dashboard;