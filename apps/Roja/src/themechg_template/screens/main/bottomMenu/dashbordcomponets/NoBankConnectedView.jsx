import React from "react";
import { View, ScrollView } from "react-native";
import ConnectBank from "../../connect_bank_account/ConnectBank";
import ReminderWidget from "./reminderWidget";
import OfferCarousel from "./CommonComponents";
import { content } from "../../../../../constants/content";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import { getFontSize } from "../../../../../constants/Font";

/**
 * Shown when the customer has no bank connected yet.
 * Extracted verbatim from the `else` branch of the `isConnect` check.
 */
function NoBankConnectedView({
  navigation,
  isShowoff,
  setIshowoff,
  bankConnect,
  remindedata,
  themeColors,
  calculateDaysAgo,
  formatchDate,
  getcolor,
  storedata,
  styles,
  offerRec,
  width,
  height,

}) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ConnectBank
        screen={"dashboard"}
        onload={(data) => setIshowoff(data)}
        onChange={(data) => bankConnect(data)}
      />

      {isShowoff && (
        <View style={{ marginTop: 0 < remindedata?.length ? 30 : 0, padding: 20 }}>
          {0 < remindedata?.length && (
            <ReminderWidget
              title={"Reminders"}
              remindedata={remindedata}
              navigation={navigation}
              themeColors={themeColors}
              fontsFamily={fontsFamily}
              getFontSize={getFontSize}
              calculateDaysAgo={calculateDaysAgo}
              formatchDate={formatchDate}
              getcolor={getcolor}
              storedata={storedata}
              content={content}
              styles={styles}
            />
          )}
        </View>
      )}

      {isShowoff && 0 < offerRec.length && (
        <View style={{ padding: 20 }}>
          <View>
            <OfferCarousel
              item={""}
              offerRec={offerRec}
              themeColors={themeColors}
              getFontSize={getFontSize}
              styles={styles}
              width={width}
              height={height}
              navigation={navigation}

            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default React.memo(NoBankConnectedView);
