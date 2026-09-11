import React, { useState, useRef, useEffect } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, Image, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
import getStyles from '../../../styles';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import GradientBackground from '../../../component/GradientBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonIcon from '../../../component/Commonicons';
import CommonHeader from '../../../component/CommonHeader';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFontSize } from '../../../../constants/Font';
import moment from 'moment';
import CommonFunction from '../../../../utill/CommonFunction';
import { commondateformat } from '../../../../utill/Utills';
import { deleteGoalItem, fetchgoallistAccount } from '../../../../redux/slices/goalSlice';
import { useDispatch } from 'react-redux';
import GoalProgressBar from '../../../component/GoalProgressBar';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Divider } from 'react-native-paper';
import timezone from 'moment-timezone'
import { content } from '../../../../constants/content';
import CustomModal from '../../../component/CustomModal';
import { fetchGoalhis } from '../../../../redux/slices/goalhisSlice';
import { fetchgetAccount } from '../../../../redux/slices/getmanulaccountSlice';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';
import CloudImage from '../../../../utill/CloudImage';
import api from '../../../../service/api';

const ViewGoal = ({ navigation, route }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle } = getStyles(themeColors);
    const goaldataprams = route?.params?.item
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);

    const { goalList, goalaccount, goalloading } = useSelector((state) => state.goal);
    const { goalhisdata } = useSelector((state) => state.goalhistrory);
    const [goalHis, setgoalHis] = useState([])
    const [isModal, setIsmodal] = useState(false)
    const { width, height } = Dimensions.get('window')
    const sheetRef = useRef();
    const dispatch = useDispatch()
    const [goaldata, setgealdata] = useState('')
    var save_amount = (goaldata?.amount || 0) - (goaldata?.savedamount || 0) - (goaldata?.spent || 0)


          const Goaltype = [
        {
            name: "Spend a Custom Amount",
            des: "Spend from your available balance.The total amount saved will not be affected.",
            image: require('../../../../../assets/images/s.png'),
            color: '#DFFBFF',
            currentsaving: '100',
            target: '1000',
            targetdate: '1-10-2024',
            spentamount: '200',
            stilltosave: '100',
            iconname: 'account-balance-wallet',
            iconfamily: 'MaterialIcons'

        },
        {
            name: "Withdraw for Another Purpose",
            des: "Your overall goal progress and amount saved will be reduced.",
            image: require('../../../../../assets/images/s1.png'),
            color: '#DFFBFF',
            currentsaving: '100',
            target: '1000',
            targetdate: '1-10-2024',
            spentamount: '200',
            stilltosave: '100',
            iconname: 'arrow-redo-sharp',
            iconfamily: 'Ionicons'
        },
    ]


    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });

    useEffect(() => {

        if (goaldataprams) {

            const goaldata = goalList?.find((item) => item?._id === goaldataprams?._id)
            setgealdata(goaldata)

        }

    }, [goalList, goaldataprams])

    useEffect(() => {
        if (goalhisdata) {
            const history = goalhisdata?.records.filter((obj) => obj.goal_id === goaldata?._id)
            setgoalHis(history)
        } else {
            setgoalHis([])
        }

    }, [goaldata, goalhisdata,])
    const textlabelStyle = () => {
        return [styles.metaLabel, { color: 'gray', fontSize: getFontSize(14), fontsFamily: fontsFamily.boldFont, fontWeight: '600' }]

    }
    const textanslabelStyle = () => {
        return [styles.metaValue, { color: themeColors?.card_text_color, fontSize: getFontSize(18), fontsFamily: fontsFamily.semiboldFont, fontWeight: '700' }]
    }

    const deletGoal = () => {
        dispatch(deleteGoalItem(goaldata?._id))

        api.get('dashboard/deletegoals/' + goaldata?._id).then((res) => {
            console.log(res.data)
            navigation?.replace('Goal')
            dispatch(fetchgoallistAccount())
            dispatch(fetchGoalhis())
            dispatch(fetchgetAccount())
        }).catch((err) => {
            console.log(err)
        })

    }

    function formatDateTime(date) {
        if (storedata) {
            var zone = storedata.zone
            const df = timezone(date).tz(zone).format(storedata?.format);
            return df
        } else {
            return ''
        }


    }

    function formatTime(date) {
        if (storedata) {
            var zone = storedata?.zone
            const df = timezone(date).tz(zone).format("hh:mm a");
            return df
        } else {
            return ''
        }

    }
    return (
        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                <CommonHeader back={'yes'} title='View Goal' onBackPress={() => navigation.replace('Goal')} onDelete={
                    goaldata?.status !== 'Completed' ? () => {
                        setIsmodal(true)
                        console.log('hello')
                    } : ''} />

                <ScrollView
                    showsVerticalScrollIndicator={false}

                >



                    <View style={[styles.card, { backgroundColor: themeColors?.card_list_bg }]}>
                        {/* Top Grid Section */}

                        <View style={styles.rowCenter}>
                            <View>
                                <View style={[styles.iconWrapper, { backgroundColor: themeColors?.iconbg }]}>
                                    {
                                        goaldata?.emoji ? <Text style={{ textAlign: 'center' }}>{goaldata?.emoji}</Text> :
                                            <>
                                                {/* {
                                                    img && <Image
                                                        source={{ uri: img }}
                                                        style={styles.icon}
                                                    />
                                                } */}
                                                {
                                                    goaldata?.image &&
                                                    <CloudImage
                                                        style={styles.icon}
                                                        page='goal'
                                                        cloudSource={goaldata?.image} />
                                                }
                                            </>

                                    }

                                </View>

                            </View>

                            <View style={styles.titleContainer}>
                                <Text style={[styles.titleText, { color: themeColors?.card_text_color }]}>
                                    {goaldata?.name}
                                </Text>
                            </View>

                        </View>
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <GoalProgressBar
                                progress={goaldata?.savedamount + goaldata?.spent}
                                total={goaldata?.amount}
                                height={12}
                                color={themeColors?.barbg} />
                        </View>
                        <View style={styles.topSection}>
                            <View style={[styles.gridRow]}>
                                <View style={styles.gridItem}>
                                    <Text style={textlabelStyle()}>Goal Amount</Text>
                                    <Text style={textanslabelStyle()}>{storedata?.currency}{CommonFunction.formatamount(goaldata?.amount)}</Text>
                                </View>
                                <View style={[styles.gridItem, { alignItems: 'flex-end' }]}>
                                    <Text style={textlabelStyle()}>Monthly Contribution</Text>
                                    <Text style={textanslabelStyle()}>{`${storedata?.currency ?? "$"}${CommonFunction.formatamount(goaldata?.contribution)}`}</Text>
                                </View>
                            </View>
                            <View style={[styles.gridRow, { marginTop: 24 }]}>
                                <View style={styles.gridItem}>
                                    <Text style={textlabelStyle()}>Start By</Text>
                                    <Text style={textanslabelStyle()}>{commondateformat(goaldata?.startdate)}</Text>
                                </View>
                                <View style={[styles.gridItem, { alignItems: 'flex-end' }]}>
                                    <Text style={textlabelStyle()}>End By</Text>
                                    <Text style={textanslabelStyle()}>{commondateformat(goaldata?.targetdate)}</Text>
                                </View>
                            </View>


                        </View>

                        {/* Modern Thin Divider */}
                        <View style={styles.divider} />

                        {/* Stats List Section */}
                        <View style={styles.statsSection}>
                            {/* Current Savings */}
                            <View style={styles.statRow}>
                                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                                    <Icon name="dollar-sign" size={16} color="#2E7D32" />
                                </View>
                                <Text style={[styles.statName, { color: themeColors.card_text_color }]}>Current Savings</Text>
                                <Text style={[styles.statAmount, { color: themeColors.card_text_color }]}>{storedata?.currency}{CommonFunction.formatamount(goaldata?.savedamount)}</Text>
                            </View>

                            {/* Spent Amount */}
                            <View style={styles.statRow}>
                                <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                                    <Icon name="minus" size={16} color="#C62828" />
                                </View>
                                <Text style={[styles.statName, { color: themeColors.card_text_color }]}>Spent Amount</Text>
                                <Text style={[styles.statAmount, { color: themeColors.card_text_color }]}>{storedata?.currency}{CommonFunction.formatamount(goaldata?.spent)}</Text>
                            </View>

                            {/* Still to Save */}
                            <View style={styles.statRow}>
                                <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                                    <Icon name="trending-up" size={16} color="#7B1FA2" />
                                </View>
                                <Text style={[styles.statName, { color: themeColors.card_text_color }]}>Still to Save</Text>
                                <Text style={[styles.statAmount, { color: themeColors.card_text_color }]}>{storedata?.currency}{CommonFunction.formatamount(save_amount)}</Text>
                            </View>
                        </View>
                    </View>



                    {
                        goaldata?.status === 'Active' &&
                        <View style={{ margin: 20, flexDirection: 'row' }}>
                            <Pressable style={{
                                flex: 1, padding: 15, borderRadius: 12, backgroundColor: themeColors?.card_list_bg, alignItems: 'center'
                            }} onPress={() => {
                                navigation.navigate('AddFunds', { item: goaldata })
                            }}>
                                <View style={{ justifyContent: 'center', }}>
                                    <CommonIcon name="add-circle-outline" family="Ionicons" size={18} color={themeColors?.bgbtn} />
                                </View>
                                <Text style={{ color: themeColors?.bgbtn, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16), marginTop: 10 }}>Add Fund</Text>
                            </Pressable>

                            {
                                0 < goaldata?.savedamount &&
                                <Pressable style={{ flex: 1, padding: 15, borderRadius: 12, backgroundColor: themeColors?.card_list_bg, marginStart: 10, alignItems: 'center' }} onPress={() => {
                                    sheetRef?.current?.open()
                                }}>
                                    <View style={{ justifyContent: 'center', }}>
                                        <CommonIcon name="remove-circle-outline" family="Ionicons" size={18} color={themeColors?.bgbtn} />
                                    </View>
                                    <Text style={{ color: themeColors?.bgbtn, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16), marginTop: 10 }}>Withdraw</Text>
                                </Pressable>
                            }


                            {
                                0 === Number(goaldata?.savedamount) &&
                                <Pressable style={{ flex: 1, padding: 15, borderRadius: 12, backgroundColor: themeColors?.card_list_bg, marginStart: 10, alignItems: 'center' }}
                                    onPress={() => {
                                        navigation.navigate('CreateGoalformscreen', { item: goaldata, edit: 'yes' })
                                    }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <CommonIcon name="create-outline" family="Ionicons" size={18} color={themeColors?.bgbtn} />
                                    </View>
                                    <Text style={{ color: themeColors?.bgbtn, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16), marginTop: 10 }}>Edit Goal</Text>
                                </Pressable>
                            }

                        </View>

                    }

                    {
                        goaldata?.status === 'Completed' && 0 < goaldata?.savedamount &&

                        <View style={{ margin: 20, flexDirection: 'row' }}>

                            {
                                0 < goaldata?.savedamount &&
                                <Pressable style={{ flex: 1, padding: 15, borderRadius: 12, backgroundColor: themeColors?.card_list_bg, alignItems: 'center' }} onPress={() => {
                                    console.log('open log')
                                    sheetRef?.current?.open()
                                }}>
                                    <View style={{ justifyContent: 'center', }}>
                                        <CommonIcon name="remove-circle-outline" family="Ionicons" size={18} color={themeColors?.bgbtn} />
                                    </View>
                                    <Text style={{ color: themeColors?.bgbtn, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16), marginTop: 10 }}>Withdraw</Text>
                                </Pressable>
                            }




                            <Pressable style={{ flex: 1, padding: 15, borderRadius: 12, backgroundColor: themeColors?.card_list_bg, marginStart: 10, alignItems: 'center' }}
                                onPress={() => {
                                    setIsmodal(true)
                                }}>
                                <View style={{ justifyContent: 'center', opacity: 0.7 }}>
                                    <CommonIcon name={'delete'} family={'MaterialIcons'} size={21} color={themeColors.danger} />

                                </View>
                                <Text style={{ color: themeColors.danger, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16), marginTop: 10, opacity: 0.7 }}>Delete Goal</Text>
                            </Pressable>


                        </View>


                    }

                    <View style={{ marginStart: 20, marginBottom: 20, marginTop: 20 }}>
                        <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16) }}>Available by Account</Text>
                    </View>

                    {
                        0 < goaldata?.bank_contributions?.length ? <View style={{ marginBottom: 20 }}>
                            {
                                goaldata?.bank_contributions.map((item, index) => {
                                    var number = ''
                                    if (item?.account_number) {
                                        number = ' - XX' + CommonFunction.slicenum(item?.account_number)
                                    } else {
                                        number = ' - ' + content.manual
                                    }
                                    return (
                                        <View style={[styles.card, { padding: 15, borderRadius: 12, backgroundColor: themeColors?.card_list_bg, marginTop: index === 0 ? 0 : 10 }]} key={index}>
                                            {/* Header Section */}
                                            <View style={styles.header}>
                                                <View style={styles.headerLeft}>
                                                    <View style={[styles.iconWrapper, { backgroundColor: themeColors?.iconbg }]}>
                                                        <Icon name="credit-card" size={18} color={themeColors?.iconcolor} />
                                                    </View>
                                                    <View style={{ marginStart: 10, flex: 1 }}>
                                                        <Text style={[styles.accountType, { color: themeColors?.card_text_color, fontSize: getFontSize(14), fontWeight: 'medium' }]}>{item?.bank_name}{number}</Text>

                                                    </View>
                                                    <View style={{ alignItems: 'flex-end' }}>
                                                        <Text style={[styles.balanceText, { color: themeColors?.card_text_color, fontSize: getFontSize(14) }]}>{`${storedata?.currency ?? "$"}${CommonFunction.formatamount(item?.total_amount)}`}</Text>
                                                    </View>
                                                </View>

                                            </View>

                                        </View>
                                    )
                                })
                            }

                        </View> :
                            <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
                                <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(14) }}>No accounts available</Text>
                            </View>

                    }

                    {
                        0 < goalHis.length &&
                        <View style={{ marginStart: 20, marginBottom: 10, flexDirection: 'row', marginEnd: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16) }}>History</Text>
                            </View>
                            <Pressable onPress={() => {
                                navigation.replace('Goalhistory', { item: goaldata })
                            }}>
                                <Text style={{ color: themeColors?.bgbtn, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(14) }}>View All</Text>
                            </Pressable>

                        </View>
                    }

                    {
                        0 < goalHis.length && <View >
                            {
                                goalHis.slice(0, 4).map((value, key) => {
                                    var name = ''
                                    if (value?.type === 'spend') {
                                        name = 'Withdraw Spent'
                                    } else {
                                        name = CommonFunction.captialize(value?.type?.toLowerCase())
                                    }

                                    var number = ''
                                    if (value?.bankaccount?.account_number) {
                                        number = ' - XX' + CommonFunction.slicenum(value?.bankaccount?.account_number)
                                    } else {
                                        number = ' - ' + content.manual
                                    }


                                    return (
                                        <View key={key} style={[styles.card, { padding: 15, borderRadius: 12, backgroundColor: themeColors?.card_list_bg, flexDirection: 'row', marginTop: 10 }]}>
                                            <View style={{ justifyContent: 'center' }}>
                                                <View style={[styles.iconBox, { backgroundColor: value?.type === 'contribution' ? '#E8F5E9' : value?.type === 'withdraw' ? '#FFEBEE' : themeColors?.iconbg, height: 45, width: 45 }]}>
                                                    {
                                                        value?.type === 'contribution' ?
                                                            <Icon name="arrow-up" size={16} color="#2E7D32" /> :
                                                            value?.type === 'withdraw' ?
                                                                <Icon name="arrow-down" size={16} color="#C62828" /> :
                                                                value?.type === 'spend' ?
                                                                    <Icon name="file" size={16} color={themeColors?.bgbtn} /> :

                                                                    <></>

                                                    }

                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.statName, { color: themeColors.text_primary, fontSize: getFontSize(15), flex: 0 }]}>{name}</Text>
                                                <Text style={[styles.statName, { color: themeColors.card_text_color, marginTop: 6, fontSize: getFontSize(13), flex: 0, fontFamily: fontsFamily.regularFont, fontWeight: '400' }]}>{formatDateTime(value?.createdAt) + ' ' + formatTime(value?.createdAt)}</Text>
                                                <Text style={[styles.statName, { color: themeColors.card_text_color, marginTop: 6, fontSize: getFontSize(13), flex: 0, fontFamily: fontsFamily.regularFont, fontWeight: '400' }]}>{value?.bankaccount?.type}{number}</Text>
                                            </View>
                                            <View style={{ justifyContent: 'center', }}>
                                                <View style={{ alignItems: 'flex-end' }}>
                                                    <Text style={[styles.statName, { color: value?.type === 'contribution' ? '#2E7D32' : value?.type === 'withdraw' ? '#C62828' : themeColors.card_text_color }]}>{storedata?.currency}{CommonFunction.formatamount(value?.amount)}</Text>
                                                    {
                                                        value?.type === 'spend' &&
                                                        <View style={{ backgroundColor: themeColors?.iconbg, padding: 5, borderRadius: 8, marginTop: 10 }}>
                                                            <Text style={[styles.statName, { color: themeColors.card_text_color, flex: 0, fontSize: getFontSize(10) }]}>No Impact</Text>
                                                        </View>

                                                    }
                                                </View>
                                            </View>

                                        </View>
                                    )
                                })
                            }
                        </View>
                    }


                </ScrollView>
            </View>

            {/* <Modal visible={isModal} transparent animationType="fade">
                <View style={[appstyle.modalBackground]}>
                    <View style={[appstyle.alertBox1]}>
                        <Text style={[appstyle.textHeader, { color: '#000' }]}>Delete Goal !</Text>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[appstyle.alerttext,]}>Are you sure you want to delete this goal?</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 5 }} onPress={() => setIsmodal(false)}>
                                    <Text style={[appstyle.alerttext]}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[appstyle.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { deletGoal() }}>
                                    <Text style={[appstyle.btnText]}>Yes</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>
                </View>

            </Modal> */}

            <CustomModal
                visible={isModal}
                onClose={() => setIsmodal(false)}
                alertTitle="Delete Goal !"
                actionText="Yes"
                cancelText="No"
                onAction={() => {
                    deletGoal()
                }}
            >
                <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: getFontSize(15) }}>
                    Are you sure you want to delete this goal?
                </Text>
            </CustomModal>

            <RBSheet
                ref={sheetRef}
                height={350}
                openDuration={250}

                customStyles={{
                    container: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        backgroundColor: themeColors?.cardbg
                    },
                }}
            >
                <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 30 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_text_color }}>
                                Withdraw from Goal
                            </Text>
                            <Pressable

                                onPress={() => sheetRef.current.close()}
                                style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, padding: 5 }}>
                                <CommonIcon
                                    name={'clear'}
                                    family={'MaterialIcons'}
                                    color={themeColors?.iconcolor}
                                />
                            </Pressable>

                        </View>
                        <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />
                        <View style={{ flex: 1 }}>

                            <Text style={{ fontSize: getFontSize(14), marginBottom: 10, color: themeColors?.card_text_color, fontFamily: fontsFamily.semiboldFont, marginVertical: 5 }} >
                                How do you want to use this money?
                            </Text>

                            {
                                Goaltype.map((item, index) => {
                                    return (
                                        <Pressable

                                            onPress={() => {
                                                var type = ''
                                                if (index === 1) {
                                                    type = 'withdraw'
                                                } else {
                                                    type = 'spend'
                                                }
                                                navigation.navigate('Takeout', { item: goaldata, type: type })
                                                sheetRef.current.close()
                                            }}
                                            key={index}
                                            style={({ pressed }) => [
                                                {
                                                    backgroundColor: themeColors?.card_list_bg,
                                                    marginVertical: 10,
                                                    padding: 10,
                                                    borderRadius: 5,
                                                    opacity: pressed ? 0.7 : 1,
                                                },
                                            ]}
                                        >

                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
                                                <View style={{ height: 50, width: 50, borderRadius: 50, backgroundColor: themeColors?.iconbg, justifyContent: 'center', alignItems: 'center' }}>

                                                    <CommonIcon
                                                        name={item.iconname}
                                                        family={item.iconfamily}
                                                        size={24}
                                                        color={themeColors?.iconcolor}
                                                    />
                                                </View>
                                                <View style={{ flex: 1, marginHorizontal: 5, justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: getFontSize(14), color: themeColors?.card_secondary_color, fontFamily: fontsFamily.semiboldFont, marginTop: 5 }}>{item.name}</Text>
                                                    <Text style={{ fontSize: getFontSize(12), color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont, marginTop: 5, lineHeight: 20, opacity: 0.5 }}>{item.des}</Text>
                                                </View>

                                                <CommonIcon
                                                    name={'right'}
                                                    family={'AntDesign'}
                                                    size={16}
                                                    color={themeColors?.iconcolor}
                                                />
                                            </View>





                                        </Pressable>
                                    )
                                })
                            }

                        </View>



                    </View>
                </View>
            </RBSheet>

        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        // Soft, natural shadows
        shadowColor: '#000',

        // borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',

    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    accountType: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    accountStatus: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 2,
        fontWeight: '500',
    },
    balanceSection: {
        marginBottom: 24,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#8E8E93',
        letterSpacing: 1.2,
        marginBottom: 6,
    },
    balanceText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contributionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    footerLabel: {
        fontSize: 14,
        color: '#48484A',
        fontWeight: '500',
    },
    footerValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },


    topSection: {
        paddingBottom: 4,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gridItem: {
        flex: 1,
    },
    metaLabel: {
        fontSize: 11,
        color: '#8E8E93',
        marginBottom: 6,
    },
    metaValue: {
        fontSize: 16,
        color: '#1C1C1E',
    },
    goalValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1C1C1E',
        letterSpacing: -0.5,
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginVertical: 24,
    },
    statsSection: {
        gap: 16, // Modern way to handle spacing between items
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    statName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#3A3A3C',
    },
    statAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        height: 45,
        width: 45,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    icon: {
        resizeMode: 'contain',
        height: 40,
        width: 40
    },
    titleContainer: {
        flex: 1,
        marginStart: 10
    },
    titleText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(16)
    },
});

export default ViewGoal
// import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
// import React, { useContext } from 'react'
// import getStyles from '../../../../constant/getStyles';
// import { useSelector } from 'react-redux';
// import { ThemeContext } from '../../../../Provider/ThemeContext';
// import GradientBackground from '../../../../components/GradientBackground';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import CommonIcon from '../../../../utill/Commonicons';
// import CommonHeader from '../../../../components/CommonHeader';
// import { fontsFamily } from '../../../../constant/fontsFamily';
// import { getFontSize } from '../../../../constant/Font';
// import moment from 'moment';
// import CommonFunction from '../../../../constant/CommonFunction';
// import { commondateformat } from '../../../../utill/utills';

// const ViewGoal = ({ navigation, route }) => {
//     const { theme } = useContext(ThemeContext);
//     const { themedata } = useSelector((state) => state.appcolor);
//     const themeColors = themedata.theme
//     const { styles: appstyle } = getStyles(themeColors, theme);
//     const goaldata = route?.params?.item
//     const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);



//     function dataCard({ title, value,label }) {
//         return (
//             <View>
//                 <View style={{alignItems: label ? 'flex-start' : 'flex-end'}}>
//                     <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
//                         {title}
//                     </Text>
//                 </View>
//                 <View style={[{ marginTop: 5 }]} >
//                     <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color }]}>
//                         {value}
//                     </Text>
//                 </View>
//             </View >
//         )
//     }

//     return (
//         <GradientBackground>
//             <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

//             <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
//                 <CommonHeader back={'yes'} title='View Goal' onBackPress={() => navigation.goBack()} />
//                 <View style={{ flex: 1 }}>

//                     <ScrollView
//                         showsVerticalScrollIndicator={false}
//                         contentContainerStyle={{ margin: 10 }}
//                     >
//                         <View style={{ marginVertical: 10 }}>
//                             <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) }}>Goal Details</Text>
//                         </View>

//                         <View style={{ backgroundColor: themeColors?.cardbg, borderRadius: 10, marginTop: 10, padding: 15, }}>
//                             <View style={{borderBottomWidth:1,paddingBottom:20, borderColor:'#ccc'}}>
//                             <View style={{ flexDirection: 'row' }}>
//                                 <View style={{ flex: 1 }}>
//                                     {dataCard({ title: "Start By", value: commondateformat(goaldata?.startdate), label:'start' })}
//                                 </View>
//                                 <View style={{ alignItems: 'flex-end' }}>
//                                     {dataCard({ title: "End By", value: commondateformat(goaldata?.targetdate) })}
//                                 </View>
//                             </View>
//                             <View style={{ flexDirection: 'row', marginTop: 20 }}>
//                                 <View style={{ flex: 1 }}>
//                                     {dataCard({ title: "Target Goal", value: `${storedata?.currency ?? "$"}${CommonFunction.formatamount(goaldata?.amount)}`, label:'start' })}
//                                 </View>
//                                 <View style={{ alignItems: 'flex-end' }}>
//                                     {dataCard({ title: "Monthly", value: `${storedata?.currency ?? "$"}${CommonFunction.formatamount(goaldata?.contribution)}` })}
//                                 </View>
//                             </View>
//                             </View>
//                             {/* {dataCard({ title: "Goal Name", value: goaldata?.name })}
//                             {dataCard({ title: "Start By", value: commondateformat(goaldata?.startdate) })}
//                             {dataCard({ title: "End By", value: commondateformat(goaldata?.targetdate) })}
//                             {dataCard({ title: "Target Goal", value: `${storedata?.currency ?? "$"}${CommonFunction.formatamount(goaldata?.amount)}`, })}
//                             {dataCard({ title: "Monthly Contribution", value: `${storedata?.currency ?? "$"}${CommonFunction.formatamount(goaldata?.contribution)}`, })}
//                             {dataCard({ title: "Current Savings", value: `${storedata?.currency ?? "$"}${CommonFunction.formatamount(goaldata?.savedamount)}`, })}
//                             {dataCard({ title: "Spent Amount", value: `${storedata?.currency ?? "$"}${CommonFunction.formatamount(goaldata?.spent)}`, })}
//                             {dataCard({ title: "Still to Save", value: `${storedata?.currency ?? "$"}${CommonFunction.formatamount((goaldata?.amount || 0) - (goaldata?.savedamount || 0) - (goaldata?.spent || 0))}`, })} */}
//                         </View>

//                         <View style={{ marginVertical: 20 }}>
//                             <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) }}>Available by Account</Text>
//                         </View>

//                         <View style={{ backgroundColor: themeColors?.cardbg, borderRadius: 10, marginTop: 5 }}>
//                             {
//                                 0 < goaldata?.bank_contributions.length ? <View>
//                                     {
//                                         goaldata?.bank_contributions.map((item, index) => {
//                                             return (
//                                                 <View key={index}>
//                                                     {dataCard({ title: item?.bank_name, value: `${storedata?.currency ?? "$"}${CommonFunction.formatamount(item?.total_amount)}`, })}
//                                                 </View>
//                                             )
//                                         })
//                                     }
//                                 </View> : <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
//                                     <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(14) }}>No accounts available</Text>
//                                 </View>
//                             }

//                         </View>

//                     </ScrollView>
//                 </View>

//             </View>
//         </GradientBackground>
//     )
// }

// export default ViewGoal

// const styles = StyleSheet.create({
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10
//     },
//     flexstyle: {
//         flex: 1,
//         marginTop: 5

//     },
//     valueflexstyle: {
//         flex: 1,
//         // marginTop: 15,
//         alignItems: 'flex-end'

//     },
//     headstyle: {
//         fontFamily: fontsFamily.boldFont,
//         fontSize: getFontSize(16),
//         color: '#fff', opacity: 0.8
//     },
//     subheadstyle: {
//         fontFamily: fontsFamily.boldFont,
//         fontSize: getFontSize(16),
//         color: '#fff'
//     }
// })