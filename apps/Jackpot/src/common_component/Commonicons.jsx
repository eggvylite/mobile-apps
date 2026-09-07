import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Zocial from "react-native-vector-icons/Zocial";
import MaterialDesignIcons from "react-native-vector-icons/MaterialCommunityIcons";




const DEFAULT_ICON_FAMILY = "MaterialIcons";
const DEFAULT_ICON_NAME = "help-outline";

const CommonIcon = ({ family, name, size = 24, color = "#000", style }) => {
  const IconFamily = {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
    MaterialDesignIcons
  }[family];

  if (!IconFamily || !name) {

    const FallbackFamily = MaterialIcons;
    return (
      <FallbackFamily
        name={DEFAULT_ICON_NAME}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  return <IconFamily name={name} size={size} color={color} style={style} />;
};

export default CommonIcon;
