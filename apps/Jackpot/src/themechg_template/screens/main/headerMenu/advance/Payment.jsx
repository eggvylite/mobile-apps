import { Dimensions, StyleSheet, Text, View, ScrollView, Pressable, Image, Alert, Modal, Animated, TouchableWithoutFeedback,TouchableOpacity } from 'react-native'
import React, { useRef, useState, useEffect, useContext } from 'react'
import GradientBackground from '../../../../component/GradientBackground'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import CommonFunction from '../../../../../utill/CommonFunction'
import { fetchadvanceActiveSubscription, fetchOutstanding } from '../../../../../redux/slices/advenceSlice'
import CommonHeader from '../../../../component/CommonHeader'
import getStyles from '../../../../styles'
import { getFontSize } from '../../../../../constants/Font'
import { fontsFamily } from '../../../../../constants/fontsFamily'
import Loader from '../../../../component/Loader'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { fetchNotication } from '../../../../../redux/slices/notificationSlice'
import Paymentsuccess from '../../../../component/Paymentsuccess'
import { getFcmToken } from '../../../../../service/NotificationServices'
import { fetchAdvancesListHistory,resetAdvTransaction } from '../../../../../redux/slices/advanceTransSlice'
import { resetTransaction } from '../../../../../redux/slices/transactionSlice'
import PaymentCardlist from '../../../../component/PaymentCardlist'
import CommonIcon from '../../../../component/Commonicons'
import AddPaymentCard from '../../../../component/AddPaymentCard'
import { BottomContext } from '../../../../../context/BottomContext'
import api from '../../../../../service/api'



;

const CARD_HEIGHT = 160;
const CARD_GAP = 30;

const Payment = (props) => {


    const [paymentMode, setpaymentMode] = useState('Total')
    const isFocused = useIsFocused();
    const [total, settotal] = useState('')
    const [cardno, setcardno] = useState('')
    const [loading, setLoading] = useState(false);
    const [card, setcard] = useState([])
    const [otherPayment, setotherPayment] = useState([])
    const [cardID, setcardID] = useState(false)
    const [defaultcard, setdefaultCard] = useState([])
    const [otherID, setotherID] = useState([])
    const [totalamt, settotalamt] = useState(0)
    const [paykey, setpaykey] = useState('')
    const [checked, setChecked] = React.useState({});
    const [isDisabled, setIsDisabled] = useState(false);
    const [loginfo, setloginfo] = useState('')
    const [reload, setreload] = useState(false)
    const [amt, setamt] = useState([])
    const refRBSheet = useRef();
    const [index1, setindex1] = useState(0)
    const ids = []
    var arr = []
    var paybill = false

    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);

    const [currentindex, setcurrectindex] = useState('')
    const [visible, setvisible] = useState(false)
    const { width } = Dimensions.get('window')
    const [paymensucces, setpaymentsuccess] = useState(false)
    const [paymentmessage, setpaymentmessage] = useState('')
    const [ispaymentmodel, setpaymentmodel] = useState(false)
    const { totalBill } = useSelector((state) => state.advance);
    const { defcardpm } = useSelector(state => state.payment);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [data, setData] = useState('')
    const dispatch = useDispatch()
    const [cardOpen, setcardOpen] = useState(false)
    const { enableMenu, disableMenu } = useContext(BottomContext);

    useEffect(() => {
        getDetails()
    }, [])



    const getDetails = () => {
        const details = {
            type: 'payment',
            amount: totalBill,
            pmcard: defcardpm
        }
        setData(details)
    }




    const payBalance = async (obj) => {


        setLoading(true)


        const payload = {
            customer: storedata.id,
            pmid: obj.cardno,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress(),
        }






        url = "advances/captureall"


         api.post(url, payload).then(res => {

            if (res.data?.status[0]?.status === 400) {
                setpaymentmessage(res.data.status[0].message)
                // setpaymentmodel(true)
                Alert.alert(
                    "Adavnce Failed",
                    res.data.status[0].message || "Something went wrong"
                  );
                dispatch(fetchNotication(10))
                dispatch(fetchadvanceActiveSubscription()),
                    dispatch(fetchOutstanding())
            } else {
                setpaymentmessage(res.data.status[0].message)

                setpaymentsuccess(true)

                dispatch(fetchNotication(10))
                dispatch(fetchadvanceActiveSubscription()),
                    dispatch(fetchOutstanding())
            }

            dispatch(resetTransaction())
            dispatch(resetAdvTransaction())


            // props.navigation.goBack()

            setLoading(false)


        }).catch(err => {
            console.log(err)
            console.log(err.response.data)
            CommonFunction.message(err.response.data.message, 'danger')
            setLoading(false)

        })




    }







    if (loading) {
        return (
            <Loader label={'Loading'} />
        )
    }

    if (paymensucces) {
        return (
            <Paymentsuccess data={paymentmessage} title={'Payment'} />
        )
    } else {
        return (
            <GradientBackground>
                <View style={styles.container} >
                    <CommonHeader title={ cardOpen ?  'Add New Payment Method' :'Payment'} back={'yes'} onBackPress={() => {
                        if(cardOpen) {
                            setcardOpen(false)
                            enableMenu()
                        } else {
                            props.navigation.goBack()
                        }
                    }} />

                    {
                        cardOpen ?
                            <AddPaymentCard
                                onExit={()=>{
                                    setcardOpen(false)
                                }}
                                disable={(obj) => {
                                    const details= {
                                        ...data,pmcard:obj
                                     }
                                     setData(details)
                                    setcardOpen(false)
                                }}
                            /> :
                            <View style={{ flex: 1, marginHorizontal: 10 }}>

                                <Text style={[styles.signUpsubTitle, { textAlign: 'left' }]}>
                                    Current Outstanding
                                </Text>

                                <View style={{
                                    height: 50, borderWidth: 1, borderColor: 'grey',
                                    marginTop: 20, borderRadius: 5, justifyContent: 'center'
                                }}>
                                    <Text style={[styles.signUpsubTitle, { fontSize: getFontSize(14), marginStart: 10, marginTop: 0, textAlign: 'left' }]}>
                                        {storedata?.currency} {CommonFunction.formatamount(totalBill)}
                                    </Text>

                                </View>


                                <PaymentCardlist
                                    data={data}
                                    addCard={() => {
                                        setcardOpen(true)
                                    }}
                                    onComplete={(obj) => {
                                        payBalance(obj)
                                    }}
                                />


                            </View>
                    }






                    {/* <TouchableOpacity

                        onPress={() => setvisible(true)}

                        style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.bgbtn, marginHorizontal: 20, padding: 15, borderRadius: 10, marginTop: 20, position: 'absolute', bottom: 0, left: 0, right: 0, marginBottom: 40 }} >
                        <Text style={[styles.signUpTitle, { fontSize: 16, color: themeColors?.white }]}>
                            Pay Now
                        </Text>
                    </TouchableOpacity> */}





                    <Modal visible={visible} transparent animationType="fade">
                        <View style={[styles.modalBackground]}>
                            <View style={[styles.alertBox1]}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.textHeader, { color: themeColors?.card_secondary_color }]}>Alert !</Text>
                                </View>
                                <View style={{ marginTop: 20, alignItems: 'center' }}>
                                    <Text style={[styles.text, { color: themeColors?.card_secondary_color }]}>Do you want to pay this amount?</Text>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors.btnborder, borderRadius: 5 }} onPress={() => setvisible(false)}>
                                            <Text style={[styles.text, { color: themeColors?.card_secondary_color }]}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { payBalance() }}>
                                            <Text style={[styles.btnText]}>Yes</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                            </View>
                        </View>
                    </Modal>





                    <Modal visible={ispaymentmodel} transparent animationType="fade">
                        <View style={[styles.modalBackground]}>
                            <View style={[styles.alertBox1]}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.textHeader, { color: themeColors?.card_secondary_color }]}>Alert !</Text>
                                </View>
                                <View style={{ marginTop: 20, alignItems: 'center' }}>
                                    <Text style={styles.text}>{paymentmessage}</Text>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={{ marginEnd: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.bgbtn, borderRadius: 5, padding: 10, width: '60%', marginTop: 10 }}
                                            onPress={() => setpaymentmodel(false)}>
                                            <Text style={[styles.text, { color: themeColors?.white, fontFamily: fontsFamily.semiboldFont }]}>Cancel</Text>
                                        </TouchableOpacity>


                                    </View>
                                </View>

                            </View>
                        </View>
                    </Modal>

                </View>

            </GradientBackground>
        )
    }


}

export default Payment


const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 400
    },
    card: {
        position: 'absolute',
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
