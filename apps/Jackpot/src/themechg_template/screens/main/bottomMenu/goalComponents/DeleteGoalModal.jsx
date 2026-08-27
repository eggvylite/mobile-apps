import React, { memo } from 'react';
import { Text } from 'react-native';
import CustomModal from '../../../../component/CustomModal';
import { getFontSize } from '../../../../../constants/Font';

function DeleteGoalModal({ visible, onClose, onConfirm, themeColors }) {
  return (
    <CustomModal visible={visible} onClose={onClose} alertTitle="Delete Goal !" actionText="Yes" cancelText="No" onAction={onConfirm}>
      <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: getFontSize(15) }}>
        Are you sure you want to delete this goal?
      </Text>
    </CustomModal>
  );
}

export default memo(DeleteGoalModal);
