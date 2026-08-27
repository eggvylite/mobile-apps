import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, View } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import CommonFunction from "../../utill/CommonFunction";
import { content } from "../../constants/content";
import { fontsFamily } from "../../constants/fontsFamily";
import { getFontSize } from "../../constants/Font";


export default function BillsSection({ bills }) {
  const navigation = useNavigation();
  const { reminderdata, reminderoading, remindererror } = useSelector((state) => state.reminder)
  const [remindedata, setremaindata] = useState([])
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);

  useEffect(() => {
    if (0 < reminderdata?.length) {
      const pendingremaingdata = reminderdata.filter((obj) => obj.status === 'Pending')
      setremaindata(pendingremaingdata)
    } else {
      setremaindata([])
    }
  }, [reminderdata])
  const handleBillPress = (reminder) => {
    navigation.navigate('ReminderDetail', { reminder });
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


  const formatchDate = (date) => {
    const d = new Date(date);
    return `On ${d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })}`;
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Reminders</Text>

      {remindedata.slice(0, 3).map((bill) => {
        const accountDetails = bill?.account_id
        var number = ''
        if (accountDetails?.account_number) {
          number = ' -  XX' + CommonFunction.slicenum(accountDetails?.account_number)
        } else {
          number = ' - ' + content.manual
        }
        let displayText = "";
        let dispalypast = '';
        if (bill && bill?.date) {
          // var days = calculateDaysAgo(value?.date)
          const daysAgo = calculateDaysAgo(bill.date);

          if (bill.status !== "Paid") {
            if (daysAgo > 0 && daysAgo <= 7) {
              // Past within 7 days
              if (1 < daysAgo) {
                displayText = `${daysAgo} days ago`;
              } else {
                displayText = `${daysAgo} day ago`;
              }

            }
            else if (daysAgo > 7) {
              // Past more than 7 days
              displayText = `${formatchDate(bill.date)}`;
            }
            else if (daysAgo === 0) {
              displayText = "Today";
            }
            else if (daysAgo < 0 && Math.abs(daysAgo) <= 7) {
              // Future within 7 days
              if (1 < daysAgo) {
                displayText = `Due In ${Math.abs(daysAgo)} days`;
              } else {
                displayText = `Due In ${Math.abs(daysAgo)} day`;
              }

            }
            else {
              // Future more than 7 days (e.g., -13)
              displayText = `${formatchDate(bill.date)}`;
            }
          }

          if (daysAgo > 0) {
            dispalypast = 'Past'
          } else {
            dispalypast = ''
          }
        }

        return (
          <TouchableOpacity
            key={bill._id}
            style={styles.card}
            onPress={() => handleBillPress(bill)}
            activeOpacity={0.7}>
            <View style={styles.left}>
              <View style={styles.row}>
                <Text style={styles.billTitle}>{bill.name}</Text>
                <View style={[
                  styles.badge,
                  displayText === 'Today' ? styles.badgeDanger : displayText === 'Tomorrow' ? { backgroundColor: '#FFFF93' } :
                    displayText?.includes('Due in') ? styles.badgeWarning :
                      styles.badgeDefault
                ]}>
                  <Text style={styles.badgeText}>{displayText}</Text>
                </View>
              </View>

              <Text style={styles.subtitle}>
                {bill?.account_id?.type}{number}
              </Text>

              <Text style={styles.amount}>{storedata?.currency}{CommonFunction.formatamount(bill?.amount || 0)}</Text>
            </View>

            <View style={styles.arrow}>
              <Feather name="chevron-right" size={20} color="#111827" />
            </View>
          </TouchableOpacity>
        )
      }
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
    marginTop: 0
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#1b1b1b',
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 14,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20
  },
  left: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeDanger: {
    backgroundColor: "#E56772",
  },
  badgeWarning: {
    backgroundColor: "#FBBF24",
  },
  badgeDefault: {
    backgroundColor: "#94A3B8",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
    marginBottom: 6,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
});