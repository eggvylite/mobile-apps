import React from 'react';
import { Pressable, Text } from 'react-native';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';


const SubmitButton = ({
  title = "Submit",
  onPress,
  backgroundColor,
  textColor = "#fff",
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          marginTop: 25,
          backgroundColor: backgroundColor,
          padding: 12,
          borderRadius: 8,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          textAlign: 'center',
          color: textColor,
          fontFamily: fontsFamily.semiboldFont,
          fontSize: getFontSize(16),
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default SubmitButton;
