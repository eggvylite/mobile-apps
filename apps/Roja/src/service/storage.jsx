import AsyncStorage from '@react-native-async-storage/async-storage';
export const getLoginInfo =async () => {
    const value =
      await AsyncStorage.getItem(
        '@cusLoginInfo',
      );

    return value
      ? JSON.parse(value)
      : null;
  };