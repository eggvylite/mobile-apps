import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import { themeColors } from '../Common';

const GradientCard = ({
  colors = ['#6a11cb', '#2575fc'],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,        // override outer card style if needed
  children,     // fully custom inner layout per screen
}) => {
  return (
    <LinearGradient
      colors={themeColors?.gradientColor}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default GradientCard;