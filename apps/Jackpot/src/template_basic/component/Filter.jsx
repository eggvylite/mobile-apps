import { StyleSheet, Text, View, Modal, Animated, Dimensions, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'
import DateTimePicker, { DateTimePickerAndroid, } from '@react-native-community/datetimepicker';
import SubmitBtn from './SubmitBtn'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import { apiformatDate } from '../../utill/Utills';
import BaseModal from './BaseModel';

const Filter = ({ visible, onClose, onApply, value, screen }) => {
    const [selectedTimeline, setSelectedTimeline] = useState(value?.timeline || '');
    const [selectedStatus, setSelectedStatus] = useState(value?.status || 'All');
    const [selectedType, setSelectedType] = useState(value?.status || 'All');
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const currenDate = new Date()
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [iosStartPickerMode, setIosStartPickerMode] = useState(false);
    const [iosEndPickerMode, setIosEndPickerMode] = useState(false);
    const { height, width } = Dimensions.get('window')
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;
    const timeLineMonth = [
        { label: "This Year", value: '1' },
        { label: "This Month", value: '3' },
        { label: "Last 3 Months", value: '13' },
        { label: "Last 6 Months", value: '14' },
        { label: "Last Month", value: '4' },
        { label: "Custom", value: '7' },

    ]

    const status = [
        { value: 'All', label: "All" },
        { value: 'Success', label: "Success" },
        { value: 'Failed', label: "Failure" },
    ]

    const type = [
        { value: 'All', label: "All" },
        { value: 'Advance', label: "Advance" },
        { value: "Subscription", label: "Subscription" },
    ]


    useEffect(() => {
        setSelectedTimeline(value?.timeline || '')
        setSelectedStatus(value?.status || 'All')
        console.log(value)
        if (value?.timeline === '7') {
            setStartDate(value?.begin)
            setEndDate(value?.end)
        } else {
            setStartDate(new Date())
            setEndDate(new Date())
        }

    }, [visible, value])


    Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
    }).start();

    const applyBtn = () => {
        var data = ''
        if (selectedTimeline === '7') {
            data = {
                status: selectedStatus,
                timeline: selectedTimeline,
                begin: changeformat(startDate),
                end: changeformat(endDate),
                type: selectedType
            }
        } else {
            data = {
                status: selectedStatus,
                timeline: selectedTimeline,
                type: selectedType
            }
        }

        onApply(data)

    }

    const changeformat = (date) => {
        var dt = moment(new Date(date)).format('YYYY-MM-DD');
        return dt
    }



    const resetBtn = () => {
        setSelectedStatus('All')
        setSelectedType('All')
        setSelectedTimeline('')
        onApply('')
    }

    const close = () => {
        setSelectedStatus('')
        setSelectedTimeline('')
        onClose()
    }

    const openAndroidStartDate = () => {
        DateTimePickerAndroid.open({
            value: new Date(startDate),
            mode: 'date',
            is24Hour: true,
            maximumDate: currenDate,
            minimumDate: storedata?.first_transaction ? new Date(storedata?.first_transaction) : new Date(),
            onChange: (event, selectedDate) => {
                if (event.type === 'dismissed' || !selectedDate) return;
                const combined = new Date(selectedDate);
                setStartDate(combined);
            },
        });
    };

    const openAndroidEndDate = () => {
        DateTimePickerAndroid.open({
            value: new Date(endDate),
            mode: 'date',
            is24Hour: true,
            maximumDate: currenDate,
            minimumDate: new Date(startDate),
            onChange: (event, selectedDate) => {
                if (event.type === 'dismissed' || !selectedDate) return;
                const combined = new Date(selectedDate);
                setEndDate(combined);

            },
        });
    };

    const onIosStartChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setIosStartPickerMode(false);
            return;
        }
        if (selectedDate) setStartDate(selectedDate);
        setIosStartPickerMode(false);
    };

    const onIosEndChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setIosEndPickerMode(false);;
            return;
        }
        if (selectedDate) setEndDate(selectedDate);
        setIosEndPickerMode(false);;
    };

    const displayDate = (date) => {
        if (storedata) {
            const dt = moment(new Date(date)).format(storedata.format)
            return dt
        }
    }

    const openStartDatePicker = () =>
        Platform.OS === 'android' ? openAndroidStartDate() : setIosStartPickerMode(true)


    const openEndDatePicker = () =>
        Platform.OS === 'android' ? openAndroidEndDate() : setIosEndPickerMode(true);




    return (

        <BaseModal visible={visible}
            onClose={close}
            title="Filter">
            <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>

                {
                    !screen &&
                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Status</Text>
                        <View style={styles.filterOptionsGrid}>
                            {status.map((option, key) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.filterOption,
                                        selectedStatus === option.value && styles.filterOptionActive
                                    ]}
                                    onPress={() => setSelectedStatus(option.value)}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        selectedStatus === option.value && styles.filterOptionTextActive
                                    ]}>
                                        {option?.label}
                                    </Text>
                                    {selectedStatus === option?.value && (
                                        <View style={styles.filterCheck}>
                                            <Feather name="check" size={12} color="#FFFFFF" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                }
                {
                    !screen &&
                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Type</Text>
                        <View style={styles.filterOptionsGrid}>
                            {type.map((option, key) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.filterOption,
                                        selectedType === option.value && styles.filterOptionActive
                                    ]}
                                    onPress={() => setSelectedType(option.value)}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        selectedType === option.value && styles.filterOptionTextActive
                                    ]}>
                                        {option?.label}
                                    </Text>
                                    {selectedType === option?.value && (
                                        <View style={styles.filterCheck}>
                                            <Feather name="check" size={12} color="#FFFFFF" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                }

                <View style={styles.filterSection}>
                    <View>
                        <Text style={styles.filterSectionTitle}>Timeline</Text>
                    </View>
                    <View style={styles.filterOptionsGrid}>
                        {timeLineMonth.map((option, key) => (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.filterOption,
                                    selectedTimeline === option?.value && styles.filterOptionActive
                                ]}
                                onPress={() => setSelectedTimeline(option?.value)}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    selectedTimeline === option?.value && styles.filterOptionTextActive
                                ]}>
                                    {option?.label}
                                </Text>
                                {selectedTimeline === option?.value && (
                                    <View style={styles.filterCheck}>
                                        <Feather name="check" size={12} color="#FFFFFF" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {
                    selectedTimeline === '7' &&
                    <View style={[styles.filterSection, { flexDirection: 'row', marginStart: 5 }]}>
                        <View style={{ flex: 1 }}>
                            <View>
                                <Text style={styles.filterSectionTitle}>Start</Text>
                            </View>

                            <Pressable style={[styles.selectField, { flexDirection: 'row' }]} onPress={openStartDatePicker}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Feather name="calendar" size={20} color="#94A3B8" />
                                </View>
                                <View style={{ justifyContent: 'center', flex: 1, marginStart: 10 }}>
                                    <Text style={{ color: "#94A3B8", fontSize: getFontSize(14), fontFamily: fontsFamily.regularFont, }}
                                    >{startDate ? displayDate(startDate) : storedata.format}</Text>

                                </View>

                            </Pressable>
                        </View>
                        <View style={{ flex: 1, marginStart: 10 }}>
                            <View>
                                <Text style={styles.filterSectionTitle}>End</Text>
                            </View>

                            <Pressable style={[styles.selectField, { flexDirection: 'row', }]} onPress={openEndDatePicker}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Feather name="calendar" size={20} color="#94A3B8" />
                                </View>
                                <View style={{ justifyContent: 'center', flex: 1, marginStart: 10 }}>
                                    <Text style={{ color: "#94A3B8", fontSize: getFontSize(14), fontFamily: fontsFamily.regularFont, }}
                                    >{endDate ? displayDate(endDate) : storedata.format}</Text>

                                </View>

                            </Pressable>
                        </View>
                    </View>
                }



                <View style={styles.filterActions}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => {
                            resetBtn()
                        }}
                    >
                        <Text style={styles.resetButtonText}>Reset</Text>
                    </TouchableOpacity>

                    <SubmitBtn
                        text={'Apply'}
                        submit={() => {
                            applyBtn()
                        }} />
                </View>
                {
                    Platform.OS === 'ios' && (
                        <Modal visible={iosStartPickerMode} transparent animationType="slide">
                            <View style={[styles.overlay1, { backgroundColor: 'transaparant' }]}>
                                <View style={styles.container1}>

                                    <View style={styles.header1}>
                                        <Pressable onPress={() => {
                                            setIosStartPickerMode(false)
                                        }}>
                                            <Text style={styles.cancel1}>Cancel</Text>
                                        </Pressable>

                                        <Pressable onPress={() => {
                                            setIosStartPickerMode(false)
                                        }}>
                                            <Text style={styles.done1}>Done</Text>
                                        </Pressable>
                                    </View>


                                    <View style={{ alignItems: 'center' }}>
                                        <DateTimePicker
                                            value={new Date(startDate)}
                                            mode="date"
                                            display={'spinner'}
                                            maximumDate={currenDate}
                                            minimumDate={storedata?.first_transaction ? new Date(storedata?.first_transaction) : new Date()}
                                            style={{ backgroundColor: '#fff' }}
                                            textColor="black"   // iOS only
                                            onChange={(e, date) => date && setStartDate(date)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )
                }


                {
                    Platform.OS === 'ios' && (
                        <Modal visible={iosEndPickerMode} transparent animationType="slide">
                            <View style={[styles.overlay1, { backgroundColor: 'transaparant' }]}>
                                <View style={styles.container1}>

                                    <View style={styles.header1}>
                                        <Pressable onPress={() => {
                                            setIosEndPickerMode(false)
                                        }}>
                                            <Text style={styles.cancel1}>Cancel</Text>
                                        </Pressable>

                                        <Pressable onPress={() => {
                                            setIosEndPickerMode(false)
                                        }}>
                                            <Text style={styles.done1}>Done</Text>
                                        </Pressable>
                                    </View>


                                    <View style={{ alignItems: 'center' }}>
                                        <DateTimePicker
                                            value={new Date(endDate)}
                                            mode="date"
                                            display={'spinner'}
                                            maximumDate={currenDate}
                                            minimumDate={new Date(startDate)}
                                            style={{ backgroundColor: '#fff' }}
                                            textColor="black"   // iOS only
                                            onChange={(e, date) => date && setEndDate(date)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )
                }
            </ScrollView>
        </BaseModal>
    )
}
export default Filter

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    filterModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    overlay1: {
        flex: 1,
        justifyContent: "flex-end",
        borderRadius: 8,
    },
    container1: {
        backgroundColor: "#fff",
        paddingBottom: 20,
    },
    header1: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    cancel1: {
        color: "#999",
        fontSize: 16,
    },
    done1: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
    modalTitle: {
        fontSize: getFontSize(20),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#0F172A',
    },
    selectField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#F8FAFC',
    },
    selectFieldText: {
        fontSize: getFontSize(15),
        fontFamily: fontsFamily.regularFont,
        color: '#0F172A',
    },
    modalClose: {
        padding: 4,
    },
    filterSection: {
        marginBottom: 24,
    },
    filterSectionTitle: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 12,
    },
    filterOptionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        gap: 6,
    },
    filterOptionActive: {
        backgroundColor: '#3F2B96',
    },
    filterOptionText: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#64748B',
    },
    filterOptionTextActive: {
        color: '#FFFFFF',
    },
    filterCheck: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resetButtonText: {
        fontSize: getFontSize(15),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#64748B',
    },
    applyButton: {
        flex: 2,
        borderRadius: 14,
        overflow: 'hidden',
    },
    applyButtonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        fontSize: getFontSize(15),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#FFFFFF',
    },
})