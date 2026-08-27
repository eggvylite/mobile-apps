import { View, Dimensions, Text, useColorScheme, AppState, } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import getStyles from '../styles';
import { BarChart } from "react-native-gifted-charts";
import { useSelector } from 'react-redux';
import { getFontSize } from '../../constants/Font';

const DoubleBarChart = (props) => {
  const { height, width } = Dimensions.get('window')
  // const { theme, themeColors } = useContext(ThemeContext);
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  const { styles } = getStyles(themeColors)
  const [amt, setamt] = useState(false)
  const [isVisbleamt, setisVisibleamt] = useState(false)
  const [selectedBar, setSelectedBar] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const barWidth = 40;
  const spacing = 20;
  const chartHeight = props.type === 'report' ? height * 0.3 : height * 0.2



  const handleBarPress = (bar, index, x, y) => {

    var num = 0
    if (index <= 4) {
      num = 1.5
    } else {
      num = 4
    }

    setSelectedBar({ value: parseFloat(bar.value).toFixed(2), label: bar.lab ? bar.lab : bar.label, type: bar.type });
    const barSpacing = (barWidth + spacing) * index + barWidth;
    const xPos = barSpacing + (150 / num - (props.data.length * (barWidth + spacing)) / 8); // Center alignment
    const yPos = (bar.value / num)
    setTooltipPosition({ left: xPos, top: yPos });
    setTimeout(() => {
      setSelectedBar('')
    }, 3000); // 3 seconds delay
  };

  return (
    <View>

      {
        selectedBar &&
        <View style={[styles.tooltip]}>
          <Text style={{ fontSize: getFontSize(14), color: '#fff' }}>{`${selectedBar.label} ${selectedBar.type}: ${props?.currency}${selectedBar.value}`}</Text>
        </View>
      }
      <View>
        <BarChart
          width={width * 0.8}
          height={props.type === 'report' ? height * 0.3 : height * 0.2}
          hideRules
          xAxisColor={'#C3C3C3'}
          yAxisTextStyle={styles.YaxisLabelTextStyle}
          yAxisColor={'#C3C3C3'}
          yAxisThickness={2}
          barBorderRadius={4}
          // showGradient
          // cappedBars
          // capThickness={5}
          // capRadius={4}
          onPress={(bar, index) => handleBarPress(bar, index)}
          xAxisThickness={2}
          xAxisLabelTextStyle={[styles.XaxisLabelTextStyle]}
          data={props.data}
          spacing={spacing}
          intactTopLabel
          barBorderTopLeftRadius={5}
          barBorderTopRightRadius={5}
          barWidth={barWidth}
        />
      </View>

      <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 10 }}>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.insightBarColordiff, { backgroundColor: themeColors.chartincome, borderRadius: 20 }]}></View>
            <View style={{ justifyContent: 'center', marginStart: 5 }}>
              <Text style={styles.insightLabel}>{props.label1}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flex: 1, marginStart: 20 }}>
          <View style={[styles.insightBarColordiff, { backgroundColor: themeColors.chartexpenses, borderRadius: 20 }]}></View>
          <View style={{ justifyContent: 'center', marginStart: 5 }}>
            <Text style={styles.insightLabel}>{props.label2}</Text>
          </View>
        </View>

      </View>
    </View>
  )

}

export default DoubleBarChart

