import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Animated,
    Dimensions,
    Modal,
    Alert,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useForm, Controller } from 'react-hook-form';
import cardValidator from 'card-validator';
import TopBar from '../../../component/TopBar';
import CommonFunction from '../../../../utill/CommonFunction';
import api from '../../../../service/api';
import { fetchPaymentMethods, clearpaymentDetails } from '../../../../redux/slices/paymentSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getLoginInfo } from '../../../../service/storage';
import { Divider } from 'react-native-paper';
import appLog from '../../../../constants/logger';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { fontsFamily } from '../../../../constants/fontsFamily';
const { width, height } = Dimensions.get('window');


const CARD_COLORS = {
    Visa: ['#1A1F71', '#2D3579'],
    Mastercard: ['#023d29', '#082e12'],
    Amex: ['#1500cf', '#2b0088'],
    default: ['#3c3cd6', '#2633a7'],
};
const getCardColor = (type) => CARD_COLORS[type] || CARD_COLORS.default;

const getProviderDisplayName = (providerId) => {
    if (!providerId) return null;
    return providerId
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


const PaymentCardRow = React.memo(function PaymentCardRow({
    method,
    isSelected,
    onSelect,
    onSetDefault,
    onDeletePress,
}) {
    const methodColors = getCardColor(method.brand || method.type);
    const isDefault = method.default?.toLowerCase() === 'yes';

    return (
        <View style={[styles.methodCard, isSelected && styles.methodCardActive]}>
            <TouchableOpacity
                style={styles.methodContent}
                onPress={() => onSelect(method)}
                activeOpacity={0.8}
            >
                <View style={styles.methodLeft}>
                    <LinearGradient
                        colors={methodColors}
                        style={styles.methodIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.methodIconText}>{(method.name || 'C')[0]}</Text>
                    </LinearGradient>
                    <View>
                        <Text style={styles.methodNumber}>•••• {method.number}</Text>
                        <Text style={styles.methodType}>{method.name}</Text>
                    </View>
                </View>
                <View style={styles.methodRight}>
                    {isDefault && (
                        <View style={styles.defaultBadge}>
                            <Feather name="check" size={10} color="#10B981" />
                            <Text style={styles.defaultText}>Default</Text>
                        </View>
                    )}
                    <View style={[styles.methodRadio, isSelected && styles.methodRadioActive]}>
                        {isSelected && <View style={styles.methodRadioInner} />}
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.cardActions}>
                {!isDefault && (
                    <TouchableOpacity
                        style={styles.setDefaultButton}
                        onPress={() => onSetDefault(method)}
                        activeOpacity={0.7}
                    >
                        <Feather name="star" size={14} color="#3c3cd6" />
                        <Text style={styles.setDefaultText}>Set Default</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.deleteCardButton, isDefault && styles.deleteCardButtonDisabled]}
                    onPress={() => !isDefault && onDeletePress(method)}
                    activeOpacity={0.7}
                    disabled={isDefault}
                >
                    <Feather name="trash-2" size={14} color={isDefault ? '#94A3B8' : '#EF4444'} />
                    <Text style={[styles.deleteCardText, isDefault && styles.deleteCardTextDisabled]}>
                        {isDefault ? 'Default' : 'Delete'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});


const PaymentMethodSkeleton = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SkeletonPlaceholder>
            {/* Selected Card Skeleton */}
            <SkeletonPlaceholder.Item marginBottom={8} width={120} height={15} borderRadius={4} />
            <SkeletonPlaceholder.Item width="100%" height={150} borderRadius={16} marginBottom={20} />

            {/* Section Title Skeleton */}
            <SkeletonPlaceholder.Item marginBottom={12} width={150} height={20} borderRadius={4} />

            {/* List Items Skeleton */}
            {[1, 2, 3].map((item) => (
                <SkeletonPlaceholder.Item key={item} marginBottom={10} borderRadius={14} height={90} width="100%" />
            ))}

            {/* Add Card Button Skeleton */}
            <SkeletonPlaceholder.Item width="100%" height={55} borderRadius={14} borderStyle="dashed" borderWidth={2} marginTop={10} />
        </SkeletonPlaceholder>
    </ScrollView>
);


export default function PaymentMethod({ route }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { provider, name } = route?.params || {};


    const [selectedMethod, setSelectedMethod] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [cardToSetDefault, setCardToSetDefault] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            cardNumber: '',
            cardHolder: '',
            expiryDate: '',
            cvv: '',
        }
    });

    const watchAllFields = watch();

    const slideAnim = useRef(new Animated.Value(height)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    const openAddCardModal = () => {
        setShowAddCardModal(true);
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeAddCardModal = () => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: height,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 0.9,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowAddCardModal(false);
            reset();
        });
    };

    const formatCardNumber = (text) => {
        const cleaned = text.replace(/\s/g, '');
        const chunks = cleaned.match(/.{1,4}/g);
        return chunks ? chunks.join(' ') : '';
    };

    const formatExpiryDate = (text) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    const getCardType = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5')) return 'Mastercard';
        if (cleaned.startsWith('3')) return 'Amex';
        if (cleaned.startsWith('6')) return 'Discover';
        return 'Card';
    };

    const onSubmit = async (data) => {
        const noSpaceCardNumber = data.cardNumber.replace(/\s+/g, '');
        const [month, year] = data.expiryDate.split('/');

        try {
            const cusData = await getLoginInfo();
            const send = {
                id: cusData.id,
                name: data.cardHolder,
                number: noSpaceCardNumber,
                month: month,
                year: year,
                cvc: data.cvv,
                device_name: await CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress(),
            };

            Keyboard.dismiss();
            setIsSubmitting(true);

            const res = await api.post('customer/paymentcards/add', send);
            dispatch(clearpaymentDetails());
            dispatch(fetchPaymentMethods());
            CommonFunction.message(res.data.Message || "Card added successfully");
            closeAddCardModal();
        } catch (error) {
            const errorMsg = error.response?.data?.Message || 'Failed to add card. Please try again.';
            CommonFunction.message(errorMsg, 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };

    const { paymentMethods, paymentloading, error } = useSelector((state) => state.payment);
    const [cards, setCards] = useState(paymentMethods || []);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const refRBSheet = useRef();


    useEffect(() => {
        if (!paymentMethods?.length) {
            dispatch(fetchPaymentMethods());
        }
    }, [dispatch]);



    useEffect(() => {
        if (paymentMethods) {
            setCards(paymentMethods);
            const defcard = paymentMethods.find((m) => m.default?.toLowerCase() === 'yes');
            if (defcard) setSelectedMethod(defcard.pm_id);
        }
    }, [paymentMethods]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);


    const openConfirmModal = useCallback((card) => {
        setCardToDelete(card);
        setShowConfirmModal(true);
    }, []);

    const closeConfirmModal = useCallback(() => {
        setShowConfirmModal(false);
        setCardToDelete(null);
    }, []);


    const handleSetDefault = useCallback((card) => {
        if (card.default?.toLowerCase() === 'yes') return;
        setCardToSetDefault(card);
        refRBSheet.current?.open();
    }, []);


    const confirmSetDefault = useCallback(async () => {
        if (!cardToSetDefault) return;
        setIsLoading(true);
        refRBSheet.current?.close();
        try {
            const cusData = await getLoginInfo();
            const response = await api.get(
                `customer/defpaymentcard/${cardToSetDefault.id}/${cusData.id}?platform=${CommonFunction.getOS()}&device_name=${await CommonFunction.getdevicename()}&ipaddress=${await CommonFunction.getipaddress()}`
            );

            if (response.status === 200) {
                dispatch(clearpaymentDetails());
                dispatch(fetchPaymentMethods());
                CommonFunction.message(response.data.message || "Default card updated");
                setSelectedMethod(cardToSetDefault.pm_id);
            } else {
                CommonFunction.message("Unable to process request", "danger");
            }
        } catch (err) {
            CommonFunction.message("Something went wrong", "danger");
        } finally {
            setIsLoading(false);
            setCardToSetDefault(null);
        }
    }, [cardToSetDefault, dispatch]);

    const handleDeleteCard = useCallback(async () => {
        if (!cardToDelete) return;

        const isDefault = cardToDelete.default?.toLowerCase() === 'yes';

        if (isDefault) {
            Alert.alert(
                'Cannot Delete Default Card',
                'Please set another card as default before deleting this one.',
                [{ text: 'OK' }]
            );
            closeConfirmModal();
            return;
        }

        try {
            const cusData = await getLoginInfo();
            const response = await api.get(
                `customer/deletecard?card=${cardToDelete.pm_id}&customer=${cusData.id}&platform=${CommonFunction.getOS()}&device_name=${await CommonFunction.getdevicename()}&ipaddress=${await CommonFunction.getipaddress()}`
            );

            CommonFunction.message(response.data.message);
            dispatch(clearpaymentDetails());
            dispatch(fetchPaymentMethods());
            closeConfirmModal();
        } catch (err) {
            CommonFunction.message("Something went wrong", "danger");
        }
    }, [cardToDelete, closeConfirmModal, dispatch]);

    const handleSelectMethod = useCallback((method) => {
        setSelectedMethod(method.pm_id);
        handleSetDefault(method);
    }, [handleSetDefault]);

    const selectedCard = useMemo(() => cards.find((m) => m.pm_id === selectedMethod || m.default?.toLowerCase() === 'yes'), [cards, selectedMethod]);
    const cardColors = useMemo(() => getCardColor(selectedCard?.type || 'Visa'), [selectedCard]);
    const providerDisplayName = useMemo(() => getProviderDisplayName(provider), [provider]);



    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <TopBar
                title={name ? name : 'Manage Payment Cards'}
                showBack={true}
                onBackPress={() => navigation.goBack()}
                showAdvance={false}
            />

            {
                paymentloading ? (
                    <PaymentMethodSkeleton />
                ) : (
                    <Animated.ScrollView
                        style={[styles.scrollView]}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >

                        {providerDisplayName &&
                            (
                                <View style={styles.providerInfo}>
                                    <View style={styles.providerInfoIcon}>
                                        <Feather name="check-circle" size={16} color="#10B981" />
                                    </View>
                                    <Text style={styles.providerInfoText}>
                                        Managing cards for: <Text style={styles.providerInfoHighlight}>{providerDisplayName}</Text>
                                    </Text>
                                </View>
                            )
                        }

                        {selectedCard && (
                            <View style={styles.cardContainer}>
                                <Text style={styles.sectionLabel}>Selected Card</Text>
                                <View style={{ height: 150 }}>
                                    <LinearGradient
                                        colors={cardColors}
                                        style={styles.card}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <View style={{ padding: 10 }}>
                                            <View style={styles.cardShine} />
                                            <View style={styles.cardShine2} />

                                            <View style={styles.cardHeader}>
                                                <View style={styles.cardChip}>
                                                    <View style={styles.chipLine} />
                                                    <View style={[styles.chipLine, { width: 20 }]} />
                                                </View>

                                            </View>

                                            <Text style={styles.cardNumber}> **** **** {selectedCard?.number || '**** ****'}</Text>

                                            <View style={styles.cardFooter}>
                                                <View>
                                                    <Text style={styles.cardLabel}>Card Holder</Text>
                                                    <Text style={styles.cardValue}>{selectedCard?.name || 'JOHN DOE'}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.cardLabel}>Expires</Text>
                                                    <Text style={styles.cardValue}>{selectedCard?.ExpMonth + '/' + selectedCard?.ExpYear || 'MM/YY'}</Text>
                                                </View>
                                            </View>

                                            {selectedCard?.default === 'yes' && (
                                                <View style={styles.cardBadge}>
                                                    <Text style={styles.cardBadgeText}>Default</Text>
                                                </View>
                                            )}
                                        </View>
                                    </LinearGradient>
                                </View>
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>All Cards ({cards.length})</Text>


                        {0 < cards?.length && cards.map((method) => (
                            <PaymentCardRow
                                key={method.pm_id}
                                method={method}
                                isSelected={selectedMethod === method.pm_id}
                                onSelect={handleSelectMethod}
                                onSetDefault={handleSetDefault}
                                onDeletePress={openConfirmModal}
                            />
                        ))}

                        <TouchableOpacity
                            style={styles.addCardButton}
                            onPress={openAddCardModal}
                            activeOpacity={0.7}
                        >
                            <Feather name="plus-circle" size={20} color="#3c3cd6" />
                            <Text style={styles.addCardText}>Add New Card</Text>
                        </TouchableOpacity>

                        <View style={styles.bottomPadding} />
                    </Animated.ScrollView>
                )
            }

            <Modal visible={showConfirmModal} transparent animationType="slide" onRequestClose={closeConfirmModal}>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeConfirmModal} />

                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Delete Card</Text>
                            <TouchableOpacity onPress={closeConfirmModal} style={styles.modalClose}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.warningIconContainer}>
                                <View style={styles.warningIcon}>
                                    <Feather name="alert-triangle" size={40} color="#EF4444" />
                                </View>
                            </View>

                            <View style={styles.warningMessage}>
                                <Text style={styles.warningTitle}>Are you sure?</Text>
                                <Text style={styles.warningSubtitle}>
                                    You are about to delete your {cardToDelete?.type} card ending in{' '}
                                    {cardToDelete?.number?.slice(-4)}. This action cannot be undone.
                                </Text>
                            </View>


                            {cardToDelete && (
                                <View style={{ height: 120 }}>
                                    <LinearGradient
                                        colors={getCardColor(cardToDelete.type)}
                                        style={styles.previewCard}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <View style={{ padding: 10 }}>
                                            <View style={styles.previewCardHeader}>
                                                <View style={styles.previewCardChip}>
                                                    <View style={styles.chipLine} />
                                                    <View style={[styles.chipLine, { width: 20 }]} />
                                                </View>
                                                {/* <Text style={styles.previewCardType}>{cardToDelete.type}</Text> */}
                                            </View>

                                            <Text style={styles.previewCardNumber}>{cardToDelete.number}</Text>

                                            <View style={styles.previewCardFooter}>
                                                <View>
                                                    <Text style={styles.previewCardLabel}>Card Holder</Text>
                                                    <Text style={styles.previewCardValue}>{cardToDelete.name}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.previewCardLabel}>Expires</Text>
                                                    <Text style={styles.previewCardValue}>{cardToDelete.ExpMonth}/{cardToDelete.ExpYear}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </View>
                            )}


                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={closeConfirmModal} activeOpacity={0.7}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCard} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#EF4444', '#DC2626']}
                                    style={styles.deleteGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Feather name="trash-2" size={18} color="#FFFFFF" />
                                    <Text style={styles.deleteButtonText}>Delete Card</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <RBSheet
                ref={refRBSheet}
                height={280}
                openDuration={250}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        padding: 24,
                    }
                }}
            >
                <View style={styles.sheetContent}>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Set as Default?</Text>
                        <TouchableOpacity onPress={() => refRBSheet.current?.close()}>
                            <Feather name="x" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                    <Divider />

                    <Text style={styles.sheetSubtitle}>
                        Are you sure you want to set this card as your default payment method?
                    </Text>

                    <View style={{ flex: 1 }} />

                    <View style={styles.sheetActions}>
                        <TouchableOpacity
                            style={styles.sheetCancelButton}
                            onPress={() => refRBSheet.current?.close()}
                        >
                            <Text style={styles.sheetCancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sheetConfirmButton}
                            onPress={confirmSetDefault}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={['#3c3cd6', '#2633a7']}
                                style={styles.sheetConfirmGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.sheetConfirmText}>
                                    {isLoading ? 'Saving...' : 'Set as Default'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>


            <Modal
                visible={showAddCardModal}
                transparent={true}
                animationType="none"
                onRequestClose={closeAddCardModal}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >

                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={closeAddCardModal}
                    />

                    <Animated.View
                        style={[
                            styles.modalContainer, { height: '75%', },
                            {
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim }
                                ]
                            }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Card</Text>
                            <TouchableOpacity onPress={closeAddCardModal} style={styles.modalClose}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Live Card Preview */}

                            <View style={{ height: 150, marginBottom: 20 }}>
                                <LinearGradient
                                    colors={['#3c3cd6', '#2633a7']}
                                    style={styles.previewCard}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <View style={{ padding: 10 }}>

                                        <View style={styles.previewCardHeader}>
                                            <View style={styles.previewCardChip}>
                                                <View style={styles.chipLine} />
                                                <View style={[styles.chipLine, { width: 20 }]} />
                                            </View>
                                            <Text style={styles.previewCardType}>
                                                {watchAllFields.cardNumber ? getCardType(watchAllFields.cardNumber) : 'Visa'}
                                            </Text>
                                        </View>

                                        <Text style={styles.previewCardNumber}>
                                            {watchAllFields.cardNumber || '••••  ••••  ••••  ••••'}
                                        </Text>

                                        <View style={styles.previewCardFooter}>
                                            <View>
                                                <Text style={styles.previewCardLabel}>Card Holder</Text>
                                                <Text style={styles.previewCardValue}>
                                                    {watchAllFields.cardHolder?.toUpperCase() || 'CARDHOLDER NAME'}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={styles.previewCardLabel}>Expires</Text>
                                                <Text style={styles.previewCardValue}>
                                                    {watchAllFields.expiryDate || 'MM/YY'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>



                            {/* Form Fields */}
                            <View style={styles.formContainer}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Card Number</Text>
                                    <Controller
                                        control={control}
                                        name="cardNumber"
                                        rules={{
                                            required: 'Card number is required',
                                            validate: (value) => {
                                                const clean = value.replace(/\s/g, '');
                                                return cardValidator.number(clean).isValid || 'Invalid card number';
                                            }
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={[styles.formInput, errors.cardNumber && styles.formInputError]}
                                                placeholder="1234 5678 9012 3456"
                                                placeholderTextColor="#94A3B8"
                                                onBlur={onBlur}
                                                onChangeText={(text) => {
                                                    const formatted = formatCardNumber(text);
                                                    onChange(formatted);
                                                }}
                                                value={value}
                                                keyboardType="number-pad"
                                                maxLength={19}
                                            />
                                        )}
                                    />
                                    {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber.message}</Text>}
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Cardholder Name</Text>
                                    <Controller
                                        control={control}
                                        name="cardHolder"
                                        rules={{
                                            required: 'Cardholder name is required',
                                            minLength: { value: 3, message: 'Name too short' }
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                style={[styles.formInput, errors.cardHolder && styles.formInputError]}
                                                placeholder="John Doe"
                                                placeholderTextColor="#94A3B8"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                autoCapitalize="characters"
                                            />
                                        )}
                                    />
                                    {errors.cardHolder && <Text style={styles.errorText}>{errors.cardHolder.message}</Text>}
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
                                        <Text style={styles.formLabel}>Expiry Date</Text>
                                        <Controller
                                            control={control}
                                            name="expiryDate"
                                            rules={{
                                                required: 'Required',
                                                validate: (value) => cardValidator.expirationDate(value).isValid || 'Invalid'
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    style={[styles.formInput, errors.expiryDate && styles.formInputError]}
                                                    placeholder="MM/YY"
                                                    placeholderTextColor="#94A3B8"
                                                    onBlur={onBlur}
                                                    onChangeText={(text) => {
                                                        const formatted = formatExpiryDate(text);
                                                        onChange(formatted);
                                                    }}
                                                    value={value}
                                                    keyboardType="number-pad"
                                                    maxLength={5}
                                                />
                                            )}
                                        />
                                        {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate.message}</Text>}
                                    </View>

                                    <View style={[styles.formGroup, { flex: 1 }]}>
                                        <Text style={styles.formLabel}>CVV</Text>
                                        <Controller
                                            control={control}
                                            name="cvv"
                                            rules={{
                                                required: 'Required',
                                                validate: (value) => {
                                                    const cardNumber = watchAllFields.cardNumber;
                                                    const { card } = cardValidator.number(cardNumber);
                                                    const cvvLength = card?.type === 'american-express' ? 4 : 3;
                                                    return cardValidator.cvv(value, cvvLength).isValid || 'Invalid';
                                                }
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    style={[styles.formInput, errors.cvv && styles.formInputError]}
                                                    placeholder="•••"
                                                    placeholderTextColor="#94A3B8"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    keyboardType="number-pad"
                                                    maxLength={4}
                                                    secureTextEntry
                                                />
                                            )}
                                        />
                                        {errors.cvv && <Text style={styles.errorText}>{errors.cvv.message}</Text>}
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.addCardSubmitButton, isSubmitting && { opacity: 0.7 }]}
                                    onPress={handleSubmit(onSubmit)}
                                    activeOpacity={0.8}
                                    disabled={isSubmitting}
                                >
                                    <LinearGradient
                                        colors={['#3c3cd6', '#2633a7']}
                                        style={styles.addCardSubmitGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Text style={styles.addCardSubmitText}>
                                            {isSubmitting ? 'Adding...' : 'Add Card'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animated.View>

                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
    providerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    providerInfoIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    providerInfoText: { fontSize: 13, fontFamily: fontsFamily.mediumFont, color: '#065F46', flex: 1 },
    providerInfoHighlight: { fontFamily: fontsFamily.boldFont, color: '#047857' },
    sectionLabel: {
        fontSize: 13,
        color: '#94A3B8',
        fontFamily: fontsFamily.mediumFont,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardContainer: { marginBottom: 20 },
    card: { borderRadius: 16, width: '100%', height: '100%', position: 'relative', overflow: 'hidden' },
    cardShine: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    cardShine2: {
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cardChip: {
        width: 36,
        height: 28,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 4,
        justifyContent: 'center',
    },
    chipLine: { height: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)', marginVertical: 2, borderRadius: 1 },
    cardType: { color: '#FFFFFF', fontSize: 14, fontFamily: fontsFamily.semiboldFont, letterSpacing: 0.5, marginTop: 10 },
    cardNumber: { color: '#FFFFFF', fontSize: 20, fontFamily: fontsFamily.semiboldFont, letterSpacing: 3, marginBottom: 20 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontFamily: fontsFamily.regularFont, textTransform: 'uppercase', letterSpacing: 1 },
    cardValue: { color: '#FFFFFF', fontSize: 14, fontFamily: fontsFamily.mediumFont, marginTop: 2 },
    cardBadge: {
        position: 'absolute',
        top: 23,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        borderRadius: 12,
        padding: 5
    },
    cardBadgeText: { color: '#FFFFFF', fontSize: 10, fontFamily: fontsFamily.semiboldFont },
    sectionTitle: { fontSize: 16, fontFamily: fontsFamily.semiboldFont, color: '#0F172A', marginBottom: 12 },
    methodCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    methodCardActive: { borderColor: '#3c3cd6', backgroundColor: '#EEF2FF' },
    methodContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
    methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    methodIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    methodIconText: { fontSize: 16, fontFamily: fontsFamily.boldFont, color: '#FFFFFF' },
    methodNumber: { fontSize: 15, fontFamily: fontsFamily.mediumFont, color: '#0F172A' },
    methodType: { fontSize: 12, fontFamily: fontsFamily.regularFont, color: '#94A3B8' ,marginTop:5},
    methodRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 3,
    },
    defaultText: { fontSize: 10, fontFamily: fontsFamily.semiboldFont, color: '#10B981' },
    methodRadio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    methodRadioActive: { borderColor: '#3c3cd6' },
    methodRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3c3cd6' },
    cardActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingVertical: 8,
        paddingHorizontal: 14,
        gap: 8,
    },
    setDefaultButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#EEF2FF',
        gap: 6,
    },
    setDefaultText: { fontSize: 12, fontFamily: fontsFamily.mediumFont, color: '#3c3cd6' },
    deleteCardButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
        gap: 6,
    },
    deleteCardButtonDisabled: { backgroundColor: '#F1F5F9' },
    deleteCardText: { fontSize: 12, fontFamily: fontsFamily.mediumFont, color: '#EF4444' },
    deleteCardTextDisabled: { color: '#94A3B8' },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        gap: 8,
        marginBottom: 20,
    },
    addCardText: { fontSize: 15, fontFamily: fontsFamily.semiboldFont, color: '#3c3cd6' },
    bottomPadding: { height: 20 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalBackdrop: { ...StyleSheet.absoluteFillObject },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        height: '65%',
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontFamily: fontsFamily.boldFont, color: '#0F172A' },
    modalClose: { padding: 4 },
    warningIconContainer: { alignItems: 'center', marginBottom: 16 },
    warningIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    warningMessage: { alignItems: 'center', marginBottom: 20 },
    warningTitle: { fontSize: 18, fontFamily: fontsFamily.boldFont, color: '#0F172A', marginBottom: 8 },
    warningSubtitle: { fontSize: 14, fontFamily: fontsFamily.regularFont, color: '#64748B', textAlign: 'center', lineHeight: 20 },
    previewCard: { borderRadius: 16, marginBottom: 20, position: 'relative', overflow: 'hidden' },
    previewCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    previewCardChip: {
        width: 36,
        height: 28,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 4,
        justifyContent: 'center',
    },
    previewCardType: { color: '#FFFFFF', fontSize: 14, fontFamily: fontsFamily.semiboldFont },
    previewCardNumber: { color: '#FFFFFF', fontSize: 18, fontFamily: fontsFamily.semiboldFont, letterSpacing: 2, marginBottom: 16 },
    previewCardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    previewCardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontFamily: fontsFamily.regularFont, textTransform: 'uppercase', letterSpacing: 1 },
    previewCardValue: { color: '#FFFFFF', fontSize: 14, fontFamily: fontsFamily.mediumFont, marginTop: 2 },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },

    // Sheet Styles
    sheetContent: { flex: 1 },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sheetTitle: { fontSize: 20, fontFamily: fontsFamily.boldFont, color: '#0F172A' },
    sheetSubtitle: { fontSize: 15, fontFamily: fontsFamily.regularFont, color: '#64748B', lineHeight: 22, marginBottom: 24, marginTop: 5 },
    sheetCardPreview: {},
    miniCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, gap: 16 },
    miniCardText: { color: '#FFF', fontSize: 18, fontFamily: fontsFamily.boldFont },
    miniCardSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: fontsFamily.mediumFont },
    sheetActions: { flexDirection: 'row', gap: 12 },
    sheetCancelButton: { flex: 1, height: 56, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    sheetCancelText: { fontSize: 16, fontFamily: fontsFamily.semiboldFont, color: '#64748B' },
    sheetConfirmButton: { flex: 1, height: 56, borderRadius: 14, overflow: 'hidden' },
    sheetConfirmGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    sheetConfirmText: { fontSize: 16, fontFamily: fontsFamily.boldFont, color: '#FFFFFF' },

    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: { fontSize: 15, fontFamily: fontsFamily.semiboldFont, color: '#64748B' },
    deleteButton: { flex: 1, borderRadius: 14, overflow: 'hidden', height: 40 },
    deleteGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, gap: 8 },
    deleteButtonText: { fontSize: 15, fontFamily: fontsFamily.boldFont, color: '#FFFFFF' },

    // Form Styles
    formContainer: { gap: 4 },
    formGroup: { marginBottom: 16 },
    formLabel: { fontSize: 13, fontFamily: fontsFamily.semiboldFont, color: '#0F172A', marginBottom: 6 },
    formInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        fontFamily: fontsFamily.regularFont,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    formInputError: { borderColor: '#EF4444' },
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontFamily: fontsFamily.mediumFont },
    formRow: { flexDirection: 'row' },
    addCardSubmitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
    addCardSubmitGradient: { height: 50, alignItems: 'center', justifyContent: 'center' },
    addCardSubmitText: { fontSize: 16, fontFamily: fontsFamily.boldFont, color: '#FFFFFF' },
});
