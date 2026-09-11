import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, Switch, Animated, LayoutAnimation, Platform, UIManager, Image, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { imgApi } from "../../service/environment";
import { themeColors } from "../Common";
import CloudImage from "../../utill/CloudImage";
import { getFontSize } from '../../constants/Font'
import { fontsFamily } from "../../constants/fontsFamily";
import { useDashboardUtils } from "../../hook/useDashboardUtils";
import { useMenuLogic } from "../../hook/useMenuLogic";
import CommonFunction from "../../utill/CommonFunction";
import { useConnectBankWorkFlow } from "../../hook/useConnectBankWorkFlow";
import { useSelector } from "react-redux";
import { WORKFLOW_CONSTANT } from "../../constants/workflowConstents";
import useFeatureFlow from "../../hook/useFeatureGate";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import appLog from "../../constants/logger";



if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MenuScreen({ visible, onClose, onGetStatement }) {
  const navigation = useNavigation();
  const { formatDate, formatTime } = useDashboardUtils();
  const { workflow } = useFeatureFlow(WORKFLOW_CONSTANT.GETSTATEMENT)
  const insets = useSafeAreaInsets();
  const {
    slideAnim,
    fadeAnim,
    menuWidth,
    expandedSections,
    activeItem,
    isBiomatric,
    cusDetails,
    storedata,
    settingmenu,
    sidehead,
    firstHead,
    isItemDisabled,
    toggleSection,
    updatebiomatric,
    handleLogout,
    navigateScreen,
    bankRefreshMessage,
    isHideRefresh,
    DISABLED_FEATURE_MESSAGE
  } = useMenuLogic(visible, onClose, onGetStatement, navigation, formatDate, formatTime, workflow);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderIcon = (subvalue, geticonSize = 20, color = "#64748B") => {
    const IconComponent = {
      'FontAwesome': FontAwesome,
      'AntDesign': AntDesign,
      'MaterialIcons': MaterialIcons,
      'MaterialCommunityIcons': MaterialCommunityIcons,
      'FontAwesome5': FontAwesome5,
      'Ionicons': Ionicons,
      'Feather': Feather,
    }[subvalue.iconfamily];

    if (IconComponent) {
      return <IconComponent name={subvalue.appicon} color={color} size={geticonSize} />;
    }

    return <Image
      source={{ uri: imgApi + 'content/original/' + subvalue.image }}
      style={{ height: 20, width: 20, tintColor: color }}
      resizeMode='contain'
    />;
  };

  const logoutContent = useMemo(() => {
    return settingmenu.find((obj) => obj.id === '6748267bb2253a1fd8a5b83f');
  }, [settingmenu]);




  const renderMenuItems = () => {
    return (
      <View>
        {settingmenu.map((subvalue, index) => {
          if (subvalue?.id === '67482369b2253a1fd8a5b6af' || subvalue?.id === '6800f07d21000a440c91e584') {
            const disabled = isItemDisabled(subvalue?.id);
            return (
              <View key={`menu-item-${index}`}>
                <TouchableOpacity
                  style={[styles.menuItem, disabled && styles.menuItemDisabled]}
                  onPress={() => { if (!disabled) navigateScreen(subvalue?.id, subvalue?.name) }}
                  activeOpacity={disabled ? 1 : 0.7}
                  disabled={disabled}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuItemIcon}>
                      {renderIcon(subvalue, 20, disabled ? "#CBD5E1" : "#64748B")}
                    </View>
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuItemHeader}>
                        <Text style={[styles.menuItemTitle, disabled && styles.menuItemTitleDisabled]}>
                          {subvalue.name}
                        </Text>
                      </View>
                      <Text style={styles.menuItemDescription}>
                        {disabled ? DISABLED_FEATURE_MESSAGE : subvalue.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            )
          }
          return null;
        })}

        {firstHead.map((item, index) => {
          const isExpanded = expandedSections[item.id];
          return (
            <View key={`head-item-${index}`}>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isExpanded && styles.menuItemExpanded,
                  activeItem === item.id && styles.menuItemActive
                ]}
                onPress={() => toggleSection(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIcon}>
                    {renderIcon(item, 20, isExpanded || activeItem === item.id ? "#5A21F1" : "#64748B")}
                  </View>
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemHeader}>
                      <Text style={[styles.menuItemTitle, isExpanded && styles.menuItemTitleActive]}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                </View>
                <View style={[styles.menuItemRight, styles.menuItemRightGroup]}>
                  <Feather name={isExpanded ? "chevron-up" : "chevron-down"} color={isExpanded ? "#5A21F1" : "#94A3B8"} size={18} />
                </View>
              </TouchableOpacity>


              {isExpanded && (
                <View style={styles.subMenuContainer}>
                  {settingmenu.map((subvalue, subIdx) => {
                    const excludedIds = [
                      '6748267bb2253a1fd8a5b83f',
                      '674823adb2253a1fd8a5b6e7',
                      '6981b7c31445f81db0b4b3e9',
                      '67482369b2253a1fd8a5b6af',
                      '6800f07d21000a440c91e584',
                    ];

                    if (subvalue.group !== item.id || excludedIds.includes(subvalue.id)) {
                      return null;
                    }

                    const disabled = isItemDisabled(subvalue?.id);

                    if (
                      subvalue?.id === '674823ebb2253a1fd8a5b71f' &&
                      !workflow?.enabled
                    ) {
                      return null;
                    }

                    const isDangerItem =
                      subvalue.id === '67f3a555169d7f5660ca89d5';

                    const isRefreshItem =
                      subvalue.id === '674823ebb2253a1fd8a5b71f';

                    const isBiometricItem =
                      subvalue.id === '6981b7c31445f81db0b4b3e9';

                    return (
                      <TouchableOpacity
                        key={`sub-item-${subIdx}`}
                        style={[
                          styles.subMenuItem,
                          isDangerItem && styles.subMenuItemDanger,
                          disabled && styles.subMenuItemDisabled,
                        ]}
                        onPress={() => {
                          if (!disabled && !isBiometricItem) {
                            navigateScreen(subvalue?.id, subvalue?.name);
                          }
                        }}
                        activeOpacity={disabled ? 1 : 0.7}
                        disabled={disabled}
                      >
                        <View style={styles.subMenuItemContent}>
                          <View
                            style={[
                              styles.subMenuItemIcon,
                              isDangerItem && styles.subMenuItemDangerIcon,
                            ]}
                          >
                            {renderIcon(
                              subvalue,
                              16,
                              disabled
                                ? '#CBD5E1'
                                : isDangerItem
                                  ? '#DC2626'
                                  : themeColors?.primarColor
                            )}
                          </View>

                          <View style={styles.subMenuItemTextContainer}>
                            <Text
                              style={[
                                styles.subMenuItemTitle,
                                isDangerItem && styles.subMenuItemDangerText,
                                disabled && styles.subMenuItemTitleDisabled,
                              ]}
                            >
                              {subvalue.name}
                            </Text>

                            <Text style={styles.menuItemDescription}>
                              {disabled
                                ? DISABLED_FEATURE_MESSAGE
                                : isRefreshItem
                                  ? isHideRefresh
                                    ? subvalue.description
                                    : bankRefreshMessage
                                  : subvalue.description}
                            </Text>
                          </View>

                          {isBiometricItem ? (
                            <Switch
                              disabled={
                                disabled ||
                                (storedata?.biometric_status === 'Yes' && isBiomatric)
                              }
                              value={isBiomatric}
                              onValueChange={updatebiomatric}
                              color={themeColors.menu_active_bg}
                              thumbColor={isBiomatric ? '#ffffff' : '#f4f3f4'}
                              trackColor={{
                                false: '#767577',
                                true: themeColors?.primarColor,
                              }}
                              style={{
                                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                              }}
                            />
                          ) : (
                            <Feather
                              name={disabled ? 'lock' : 'chevron-right'}
                              size={18}
                              color="#94A3B8"
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              {index < sidehead.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}

        {settingmenu.map((subvalue, index) => {
          if (subvalue?.id === '6a79bed040e8d43219b12033') {
            const disabled = isItemDisabled(subvalue?.id);
            return (
              <View key={`ewa-item-${index}`}>
                <TouchableOpacity
                  style={[styles.menuItem, disabled && styles.menuItemDisabled]}
                  onPress={() => { if (!disabled) navigateScreen(subvalue?.id, subvalue?.name) }}
                  activeOpacity={disabled ? 1 : 0.7}
                  disabled={disabled}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuItemIcon}>
                      {renderIcon(subvalue, 20, disabled ? "#CBD5E1" : "#64748B")}
                    </View>
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuItemHeader}>
                        <Text style={[styles.menuItemTitle, disabled && styles.menuItemTitleDisabled]}>
                          {subvalue.name}
                        </Text>
                      </View>
                      <Text style={styles.menuItemDescription}>
                        {disabled ? DISABLED_FEATURE_MESSAGE : subvalue.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            )
          }
          return null;
        })}

        {sidehead.map((item, index) => {
          if (item?.id !== '67c2a02917522b2d6464bfae') return null;
          const isExpanded = expandedSections[item.id];
          return (
            <View key={`side-head-${index}`}>
              <TouchableOpacity
                style={[styles.menuItem, isExpanded && styles.menuItemExpanded, activeItem === item.id && styles.menuItemActive]}
                onPress={() => toggleSection(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIcon}>
                    {renderIcon(item, 20, isExpanded || activeItem === item.id ? "#5A21F1" : "#64748B")}
                  </View>
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemHeader}>
                      <Text style={[styles.menuItemTitle, isExpanded && styles.menuItemTitleActive]}>{item.name}</Text>
                    </View>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                </View>
                <View style={[styles.menuItemRight, styles.menuItemRightGroup]}>
                  <Feather name={isExpanded ? "chevron-up" : "chevron-down"} color={isExpanded ? "#5A21F1" : "#94A3B8"} size={18} />
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.subMenuContainer}>
                  {settingmenu.map((subvalue, subIdx) => {
                    if (subvalue.group === item.id && !['6748267bb2253a1fd8a5b83f', '674823adb2253a1fd8a5b6e7', '6981b7c31445f81db0b4b3e9', '67482369b2253a1fd8a5b6af', '6800f07d21000a440c91e584'].includes(subvalue.id)) {
                      const disabled = isItemDisabled(subvalue?.id);
                      return (
                        <TouchableOpacity
                          key={`sub-item-2-${subIdx}`}
                          style={[styles.subMenuItem, subvalue.id === '67f3a555169d7f5660ca89d5' && styles.subMenuItemDanger, disabled && styles.subMenuItemDisabled]}
                          onPress={() => { if (!disabled) navigateScreen(subvalue?.id, subvalue?.name) }}
                          activeOpacity={disabled ? 1 : 0.7}
                          disabled={disabled}
                        >
                          <View style={styles.subMenuItemContent}>
                            <View style={[styles.subMenuItemIcon, subvalue.id === '67f3a555169d7f5660ca89d5' && styles.subMenuItemDangerIcon]}>
                              {renderIcon(subvalue, 16, disabled ? "#CBD5E1" : (subvalue.id === '67f3a555169d7f5660ca89d5' ? "#DC2626" : themeColors?.primarColor))}
                            </View>
                            <View style={styles.subMenuItemTextContainer}>
                              <Text style={[styles.subMenuItemTitle, subvalue.id === '67f3a555169d7f5660ca89d5' && styles.subMenuItemDangerText, disabled && styles.subMenuItemTitleDisabled]}>{subvalue.name}</Text>
                              <Text style={styles.menuItemDescription}>{disabled ? DISABLED_FEATURE_MESSAGE : subvalue.description}</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color={disabled ? "#E2E8F0" : "#94A3B8"} />
                          </View>
                        </TouchableOpacity>
                      )
                    }
                    return null;
                  })}
                </View>
              )}
              {index < sidehead.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
      <Animated.View style={[styles.modalOverlay,]}>
        <Pressable style={styles.overlayTouchable} onPress={onClose} />
        <Animated.View style={[styles.menuContainer, { width: menuWidth, transform: [{ translateX: slideAnim }] }]}>

          <View style={styles.menuTouchable}>
            <LinearGradient colors={themeColors?.gradientColor} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={{ top: '40%' }}>
                <View style={styles.headerContent}>
                  <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                      <View style={styles.profileImage}>
                        {cusDetails?.photo ? (
                          <CloudImage style={{ width: 50, height: 50, borderRadius: 100, borderColor: '#a9a9aa', borderWidth: 1, resizeMode: 'contain' }} page='main' cloudSource={cusDetails?.photo} />
                        ) : (
                          <Text style={styles.profileInitials}>{getInitials(cusDetails?.firstname)}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.greeting}>{cusDetails?.firstname} {cusDetails?.lastname}</Text>
                      <Text style={styles.userEmail} numberOfLines={1}>{CommonFunction.decryptString(cusDetails?.email)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.closeButton, { end: 10 }]} onPress={onClose}>
                    <Feather name="x" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>

            <ScrollView
              style={styles.menuList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.scrollContent]}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                {renderMenuItems()}
              </View>

              <TouchableOpacity onPress={handleLogout} activeOpacity={0.7} style={{ paddingBottom: insets.bottom }}>
                <LinearGradient colors={['#FEF2F2', '#FEE2E2']} style={styles.logoutGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <View style={styles.logoutContent}>
                    <View style={styles.logoutIconContainer}>
                      {renderIcon(logoutContent, 18, "#DC2626")}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.logoutTitle}>{logoutContent?.name || 'Logout'}</Text>
                      <Text style={styles.logoutDescription}>{logoutContent?.description || ' Sign out of your account'}</Text>
                    </View>
                    <Feather name="chevron-right" size={18} color="#DC2626" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayTouchable: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#F8FAFC",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  menuTouchable: {
    flex: 1,
    width: '100%',
  },
  header: {
    height: 150,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    marginLeft: 14,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  profileInitials: {
    fontSize: getFontSize(20),
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10
  },
  greeting: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: getFontSize(13),
    color: "rgba(255,255,255,0.8)",
  },
  closeButton: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    flex: 1,
    paddingTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  menuItemExpanded: {
    borderColor: '#5A21F1',
    backgroundColor: '#EEF2FF',
  },
  menuItemActive: {
    borderColor: '#5A21F1',
    backgroundColor: '#EEF2FF',
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemTitle: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
  },
  menuItemTitleActive: {
    color: '#5A21F1',
  },
  menuItemTitleDisabled: {
    color: '#94A3B8',
  },
  menuItemDescription: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#94A3B8',
    marginTop: 2,
  },
  menuItemRight: {
    paddingLeft: 8,
  },
  menuItemRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  subMenuContainer: {
    marginLeft: 16,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  subMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  subMenuItemDanger: {
    backgroundColor: '#FEF2F2',
  },
  subMenuItemDisabled: {
    opacity: 0.5,
  },
  subMenuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subMenuItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subMenuItemDangerIcon: {
    backgroundColor: '#FEE2E2',
  },
  subMenuItemTextContainer: {
    flex: 1,
  },
  subMenuItemTitle: {
    fontSize: 14,
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
  },
  subMenuItemDangerText: {
    color: '#DC2626',
  },
  subMenuItemTitleDisabled: {
    color: '#94A3B8',
  },
  logoutGradient: {
    borderRadius: 16,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  logoutTitle: {
    fontSize: 15,
    fontFamily: fontsFamily.boldFont,
    color: '#DC2626',
  },
  logoutDescription: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
  },
});