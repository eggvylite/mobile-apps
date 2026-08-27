import React, { useState, useRef, useEffect } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, Image, View, Modal, FlatList, TouchableOpacity, Dimensions, TextInput } from 'react-native'
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
import { deleteGoalItem,fetchgoallistAccount } from '../../../../redux/slices/goalSlice';
import { useDispatch } from 'react-redux';
import GoalProgressBar from '../../../component/GoalProgressBar';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Divider } from 'react-native-paper';
import timezone from 'moment-timezone'
import NoRecord from '../../../component/NoRecord';
import { content } from '../../../../constants/content';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';


const Goalhistory = ({ navigation, route }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle } = getStyles(themeColors);
    const goaldata = route?.params?.item
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    var save_amount = (goaldata?.amount || 0) - (goaldata?.savedamount || 0) - (goaldata?.spent || 0)
    const { goalhisdata } = useSelector((state) => state.goalhistrory);
    const [goalHis, setgoalHis] = useState([])
    const [isModal, setIsmodal] = useState(false)
    const { width, height } = Dimensions.get('window')
    const sheetRef = useRef();
    const dispatch = useDispatch()
    const [searchtext, setserchtext] = useState('')
    const filterdata = ['All', 'Withdraw', 'Contribution', 'Spent']
    const [selectfilterdata, setfliterselectdata] = useState('All')
    const filtetRBSheet = useRef()



    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });

    useEffect(() => {
        if (!goalhisdata) {
            setgoalHis([]);
            return;
        }

        const history = goalhisdata?.records?.filter(
            obj => obj.goal_id === goaldata?._id
        );

        const search = searchtext?.trim()?.toLowerCase();
        const filterbtn = selectfilterdata?.toLowerCase();

        const filtered = history.filter(obj => {
            const bankType = obj?.bankaccount?.type?.toLowerCase() || "";
            const objType = obj?.type?.toLowerCase() || "";

            const matchesSearch = search ? bankType.includes(search) : true;
            const matchesFilter = filterbtn === 'spent' ? objType === 'spend' : filterbtn !== "all" ? objType === filterbtn : true;

            return matchesSearch && matchesFilter;
        });

        setgoalHis(filtered);
    }, [goaldata, goalhisdata, searchtext, selectfilterdata]);



    function formatDateTime(date) {
        var zone = storedata.zone
        const df = timezone(date).tz(zone).format(storedata.format);
        return df

    }

    function formatTime(date) {
        var zone = storedata.zone
        const df = timezone(date).tz(zone).format("hh:mm a");
        return df
    }


    return (
        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                <CommonHeader back={'yes'} title='Goal History' onBackPress={() => navigation.replace('ViewGoal', { item: goaldata })} />

                <View style={{ flexDirection: 'row', marginStart: 20, marginEnd: 20 }}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', backgroundColor: themeColors?.inputprimary, marginEnd: 10, paddingHorizontal: 10, marginTop: 10, borderRadius: 5, justifyContent: 'center' }}>
                        <CommonIcon
                            name={'search'}
                            family={'EvilIcons'}
                            size={20}
                            color={'grey'}
                        />
                        <TextInput
                            value={searchtext}
                            onChangeText={(value) => {
                                setserchtext(value)
                            }}
                            placeholderTextColor={'gray'}
                            placeholder='Search by account name'
                            style={{ flex: 1, backgroundColor: themeColors?.inputprimary, borderRadius: 5, color: themeColors?.inputsecondary, paddingLeft: 10, padding: 15, fontSize: getFontSize(12) }}
                        />
                        {
                            searchtext?.length && <Pressable
                                onPress={() => {
                                    setserchtext('')
                                }}
                                style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <CommonIcon
                                    name={'clear'}
                                    family={'MaterialIcons'}
                                    size={14}
                                    color={themeColors?.danger}
                                />

                            </Pressable>
                        }

                    </View>
                    {/* <Pressable
                        onPress={() => filtetRBSheet.current.open()}
                        style={{ backgroundColor: themeColors?.iconbg, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 45, width: 45, marginTop: 10 }}>
                        <CommonIcon
                            name={'filter'}
                            family={'Feather'}
                            size={16}
                            color={themeColors?.iconcolor}
                        />

                    </Pressable> */}
                </View>

                <View style={{ flexDirection: 'row', marginStart: 20, marginEnd: 20, marginTop: 20 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            filterdata.map((value, key) => {
                                return (
                                    <TouchableOpacity key={key} style={[styles.fiterbg, { marginStart: key === 0 ? 0 : 10, backgroundColor: selectfilterdata === value ? themeColors.bgbtn : themeColors?.cardbg, borderColor: selectfilterdata === value ? themeColors.bgbtn : themeColors?.inputprimary }]}
                                        onPress={() => {
                                            setfliterselectdata(value)
                                        }}>
                                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, color: selectfilterdata === value ? themeColors?.btn_text_color : themeColors?.text_primary, fontSize: getFontSize(14) }}>{value}</Text>

                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>

                    {/*
                    <View style={[styles.fiterbg,{ backgroundColor: selectfilterdata === 'Contribution' ? themeColors.bgbtn :themeColors?.cardbg,borderColor:selectfilterdata === 'Contribution' ? themeColors.bgbtn :themeColors?.inputprimary,marginStart:10}]}>
                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, color: selectfilterdata === 'Contribution' ?  themeColors?.btn_text_color : themeColors?.text_primary,fontSize:getFontSize(14) }}>Contribution</Text>

                    </View>
                    <View style={[styles.fiterbg,{ backgroundColor: selectfilterdata === 'Withdraw' ? themeColors.bgbtn :themeColors?.cardbg,borderColor:selectfilterdata === 'Withdraw' ? themeColors.bgbtn :themeColors?.inputprimary,marginStart:10}]}>
                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, color: selectfilterdata === 'Withdraw' ?  themeColors?.btn_text_color : themeColors?.text_primary,fontSize:getFontSize(14) }}>Withdraw</Text>

                    </View>
                    <View style={[styles.fiterbg,{ backgroundColor: selectfilterdata === 'Spent' ? themeColors.bgbtn :themeColors?.cardbg,borderColor:selectfilterdata === 'Spent' ? themeColors.bgbtn :themeColors?.inputprimary,marginStart:10}]}>
                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, color: selectfilterdata === 'Spent' ?  themeColors?.btn_text_color : themeColors?.text_primary,fontSize:getFontSize(14) }}>Spent</Text>

                    </View> */}

                </View>


                {
                    0 < goalHis.length ?
                        <ScrollView
                            showsVerticalScrollIndicator={false}

                        >


                            {
                                0 < goalHis.length && <View style={{ marginTop: 20 }}>
                                    {
                                        goalHis.map((value, key) => {
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


                        </ScrollView> :
                        <NoRecord />
                }



                <RBSheet
                    ref={filtetRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={300}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                            backgroundColor: themeColors?.cardbg,

                        },
                        draggableIcon: {
                            backgroundColor: themeColors?.bgbtn,

                        },
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: getFontSize(16), fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                                Fillter
                            </Text>
                            <Pressable

                                onPress={() => filtetRBSheet.current.close()}
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
                            <FlatList
                                data={filterdata}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            setfliterselectdata(item)
                                            filtetRBSheet.current.close()
                                        }}
                                        style={{
                                            flex: 1,
                                            margin: 3,
                                            padding: 10,
                                            backgroundColor: selectfilterdata === item ? themeColors?.bgbtn : themeColors.cardbg,
                                            borderRadius: 5,
                                            alignItems: "center",
                                            borderWidth: 1, borderColor: themeColors?.bgbtn,
                                            marginBottom: 20
                                        }}
                                    >
                                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, color: selectfilterdata === item ? themeColors?.btn_text_color : themeColors?.card_secondary_color }}>{item}</Text>
                                    </Pressable>
                                )}
                            />

                        </View>



                    </View>
                </RBSheet>
            </View>



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
    fiterbg: {
        padding: 8,
        paddingStart: 15, paddingEnd: 15,
        borderRadius: 20,
        alignItems: "center",
        borderWidth: 1,
    }

});

export default Goalhistory
