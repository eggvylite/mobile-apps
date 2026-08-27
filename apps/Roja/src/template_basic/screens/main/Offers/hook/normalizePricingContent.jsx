import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

const NormalizePricingContent = ({pricing_content, sellingPrice, renewalDate, renewSellingPrice}) => {
  const navigation = useNavigation();

  const parts = pricing_content.split('{cancellation_policy}');

  const beforePolicy = parts[0];
  const afterPolicy = parts[1];

  const renderTextWithColors = (text) => {
    if (!text) return null;


    const regex = /(\{selling_price\}|\{renewalDate\}|\{renew_selling_price\})/g;
    const segments = text.split(regex);

    return segments.map((segment, index) => {
      if (segment === '{selling_price}') {
        return (
          <Text key={index} style={styles.disclaimerHighlight}>
            {sellingPrice}
          </Text>
        );
      } else if (segment === '{renewalDate}') {
        return (
          <Text key={index} style={styles.disclaimerHighlight}>
            {renewalDate}
          </Text>
        );
      } else if (segment === '{renew_selling_price}') {
        return (
          <Text key={index} style={styles.disclaimerHighlight}>
            {renewSellingPrice}
          </Text>
        );
      }
      return (
        <Text key={index} style={styles.disclaimerText}>
          {segment}
        </Text>
      );
    });
  };

  return (
    <View >
      <Text>
        {renderTextWithColors(beforePolicy)}

        <Text
          style={styles.disclaimerLink}
          onPress={() => {
            navigation.navigate('CancellationPolicy');
          }}>
          cancellation policy
        </Text>

        {renderTextWithColors(afterPolicy)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({



  disclaimerText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  disclaimerHighlight: {
    fontWeight: '700',
    color: '#5A21F1',
  },
  disclaimerLink: {
    fontWeight: '600',
    color: '#5A21F1',
    textDecorationLine: 'underline',
  },


  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4A5568',
  },

  redText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#EF4444',
    fontWeight: '600',
  },

  purpleText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6366F1',
    fontWeight: '600',
  },

});

export default NormalizePricingContent;