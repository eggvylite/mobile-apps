import React, { useEffect, useState, useRef, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Alert, FlatList, Pressable, Dimensions, TextInput } from "react-native";
import CommonFunction from "../../../../utill/CommonFunction";
import Loader from "../../../component/Loader";
import NoRecord from "../../../component/NoRecord";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import { useForm, Controller } from 'react-hook-form';
import LabelledInput from "../../../component/LabelledInput";
import { Dropdown } from "react-native-element-dropdown";
import timezone from 'moment-timezone'
import { useBackHandler } from "@react-native-community/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import getStyles from "../../../styles";
import { getFontSize } from "../../../../constants/Font";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTag, updateTagname } from "../../../../redux/slices/tagSlice";
import { fetchStatement } from "../../../../redux/slices/statementSlice";
import { content } from "../../../../constants/content";
import { fontsFamily } from "../../../../constants/fontsFamily";
import GradientBackground from "../../../component/GradientBackground";
import CommonHeader from "../../../component/CommonHeader";
import { fetchTagdescription } from "../../../../redux/slices/tagdescriptionSlice";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import { Divider, Menu } from 'react-native-paper';
import CommonIcon from "../../../component/Commonicons";
import CustomModal from "../../../component/CustomModal";
import { getLoginInfo } from "../../../../service/storage";
import api from "../../../../service/api";
// import { deleteTaglist, fetchTagListService, fetchTagTransactionService, updateTaglisitemt, updateTaglist } from "../../../redux/slices/tagTransactionstementSlice";

function TagSettings(props) {
    const [record, setRecord] = useState([])
    const [isload, setIsLoad] = useState(false)
    const [tagModal, setTagmoadl] = useState(false)
    const [loginfo, setstoredata] = useState()
    const { height, width } = useWindowDimensions();
    const [selectKey, setSelectKey] = useState(-1)
    const [keyPress, setKeyPress] = useState(true)
    const refRBSheet = useRef(null)
    const [tagValue, setTagvalue] = useState('')
    const [isEdit, setisEdit] = useState(false)
    const [editmodal, setiseditmodal] = useState(false)
    const [topScroll, setTopscroll] = useState(false)
    const [more, setMore] = useState(false)
    const [bottomLoad, setBottomload] = useState(false)
    const [page, setPage] = useState(0)
    const [item, setItem] = useState(1)
    const [totalPage, settotalPage] = useState('')
    const [request, setrequest] = useState('')
    const [tags, setTags] = useState([]);
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor } = getStyles(themeColors)
    const { control, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onBlur', });
    const dispatch = useDispatch();
    const [menuVisibleFor, setMenuVisibleFor] = React.useState(null);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { tagdata, tagloading, tagerror } = useSelector((state) => state.taglist);
    const [isdelModel, setisdelModel] = useState(false)
    const size = 20
    const payType = [
        { id: 'Credit', name: "Credit" },
        { id: 'Debit', name: "Debit" },

    ]


    useEffect(() => {
        getDetails()
    }, [])

    useEffect(() => {
        setRecord(tagdata.records)
    }, [tagdata])

    const navigationBack = () => {
        props.navigation.goBack()
    }


    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });


    const getDetails = async () => {
        reset()
        var login = await getLoginInfo()
        setstoredata(login)

    }





    const tagbtn = (obj) => {
        setTagmoadl(false)
        setKeyPress(!keyPress)
        getDetails()


    }






    const deleteTag = async () => {
        setisdelModel(false)
        setMenuVisibleFor(null)
        const updatedData = record.filter((item) => item.tagname !== tagValue?.tagname);
        setRecord(updatedData)
        dispatch(updateTagname({ records: updatedData }))
        // CommonFunction.message(message.tagmsg.Tag_delete)
        api.get('customer/deletealltag/' + tagValue._id + "?platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress()).then((res) => {
            CommonFunction.message(res.data.message)
            dispatch(fetchTag())
            dispatch(fetchTagdescription())
        }).catch((err) => {
            console.log('step3 ')
            console.log(err)
        })
    }



    const updateTag = async (data) => {
        console.log('1')
        setisEdit(false)
        setTagmoadl(false)
        setIsLoad(true)
        setItem((item) => item + 1)
        const send = {
            tagname: data.tagname.trim(),
            tag_status: data.tag_status,
            tag_type: (data.tag_type).toUpperCase(),
            customer_id: loginfo.id,
            // tags: tags,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress()

        }
        var url = 'customer/cusupadtetaglist/' + tagValue._id

        const isName = record.find(
            (item) =>
                item?.tagname?.toLowerCase() === send?.tagname?.toLowerCase()
        );

        if (isName) {
            if (isName._id !== tagValue._id) {
                Alert.alert(
                    "Alert!",
                    "Tag name already exists",
                    [
                        {
                            text: "OK",
                            onPress: () => null,
                            style: "cancel"
                        },

                    ]
                );
            }

        } else {
            console.log('test 1')
            const updatedData = record.map((item) => {
                if (item._id === tagValue._id) {
                    return { ...item, tagname: send.tagname }; // Update the specific name
                }
                return item;
            });
            setRecord(updatedData)
            // CommonFunction.message(message.tagmsg.Tag_update)
            dispatch(updateTagname({ records: updatedData }))
            api.get(url, send).then(async (res) => {
                CommonFunction.message(res.data.message)
            }).catch(err => {


            })

        }





        // CommonFunction.postAPI(api, 'nouid', send).then(async (res) => {
        //     setRecord([])
        //     setPage(0)
        //     await AsyncStorage.setItem('banktag', 'yes')
        //     await AsyncStorage.setItem('insights', 'yes')
        //     getDetails()
        //     CommonFunction.message(res.data.message)
        //     CommonFunction.getInsights()
        // }).catch(err => {
        //     setIsLoad(false)
        //     CommonFunction.message('Tag name already exists')
        //     console.log(err.response.data)
        // })


    }




    const checkColor = (type) => {
        if (type === 'DEBIT') {
            return themeColors.danger
        } else {
            return themeColors.success
        }

    }




    const editValue = (value) => {
        setMenuVisibleFor(null)
        setiseditmodal(true)
        setTags(value.tags)
        setTagmoadl(true),
            setTagvalue(value),
            reset({ tagname: value.tagname, tag_status: value.tag_status, tag_type: CommonFunction.captialize((value.tag_type).toLowerCase()) })


    }



    function formatDateTime(date) {
        var zone = storedata.zone
        const df = timezone(date).tz(zone).format(storedata.format);
        return df

    }





    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <CommonHeader title="Manage Tags" back={'yes'} onBackPress={() => navigationBack()} />
                {

                    <View style={{ flex: 1 }}>
                        {
                            0 < record?.length ?
                                <View style={{ marginTop: 10 }}>

                                    <FlatList
                                        data={record}
                                        showsVerticalScrollIndicator={false}
                                        extraData={item}
                                        keyExtractor={(item, index) => index}
                                        renderItem={({ item, index }) => {
                                            if (item?.tagname) {
                                                return (
                                                    <View style={[{
                                                        backgroundColor: themeColors?.card_list_bg, marginStart: 10, marginEnd: 10, borderRadius: 8, padding: 5, marginBottom: 10, marginTop: 5, paddingStart: 10, paddingEnd: 10,
                                                        shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.1,
                                                        shadowRadius: 3,
                                                        elevation: 3,

                                                    }]}>
                                                        <View style={[styles.bankListBackground, { borderBottomWidth: 0, }]}>
                                                            <View style={{ height: 35, width: 35, borderRadius: 50, backgroundColor: themeColors.iconbg, alignItems: 'center', justifyContent: 'center', top: 8 }}>
                                                                <AntDesign name="tag" size={20} color={themeColors.iconcolor} />
                                                            </View>
                                                            <View style={{ flex: 1, marginStart: 20, marginEnd: 10, justifyContent: 'center', justifyContent: 'space-evenly' }}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <View style={{ justifyContent: 'center' }}>
                                                                        <Text style={[styles.banklistfont]}>{item.tagname}</Text>
                                                                    </View>
                                                                    {
                                                                        item?.tag_type &&
                                                                        <View style={{ marginStart: 10, backgroundColor: checkColor(item?.tag_type), padding: 2, borderRadius: 10, paddingStart: 10, paddingEnd: 10, opacity: 0.7 }}>
                                                                            <Text style={[styles.banklistfont, { color: '#fff', fontSize: getFontSize(10) }]}>{CommonFunction.captialize((item?.tag_type)?.toLowerCase())}</Text>
                                                                        </View>
                                                                    }


                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{opacity:0.7}}>
                                                                            <FontAwesome name="user" size={16} color={themeColors?.card_secondary_color} />
                                                                        </View>
                                                                        <View style={{marginStart:5,opacity:0.5}}>
                                                                            <Text style={[styles.banklistfont]}>{item.createdBy ? 'Admin' : 'User'}</Text>
                                                                        </View>

                                                                    </View>

                                                                    <View style={{ flexDirection: 'row',marginStart:10 }}>
                                                                        <View style={{opacity:0.7}}>
                                                                            <AntDesign name="calendar" size={16} color={themeColors?.card_secondary_color} />
                                                                        </View>
                                                                        <View style={{marginStart:5,opacity:0.7}}>
                                                                             <Text style={[styles.banklistfont, { fontSize: getFontSize(14), fontWeight: '600', }]}>{formatDateTime(item.createdAt)}</Text>
                                                                        </View>

                                                                    </View>


                                                                   
                                                                </View>

                                                            </View>

                                                            <View style={{ end: 10, justifyContent: 'center' }}>
                                                                {
                                                                    !item?.createdBy ?

                                                                        <View >
                                                                            <Menu
                                                                                visible={menuVisibleFor === item._id}
                                                                                onDismiss={() => setMenuVisibleFor(null)}

                                                                                anchor={
                                                                                    <Pressable
                                                                                        onPress={() => setMenuVisibleFor(item._id)}
                                                                                        style={{

                                                                                            marginLeft: 8,
                                                                                        }}
                                                                                    >
                                                                                        <CommonIcon
                                                                                            name="more-vertical"
                                                                                            family="Feather"
                                                                                            color={themeColors?.iconcolor}
                                                                                            size={18}
                                                                                        />
                                                                                    </Pressable>
                                                                                }
                                                                            >
                                                                                <Menu.Item
                                                                                    onPress={() => {
                                                                                        editValue(item)
                                                                                    }}
                                                                                    leadingIcon={() => (
                                                                                        <View style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: themeColors?.iconbg, alignItems: 'center', justifyContent: 'center' }}>
                                                                                            <CommonIcon name="edit" family="Entypo" size={14} color={themeColors?.iconcolor} />
                                                                                        </View>
                                                                                    )}

                                                                                    titleStyle={{ fontSize: getFontSize(12), color: themeColors?.card_secondary_color, marginStart: 10, fontFamily: fontsFamily.boldFont }}
                                                                                    title="Edit"
                                                                                />



                                                                                <Menu.Item
                                                                                    onPress={() => {
                                                                                        setisdelModel(true)
                                                                                        setMenuVisibleFor(null);
                                                                                    }}
                                                                                    leadingIcon={() => (
                                                                                        <View style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: themeColors?.iconbg, alignItems: 'center', justifyContent: 'center' }}>
                                                                                            <CommonIcon name="delete" family="MaterialCommunityIcons" size={14} color={themeColors?.iconcolor} />
                                                                                        </View>
                                                                                    )}
                                                                                    titleStyle={{ fontSize: getFontSize(12), color: themeColors?.card_secondary_color, marginStart: 10, fontFamily: fontsFamily.boldFont }}
                                                                                    title="Delete"
                                                                                />
                                                                            </Menu>
                                                                        </View> : <View></View>

                                                                }



                                                            </View>


                                                        </View>
                                                    </View>
                                                )
                                            }


                                        }}
                                    />



                                </View> : <NoRecord />
                        }
                    </View>


                }




                <CustomModal
                    visible={isdelModel}
                    onClose={() => setisdelModel(false)}
                    alertTitle="Alert!"
                    actionText="Yes"
                    cancelText="No"
                    onAction={() => {
                        deleteTag()
                    }}
                >
                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                        Are you sure you want to delete this tag?
                    </Text>
                </CustomModal>








                <Modal animationIn={'fadeIn'} animationOut={'fadeOut'} isVisible={tagModal}>
                    <View style={{ marginTop: Platform.OS == 'ios' ? 50 : 0, borderTopWidth: 0, borderColor: "#e2e2e2", borderBottomWidth: 1, backgroundColor: themeColors?.cardbg, borderRadius: 14, height: height * 0.50 }}>
                        <View style={{ padding: 22, flex: 1 }}>
                            <View style={{ flex: 1 }}>

                                <View style={{ borderBottomWidth: 1, borderBottomColor: themeColors?.iconbg, alignItems: 'center', paddingBottom: 7 }}>
                                    <Text style={[styles.textchg, { fontSize: getFontSize(18), marginTop: 0, color: themeColors?.card_text_color }]}>Edit Tag</Text>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View >
                                        <Controller
                                            control={control}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <LabelledInput
                                                    label={'Tag Name'}
                                                    required value={value}
                                                    onChangeText={(val) => { 15 >= val.length && onChange(val) }} />
                                            )}
                                            name="tagname"
                                            rules={{
                                                required: content.fieldrequire, // Required validation
                                                validate: {
                                                    noLongSpaces: (value) =>
                                                        !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                    noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                                                },

                                            }}
                                        />
                                        {errors.tagname && <Text style={styles.errortext}>{errors.tagname.message}</Text>}
                                    </View>



                                    <>
                                        <View style={{ flexDirection: "row", marginVertical: 12, }}>
                                            <Text style={[styles.label, { color: themeColors?.card_text_color }]}>Type</Text>
                                            <Text style={{ ...styles.label, color: "red" }}> *</Text>

                                        </View>
                                        <Controller
                                            control={control}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <Dropdown
                                                    style={[styles.dropdown1, { height: 60, backgroundColor: themeColors?.inputprimary }]}
                                                    placeholderStyle={styles.placeholderStyle}
                                                    selectedTextStyle={[styles.selectedTextStyle, { fontFamily: fontsFamily.regularFont, fontSize: getFontSize(14) }]}
                                                    inputSearchStyle={styles.inputSearchStyle}
                                                    iconStyle={styles.iconStyle}
                                                    data={payType}
                                                    disable={true}
                                                    renderRightIcon={() => {
                                                        return (
                                                            null
                                                        )
                                                    }}
                                                    maxHeight={300}
                                                    labelField="id"
                                                    valueField="name"
                                                    placeholder="SELECT STATUS"
                                                    searchPlaceholder="Search..."
                                                    value={payType.find((obj) => obj.id == value)}
                                                    onChange={item => {
                                                        onChange(item.id);
                                                    }}
                                                />
                                            )}
                                            name="tag_type"
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: content.fieldrequire
                                                }
                                            }}
                                        />
                                        {errors.tag_type && <Text style={styles.errortext}>{errors.tag_type.message}</Text>}
                                    </>



                                </ScrollView>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 10, marginTop: 20 }}>
                                <TouchableOpacity style={{ flex: 1, marginEnd: 10, borderRadius: 8, borderColor: themeColors.bgbtn, borderWidth: 1, padding: 12, alignItems: 'center' }} onPress={() => { setisEdit(false), setTagmoadl(false), setSelectKey(-1), setKeyPress(true), reset() }}>
                                    <Text style={{ color: themeColors.bgbtn, fontSize: 16, fontFamily: fontsFamily.mediumFont }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, flex: 1, borderRadius: 8, padding: 12, alignItems: 'center' }} onPress={handleSubmit(updateTag)}>
                                    <Text style={{ color: themeColors.btn_text_color, fontSize: 16, fontFamily: fontsFamily.mediumFont }}>{isEdit ? 'Update' : 'Submit'}</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                </Modal>
            </View>
        </GradientBackground>

    )
}
export default TagSettings