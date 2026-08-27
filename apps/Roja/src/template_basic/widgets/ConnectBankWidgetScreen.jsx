import React, { useState, useCallback, lazy, Suspense } from 'react';
import {
    ScrollView,
    StyleSheet,
    StatusBar,
    View,
    RefreshControl,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import CloudImage from '../../utill/CloudImage';
import appLog from '../../constants/logger';
import CommonIcon from '../../themechg_template/component/Commonicons';
import { appName } from '../../service/environment';

const CONNECT_BANK_CONTENT = {
    pill: 'Unlock more with ' + appName,
    title: 'Connect your bank to unlock your financial advantages',
    description:
        'Securely connect your bank to see what you may qualify for and access powerful tools that help you manage your money with confidence.',
    benefitsTitle: `What you can get with your ${appName} plan`,
    benefits: [
        {
            icon: 'zap',
            title: 'Earned Wage Access',
            description: 'Access a portion of your earned wages when you qualify.',
            color: '#EEF2FF',
        },
        {
            icon: 'briefcase',
            title: 'Budgeting Tools',
            description: 'Plan, organize, and manage your everyday spending.',
            color: '#E8F5E9',
        },
        {
            icon: 'target',
            title: 'Savings Goals',
            description: 'Set goals and track your progress toward them.',
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
            icon: 'pie-chart',
            title: 'Spending Insights',
            description: 'Understand where your money goes with personalized insights.',
            color: '#E0F7FA',
        },
        {
            icon: 'tag',
            title: 'Handpicked Offers',
            description: 'Discover offers chosen for you based on your transactions.',
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
    buttonText: 'Connect Your Bank',
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


const ConnectBankWidgetScreen = ({ connectBankData, onConnectBank }) => {
    const renderConnectBankCard = () => (
        <View style={styles.connectBankCard}>

            <View style={styles.connectBankHeader}>
                <View style={styles.connectBankPill}>
                    <Text style={styles.connectBankPillText}>{connectBankData?.name ?? ''}</Text>
                </View>
                <Text style={styles.connectBankTitle}>{connectBankData?.title ?? ''}</Text>
                <View style={styles.connectBankHeaderRow}>
                    <Text style={styles.connectBankDescription}>

                        {connectBankData?.description ?? ''}
                    </Text>
                    <View style={styles.connectBankIllustration}>
                        {
                            connectBankData?.fimage ? <CloudImage
                                resizeMode="contain"
                                style={styles.connectBankWalletImage}

                                cloudSource={connectBankData?.fimage} /> : null

                        }



                        <View style={[styles.connectBankDot, styles.connectBankDot1]} />
                        <View style={[styles.connectBankDot, styles.connectBankDot2]} />
                        <View style={[styles.connectBankDot, styles.connectBankDot3]} />
                    </View>
                </View>
            </View>

            <View style={styles.connectBankBenefits}>
                <Text style={styles.connectBankBenefitsTitle}>{connectBankData?.head ?? ''}</Text>

                {0 < connectBankData?.features?.length && connectBankData?.features?.map((benefit, index) => (
                    <BenefitSectionCard
                        key={index}
                        icon={benefit?.icon}
                        title={benefit?.title}
                        description={benefit?.description}
                        color={benefit?.bgcolor}
                        iconColor={benefit?.iconcolor}
                        family={benefit?.family}

                    />
                ))}
            </View>

            <View style={styles.connectBankPricing}>
                <View style={styles.qualifiedPricingIconRow}>
                    <FontAwesome5 name="credit-card" size={18} color="#3F2B96" />
                    <Text style={styles.connectBankPricingTitle}>{CONNECT_BANK_CONTENT.pricing.title}</Text>
                </View>
                <Text style={styles.connectBankPricingDescription}>
                    {appName} is a subscription service with a <Text style={styles.connectBankPricingHighlight}>{CONNECT_BANK_CONTENT.pricing.highlight}</Text>.
                    <Text style={styles.connectBankPricingImportant}> {CONNECT_BANK_CONTENT.pricing.important}</Text>
                    —it is the cost of accessing your {appName} membership and financial tools, including Earned Wage Access when you qualify.
                </Text>
            </View>
        </View>
    );



    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.centeredContent
                ]}

            >
                {renderConnectBankCard()}


                <View style={styles.bottomPadding} />
            </ScrollView>
            <View style={styles.fixedBottomContainer}>
                <TouchableOpacity
                    style={[styles.fixedBottomButton]}
                    activeOpacity={0.8}
                    onPress={onConnectBank}

                >
                    <LinearGradient
                        colors={['#3F2B96', '#2633a7']}
                        style={styles.fixedBottomGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >

                        <>
                            <FontAwesome5 name="university" size={18} color="#FFF" />
                            <Text style={styles.fixedBottomButtonText}>{CONNECT_BANK_CONTENT.buttonText}</Text>
                        </>

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
        resizeMode: 'contain'
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
        padding: 24,
        paddingBottom: 20,
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
        padding: 24,
        marginBottom: 16,
        shadowColor: '#3F2B96',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    qualifiedHeaderContent: {
        alignItems: 'center',
    },
    qualifiedHeaderTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
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
        color: '#FFFFFF',
    },
    qualifiedHeaderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        marginBottom: 8,
    },
    qualifiedHeaderBadgeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    qualifiedHeaderSubText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
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
        marginTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    fixedBottomButton: {
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

export default ConnectBankWidgetScreen;



