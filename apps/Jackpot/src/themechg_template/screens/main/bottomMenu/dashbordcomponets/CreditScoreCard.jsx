import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import SpeedMeter from "../../creditscore/SpeedMeter";
import CommonFunction from "../../../../../utill/CommonFunction";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import { getFontSize } from "../../../../../constants/Font";

/**
 * Credit score card: speedometer + score label + refresh/report CTAs.
 * Extracted verbatim from Dashboard.js.
 */
function CreditScoreCard({
  title,
  creditaount,
  scoredata,
  btnvisible,
  themeColors,
  styles,
  navigation,
  refreshScore,
}) {
  return (
    <View style={{ backgroundColor: themeColors?.cardbg, borderRadius: 5, paddingBottom: 20 }}>
      <View style={{ marginTop: 10 }}>
        <View style={{ marginTop: 10, backgroundColor: themeColors?.cardbg, padding: 10 }}>
          {creditaount == "0" ? (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: themeColors?.card_text_color, textAlign: "center", fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(18) }}>
                {title}
              </Text>
            </View>
          ) : (
            <Text style={{ color: themeColors?.card_text_color, textAlign: "center", fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(18) }}>
              Check Your Credit Score
            </Text>
          )}

          <View style={{ top: 10 }}>
            <SpeedMeter status={"no"} score={creditaount !== 0 ? creditaount : creditaount} />
          </View>

          {0 < creditaount && (
            <View style={{ alignItems: "center", bottom: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.text, { fontFamily: fontsFamily?.regularFont, fontSize: getFontSize(16), color: themeColors?.card_text_color }]}>
                  Your credit score is{" "}
                </Text>
                <Text style={{ fontFamily: fontsFamily?.boldFont, color: themeColors?.card_text_color, fontSize: getFontSize(16) }}>
                  {CommonFunction.scoreName(scoredata?.data?.score) + " : " + scoredata?.data?.score}
                </Text>
              </View>
            </View>
          )}

          <View style={{ marginTop: scoredata?.data?.score ? "5%" : 0, bottom: scoredata?.data?.score ? 0 : 50 }}>
            {scoredata?.data?.score ? (
              btnvisible ? (
                <View style={{ flexDirection: "row", marginStart: 10, marginEnd: 10 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderColor: themeColors.bgbtn,
                      backgroundColor: "transparent",
                      borderRadius: 8,
                      borderTopLeftRadius: 0,
                      borderWidth: 1,
                      padding: 12,
                      alignItems: "center",
                      marginEnd: 10,
                    }}
                    onPress={() => refreshScore()}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Feather name="refresh-ccw" color={themeColors.bgbtn} size={18} />
                      <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily?.mediumFont, marginStart: 10, color: themeColors.card_text_color }}>
                        Refresh score
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: themeColors.bgbtn, borderRadius: 8, padding: 12, alignItems: "center" }}
                    onPress={() => navigation.navigate("ScoreCheck")}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ backgroundColor: "#fff", padding: 3 }}>
                        <AntDesign name="barschart" size={12} color={"#35B0F4"} />
                      </View>
                      <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily?.mediumFont, marginStart: 10, color: "#fff" }}>
                        View Full Report
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{ backgroundColor: themeColors.bgbtn, borderRadius: 8, padding: 12, alignItems: "center", marginEnd: 10 }}
                    onPress={() => navigation.navigate("ScoreCheck")}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ backgroundColor: "#fff", padding: 3 }}>
                        <AntDesign name="barschart" size={12} color={"#35B0F4"} />
                      </View>
                      <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily?.mediumFont, marginStart: 10, color: "#fff" }}>
                        View Full Report
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: themeColors.bgbtn,
                  borderRadius: 8,
                  padding: 12,
                  alignItems: "center",
                  marginStart: "auto",
                  marginEnd: "auto",
                  paddingHorizontal: 20,
                }}
                onPress={() => navigation.navigate("ScoreCheck")}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily?.mediumFont, marginStart: 10, color: "#fff" }}>
                    Check your score
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(CreditScoreCard);
