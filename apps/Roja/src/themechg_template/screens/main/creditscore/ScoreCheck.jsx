import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, KeyboardAvoidingView, BackHandler, Image } from "react-native";
import getStyles from "../../../styles";
import { useForm, Controller } from 'react-hook-form';
import SpeedMeter from "./SpeedMeter";
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import CommonFunction from "../../../../utill/CommonFunction";
import Loader from "../../../component/Loader";
import moment from "moment";
import { content } from "../../../../constants/content";
import GradientBackground from "../../../component/GradientBackground";
import CommonHeader from "../../../component/CommonHeader";
import { getFontSize } from "../../../../constants/Font";
import { useDispatch, useSelector } from 'react-redux';
import { fetchcreditScore } from "../../../../redux/slices/scoreSlice";
import { fontsFamily } from "../../../../constants/fontsFamily";
import { useBackHandler } from "@react-native-community/hooks";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import { getLoginInfo } from "../../../../service/storage";
import api from "../../../../service/api";


const ScoreCheck = (props) => {
    const [getregister, setregister] = useState('')
    const [isScorePage, setisScrorePage] = useState(false)
    const [score, setscore] = useState(0)
    const [rec, setrec] = useState('')
    const [futureDate, setfutureDate] = useState('')
    const [btnvisible, setbtnvisible] = useState(false)
    const [details, setdetails] = useState('')
    const [loginfo, setloginfo] = useState('')
    const [isloading, setIsloading] = useState(false)
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, textColor, } = getStyles(themeColors);
    const dispatch = useDispatch();
    const { height, width } = Dimensions.get('window')
    const { scoredata, scoreloading, scorerror } = useSelector((state) => state.creditScore);
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur', });

    useEffect(() => {

        getDeatils()

    }, [])

    const navigationBack = () => {
        props.navigation.goBack()
    }

    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    const getDeatils = async () => {
        var stoage = await getLoginInfo()
        setloginfo(stoage)
        const details = {
            "firstname": "KARL",
            "middlename": "E",
            "lastname": "ARMSTRONG",
            "dob": "1959",
            "ssn": "111111111",
            "line1": "1073 BUCKINGHAM DR",
            "city": "CAROL STREAM",
            "state": "IL",
            "zipcode": "60188",
            "requestor": "2222222"
        }
        setregister(details)
    }

    useEffect(() => {
        if (scoredata) {
            getscoreData()
        }
    }, [scoredata])



    useEffect(() => {
        reset(getregister)
    }, [getregister])

    const handleInputChange = (name, value) => {
        setregister({ ...getregister, [name]: value });
    }

    const getscoreData = async (data) => {

        const firstDate = scoredata.data.createdAt
        const currentDate = new Date()
        const futureDate = new Date(firstDate);
        futureDate.setDate(futureDate.getDate() + scoredata.refresh);
        const fd = moment(firstDate).add(scoredata.refresh, 'day')
        const st = moment(currentDate)


        setdetails(scoredata)
        setfutureDate(fd)

        if (fd <= st) {
            setbtnvisible(true)
        } else {
            setbtnvisible(false)
        }

        setrec(scoredata.records)
        setscore(scoredata.data.score)
        setisScrorePage(true)


        setIsloading(false)

    }

    const submit = () => {
        setIsloading(true)
        console.log(getregister)
        setisScrorePage(false)
        api.post('settings/savescore/' + loginfo.id, getregister).then((res) => {
            console.log('test')
            dispatch(fetchcreditScore())
            // dispatch(fetchDashboard())

        }).catch((err) => {
            if(scoredata?.records && 0 < scoredata?.records?.length) {
                setisScrorePage(true)
            } 
            // 
            setIsloading(false)
            CommonFunction.message('Something went wrong. Please try again later.')
            // CommonFunction.message(err.response.data.message)
            console.log(err.response)
        })
    }

    const textinputStyle = (data) => {
        var conatin = ''
        if (data) {
            conatin = Platform.OS === 'ios' ?
                CommonFunction.getDeviceType() === 'Tablet' ?
                    [styles.textInputContainer, { height: height * 0.06, marginTop: 10, }]
                    : [styles.textInputContainer, { marginTop: 10, width: width * 0.9 }]
                : [styles.textInputContainer, { height: height * 0.07, marginTop: 10, width: width * 0.9 }]
            return conatin

        } else {
            conatin = Platform.OS === 'ios' ?
                CommonFunction.getDeviceType() === 'Tablet' ?
                    [styles.textInputContainer, { height: height * 0.06, marginTop: 10, flexDirection: 'row', borderColor: themeColors.textlight }]
                    : [styles.textInputContainer, { marginTop: 10, width: width * 0.9, flexDirection: 'row', borderColor: themeColors.textlight }]
                : [styles.textInputContainer, { height: height * 0.07, width: width * 0.9, marginTop: 10, flexDirection: 'row', borderColor: themeColors.textlight }]
            return conatin
        }

    }


    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                {/* <CommonHeader title="Credit Score Report" back={'yes'} onBackPress={() => props.navigation.goBack()} /> */}
                
                      <CommonHeader title={isScorePage ? "Credit Score Report" : 'Check Your Credit Score'} back={'yes'} onBackPress={() => props.navigation.goBack()} />
                

                {
                    scoreloading || isloading &&
                    <Loader
                        label={'Loading...'} />
                }

                <KeyboardAvoidingView
                    style={{ flex: 1, }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >

                    <View style={{ flex: 1 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexGrow: 1, // Ensures content fills the scroll area
                                paddingBottom: 10, // Prevents the gap at the bottom
                            }}>
                            {
                                isScorePage ?
                                    <View style={{ bottom: 20 }}>
                                        <SpeedMeter score={score} customer={loginfo} button={btnvisible} date={futureDate} record={rec} data={details} onClick={() => submit()} />
                                    </View> :
                                    !isloading &&
                                    <View style={{ alignItems: 'center', marginTop: 20, paddingBottom: 20 }}>



                                        <Image source={require('../../../../../assets/images/cards.png')} resizeMode='contain' style={{ height: '40%', width: '70%' }} />

                                        <Text style={[{ fontSize: getFontSize(18), fontFamily: fontsFamily.boldFont, marginTop: 30, color: themeColors?.text_primary }]}>Access Your Credit Report</Text>
                                        <Text style={[{ fontSize: getFontSize(15), fontFamily: fontsFamily.semiboldFont, textAlign: 'center', marginHorizontal: 25, marginTop: 10, opacity: 0.5, lineHeight: 22, color: themeColors?.text_primary }]}>We need your Social Security Number to securely retrieve your credit report</Text>
                                        <View style={{ marginTop: 30 }}></View>



                                        <View style={{ marginTop: 20 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>SSN</Text>
                                                <Text style={styles.require}>*</Text>


                                            </View>
                                            <View style={[textinputStyle()]}>
                                                <View style={{ flex: 1 }}>
                                                    <TextInput
                                                        onChangeText={(e) => handleInputChange('ssn', e)}
                                                        value={getregister['ssn']}
                                                        style={[styles.textInputColor,]}
                                                        // selectionColor={styles.selectColor}
                                                        {...register("ssn", {
                                                            required: content.fieldrequire,
                                                            minLength: {
                                                                value: 9,
                                                                message: "SSN must be exactly 9 digits!"
                                                            },
                                                            maxLength: {
                                                                value: 9,
                                                                message: "SSN must be exactly 9 digits!"
                                                            },
                                                            pattern: {
                                                                value: /^[0-9]+$/,
                                                                message: 'SSN must contain only numbers!',
                                                            },
                                                        })}
                                                        placeholderTextColor={themeColors.vectorIconsColor}
                                                        placeholder="SSN"
                                                    />
                                                </View>


                                            </View>
                                            {errors.ssn && <Text style={styles.errortext}>{errors.ssn.message}</Text>}
                                        </View>




                                        <View style={{ alignItems: 'center', marginTop: 30, flexDirection: 'row' }}>
                                            <TouchableOpacity style={{ borderColor: themeColors.bgbtn, padding: 15, borderRadius: 8, width: width * 0.4, alignItems: 'center', borderWidth: 1 }} onPress={() => props.navigation.goBack()}>
                                                <Text style={[styles.btnText, { fontSize: getFontSize(16), color: themeColors?.text_primary }]}>Back</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, padding: 15, marginStart: 20, borderRadius: 8, width: width * 0.4, alignItems: 'center' }} onPress={handleSubmit(submit)}>
                                                <Text style={[styles.btnText, { fontSize: getFontSize(16) }]}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>


                                    </View>


                            }

                        </ScrollView>
                    </View>



                </KeyboardAvoidingView>



            </View>
        </GradientBackground>
    )
}

export default ScoreCheck