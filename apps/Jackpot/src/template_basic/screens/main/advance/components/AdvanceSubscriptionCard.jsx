import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { fontsFamily } from '../../../../../constants/fontsFamily';


const { width, height } = Dimensions.get('window');

const AdvanceSubscriptionCard = ({

    handleGetAdvance,

}) => {
    const { dashboardLabel } = useSelector((state) => state.labels || {});
    return (
        <>
            <View style={styles.advanceCardContainer}>
                <LinearGradient
                    colors={['#E3ECFF', '#E4D9FF', '#E1F3FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.leftContent}>
                        <Text style={styles.title}>{'Oops! You have no subscription. So kindly subscribe any plan and get cash now.'}</Text>
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.8}
                            onPress={handleGetAdvance}
                        >
                            <Text style={styles.buttonText}>{'Choose Plan'}</Text>
                        </TouchableOpacity>
                    </View>

                </LinearGradient>
            </View>

        </>
    );
};


const styles = StyleSheet.create({
    advanceCardContainer: {
        width: Platform.OS === 'ios' ? width * 1 : width * 0.9,
        alignSelf: 'center',
        marginVertical: 10,
    },
    rightContent: {
        marginRight: 40,
        marginTop: 10
    },
    card: {
        width: '100%',
        height: 125,
        borderRadius: 20,
        flexDirection: 'row',
        aligntypes: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    leftContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 16,
        color: '#000000',
        lineHeight: 24,
        marginBottom: 12,
        textAlign: 'center'

    },
    button: {
        backgroundColor: '#F3F6FD',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    buttonText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 11,
        textAlign: 'center',
        color: '#000000',
    },


});
export default AdvanceSubscriptionCard;
