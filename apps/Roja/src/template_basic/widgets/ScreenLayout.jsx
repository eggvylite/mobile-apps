import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../component/TopBar';
import styles from '../styles/goalStyles';

const ScreenLayout = ({
    title,
    back = true,
    screen = 'Insights',
    onBackPress,
    children,
}) => {
    const navigation = useNavigation();
    const handleBack = () => {
        if (onBackPress) {
            onBackPress()
        } else {
            navigation.goBack()
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <StatusBar backgroundColor={'#F8FAFC'} />
                <TopBar title={title || "Goals"} showBack={back} onBackPress={handleBack} />
                {children}
            </SafeAreaView>

        </View>
    )
}

export default ScreenLayout