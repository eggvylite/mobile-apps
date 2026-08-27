import React from "react";
import { Text } from "react-native";
import MonthPicker from "react-native-month-year-picker";
import CustomModal from "../../../../component/CustomModal";


function DashboardModals({
  isStatement,
  setIsStatemnet,
  ishideRefresh,
  settingcms,
  formatDateTras,
  changeTime1,
  defbank,
  formatDateTime,
  getNewBankStatement,
  themeColors,
}) {
  return (
    <>
      <CustomModal
        visible={isStatement}
        onClose={() => setIsStatemnet(false)}
        alertTitle="Alert!"
        actionText={!ishideRefresh ? "Done" : "Yes"}
        cancelText={!ishideRefresh ? "" : "No"}
        onAction={() => {
          if (!ishideRefresh) {
            setIsStatemnet(false);
          } else {
            getNewBankStatement();
          }
        }}
      >
        <Text style={{ color: themeColors?.card_text_color, textAlign: "center", fontSize: 15 }}>
          {!ishideRefresh
            ? settingcms.refreshmsg +
              "\n " +
              formatDateTras(changeTime1(defbank?.refreshtime)) +
              "  " +
              formatDateTime(changeTime1(defbank?.refreshtime))
            : "Are you sure you want to get new statement?"}
        </Text>
      </CustomModal>
    </>
  );
}

export default DashboardModals;


export function MonthPickerModal({ show, onValueChange, date, minimumDate }) {
  if (!show) return null;
  return <MonthPicker onChange={onValueChange} value={date} minimumDate={minimumDate} maximumDate={new Date()} />;
}
