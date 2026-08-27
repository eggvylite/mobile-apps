import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';

const CashLimitsCard = ({ subscription, customer }) => {

  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const styles = useStyles(themeColors)

  return (
    <View style={styles.card}>


      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <View style={[styles.cardIconBg]}>
            <Icon name="lock" size={16} color="#FFB347" />
          </View>
          <Text style={styles.cardTitleText}>Cash Limits</Text>
        </View>
      </View>


      <View style={styles.cashLimitsContainer}>

        <View style={styles.cashLimitBox}>
          <View style={[styles.cashLimitIcon]}>
            <Icon name="arrow-down" size={20} color="#FF6B6B" />
          </View>

          <View style={styles.cashLimitContent}>
            <Text style={styles.cashLimitLabel}>
              Minimum Cash Limit
            </Text>

            <Text style={styles.cashLimitValue}>
              {`${storedata?.currency}${subscription?.plan_cash_min}`}
            </Text>

            <Text style={styles.cashLimitNote}>
              Lowest amount you can withdraw
            </Text>
          </View>
        </View>


        <View style={styles.cashLimitDivider} />

        <View style={styles.cashLimitBox}>
          <View style={[styles.cashLimitIcon]}>
            <Icon name="arrow-up" size={20} color="#34C759" />
          </View>

          <View style={styles.cashLimitContent}>
            <Text style={styles.cashLimitLabel}>
              Maximum Cash Limit
            </Text>

            <Text style={styles.cashLimitValue}>
              {`${storedata?.currency}${subscription?.max}`}
            </Text>

            <Text style={styles.cashLimitNote}>
              Highest amount you can withdraw
            </Text>
          </View>
        </View>

      </View>
    </View>
  );
};

export default CashLimitsCard;


const useStyles = (theme) => StyleSheet.create({


  card: {
    backgroundColor: theme?.cardbg ?? '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    // borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme?.iconbg
  },
  cardTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme?.card_text_color ?? '#0F172A',
  },



  // Cash Limits Styles
  cashLimitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme?.cardbg ?? '#F8FAFC',
    borderRadius: 16,
    // padding: 16,
  },
  cashLimitBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cashLimitIcon: {
    width: 40,
    height: 40,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme?.iconbg
  },
  cashLimitContent: {
    flex: 1,
  },
  cashLimitLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme?.card_text_color ?? '#64748B',
    marginBottom: 5,
    letterSpacing: 0.3,
    opacity: 0.7
  },
  cashLimitValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme?.card_text_color ?? '#0F172A',
    marginBottom: 2,
  },
  cashLimitNote: {
    fontSize: 9,
    color: theme?.card_text_color ?? '#94A3B8',
    marginTop:5
  },
  cashLimitDivider: {
    width: 1,
    height: 50,
    backgroundColor: theme?.card_text_color ?? '#E2E8F0',
    marginHorizontal: 12,
  },


});
