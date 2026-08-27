import {
    ScrollView,
    StyleSheet,

    View,

    Text,
    TouchableOpacity,

} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import appLog from '../../constants/logger';
import { useSelector } from 'react-redux';
import useGeneralLabelsHook from '../../hook/Labels/useGenerallablehoo';
import CommonIcon from '../../themechg_template/component/Commonicons';
import { appName } from '../../service/environment';


const QUALIFIED_CARD_CONTENT = {
    header: {
        title: "You're qualified for",
        amount: '$200',
        badgeText: 'from your earned wages',
        subText: 'Based on your connected bank information and eligible earned wages.',
    },
    availableNote: 'Your available amount may change based on your eligibility and account activity.',
    benefitsTitle: `${appName} offers many key benefits to support your financial needs`,
    benefits: [
        {
            icon: 'zap',
            title: 'Up to $200 Earned Wage Access',
            description: 'Access a portion of your earned wages when you need it.',
            color: '#EEF2FF',
        },
        {
            icon: 'briefcase',
            title: 'Budgeting & Spending Management',
            description: 'Plan, track, and manage your everyday spending.',
            color: '#E8F5E9',
        },
        {
            icon: 'target',
            title: 'Savings Goal Tracking',
            description: 'Set goals and build better savings habits.',
            color: '#FFF3E0',
        },
        {
            icon: 'shield',
            title: 'Credit Monitoring',
            description: 'Stay informed about changes to your credit.',
            color: '#F3E5F5',
        },
        {
            icon: 'bell',
            title: 'Smart Alerts & Reminders',
            description: 'Stay ahead of bills and help avoid NSF and overdraft fees.',
            color: '#FCE4EC',
        },
        {
            icon: 'bell',
            title: 'Bill Alerts & Reminders',
            description: 'Never miss a payment with smart alerts and reminders.',
            color: '#E8F5E9',
        },
        {
            icon: 'alert-circle',
            title: 'NSF & Overdraft Prevention Alerts',
            description: 'Get alerts to help you avoid NSF and overdraft fees.',
            color: '#FFF3E0',
        },
        {
            icon: 'pie-chart',
            title: 'Personalized Insights',
            description: 'All your spending analysis with income-based suggestions.',
            color: '#E0F7FA',
        },
        {
            icon: 'tag',
            title: 'Handpicked Offers',
            description: 'Offers tailored for you based on your spending.',
            color: '#F3E5F5',
        },
    ],
    pricing: {
        title: 'Simple Monthly Subscription',
        highlight: '$10 monthly fee',
        important: 'This is not interest or a fee for accessing your earned wages in advance.',
        description:
            `${appName} is a subscription service with a {highlight}. {important}—it is the cost of accessing your ${appName} membership and financial tools, including Earned Wage Access when you qualify.`,
    },
    buttonText: 'Subscribe & Unlock Your Benefits',
};

const BenefitSectionCard = ({ icon, title, description, color, iconColor, family }) => (
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
);


const QualifiedCard = ({ onSubscribe, storedata, cusDetails, subscriptionBage, subscriptionInformation }) => (
    <View style={styles.qualifiedCard}>

        <View style={{ width: "100%" }}>
            <LinearGradient
                colors={['#E8F5E9', '#E3F2FD', '#F3E5F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.qualifiedHeaderCard}
            >
                <View style={[styles.qualifiedHeaderContent,{right:10}]}>
                    <Text style={styles.qualifiedHeaderTitle}>{onSubscribe?.title}</Text>

                    <View style={[styles.qualifiedHeaderAmountContainer]}>
                        <Text style={styles.qualifiedHeaderAmountValue}>{storedata?.currency}{cusDetails?.advance ?? 0}</Text>
                    </View>

                    <View style={styles.qualifiedHeaderBadge}>
                        <Icon name="check-circle" size={18} color="#10B981" />
                        <Text style={styles.qualifiedHeaderBadgeText}>{subscriptionBage}</Text>
                    </View>

                    <Text style={styles.qualifiedHeaderSubText}>
                        {onSubscribe?.description}
                    </Text>
                    <View style={{ marginBottom: 20 }} />
                </View>
            </LinearGradient>
        </View>

        <View style={{
            marginHorizontal: 16,
            marginVertical: 16,
        }}>

            <View style={styles.qualifiedAvailableContainer}>
                <View style={styles.qualifiedAvailableIcon}>
                    <Icon name="info" size={16} color="#3F2B96" />
                </View>
                <View style={styles.qualifiedAvailableContent}>
                    <Text style={styles.qualifiedAvailableText}>
                        {subscriptionInformation}
                    </Text>
                </View>
            </View>

            <View style={styles.qualifiedBenefits}>
                <Text style={styles.qualifiedBenefitsTitle}>{onSubscribe?.head}</Text>

                {0 < onSubscribe?.features?.length && onSubscribe?.features.map((benefit, index) => (
                    <BenefitSectionCard
                        key={benefit.title || index}
                        icon={benefit.icon}
                        title={benefit.title}
                        color={benefit?.bgcolor}
                        iconColor={benefit?.iconcolor}
                        family={benefit?.family}
                        description={benefit.description}
                    />
                ))}
            </View>

            <View style={styles.qualifiedPricing}>
                <View style={styles.qualifiedPricingIconRow}>
                    <FontAwesome5 name="credit-card" size={18} color="#3F2B96" />
                    <Text style={styles.qualifiedPricingTitle}>{QUALIFIED_CARD_CONTENT.pricing.title}</Text>
                </View>
                <Text style={styles.qualifiedPricingDescription}>
                     {appName} is a subscription service with a <Text style={styles.qualifiedPricingHighlight}>{QUALIFIED_CARD_CONTENT.pricing.highlight}</Text>.
                    <Text style={styles.qualifiedPricingImportant}> {QUALIFIED_CARD_CONTENT.pricing.important}</Text>
                    —it is the cost of accessing your {appName} membership and financial tools, including Earned Wage Access when you qualify.
                </Text>
            </View>

        </View>


    </View>
);

const SubscriptionPromtScreen = ({ subscriptionLabelData }) => {
    const navigation = useNavigation();
    const { storedata } = useSelector((state) => state.auth);
    const { cusDetails, cusloading, cuserror } = useSelector((state) => state.customer);
    const { subscriptionInformation, subscriptionbages } = useGeneralLabelsHook()

    const handleSubscribe = () => {
        navigation.navigate('Subscription', {
            fromDashboard: true
        });
    };



    return (
        <View style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,

                ]}

            >

                <QualifiedCard onSubscribe={subscriptionLabelData} storedata={storedata} cusDetails={cusDetails} subscriptionBage={subscriptionbages} subscriptionInformation={subscriptionInformation} />



                <View style={styles.bottomPadding} />
            </ScrollView>
            <View style={styles.fixedBottomContainer}>
                    <TouchableOpacity
                        style={styles.fixedBottomButton}
                        activeOpacity={0.8}
                        onPress={handleSubscribe}
                    >
                        <LinearGradient
                            colors={['#3F2B96', '#2633a7']}
                            style={styles.fixedBottomGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <FontAwesome5 name="crown" size={18} color="#FFFFFF" />
                            <Text style={styles.fixedBottomButtonText}>{QUALIFIED_CARD_CONTENT.buttonText}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { paddingBottom: 80 },
    centeredContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 80,
    },
    sectionWrapper: { marginBottom: 8 },
    bottomPadding: { height: 30 },
    loaderContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 8
    },

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
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    benefitSectionDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
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
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#EFFDFF',
        borderRadius: 13.5,
        paddingVertical: 6,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
        marginBottom: 18,
    },
    connectBankPillText: {
        fontWeight: '600',
        fontSize: 12,
        color: '#000',
    },
    connectBankTitle: {
        fontWeight: '700',
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
        fontWeight: '600',
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
        fontWeight: '700',
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
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    connectBankPricingDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    connectBankPricingHighlight: {
        fontWeight: '700',
        color: '#3F2B96',
    },
    connectBankPricingImportant: {
        fontWeight: '700',
        color: '#DC2626',
    },

    // ─── Qualified / Subscription Card ──────────────────
    qualifiedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginHorizontal: 16,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    // ─── Pricing Icon Row ──────────────────────────────
    qualifiedPricingIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },

    // ─── Unique Header Card ──────────────────────────
    qualifiedHeaderCard: {
        borderRadius: 16,
        padding: 10,
        shadowColor: '#3F2B96',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    qualifiedHeaderContent: {
        alignItems: 'center',
        padding: 16,


    },
    qualifiedHeaderTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 4,
    },
    qualifiedHeaderAmountContainer: {
        marginBottom: 8,
        alignItems: 'center',
    },
    qualifiedHeaderAmountValue: {
        fontSize: 48,
        fontWeight: '700',
        color: '#3F2B96',
    },
    qualifiedHeaderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(202, 216, 255, 0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        marginBottom: 8,
    },
    qualifiedHeaderBadgeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1A1A1A',
    },
    qualifiedHeaderSubText: {
        fontSize: 12,
        color: 'rgba(26, 26, 26, 0.7)',
        textAlign: 'center',


    },

    // ─── Available Amount Note ──────────────────────────
    qualifiedAvailableContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0F7FF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D4E4FF',
    },
    qualifiedAvailableIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E8E0FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 2,
    },
    qualifiedAvailableContent: {
        flex: 1,
    },
    qualifiedAvailableText: {
        fontSize: 13,
        color: '#4A5568',
        lineHeight: 20,
    },

    // ─── Benefits ──────────────────────────────────────
    qualifiedBenefits: {
        marginBottom: 20,
    },
    qualifiedBenefitsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },

    // ─── Pricing ──────────────────────────────────────
    qualifiedPricing: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
    },
    qualifiedPricingTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 0,
    },
    qualifiedPricingDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    qualifiedPricingHighlight: {
        fontWeight: '700',
        color: '#3F2B96',
    },
    qualifiedPricingImportant: {
        fontWeight: '700',
        color: '#DC2626',
    },

    // ─── Fixed Bottom Container ──────────────────────────
    fixedBottomContainer: {

        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    fixedBottomButton: {
        marginTop: 20,
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
        shadowColor: '#F8C80B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    fixedBottomGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        gap: 10,
    },
    fixedBottomButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    connectBtnDisabled: {
        opacity: 0.7,
    },
});

export default SubscriptionPromtScreen;