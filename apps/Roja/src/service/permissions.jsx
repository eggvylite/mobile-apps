import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';

export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');

      console.log('iOS Permission Status:', status);

      return status === 'granted';
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const requestCameraPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'We need access to your camera.',
        buttonPositive: 'Allow',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.log('[Permission] Camera Error:', error);
    return false;
  }
};

export const requestNotificationPermission = async () => {
  let notificationEnabled = false;
  let storageGranted = false;

  try {
    const authStatus = await messaging().requestPermission();

    notificationEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log(
      '[Permission] Notifications Enabled:',
      notificationEnabled
    );

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const postGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'We need permission to send notifications.',
          buttonPositive: 'Allow',
        }
      );

      console.log(
        '[Permission] POST_NOTIFICATIONS:',
        postGranted
      );
    }

    if (Platform.OS === 'android') {
      const writeGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'We need storage access.',
          buttonPositive: 'Allow',
        }
      );

      const readGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'We need storage access.',
          buttonPositive: 'Allow',
        }
      );

      storageGranted =
        writeGranted === PermissionsAndroid.RESULTS.GRANTED &&
        readGranted === PermissionsAndroid.RESULTS.GRANTED;

      console.log(
        '[Permission] Storage Granted:',
        storageGranted
      );
    } else {
      storageGranted = true;
    }

    return {
      notificationEnabled,
      storageGranted,
    };
  } catch (error) {
    console.log('[Permission] Error:', error);

    return {
      notificationEnabled: false,
      storageGranted: false,
    };
  }
};