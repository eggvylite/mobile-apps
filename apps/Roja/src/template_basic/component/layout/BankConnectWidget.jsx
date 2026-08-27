
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const BankConnectWidget = ({
  image,
  title,
  subtitle,
  items = [],
  buttonText,
  onPressButton,
  footerText,
  footerIcon = 'lock',
}) => {
  return (
    <View style={styles.card}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.mainImage} resizeMode="contain" />
        </View>
      ) : null}

      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {items.length > 0 && (
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <React.Fragment key={item.id ?? index}>
              <View style={styles.itemRow}>
                <View style={styles.itemIconContainer}>
                  <Icon
                    name={item.icon || 'check-circle'}
                    size={18}
                    color={item.iconColor || '#10B981'}
                  />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.description ? (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  ) : null}
                </View>
              </View>
              {index < items.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      )}

      {buttonText ? (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPressButton}>
          <Icon name="check-circle" size={16} color="#FFF" style={styles.btnIcon} />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      ) : null}

      {footerText ? (
        <View style={styles.footerNote}>
          <Icon name={footerIcon} size={14} color="#94A3B8" />
          <Text style={styles.footerNoteText}>{footerText}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width * 0.92,
    maxWidth: 380,
    alignSelf: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#000',
    borderColor: '#E5E7EB',
  },
  imageContainer: {
    width: 140,
    height: 140,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: { width: '100%', height: '100%' },
  title: {
    fontWeight: '700',
    fontSize: 22,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  itemsContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  itemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTextContainer: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 1 },
  itemDescription: { fontSize: 12, color: '#6B7280', lineHeight: 16 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 4 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f61',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#0f0f61',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  btnIcon: { marginRight: 10 },
  buttonText: { fontWeight: '600', fontSize: 16, color: '#FFFFFF' },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 6,
  },
  footerNoteText: { fontSize: 12, color: '#94A3B8' },
});

export default BankConnectWidget;

