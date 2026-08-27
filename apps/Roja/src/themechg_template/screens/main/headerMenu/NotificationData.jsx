import { Text, View, FlatList, Image } from 'react-native'
import React, { useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native'
import GradientBackground from '../../../component/GradientBackground';
import { fetchNotication } from '../../../../redux/slices/notificationSlice';
import Loader from '../../../component/Loader';
import NoRecord from '../../../component/NoRecord';
import CommonHeader from '../../../component/CommonHeader';
import getStyles from '../../../styles';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFontSize } from '../../../../constants/Font';
import timezone from 'moment-timezone'
import moment from 'moment/moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useBackHandler } from '@react-native-community/hooks';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';
import { getLoginInfo } from '../../../../service/storage';
import api from '../../../../service/api';



const NotificationData = (props) => {
    const [loginfo, setloginfo] = useState('')
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const flatListRef = React.useRef()
    const [item, setItem] = useState(1)
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles } = getStyles(themeColors);
    const { notificationdata, notificationerror, notificationloading } = useSelector((state) => state.notification);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);



    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });



    useEffect(() => {
        getDetails()
        if (notificationdata?.records?.length === 0 || Object.keys(notificationdata).length === 0) {
            dispatch(fetchNotication(100))
        }


    }, [isFocused])


    const getDetails = async () => {
        var info = await getLoginInfo()
        setloginfo(info)
        setItem(1)
        if (0 < notificationdata.count) {
            readNotification(info)
        }


    }



    const readNotification = (info) => {
        if (storedata?.id) {
            api.get('customer/read/' + storedata?.id).then(res => {
                dispatch(fetchNotication(100))
            }).catch((err) => {
                console.log(err.response.data)
            })
        }

    }

    const navigationBack = () => {
        props.navigation.goBack()
    }

    const backActionHandler = () => {
        navigationBack()
        return true;
    };

    useBackHandler(backActionHandler)




    const changeDate = (date) => {
        if (loginfo && date) {
            const now = moment();
            const postTime = timezone(date).tz(loginfo.zone)
            const diffInMinutes = now.diff(postTime, 'minutes');
            const diffInHours = now.diff(postTime, 'hours');
            const diffInDays = now.diff(postTime, 'days');

            if (diffInMinutes < 60) {
                return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
            } else if (diffInHours < 24) {
                return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
            } else if (diffInDays < 3) {
                return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
            } else {
                return postTime.format(loginfo.format + ' ' + "hh:mm a");
            }

        }

    }

    const CardSkeleton = () => {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                    <CommonHeader title='Notifications' back={'yes'} onBackPress={() => navigationBack()} />
                    <View style={{ margin: 10, marginTop: 0 }}>

                        <SkeletonPlaceholder
                            backgroundColor={themeColors?.cardbg}
                            highlightColor={themeColors?.backgroundcolor}
                        >

                            <SkeletonPlaceholder.Item
                                borderRadius={10}
                            />
                            {[...Array(10)].map((_, index) => (
                                <View
                                    key={index}
                                    style={{ flexDirection: 'row', marginTop: 20 }}
                                >
                                    <View style={{ width: '100%', height: 80, borderRadius: 10 }} />


                                </View>
                            ))}
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </GradientBackground>

        );
    };



    if (notificationloading) {
        return (
            <CardSkeleton />
        )
    }

    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <CommonHeader title='Notifications' back={'yes'} onBackPress={() => navigationBack()} />


                {
                    0 < notificationdata?.records?.length ?
                        <View style={{ flex: 1 }}>
                            <FlatList
                                ref={flatListRef}
                                data={notificationdata?.records}
                                windowSize={100}
                                refreshing={false}
                                bounces={false}
                                scrollEnabled={true}
                                onEndReachedThreshold={0.5}
                                removeClippedSubviews
                                initialNumToRender={4}
                                scrollEventThrottle={16}
                                showsVerticalScrollIndicator={false}
                                onEndReached={() => {

                                }}
                                extraData={item}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{
                                            borderColor: themeColors.bgbtn, borderRadius: 10, padding: 20, backgroundColor: themeColors.card_list_bg, margin: 10,
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontFamily: fontsFamily.boldFont, fontSize: getFontSize(14), color: themeColors.card_secondary_color }}>{item.title}</Text>

                                                </View>

                                                <View style={{ marginTop: 5, alignItems: 'flex-end' }}>
                                                    <Text style={{ fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(12), color: themeColors.card_secondary_color, opacity: 0.5 }}> {changeDate(item?.createdAt)} </Text>
                                                </View>

                                            </View>

                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontFamily: fontsFamily.regularFont, fontSize: getFontSize(14), color: themeColors.card_secondary_color, lineHeight: 24 }}>{item?.body}</Text>
                                            </View>

                                        </View>
                                    )
                                }} />

                        </View> :

                        <View style={{ flex: 1 }}>
                            <NoRecord />
                        </View>

                }
            </View>
        </GradientBackground>
    )
}

export default NotificationData



