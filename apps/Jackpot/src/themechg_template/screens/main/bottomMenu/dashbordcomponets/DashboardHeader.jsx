import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CloudImage from "../../../../../utill/CloudImage";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import CommonIcon from "../../../../component/Commonicons";
import { getFontSize } from "../../../../../constants/Font";

/**
 * Top profile / notification / quick-action row.
 * Pure presentational extraction from Dashboard.js — no logic changed.
 */
function DashboardHeader({
  navigation,
  cusDetails,
  themeColors,
  styles,
  geticonSize,
  notificationdata,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 20,
        marginStart: 10,
        marginEnd: 10,
        marginTop: "2%",
        backgroundColor: themeColors?.cardbg,
        paddingVertical: 10,
        borderRadius: 5,
        paddingHorizontal: 5,
      }}
    >
      <TouchableOpacity
        style={{ marginEnd: 10, marginTop: 5, justifyContent: "center" }}
        onPress={() => navigation.navigate("Profile", { screen: "dashboard" })}
      >
        {cusDetails?.photo ? (
          <CloudImage
            style={{
              width: 55,
              height: 55,
              borderRadius: 100,
              borderColor: themeColors.white,
            }}
            page="main"
            cloudSource={cusDetails?.photo}
          />
        ) : (
          <View
            style={{
              backgroundColor: themeColors.white,
              borderRadius: 50,
              height: 55,
              width: 55,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome5 name="user" size={geticonSize} color={themeColors.dark} />
          </View>
        )}
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={[
            styles.textchg,
            {
              fontSize: getFontSize(20),
              fontFamily: fontsFamily?.mediumFont,
              color: themeColors?.text_primary,
            },
          ]}
        >
          {cusDetails?.firstname} {cusDetails?.lastname}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            end: 5,
            height: 40,
            width: 40,
            backgroundColor: themeColors?.iconbg,
            alignItems: "center",
            borderRadius: 50,
          }}
          onPress={() => navigation.navigate("NotificationData")}
        >
          {0 < Object.keys(notificationdata).length && 0 < notificationdata.count && (
            <View
              style={{
                position: "absolute",
                height: 20,
                width: 20,
                backgroundColor: themeColors.danger,
                borderRadius: 50,
                bottom: 30,
                start: 25,
                top: -2,
                zIndex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: themeColors.white, fontSize: getFontSize(12) }}>
                {10 < notificationdata.count ? "+10" : notificationdata.count}
              </Text>
            </View>
          )}
          <FontAwesome name="bell" size={20} color={themeColors.iconcolor} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Advance")}
          style={{
            height: 40,
            width: 40,
            backgroundColor: themeColors?.iconbg,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            marginEnd: 5,
          }}
        >
          <CommonIcon
            name={"cash-plus"}
            size={24}
            color={themeColors.iconcolor}
            family={"MaterialCommunityIcons"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            AsyncStorage.setItem("screenname", "Dashboard");
            navigation.navigate("Setting");
          }}
          style={{
            height: 40,
            width: 40,
            backgroundColor: themeColors?.iconbg,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
          }}
        >
          <CommonIcon name={"menu"} size={20} color={themeColors.iconcolor} family={"Entypo"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(DashboardHeader);
