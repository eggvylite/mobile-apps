import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import CommonIcon from './Commonicons';
import { getFontSize } from '../../constants/Font';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutUp, Layout } from 'react-native-reanimated';

const PlanFeaturesCard = ({ subscription }) => {
    const features = subscription?.plan_featureLabel || [];

    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const styles = useStyles(themeColors)
    const [openmodel, setopenmodel] = useState(false)


    function toggleserve() {
        setopenmodel((prev) => !prev)
    }

    return (
        <View style={styles.card}>


            <Pressable style={styles.cardHeader} onPress={() => toggleserve()}>
                <View style={[styles.cardTitle, { justifyContent: 'center' }]}>
                    <View style={[styles.cardIconBg]}>
                        <Icon name="grid" size={16} color={themeColors?.iconcolor} />
                    </View>
                    <Text style={styles.cardTitleText}>Plan Features</Text>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Pressable
                            onPress={() => toggleserve()}
                            style={{ backgroundColor: themeColors?.iconbg, borderRadius: 6, padding: 5 }}>
                            <CommonIcon
                                family={'Entypo'}
                                name={openmodel ?  'chevron-down' : 'chevron-right'}
                                size={18}
                                color={themeColors?.iconcolor}
                            />
                        </Pressable>
                    </View>

                </View>
            </Pressable>

            {
                openmodel && <Animated.View
                    entering={FadeIn.duration(500)}
                    exiting={FadeOut.duration(100)}
                    layout={Layout.springify()}
                    style={styles.featuresList}>
                    {features
                        .filter(feature => feature !== '')
                        .map((feature, index, filteredList) => {
                            const isLast = index === filteredList.length - 1;

                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.featureListItem,
                                        isLast && styles.lastFeatureItem,
                                    ]}
                                >

                                    <View style={styles.featureLeft}>
                                        <View
                                            style={[
                                                styles.featureListIcon,
                                                { backgroundColor: themeColors?.iconbg },
                                            ]}
                                        >

                                            <CommonIcon
                                                family={'FontAwesome'}
                                                name={'star-half-empty'}
                                                size={12}
                                                color={themeColors?.iconcolor}
                                            />
                                        </View>

                                        <View style={styles.featureInfo}>
                                            <Text style={styles.featureListName}>
                                                {feature}
                                            </Text>
                                        </View>
                                    </View>


                                    <View style={styles.featureCheck}>
                                        <Icon name="check-circle" size={14} color={themeColors?.success} />
                                    </View>
                                </View>
                            );
                        })}
                </Animated.View>
            }

        </View>
    );
};

export default PlanFeaturesCard;

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
        // marginBottom: 5,
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
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1a5f7a',
    },


    featuresList: {
        marginTop: 10,
    },
    featureListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        // borderBottomWidth: 1,
        borderBottomColor: '#adadad',
    },
    lastFeatureItem: {
        borderBottomWidth: 0,
    },
    featureLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    featureListIcon: {
        // width: 30,
        // height: 30,
        padding: 6,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureInfo: {
        flex: 1,
    },
    featureListName: {
        fontSize: getFontSize(13),
        fontWeight: '600',
        color: theme?.card_text_color ?? '#0F172A',
        marginBottom: 2,
    },
    featureListDesc: {
        fontSize: 11,
        color: '#64748B',
    },
    featureCheck: {
        width: 28,
        alignItems: 'center',
    },



});
