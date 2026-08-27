import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// width percentage
export const wp = (percent) => (width * percent) / 100;

// height percentage
export const hp = (percent) => (height * percent) / 100;

// responsive font (based on screen width)
export const rf = (size) => (width / 375) * size;
