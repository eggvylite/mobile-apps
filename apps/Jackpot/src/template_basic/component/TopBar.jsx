import React, { useState, memo, useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, StatusBar, Animated, Easing } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import NotificationModal from "./NotificationModal";
import { getFontSize } from "../../constants/Font";
import { themeColors } from "../Common";
import { useSelector } from "react-redux";
import appLog from "../../constants/logger";

const TopBar = memo(({
  title = "Dashboard",
  onMenuPress,
  showBack = false,
  onBackPress,
  edit,
  onExport,
  screen,
  backgroundColor = "#FFFFFF",
  textColor = "#111827",
  showEWA = true,
  type
}) => {
  const navigation = useNavigation();
  const [notificationVisible, setNotificationVisible] = useState(false);
   const { storedata } = useSelector((state) => state.auth);
  const { cusDetails, cusloading } = useSelector((state) => state.customer);
  const wave1Anim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const wave3Anim = useRef(new Animated.Value(0)).current;



  useEffect(() => {
    if (showEWA) {

      const wave1Sequence = Animated.loop(
        Animated.sequence([
          Animated.timing(wave1Anim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(wave1Anim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      wave1Sequence.start();

      // Wave 2 - Second ripple (offset)
      const wave2Sequence = Animated.loop(
        Animated.sequence([
          Animated.timing(wave2Anim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(wave2Anim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      wave2Sequence.start();

      // Wave 3 - Third ripple (further offset)
      const wave3Sequence = Animated.loop(
        Animated.sequence([
          Animated.timing(wave3Anim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(wave3Anim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      wave3Sequence.start();

      return () => {
        wave1Sequence.stop();
        wave2Sequence.stop();
        wave3Sequence.stop();
      };
    }
  }, [showEWA]);

  // Wave 1 interpolations
  const wave1Scale = wave1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.4, 1.8],
  });
  const wave1Opacity = wave1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.4, 0],
  });

  // Wave 2 interpolations
  const wave2Scale = wave2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.6, 2.2],
  });
  const wave2Opacity = wave2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.2, 0],
  });

  // Wave 3 interpolations
  const wave3Scale = wave3Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.8, 2.6],
  });
  const wave3Opacity = wave3Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.15, 0],
  });


  // Set status bar when component focuses
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(backgroundColor);
      return () => {
        // Reset when leaving screen
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor(backgroundColor);
      };
    }, [backgroundColor])
  );


  const handleBackButton = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation, onBackPress]);

  const handleNotificationPress = useCallback(() => {
    setNotificationVisible(true);
  }, []);

  const closeNotificationModal = useCallback(() => {
    setNotificationVisible(false);
    // Force status bar style when modal closes
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor(backgroundColor);
  }, [backgroundColor]);

  return (
    <>
      <View style={[styles.container, { backgroundColor, borderBottomColor: '#F1F5F9' }]}>
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity onPress={handleBackButton} style={styles.iconButton}>
              <Feather name="arrow-left" size={24} color={textColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
              <Feather name="menu" size={24} color={textColor} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </View>

        <View style={styles.rightContainer}>
          {cusDetails?.wages !== 'Yes' && (
            <TouchableOpacity
              style={styles.ewaButton}
              onPress={() => navigation.navigate('EWADetailScreen')}
              activeOpacity={0.7}
            >
              {
                storedata?.plan === 'Yes' ?
                  <View style={styles.ewaContent}>
                  <FontAwesome name="info-circle" size={22} color="#5A21F1" />
                </View> :
                    <View style={styles.ewaContainer}>
                <Animated.View
                  style={[
                    styles.ewaWave,
                    {
                      transform: [{ scale: wave1Scale }],
                      opacity: wave1Opacity,
                    }
                  ]}
                />
                <Animated.View
                  style={[
                    styles.ewaWave,
                    {
                      transform: [{ scale: wave2Scale }],
                      opacity: wave2Opacity,
                    }
                  ]}
                />
                <Animated.View
                  style={[
                    styles.ewaWave,
                    {
                      transform: [{ scale: wave3Scale }],
                      opacity: wave3Opacity,
                    }
                  ]}
                />
                <View style={styles.ewaContent}>
                  <FontAwesome name="info-circle" size={22} color="#5A21F1" />
                </View>
              </View>
              }

            </TouchableOpacity>
          )}

          {
            type && storedata?.plan === 'Yes' &&
             <TouchableOpacity
            style={styles.advanceButton}
            onPress={() => navigation.navigate('GetAdvance')}
            activeOpacity={0.7}
          >
            <View style={styles.advanceContent}>
              <FontAwesome name="money" size={20} color="#043e0c" />
            </View>
          </TouchableOpacity>
          }



          {onExport && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onExport}
            >
              <FontAwesome name="download" size={20} color={textColor} />
            </TouchableOpacity>
          )}

          {
            title !== 'Create Goal' && title !== "View Reminder" && !onExport  && title !== "Notification" &&
            <TouchableOpacity

              style={styles.iconButton}
              onPress={() => { navigation?.navigate('NotificationDestailsScreen') }}
            >
              <FontAwesome name="bell" size={22} color={textColor} />
            </TouchableOpacity>
          }



          {edit && (
            <TouchableOpacity
              style={styles.topAddButton}
              onPress={edit}>
              <Feather name="edit" size={14} color={themeColors?.primarColor} />
              <Text style={styles.topAddButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      <NotificationModal
        visible={notificationVisible}
        onClose={closeNotificationModal}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
   advanceButton: {
    backgroundColor: '#daffd0',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#258236',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    }),
  },
  topAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors?.buttonLightbackColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  topAddButtonText: {
    fontSize: getFontSize(13),
    fontWeight: '600',
    color: themeColors?.primarColor,
  },


  ewaButton: {
    padding: 4,
    marginLeft: 4,
  },
  ewaContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ewaWave: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(90, 33, 241, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(90, 33, 241, 0.3)',
  },
  ewaContent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EBFF',
    borderWidth: 1,
    borderColor: '#D4C5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  },
  ewaWaveBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5A21F1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
  },
  ewaWaveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});

export default TopBar;