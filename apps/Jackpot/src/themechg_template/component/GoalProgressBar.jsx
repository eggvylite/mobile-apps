import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
} from "react-native-reanimated";

const GoalProgressBar = ({
    total = 0,
    progress = 0,
    height = 12,
    color = "#4CAF50",
}) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme



    const percentage =
        total > 0 ? Math.min((progress / total) * 100, 100) : 0;

    const headerpercent = (data) => {
        if (100 <= percentage) {
            return 100
        } else {
            return percentage
        }

    }


    return (
        <View style={[styles.container, { height }]}>

            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: '100%',
                        backgroundColor: themeColors.barbg,
                        height,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            width: `${headerpercent()}%`,
                            backgroundColor: themeColors.bgbtn,
                            position: 'absolute',
                            height,
                        },
                    ]}
                />
            </Animated.View>
        </View>
    );
};

export default GoalProgressBar;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
    },
    bar: {
        borderRadius: 10,
    },
});
