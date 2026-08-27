import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import ScreenLayout from '../../../widgets/ScreenLayout';
import WorkflowScreen from '../../../widgets/WorkflowScreen';
import NotAvailableScreen from '../../../widgets/NotAvailableScreen';

export default function Insights({ navigation }) {
    return (
        <WorkflowScreen
            settingKey={WORKFLOW_CONSTANT.INSIGHTS}
            navigation={navigation}
            title="Insights"
            screenName="Insights"
        >
            <ScreenLayout title="Insights" back={false}>
                <View style={styles.container}>
                   <NotAvailableScreen />
                </View>
            </ScreenLayout>
        </WorkflowScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'

    }
})
