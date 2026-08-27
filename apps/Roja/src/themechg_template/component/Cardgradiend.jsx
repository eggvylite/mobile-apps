import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import getStyles from '../styles';

const CardGradient = ({ children }) => {
  const { themedata } = useSelector((state) => state.appcolor);
  const colors = themedata?.colors || {};
  const gradientEnabled = themedata?.gradient === 'Yes';
  const gradientColors = themedata?.theme?.secondary_gradient || ['#fff', '#fff'];
  const { styles } = getStyles(colors);

  if (gradientEnabled) {
    return (
      <LinearGradient
        colors={gradientColors}

        style={localStyles.container}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[localStyles.container, { backgroundColor: themedata?.theme?.cardbg }]}>
      {children}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default CardGradient;
