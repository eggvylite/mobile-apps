import React, { useContext, useState } from "react";
import { View, Dimensions, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getFontSize } from "../../constants/Font";
import getStyles from "../styles";
import { useSelector } from "react-redux";
function BarChartDiagram(props) {
    const { height, width } = Dimensions.get('window')
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);




    const [amt, setamt] = useState(false)
    const [isVisbleamt, setisVisibleamt] = useState(false)
    const [selectedBar, setSelectedBar] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const barWidth = 40;
    const spacing = 20;
    const chartHeight = props.screen === 'insights' ? height * 0.28 : height * 0.3


    // const handlePress = () => {
    //     setisVisibleamt(true);

    //     setTimeout(() => {
    //         setamt('')
    //         setisVisibleamt(false);
    //     }, 3000); // 3 seconds delay
    // };
    const handleBarPress = (bar, index, x, y) => {
          console.log(bar,index)

        setSelectedBar({ value: parseFloat(bar.value).toFixed(2), label: bar.label || bar.lab });
        const barSpacing = (barWidth + spacing) * index + barWidth;
        const xPos = barSpacing + (width / 4 - (props.data.length * (barWidth + spacing)) / 2); // Center alignment
        const yPos = chartHeight - (bar.value / 2)

        setTooltipPosition({ left: xPos, top: yPos });
        setTimeout(() => {
            setSelectedBar('')
        }, 3000); // 3 seconds delay
    };

    return (
        <View style={{ marginTop: 20 }}>


            {
                selectedBar &&
                <View style={[styles.tooltip]}>
                    <Text style={{ fontSize: getFontSize(14), color: '#fff' }}>{`${selectedBar.label}:${props?.currency}${selectedBar.value}`}</Text>
                </View>
            }
            <BarChart
                width={props.screen === 'insights' ? width * 0.8 : width * 0.8}
                hideRules
                yAxisTextStyle={styles.YaxisLabelTextStyle}
                xAxisLabelTextStyle={styles.XaxisLabelTextStyle}
                height={props.screen === 'insights' ? height * 0.28 : height * 0.3}
                // yAxisColor={themeColors.chartBorderColor}
                yAxisThickness={2}
                xAxisColor={'#C3C3C3'}
                yAxisColor={'#C3C3C3'}
                xAxisThickness={2}
                autoShiftLabels
                onPress={(bar, index) => handleBarPress(bar, index)}
                data={props.data}
                barWidth={40}
                barBorderTopLeftRadius={5}
                barBorderTopRightRadius={5}
                topLabelTextStyle={{ fontSize: getFontSize(10), color: 'black' }}
            />
        </View>
    )
}
export default BarChartDiagram