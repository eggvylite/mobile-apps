import React from "react";
import { View, ScrollView } from "react-native";
// import ReminderWidget from "./reminderWidget";
// import OfferCarousel from "./CommonComponents";
import { content } from "../../constants/content";
import { fontsFamily } from "../../constants/fontsFamily";
import { getFontSize } from "../../constants/Font";
import appLog from "../../constants/logger";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { WORKFLOW_CONSTANT } from "../../constants/workflowConstents";
import { DASHBOARD_MENU_IDS } from "../../constants/DashboardMenuConstants";
import useDashboardFeatureAccess from "../../hook/useDashboardFeatureAccess";
import { useDashboardUtils } from "../../hook/useDashboardUtils";
import ConnectBank from "../screens/main/connect_bank_account/ConnectBank";
import FuelDiscount from "../screens/main/Offers/FuelDiscount";
import OpenOffers from "./OpenOffers";
import ConnectBankCard from "../widgets/ConnectBankCard";
import InstantFunds from "./InstantFunds";
import TravelInsurance from "../screens/main/dashboard/componets/TravelInsurance";




function NoBankConnectedView({
  navigation,
  setIshowoff,
  bankConnect,
  remindedata,
  offerRec,
  width,
  height,
  dashboardMenu,
  onConnect,
  loading,
  loaderLabel,
  screen

}) {
  const { themeColors } = useDashboardUtils();
  const { isVisible: creditscoreVisible } = useDashboardFeatureAccess(WORKFLOW_CONSTANT.CREDIT_SCORE)
  const { isVisible: offersVisible } = useDashboardFeatureAccess(WORKFLOW_CONSTANT.MARKETPLACE)
  const { isVisible: reminderVisible } = useDashboardFeatureAccess(WORKFLOW_CONSTANT.REMINDER)
  const { dashboardmenudata } = useSelector((state) => state.dashboardmenu);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ConnectBankCard screen={screen} onConnectBankPress={onConnect}  navigation={navigation} />
      {
        0 < dashboardmenudata?.length && <>

          {
            dashboardmenudata.map((value, key) => {
              const renderItem = () => {
                switch (value.id) {
                  case DASHBOARD_MENU_IDS.REMINDER:
                    if (!reminderVisible || remindedata?.length === 0) return null;
                    return (
                      <View style={{ padding: 20 }}>
                        {/* <ReminderWidget
                          title={value?.name}
                          remindedata={remindedata}
                          navigation={navigation}
                        /> */}
                      </View>
                    );

                  case DASHBOARD_MENU_IDS.OFFER_CAROUSEL:
                    if (!offersVisible || offerRec?.length === 0) return null;
                    return (
                      <View> 
                       <InstantFunds />
                       <TravelInsurance navigation={navigation} />
                      </View>

                    );

                  default:
                    return null;
                }
              };

              const content = renderItem();
              if (!content) return null;

              return (
                <View key={key}>
                  {content}

                   
                </View>
              );
            })
          }



        </>
      }




    </ScrollView>
  );
}

export default React.memo(NoBankConnectedView);
