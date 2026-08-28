import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import appLog from '../../constants/logger';
import CommonIcon from '../../themechg_template/component/Commonicons';
import { fontsFamily } from '../../constants/fontsFamily';


const BenefitSectionCard = React.memo(({ icon, title, description, color, iconColor, family }) => (
  <View style={styles.benefitSectionCard}>
    <View style={[styles.benefitSectionIcon, { backgroundColor: color || '#F0F0FF' }]}>
      {
        family ? <CommonIcon name={icon ?? 'airplay'} size={24} color={iconColor ?? '#3F2B96'} family={family} /> : <Icon name={icon ?? 'airplay'} size={20} color={iconColor ?? '#3F2B96'} />
      }
    </View>
    <View style={styles.benefitSectionContent}>
      <Text style={styles.benefitSectionTitle}>{title}</Text>
      <Text style={styles.benefitSectionDescription}>{description}</Text>
    </View>
  </View>
));

const WageUserBenefitsCard = React.memo(({ data }) => (
  <View style={styles.wageBenefitsCard}>

    <Text style={styles.wageBenefitsTitle}> {data?.head}</Text>

    {0 < data?.features?.length && data?.features?.map((benefit) => (
      <BenefitSectionCard
        key={benefit.title}
        icon={benefit.icon}
        title={benefit.title}
        description={benefit.description}
        color={benefit.bgcolor}
        iconColor={benefit?.iconcolor}
        family={benefit?.family}

      />
    ))}
  </View>
));

export default WageUserBenefitsCard;


const styles = StyleSheet.create({
  // ─── Benefit Section Card ──────────────────────────
  benefitSectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  benefitSectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  benefitSectionContent: {
    flex: 1,
  },
  benefitSectionTitle: {
    fontSize: 14,
    fontFamily: fontsFamily.semiboldFont,
    color: '#111827',
    marginBottom: 2,
  },
  benefitSectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  // ─── Wage User Benefits Card ──────────────────────
  wageBenefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  wageBenefitsTitle: {
    fontSize: 18,
    fontFamily: fontsFamily.boldFont,
    color: '#111827',
    marginBottom: 16,
  },
});