import {
    ScrollView,
    StyleSheet,

    View,

    Text,
    TouchableOpacity,
    Platform,

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
import { fontsFamily } from '../../constants/fontsFamily';
import { replaceDynamicValues } from './ConnectBankWidgetScreen';
import CommonFunction from '../../utill/CommonFunction';



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


const QualifiedCard = ({ onSubscribe, storedata, cusDetails, subscriptionBage, subscriptionInformation, plandata }) => (
    <View style={styles.qualifiedCard}>

        <View style={{ width: "100%", padding: Platform.OS === 'android' ? 10 : 0 }}>
            <LinearGradient
                colors={['#E8F5E9', '#E3F2FD', '#F3E5F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.qualifiedHeaderCard}
            >
                <View style={[styles.qualifiedHeaderContent, { right: 10 }]}>
                    <Text style={styles.qualifiedHeaderTitle}>{onSubscribe?.title}</Text>

                    <View style={[styles.qualifiedHeaderAmountContainer]}>
                        <Text style={styles.qualifiedHeaderAmountValue}>{storedata?.currency}{CommonFunction.formatamount(cusDetails?.advance ?? 0)}</Text>
                    </View>
                    {
                        0 < onSubscribe?.notes?.length && <>
                            <View style={styles.qualifiedHeaderBadge}>
                                <Icon name="check-circle" size={18} color="#10B981" />
                                <Text style={styles.qualifiedHeaderBadgeText}>{onSubscribe?.notes[0]?.label ?? ''}</Text>
                            </View>
                        </>
                    }


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
            {
                0 < onSubscribe?.notes?.length && <View style={styles.qualifiedAvailableContainer}>
                    <View style={styles.qualifiedAvailableIcon}>
                        <Icon name="info" size={16} color="#3F2B96" />
                    </View>
                    <View style={styles.qualifiedAvailableContent}>
                        <Text style={styles.qualifiedAvailableText}>
                            {onSubscribe?.notes[1]?.label ?? ''}
                        </Text>
                    </View>
                </View>
            }


            <View style={styles.qualifiedBenefits}>
                <Text style={styles.qualifiedBenefitsTitle}>{onSubscribe?.head}</Text>
                <Text style={styles.qualifiedBenefitsDescription}>{onSubscribe?.information}</Text>

                {0 < onSubscribe?.features?.length && onSubscribe?.features?.map((benefit, index) => (
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


            {
                0 < onSubscribe?.notes?.length && 0 < plandata?.list?.length && <View style={styles.connectBankPricing}>
                    <View style={styles.qualifiedPricingIconRow}>
                        <FontAwesome5 name="credit-card" size={18} color="#3F2B96" />
                        <Text style={[styles.connectBankPricingTitle,{marginBottom:0}]}>{onSubscribe?.notes[2]?.label ?? ''}</Text>
                    </View>
                    {
                        0 < plandata?.list?.length && <Text style={styles.connectBankPricingDescription}>
                            {replaceDynamicValues(onSubscribe?.notes[3]?.label ?? '', storedata?.currency + plandata?.list[0]?.fee)}
                        </Text>
                    }

                    <View style={styles.noteContainer}>

                        <View style={styles.qualifiedAvailableContent}>
                            <Text style={[styles.qualifiedAvailableText, { color: '#fc6969', fontFamily: fontsFamily.semiboldFont }]}>
                                Note:<Text style={[styles.qualifiedAvailableText, { color: '#fc6969', fontFamily: fontsFamily.regularFont }]}>
                                    {onSubscribe?.notes[4]?.label ?? ''}
                                </Text>
                            </Text>


                        </View>

                    </View>

                </View>
            }


        </View>


    </View>
);

const SubscriptionPromtScreen = ({ subscriptionLabelData }) => {
    const navigation = useNavigation();
    const { storedata } = useSelector((state) => state.auth);
    const { cusDetails, cusloading, cuserror } = useSelector((state) => state.customer);
    const { subscriptionInformation, subscriptionbages } = useGeneralLabelsHook()
    const { plandata, planloading, planerror } = useSelector((state) => state.chooseplan);

    const handleSubscribe = () => {
        navigation.navigate('Plan', {
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

                <QualifiedCard onSubscribe={subscriptionLabelData} storedata={storedata} cusDetails={cusDetails} subscriptionBage={subscriptionbages} subscriptionInformation={subscriptionInformation} plandata={plandata} />



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
                        {
                            0 < subscriptionLabelData?.notes?.length ? <Text style={styles.fixedBottomButtonText}>{subscriptionLabelData?.notes[5]?.label ?? ''}</Text> :
                                <Text style={styles.fixedBottomButtonText}>Subscribe & Unlock Your Benefits</Text>
                        }

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
        fontFamily: fontsFamily.semiboldFont,
        color: '#111827',
        marginBottom: 2,
    },
    benefitSectionDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },

    noteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff2f0',
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,

        marginTop: 10
    },
    note: {
        color: 'red',
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 14
    },
    notetext: {
        color: 'red',
        fontFamily: fontsFamily.regularFont,
        fontSize: 14
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
        fontFamily: fontsFamily.semiboldFont,
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
        fontFamily: fontsFamily.boldFont,
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
        fontFamily: fontsFamily.mediumFont,
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
        fontFamily: fontsFamily.semiboldFont,
        color: '#111827',
        marginBottom: 10,
    },
    qualifiedBenefitsDescription: {
        fontSize: 14,
        fontFamily: fontsFamily.regularFont,
        color: '#111827',
        marginBottom: 15,
    },

    // ─── Pricing ──────────────────────────────────────
    qualifiedPricing: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
    },
    qualifiedPricingTitle: {
        fontSize: 15,
        fontFamily: fontsFamily.semiboldFont,
        color: '#111827',
        marginBottom: 0,
    },
    qualifiedPricingDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    qualifiedPricingHighlight: {
        fontFamily: fontsFamily.boldFont,
        color: '#3F2B96',
    },
    qualifiedPricingImportant: {
        fontFamily: fontsFamily.boldFont,
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
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },
    connectBtnDisabled: {
        opacity: 0.7,
    },
});
export default SubscriptionPromtScreen;