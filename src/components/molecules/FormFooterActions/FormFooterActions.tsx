import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import AppButton from '@/components/molecules/AppButton/AppButton';

// Define the clear, typed properties accepted by our reusable layout component
interface FormFooterActionsProps {
  // Primary (Top Button) Configs
  primaryTitle: string;
  onPrimaryPress: () => void | Promise<void>;
  isPrimaryLoading?: boolean;
  isPrimaryDisabled?: boolean;
  showPrimaryButton?: boolean; // Easily toggle out "Next" button in contexts like "Edit Modes"

  // Secondary (Bottom Button) Configs
  secondaryTitle: string;
  onSecondaryPress: () => void | Promise<void>;
  isSecondaryLoading?: boolean;
  isSecondaryDisabled?: boolean;
  showSecondaryButton?: boolean;

  // Optional styling customization overrides
  containerStyle?: ViewStyle;
}

const FormFooterActions: React.FC<FormFooterActionsProps> = ({
  primaryTitle,
  onPrimaryPress,
  isPrimaryLoading = false,
  isPrimaryDisabled = false,
  showPrimaryButton = true,

  secondaryTitle,
  onSecondaryPress,
  isSecondaryLoading = false,
  isSecondaryDisabled = false,
  showSecondaryButton = true,

  containerStyle,
}) => {
  return (
    <View style={[styles.footer, containerStyle]}>
      {showPrimaryButton && (
        <AppButton
          title={primaryTitle}
          onPress={onPrimaryPress}
          fontSize={16}
          mb={15}
          loading={isPrimaryLoading}
          disabled={isPrimaryDisabled || isPrimaryLoading}
          variant="secondary"
        />
      )}

      {showSecondaryButton && (
        <AppButton
          title={secondaryTitle}
          onPress={onSecondaryPress}
          fontSize={16}
          loading={isSecondaryLoading}
          disabled={isSecondaryDisabled || isSecondaryLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    marginTop: 'auto',
  },
});

export default FormFooterActions;