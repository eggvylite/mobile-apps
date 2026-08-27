import { Platform,PermissionsAndroid } from 'react-native';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { fetchnotiConnect } from '../redux/slices/notificonnectSlice';
import { useDispatch } from 'react-redux';

// export const requestNotificationPermission = async () => {
//   let notificationEnabled = false;
//   let storageGranted = false;
//   try {

//     const authStatus = await messaging().requestPermission();
//     notificationEnabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//     console.log('[Permission] Notifications enabled?', notificationEnabled); // Android 13+ POST_NOTIFICATIONS runtime permission 
//     if (Platform.OS === 'android' && Platform.Version >= 33) {
//       const postGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, { title: 'Notification Permission', message: 'We need permission to send you notifications.', buttonPositive: 'Allow', });
//       console.log('[Permission] Android POST_NOTIFICATIONS result:',
//         postGranted);
//     }

//     if (Platform.OS === 'android') {
//       const writeGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, { title: 'Storage Permission', message: 'We need access to your storage to download files.', buttonPositive: 'Allow', });
//       const readGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, { title: 'Storage Permission', message: 'We need access to your storage to download files.', buttonPositive: 'Allow', });
//       storageGranted = writeGranted === PermissionsAndroid.RESULTS.GRANTED && readGranted === PermissionsAndroid.RESULTS.GRANTED; console.log('[Permission] Storage granted?', storageGranted);
//     }
//     else { storageGranted = true; }
//     return { notificationEnabled, storageGranted };
//   }
//   catch (e) {
//     console.log('[Permission] Error requesting permissions', e);
//     return { notificationEnabled: false, storageGranted: false };
//   }
// };

export const usePushNotification = (onNotificationNavigate) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const setup = async () => {
      await notifee.createChannel({
        id: 'default-channel',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    };

    setup();

    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
   
      try {
        console.log('FCM Message:', remoteMessage);
    
        const title =
          remoteMessage?.notification?.title ||
          remoteMessage?.data?.title ||
          'Notification';
    
        const message =
          remoteMessage?.notification?.body ||
          remoteMessage?.data?.body ||
          'You have a new message';
    
        await notifee.displayNotification({
          title,
          body: message,
          android: {
            channelId: 'default-channel',
            smallIcon: 'roja_foreground',
            pressAction: { id: 'default' },
          },
        });
    
      } catch (error) {
        console.log('Notification Error:', error);
      }
    });

    const unsubscribeOnOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        if (onNotificationNavigate) {
          onNotificationNavigate(remoteMessage.data);
        }
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage && onNotificationNavigate) {
          onNotificationNavigate(remoteMessage.data);
        }
      });

      messaging().setBackgroundMessageHandler(async (remoteMessage) => {

        if (Platform.OS === 'android' && remoteMessage?.data?.message) {
          dispatch(fetchnotiConnect())
        }
  

      });




    return () => {
      unsubscribeOnMessage();
      unsubscribeOnOpened();
    };
  }, []);
};

export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('[FCM Token]', token);
    return token;
  } catch (e) {
    console.log('[FCM] Error getting token', e); return null;
  }
};