import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { themeColors } from '../template_basic/Common';
import CommonIcon from './Commonicons';


const AppCommonModal = ({
    visible,
    title = 'Alert',
    message = '',
    icon = 'alert-circle',
    iconColor = '#DC2626',
    iconBackground = '#FEE2E2',
    confirmText = 'Done',
    cancelText = 'Cancel',
    showCancel = true,
    onConfirm,
    onCancel,
    loading = false,
    bankIcon = false,
    iconName,
    iconFamilty,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>

                <View style={styles.modalBackdrop} />

                <View style={styles.modalContainer}>

                    {/* Title */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {title}
                        </Text>
                    </View>

                    {/* Icon */}
                    <View style={styles.warningIconContainer}>
                        <View
                            style={[
                                styles.warningIcon,
                                {
                                    backgroundColor: iconBackground,
                                },
                            ]}
                        >
                            {
                                bankIcon ? <CommonIcon name={iconName} family={iconFamilty} color={iconColor} /> : <Feather
                                    name={icon}
                                    size={40}
                                    color={iconColor}
                                />
                            }

                        </View>
                    </View>

                    {/* Dynamic Message */}
                    <Text style={styles.warningSubtitle}>
                        {message}
                    </Text>

                    {/* Buttons */}
                    <View style={styles.modalActions}>

                        {showCancel && (
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onCancel}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {
                            loading ? <Pressable
                                style={styles.confirmButton}

                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[themeColors.primarColor, themeColors.primarColor]}
                                    style={styles.confirmGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        Loading...
                                    </Text>
                                </LinearGradient>
                            </Pressable> : <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={onConfirm}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[themeColors.primarColor, themeColors.primarColor]}
                                    style={styles.confirmGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        {confirmText}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        }


                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default AppCommonModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },

    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },

    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
    },

    warningIconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },

    warningIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    warningSubtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },

    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },

    cancelButton: {
        flex: 1,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },

    confirmButton: {
        flex: 1,
        height: 44,
        borderRadius: 14,
        overflow: 'hidden',
    },

    confirmGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    confirmButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});