import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { themeColors } from '../Common';

const ErrorView = ({ message, onRetry }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Feather name="alert-circle" size={50} color="#EF4444" />
                </View>
                <Text style={styles.title}>Oops! Something went wrong</Text>
                <Text style={styles.message}>{message || "We're having trouble loading your data. Please try again."}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 32,
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    retryButton: {
        backgroundColor: '#5A21F1',
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 16,
        width: '100%',
        maxWidth: 200,
        alignItems: 'center',
        shadowColor: '#5A21F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ErrorView;
