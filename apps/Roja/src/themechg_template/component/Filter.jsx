import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Dimensions } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { ScrollView } from 'react-native-virtualized-view';
import getStyles from '../styles';
import MonthPicker from "react-native-month-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment';
import { getFontSize } from '../../constants/Font';
import { BottomContext } from '../../context/BottomContext';
import { useDispatch, useSelector } from 'react-redux';
import CalendarPicker from "react-native-calendar-picker";
import { Dropdown } from "react-native-element-dropdown";
import { fontsFamily } from '../../constants/fontsFamily';

const Filter = (props) => {

    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const [selectTimeLine, setselectTimeLine] = useState(props.timeLine ? props.timeLine : '')
    const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category);
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
    const { height, width } = Dimensions.get('window')
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const [selectStatus, setselectStatus] = useState(props.status ? props.status : '')
    const advance = props?.advance ? props?.advance : false
    const dispatch = useDispatch()
    const [categoryarr, setCategoryarr] = useState([])
    const [categoryId, setCatgoryId] = useState('')
    const timeLineMonth = [
        { label: "This Year", value: '1' },
        { label: "This Month", value: '3' },
        { label: "Last 3 Months", value: '13' },
        { label: "Last 6 Months", value: '14' },
        { label: "Last Month", value: '4' },
        { label: "Custom", value: '7' },

    ]

    const status = [
        { value: '', label: "All" },
        { value: 'Success', label: "Success" },
        { value: 'Failed', label: "Failure" },
    ]

    const option = [{
        label: "No Option", value: 10
    }]

    useEffect(() => {
        if (categorydata) {
            var arr = []
            categorydata.records.map((value) => {
                arr.push({
                    category_guid: value.category_id,
                    category: value.category,
                    category_id: value.category_id
                })

            })
            setCategoryarr(arr)

        }

    }, [categorydata])



    useEffect(() => {
        disableMenu()
    }, [])
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 10, padding: 10, flex: 1, marginBottom: 10, }}>
                    <View style={{ flex: 1 }}>
                        {
                            props?.screen === 'subscription' && advance === false &&
                            <View style={{ marginTop: 30 }}>
                                <Text style={[styles.reportText]}>Status</Text>
                                <FlatList
                                    data={status}
                                    numColumns={3} // Adjust the number of columns as needed
                                    // keyExtractor={(item) => item.value.toString()}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity style={[styles.filterButton, { backgroundColor: selectStatus === item.value ? themeColors.bgbtn : 'transparent' }]} onPress={() => { setselectStatus(item.value) }}      >
                                                <Text style={[styles.reportText, { color: selectStatus === item.value ? '#fff' : themeColors?.text_primary }]}>{item.label}</Text>
                                            </TouchableOpacity>
                                        )
                                    }

                                    }
                                />


                            </View>

                        }

                        {
                            props?.screen === 'bank' &&
                            <View >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.textchg, { fontSize: getFontSize(16), marginTop: 0 }]}>Category</Text>

                                    <Text style={styles.require}>*</Text>
                                </View>




                                <Dropdown
                                    style={{ padding: 12, marginTop: 15, borderRadius: 7, backgroundColor: 'transparent',borderWidth:1, borderColor:themeColors.bgbtn,marginStart:10 }}
                                    placeholderStyle={{ color: 'gray' }}
                                    placeholderTextColor={"grey"}
                                    selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, backgroundColor: 'transparent' }]}
                                    inputSearchStyle={[styles.inputSearchStyle]}
                                    iconStyle={styles.iconStyle}
                                    search={true}
                                    itemTextStyle={[styles.dropdownItemText,]}
                                    itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.cardbg }}
                                    containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.cardbg }}
                                    data={0 < categoryarr.length ? categoryarr : option}
                                    maxHeight={600}
                                    activeColor={themeColors?.inputprimary}
                                    labelField="category"
                                    valueField="category_id"
                                    placeholder="Select category"
                                    searchPlaceholder="Search..."
                                    value={props?.category}
                                    onChange={item => {
                                        if (item.value != 10) {
                                            props?.onCategorychg(item?.category_id)
                                        }
                                    }}
                                />


                            </View>
                        }



                        <View style={{ marginTop: props?.screen === 'subscription' || props?.screen === 'bank' ? 30 : 10 }}>
                            <Text style={[styles.reportText, { color: themeColors?.text_primary, fontSize: getFontSize(16) }]}>Timeline</Text>
                        </View>
                        {
                            !props.type &&
                            <View>
                                <FlatList
                                    data={timeLineMonth}
                                    numColumns={2} // Adjust the number of columns as needed
                                    keyExtractor={(item) => item.value.toString()}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity style={[styles.filterButton, { backgroundColor: selectTimeLine === item.value ? themeColors.bgbtn : 'transparent' }]} onPress={() => { setselectTimeLine(item.value), props.chaCancel() }}      >
                                                <Text style={[styles.reportText, { color: selectTimeLine === item.value ? themeColors?.white : themeColors?.text_primary }]}>{item.label}</Text>
                                            </TouchableOpacity>
                                        )
                                    }

                                    }
                                />



                            </View>
                        }



                        {
                            selectTimeLine === '7' &&
                            <View style={{ marginStart: 10, marginEnd: 10, marginTop: 20 }}>
                                <View style={{ marginTop: props.type ? 10 : 20 }}>
                                    {
                                        !props.type &&
                                        <Text style={[styles.reportText,]}>From</Text>
                                    }

                                    <TouchableOpacity style={[styles.filterTextInputContainer, { backgroundColor: 'transparent', borderColor: themeColors?.bgbtn, borderWidth: 1 }]} onPress={() => { setShow(!show), setShow1(false) }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.filterInpuText, { color: themeColors?.text_primary }]}>{props.disDate ? props.disDate : props.picker === 'monthpicker' ? 'MMM - YYYY' : 'MM-DD-YYYY'}</Text>
                                            </View>
                                            <TouchableOpacity style={{ end: 10 }} onPress={() => { setShow(!show), setShow1(false) }}>
                                                <AntDesign name="calendar" color={themeColors?.text_primary} size={20} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                    {
                                        show &&
                                        <View style={{ marginTop: 10, backgroundColor: themeColors?.cardbg, padding: 5 }}>



                                            {
                                                props.picker === 'monthpicker' ?
                                                    <MonthPicker
                                                        containerStyle={{ backgroundColor: themeColors?.cardbg }}
                                                        monthTextStyle={{ color: '#000' }}
                                                        nextIcon={<AntDesign name="right" color={themeColors.buttonBgColor} size={20} />}
                                                        prevIcon={<AntDesign name="left" color={themeColors.buttonBgColor} size={20} />}
                                                        yearTextStyle={{ color: '#000' }}
                                                        selectedMonthTextStyle={{ color: '#fff' }}
                                                        selectedBackgroundColor={themeColors.bgbtn}
                                                        selectedDate={moment(new Date(props.fDate))}
                                                        minDate={moment(new Date(props.firstTrans))}
                                                        maxDate={moment(new Date())}
                                                        onMonthChange={(rec) => { props.changeFdatevalue(rec), setShow(false) }}
                                                    /> :
                                                    <CalendarPicker
                                                        width={330}
                                                        initialDate={new Date(props.fDate)}
                                                        selectedStartDate={new Date(props.fDate)}
                                                        minDate={props.firstTrans}
                                                        maxDate={new Date()}
                                                        selectedDayColor={themeColors?.bgbtn}
                                                        selectedDayTextColor={themeColors?.btn_text_color}
                                                        todayBackgroundColor={themeColors?.bgbtn}
                                                        textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(14) }}
                                                        onDateChange={(value) => { props.changeFdatevalue(value), setShow(false) }}
                                                    />

                                            }


                                        </View>
                                    }

                                </View>
                                {
                                    !props.type &&
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={[styles.reportText]}>To</Text>
                                        <TouchableOpacity style={[styles.filterTextInputContainer, { backgroundColor: 'transparent', borderColor: themeColors?.bgbtn, borderWidth: 1 }]} onPress={() => { setShow1(!show1), setShow(false) }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.filterInpuText, { color: themeColors?.text_primary }]}>{props.disDate1 ? props.disDate1 : props.picker === 'monthpicker' ? 'MMM - YYYY' : 'MM-DD-YYYY'}</Text>
                                                </View>
                                                <Pressable style={{ end: 10 }} onPress={() => { setShow1(!show1), setShow(false) }}>
                                                    <AntDesign name="calendar" color={themeColors?.text_primary} size={20} />
                                                </Pressable>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }


                                {
                                    show1 &&
                                    <View style={{ marginTop: 10, backgroundColor: themeColors?.cardbg, padding: 5 }}>

                                        {
                                            props.picker === 'monthpicker' ?
                                                <MonthPicker
                                                    containerStyle={{ backgroundColor: themeColors?.cardbg }}
                                                    monthTextStyle={{ color: themeColors?.inputsecondary }}
                                                    nextIcon={<AntDesign name="right" color={themeColors?.inputsecondary} size={20} />}
                                                    prevIcon={<AntDesign name="left" color={themeColors?.inputsecondary} size={20} />}
                                                    yearTextStyle={{ color: '#000' }}
                                                    selectedMonthTextStyle={{ color: '#fff' }}
                                                    selectedBackgroundColor={themeColors.bgbtn}
                                                    selectedDate={moment(new Date(props.tDate))}
                                                    minDate={moment(new Date(props.fDate))}
                                                    maxDate={moment(new Date())}
                                                    onMonthChange={(rec) => { props.changeTdatevalue(rec), setShow1(false) }}
                                                /> :
                                                <CalendarPicker
                                                    width={330}
                                                    initialDate={props.tDate}
                                                    selectedStartDate={props.tDate}
                                                    minDate={props.fDate}
                                                    maxDate={new Date()}
                                                    selectedDayColor={themeColors?.bgbtn}
                                                    selectedDayTextColor={themeColors?.btn_text_color}
                                                    todayBackgroundColor={themeColors?.bgbtn}
                                                    textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(14) }}
                                                    onDateChange={(value) => { props.changeTdatevalue(value), setShow1(false) }}
                                                />

                                        }

                                    </View>
                                }
                            </View>
                        }

                    </View>


                </View>

            </ScrollView>
            <View style={{ flexDirection: 'row', padding: 20, marginBottom: 20 }}>

                <TouchableOpacity style={[styles.filterapplycancelBtn, { backgroundColor: themeColors?.white, borderColor: themeColors.bgbtn, borderWidth: 1, alignItems: 'center' }]} onPress={() => {
                    if (props?.screen === 'subscription') {
                        setselectStatus('')
                        setselectTimeLine('')
                        props.onCancelClk()
                    } else {
                        if (!props.type) {
                            setselectTimeLine('')
                        }
                        console.log(selectTimeLine)
                        setShow(false)
                        setShow1(false)
                        props.onCancelClk(selectTimeLine)
                    }

                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name='refresh' size={20} color={themeColors.bgbtn} />

                        <Text style={[styles.filterapplycancelBtnTxt, { color: themeColors.bgbtn, marginStart: 10 }]}>Reset</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity style={[styles.filterapplycancelBtn, { backgroundColor: themeColors.bgbtn, marginStart: 10 }]}
                    onPress={() => {
                        console.log('i am apply btn')
                        if (props?.screen === 'subscription') {
                            const data = {
                                timeline: selectTimeLine,
                                status: selectStatus
                            }
                            props.onApplyClk(data)

                        } else {
                            if (!props.screen) {
                                enableMenu()
                            }
                            props.onApplyClk(selectTimeLine)
                        }

                    }}>
                    <Text style={[styles.filterapplycancelBtnTxt, { color: themeColors?.white }]}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Filter