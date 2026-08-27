import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import CardGradient from "../../../../component/Cardgradiend";
import CommonIcon from "../../../../component/Commonicons";
import CommonFunction from "../../../../../utill/CommonFunction";
import { fontsFamily } from "../../../../../constants/fontsFamily";

/**
 * Renders either:
 *  - the "Active" subscription card (outstanding / pay now), or
 *  - the "No plan / failed" upsell card
 * Extracted verbatim from Dashboard.js return block.
 */
function AdvanceSubscriptionCard({
  navigation,
  subscription,
  loginfo,
  dashboardLabel,
  storedata,
  activeSub,
  totalBill,
  minAmount,
  maxAmount,
  themeColors,
  styles,
  getFontSize,
}) {
  if (subscription?.status === "Active") {
    return (
      <CardGradient>
        <View
          style={{
            flexDirection: "row",
            padding: 12,
            borderRadius: 12,
            borderBottomWidth: 1,
            borderBottomColor: themeColors?.card_text_color,
            paddingBottom: 15,
          }}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", paddingStart: 10 }}>
            <Text
              style={[
                styles.textchg,
                { fontSize: getFontSize(16), fontFamily: fontsFamily?.semiboldFont, color: themeColors?.card_text_color },
              ]}
            >
              {dashboardLabel?.labels?.[3]?.message}
            </Text>
            <Text
              style={[
                styles.textchg,
                { fontSize: getFontSize(24), fontFamily: fontsFamily?.semiboldFont, marginTop: 10, color: themeColors?.card_text_color },
              ]}
            >
              {storedata.currency}
              {CommonFunction.formatamount(activeSub?.plan_cash_upto ? activeSub?.plan_cash_upto : 0)}
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "flex-end", paddingEnd: 10 }}>
            <View style={{ backgroundColor: themeColors?.iconbg, padding: 10, borderRadius: 30 }}>
              <CommonIcon family={"FontAwesome"} name={"credit-card-alt"} size={20} color={themeColors?.bgbtn} />
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", padding: 12, borderRadius: 12 }}>
          <View style={{ justifyContent: "center" }}>
            <CommonIcon family={"MaterialDesignIcons"} name={"trending-up"} size={30} color={themeColors?.bgbtn} />
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", paddingStart: 10, marginStart: 5 }}>
            {0 < totalBill ? (
              <View>
                <Text
                  style={[styles.textchg, { fontSize: getFontSize(14), fontFamily: fontsFamily?.semiboldFont, color: themeColors?.card_text_color }]}
                >
                  Current Outstanding
                </Text>
                <Text
                  style={[
                    styles.textchg,
                    { fontSize: getFontSize(18), fontFamily: fontsFamily?.semiboldFont, marginTop: 10, color: themeColors?.card_text_color },
                  ]}
                >
                  {storedata.currency}
                  {CommonFunction.formatamount(0 < totalBill ? totalBill : 0)}
                </Text>
              </View>
            ) : (
              <View>
                <Text
                  style={[styles.textchg, { fontSize: getFontSize(14), fontFamily: fontsFamily?.semiboldFont, color: themeColors?.card_text_color }]}
                >
                  {dashboardLabel?.labels?.[4]?.message}
                </Text>
                <Text
                  style={[
                    styles.textchg,
                    { fontSize: getFontSize(18), fontFamily: fontsFamily?.semiboldFont, marginTop: 10, color: themeColors?.card_text_color },
                  ]}
                >
                  {storedata.currency}
                  {CommonFunction.formatamount(activeSub?.plan_cash_upto ? activeSub?.plan_cash_upto : 0)}
                </Text>
              </View>
            )}
          </View>
          <View style={{ justifyContent: "center", alignItems: "flex-end", paddingEnd: 10 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                padding: 8,
                borderRadius: 5,
                backgroundColor: themeColors?.bgbtn,
                paddingStart: 20,
                paddingEnd: 20,
              }}
              onPress={() => {
                if (0 < totalBill) {
                  navigation.navigate("Payment");
                } else {
                  navigation.navigate("Getadvance", {
                    mimamonu: minAmount,
                    maxAmount: maxAmount,
                    activeSub: activeSub,
                    currency: storedata?.currency,
                  });
                }
              }}
            >
              <View>
                <Text style={{ color: "white", fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(15) }}>
                  {0 < totalBill ? "Pay Now" : dashboardLabel?.labels?.[5]?.message}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CardGradient>
    );
  }

  if (loginfo?.plan === "No" || subscription?.status === "Failed") {
    return (
      <CardGradient>
        <View style={{ padding: 12, borderRadius: 12 }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ backgroundColor: themeColors?.iconbg, padding: 20, borderRadius: 40 }}>
              <CommonIcon name={"cash-check"} size={28} color={themeColors.iconcolor} family={"MaterialDesignIcons"} />
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingStart: 10, marginTop: 10 }}>
            <Text style={[styles.textchg, { fontSize: getFontSize(16), fontFamily: fontsFamily?.semiboldFont, color: themeColors?.card_text_color }]}>
              {dashboardLabel?.labels?.[1]?.message}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "center", marginTop: 15, marginBottom: 10 }}>
            <Pressable
              style={{ backgroundColor: themeColors?.bgbtn, padding: 8, borderRadius: 6, paddingStart: 20, paddingEnd: 20, flexDirection: "row" }}
              onPress={() => navigation.navigate("Advance")}
            >
              <View>
                <Text style={[styles.textchg, { fontSize: getFontSize(15), fontFamily: fontsFamily?.mediumFont, color: themeColors?.btn_text_color, marginTop: 0 }]}>
                  {dashboardLabel?.labels?.[2]?.message}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </CardGradient>
    );
  }

  return null;
}

export default React.memo(AdvanceSubscriptionCard);
