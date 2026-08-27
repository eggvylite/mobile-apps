import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import GradientBackground from "./GradientBackground";
import { useSelector } from "react-redux";
import getStyles from "../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Dimensions,
} from "react-native";

export const SubscriptionSkeleton = () => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme;

    const { width, height } = Dimensions.get("window");

    const { styles } = getStyles(themeColors);


    const bannerHeight = height * 0.25;
    const cardHeight = height * 0.12;

    return (
        <GradientBackground>
            <SafeAreaView
                style={
                    themedata?.gradient === "No"
                        ? styles.primaryBackground
                        : { flex: 1 }
                }
            >
                <View style={{ margin: 10 }}>
                    <SkeletonPlaceholder
                        backgroundColor={themeColors?.cardbg}
                        highlightColor={themeColors?.backgroundcolor}
                    >

                        <SkeletonPlaceholder.Item
                            height={bannerHeight}
                            borderRadius={10}
                            marginTop={20}
                        />


                        <SkeletonPlaceholder.Item
                            height={cardHeight}
                            borderRadius={10}
                            marginTop={20}
                        />


                        <View
                            style={{
                                flexDirection: "row",
                                gap: 10,
                                marginTop: 10,
                            }}
                        >
                            <SkeletonPlaceholder.Item
                                flex={1}
                                height={cardHeight}
                                borderRadius={10}
                            />
                            <SkeletonPlaceholder.Item
                                flex={1}
                                height={cardHeight}
                                borderRadius={10}
                            />
                        </View>


                        {[1, 2, 3].map((_, index) => (
                            <SkeletonPlaceholder.Item
                                key={index}
                                height={bannerHeight}
                                borderRadius={10}
                                marginTop={20}
                            />
                        ))}
                    </SkeletonPlaceholder>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};