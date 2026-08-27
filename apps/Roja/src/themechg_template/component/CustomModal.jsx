import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSelector } from 'react-redux';

const CustomModal = ({
  visible,
  onClose,
  alertTitle,
  children,
  actionText,
  onAction,
  cancelText,
  onCancel,
  icon = "🔔",
}) => {

  const { width, height } = useWindowDimensions();


  const isSmall = width < 360;
  const isLarge = width >= 768;


  const scale = (size) => {
    if (isSmall) return size * 0.85;
    if (isLarge) return size * 1.2;
    return size;
  };

  const isLandscape = width > height;

  const modalWidth = isLarge
    ? 420
    : isLandscape
    ? width * 0.6
    : width * 0.9;


  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata?.theme || {};

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.modalView,
            {
              width: modalWidth,
              padding: scale(20),
              paddingTop: scale(55),
              borderRadius: scale(30),
              backgroundColor: themeColors?.iconbg || "#fff",
            },
          ]}
        >

          <View
            style={[
              styles.alertHead,
              {
                width: scale(75),
                height: scale(75),
                borderRadius: scale(45),
                top: -scale(42),
                backgroundColor: themeColors?.iconbg,
              },
            ]}
          >
            <Text style={{ fontSize: scale(34) }}>{icon}</Text>
          </View>

            {
              onClose &&
              <TouchableOpacity
              style={[
                styles.closeBtn,
                {
                  right: scale(20),
                  top: scale(20),
                  width: scale(30),
                  height: scale(30),
                  borderRadius: scale(15),
                  backgroundColor: themeColors?.iconbg,
                },
              ]}
              onPress={onClose}
            >
              <Text
                style={{
                  fontSize: scale(12),
                  color: themeColors?.iconcolor || "#000",
                  fontWeight: "bold",
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
            }
         


          <View style={styles.content}>

            {alertTitle && (
              <Text
                style={[
                  styles.mainTitle,
                  {
                    fontSize: scale(22),
                    color: themeColors?.card_text_color || "#000",
                  },
                ]}
              >
                {alertTitle}
              </Text>
            )}

            <View style={styles.bodyContent}>{children}</View>


            {(actionText || cancelText) && (
              <View
                style={[
                  styles.buttonContainer,
                  { marginTop: scale(20) },
                ]}
              >
                {cancelText && (
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      styles.secondaryAction,
                      {
                        paddingVertical: scale(14),
                        borderRadius: scale(20),
                      },
                    ]}
                    onPress={ ()=>{
                      if(onCancel) {
                        onCancel()
                      } else {
                        onClose()
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.secondaryActionText,
                        { fontSize: scale(14) },
                      ]}
                    >
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                )}

                {actionText && (
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      {
                        backgroundColor:
                          themeColors?.bgbtn || "#6366F1",
                        paddingVertical: scale(14),
                        borderRadius: scale(20),
                      },
                      !cancelText && { width: "100%" },
                    ]}
                    onPress={onAction}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        { fontSize: scale(14) },
                      ]}
                    >
                      {actionText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
  },

  modalView: {
    alignItems: 'center',
    elevation: 24,
  },

  alertHead: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
  },

  closeBtn: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    width: '100%',
    alignItems: 'center',
  },

  mainTitle: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },

  bodyContent: {
    marginBottom: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },

  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryAction: {
    backgroundColor: '#F1F5F9',
  },

  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  secondaryActionText: {
    color: '#64748B',
    fontWeight: '700',
  },
});