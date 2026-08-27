import React,{useContext} from "react";
import { View,useWindowDimensions,Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts"
import CommonFunction from "../../utill/CommonFunction";
function LineChartDiagram(props) {
    const { height, width } = useWindowDimensions();
    return (
        <View>
            <LineChart
                data={props.data}
                height={Dimensions.get("window").height - 350}
                dataPointsShape='rectangular'
                dataPointsHeight={10}
                dataPointsWidth={10}
                dataPointsColor={'#302cd8'}
                thickness1={5}
                width={Dimensions.get("window").width}
                color1={'#5b5ae0'}
                xAxisLabelTextStyle={{ height: 200, width: 100, bottom: 12, fontSize: 12, right: 11 }}
                color2={'#5b5ae0'}
                rotateLabel
                onPress={(data) => CommonFunction.message("Amount : " + data.value)}
                isAnimated


            />
        </View>
    )

}

export default LineChartDiagram