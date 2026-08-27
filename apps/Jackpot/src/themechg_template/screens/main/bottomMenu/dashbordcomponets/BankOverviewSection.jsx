import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";
import CommonIcon from "../../../../component/Commonicons";
import CommonFunction from "../../../../../utill/CommonFunction";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import { imgApi } from "../../../../../service/environment";
import CommonRecentTransactions from "./CommonRecentTransactions";


function BankOverviewSection({
  title,
  width,
  themeColors,
  styles,
  getFontSize,
  geticonSize,
  accountArr,
  accId,
  setaccId,
  setShow,
  formatDate,
  date,
  availBal,
  storedata,
  menu,
  statements,
  avgBal,
  loginfo,
  monthlyReport,
  month,
  recentTransation,
  defbank,
  brandata,
  categorydata,
  deftransactionimg,
  formatDateTras,
  formatTime,
  checkColor,
  navigation,
  setIsStatemnet,
}) {
  const renderMenuIcon = (menuItem, color) => {
    if (!menuItem) return null;
    switch (menuItem.iconfamily) {
      case "FontAwesome":
        return <CommonIcon family={"FontAwesome"} name={menuItem.appicon} color={color} size={geticonSize} />;
      case "MaterialIcons":
        return <CommonIcon family={"MaterialIcons"} name={menuItem.appicon} color={color} size={geticonSize} />;
      case "MaterialCommunityIcons":
        return <CommonIcon family={"MaterialCommunityIcons"} name={menuItem.appicon} color={color} size={geticonSize} />;
      case "FontAwesome5":
        return <CommonIcon family={"FontAwesome5"} name={menuItem.appicon} color={color} size={geticonSize} />;
      case "Ionicons":
        return <CommonIcon family={"Ionicons"} name={menuItem.appicon} color={color} size={geticonSize} />;
      case "Feather":
        return <CommonIcon family={"Feather"} name={menuItem.appicon} color={color} size={geticonSize} />;
      default:
        return (
          <Image
            source={{ uri: imgApi + "content/original/" + menuItem.image }}
            resizeMode="contain"
            style={{ height: 12, width: 12 }}
          />
        );
    }
  };

  return (
    <View>
      <View style={{ marginTop: 20, marginStart: 5, flexDirection: "row" }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontFamily: fontsFamily.semiboldFont, color: themeColors.text_primary, fontSize: getFontSize(18) }}>
            Bank Activity Overview
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20, backgroundColor: themeColors?.cardbg, padding: 10, borderRadius: 10, paddingVertical: 30 }}>
        <View style={{ marginTop: 10, flexDirection: "row", bottom: 20 }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View style={{ width: width * 0.5 }}>
              <Dropdown
                data={accountArr}
                value={accId}
                labelField="type"
                valueField="guid"
                activeColor={themeColors?.inputprimary}
                itemTextStyle={{ color: themeColors?.inputsecondary }}
                style={[styles.dropdownreport, { backgroundColor: themeColors?.cardbg, padding: 6, borderWidth: 1, borderColor: themeColors?.bgbtn }]}
                iconColor={themeColors?.inputsecondary}
                containerStyle={{ backgroundColor: themeColors?.cardbg }}
                selectedTextStyle={[styles.reportDropText, { color: themeColors?.inputsecondary, fontFamily: fontsFamily?.mediumFont, fontSize: getFontSize(15) }]}
                onChange={(item) => setaccId(item?.guid)}
              />
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Pressable
              style={{ backgroundColor: themeColors?.bgbtn, end: 10, padding: 8, borderRadius: 6, paddingStart: 20, paddingEnd: 20, flexDirection: "row" }}
              onPress={() => setShow(true)}
            >
              <View>
                <Text style={[styles.textchg, { fontSize: getFontSize(15), fontFamily: fontsFamily?.mediumFont, color: themeColors?.btn_text_color, marginTop: 0 }]}>
                  {formatDate(date)}
                </Text>
              </View>
              <View style={{ justifyContent: "center", marginStart: 10, bottom: 3 }}>
                <FontAwesome name="sort-down" size={geticonSize} color={themeColors?.btn_text_color} />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: "center", marginTop: 10, marginBottom: 10, backgroundColor: themeColors?.iconbg, padding: 12, borderRadius: 5 }}>
          <Text style={[styles.textchg, { fontSize: getFontSize(16), fontFamily: fontsFamily?.semiboldFont, color: themeColors?.text_primary, marginTop: 0, fontWeight: "600" }]}>
            Available Balance : {storedata?.currency}
            {CommonFunction.formatamount(availBal)}
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          {menu["681af87067e4bc206411e41d"] && (
            <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
              <View style={[styles.dashbaordBalIconbg, { backgroundColor: themeColors?.iconbg }]}>
                {renderMenuIcon(menu["681af87067e4bc206411e41d"], themeColors.iconcolor)}
              </View>
              <View style={[styles.dashboardLine]}>
                <Text></Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(15) }]}>{loginfo.currency}</Text>
                  </View>
                  <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(15), color: themeColors?.card_text_color }]}>
                    {CommonFunction.formatamount(0 < statements.length && avgBal?.monavg ? avgBal?.monavg : availBal)}
                  </Text>
                </View>
                <View style={{ marginEnd: 5, marginTop: 10 }}>
                  <Text style={[styles.dashboardamountLable, { color: themeColors?.card_text_color }]}>
                    {menu["67481fc1b2253a1fd8a5b35b"].name}{" "}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {menu["681af89067e4bc206411e457"] && (
            <View style={{ flex: 1, flexDirection: "row", marginStart: 10, marginTop: 20 }}>
              <View style={[styles.dashbaordBalIconbg, { backgroundColor: themeColors?.iconbg }]}>
                {renderMenuIcon(menu["681af89067e4bc206411e457"], themeColors.iconcolor)}
              </View>
              <View style={styles.dashboardLine}>
                <Text></Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(15) }]}>{loginfo.currency}</Text>
                  </View>
                  <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(15), marginStart: 0 }]}>
                    {CommonFunction.formatamount(0 < statements.length && avgBal?.dayavg ? avgBal?.dayavg : availBal)}
                  </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={[styles.dashboardamountLable, { color: themeColors?.card_text_color }]}>
                    {menu["67482018b2253a1fd8a5b394"].name}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={{ flexDirection: "row", marginTop: 25 }}>
          {menu["67482047b2253a1fd8a5b3e9"] && (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={[styles.dashbaordBalIconbg, { backgroundColor: themeColors?.iconbg }]}>
                {renderMenuIcon(menu["67482047b2253a1fd8a5b3e9"], themeColors.success)}
              </View>
              <View style={styles.dashboardLine}>
                <Text></Text>
              </View>
              <View>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={styles.moneyInAmt}>{loginfo.currency}</Text>
                  </View>
                  <Text style={[styles.moneyInAmt, { marginStart: 0 }]}>
                    {CommonFunction.formatamount(monthlyReport[month] ? monthlyReport[month].credit : 0)}
                  </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={[styles.dashboardamountLable, { color: themeColors?.card_text_color }]}>
                    {menu["67482047b2253a1fd8a5b3e9"].name}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {menu["6748205fb2253a1fd8a5b406"] && (
            <View style={{ flex: 1, flexDirection: "row", marginStart: 10 }}>
              <View style={[styles.dashbaordBalIconbg, { backgroundColor: themeColors?.iconbg }]}>
                {renderMenuIcon(menu["6748205fb2253a1fd8a5b406"], themeColors.danger)}
              </View>
              <View style={styles.dashboardLine}>
                <Text></Text>
              </View>
              <View>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={styles.moneyOut}>{loginfo.currency}</Text>
                  </View>
                  <Text style={styles.moneyOut}>
                    {CommonFunction.formatamount(monthlyReport[month] ? monthlyReport[month].debit : 0)}
                  </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={[styles.dashboardamountLable, { color: themeColors?.text_primary }]}>
                    {menu["6748205fb2253a1fd8a5b406"].name}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      <CommonRecentTransactions
        title={title}
        refreshTime={defbank?.refreshtime}
        transactions={recentTransation}
        themeColors={themeColors}
        fontsFamily={fontsFamily}
        styles={styles}
        getFontSize={getFontSize}
        formatDateTras={formatDateTras}
        formatTime={formatTime}
        checkColor={checkColor}
        brandata={brandata}
        categorydata={categorydata}
        deftransactionimg={deftransactionimg}
        currency={storedata?.currency}
        onRefresh={() => setIsStatemnet(true)}
        onViewAll={() => navigation.navigate("BankStatement")}
      />
    </View>
  );
}

export default React.memo(BankOverviewSection);
