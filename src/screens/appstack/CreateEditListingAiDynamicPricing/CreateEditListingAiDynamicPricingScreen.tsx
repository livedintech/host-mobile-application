import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import useCreateEditListingAiDynamicPricingContainer from './CreateEditListingAiDynamicPricingContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Metrics from '@/utility/Metrics';

const CreateEditListingAiDynamicPricingScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    isLoading,
    selectedMode,
    manualOverride,
    handleModeSelect,
    Controller,
  } = useCreateEditListingAiDynamicPricingContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </GradientBorder>
          <CircularProgress percentage={70} size={48} strokeWidth={4} />
        </View>

        {/* Step Title */}
        <AppText text="Step 6" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" mb={20} />

        {/* Title */}
        <View style={styles.titleRow}>
          <AppText text="Select AI Dynamic Pricing" fontSize={24} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="cardIcon" size={24} />
        </View>

        {/* Conservative Mode Card */}
        <ButtonView
          activeOpacity={0.8}
          onPress={() => handleModeSelect('conservative')}
          style={[
            styles.card,
            selectedMode === 'conservative' && styles.cardSelected,
          ]}
        >
          <AppText text="Conservative Mode" fontSize={18} type="SemiBold" color={Colors.PINE_FOREST} mb={12} />
          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <AppText text="• " fontSize={14} color={Colors.SUPER_GREY} />
              <AppText text="Stable occupancy 📈" fontSize={14} color={Colors.SUPER_GREY} style={styles.bulletText} />
            </View>
            <View style={styles.bulletRow}>
              <AppText text="• " fontSize={14} color={Colors.SUPER_GREY} />
              <AppText text="Fewer vacant nights" fontSize={14} color={Colors.SUPER_GREY} style={styles.bulletText} />
            </View>
            <View style={styles.bulletRow}>
              <AppText text="• " fontSize={14} color={Colors.SUPER_GREY} />
              <AppText text="Slightly lower nightly rate" fontSize={14} color={Colors.SUPER_GREY} style={styles.bulletText} />
            </View>
          </View>
        </ButtonView>

        {/* Aggressive Mode Card */}
        <ButtonView
          activeOpacity={0.8}
          onPress={() => handleModeSelect('aggressive')}
          style={[
            styles.card,
            selectedMode === 'aggressive' && styles.cardSelected,
          ]}
        >
          <AppText text="Aggressive Mode" fontSize={18} type="SemiBold" color={Colors.PINE_FOREST} mb={12} />
          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <AppText text="• " fontSize={14} color={Colors.SUPER_GREY} />
              <AppText text="Higher revenue per stay 💰" fontSize={14} color={Colors.SUPER_GREY} style={styles.bulletText} />
            </View>
            <View style={styles.bulletRow}>
              <AppText text="• " fontSize={14} color={Colors.SUPER_GREY} />
              <AppText text="Premium positioning" fontSize={14} color={Colors.SUPER_GREY} style={styles.bulletText} />
            </View>
            <View style={styles.bulletRow}>
              <AppText text="• " fontSize={14} color={Colors.SUPER_GREY} />
              <AppText text="Lower booking volume" fontSize={14} color={Colors.SUPER_GREY} style={styles.bulletText} />
            </View>
          </View>
        </ButtonView>

        {/* Manual Price Override Toggle */}
        <Controller
          name="manual_price_override"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <AppText text="Manual Price Override" fontSize={16} type="SemiBold" color={Colors.PINE_FOREST} mb={4} />

              </View>
              <CustomSwitch value={value} onToggle={onChange} />
            </View>
          )}

        />
        <AppText
          text="Turn this on to edit prices for specific dates manually. AI pricing will skip these dates until they are unlocked or expire."
          fontSize={13}
          color={Colors.SUPER_GREY}
          style={styles.toggleDescription}
        />
        {/* Error Message */}
        {errors.pricing_mode && (
          <AppText text={errors.pricing_mode.message as string} fontSize={13} color={Colors.INDIAN_RED} mt={10} />
        )}

        {/* Footer Buttons */}
        <View style={styles.footer}>
          {!isEdit && (
            <>
              <AppButton
                title="Next"
                onPress={handleSubmit(onNext)}
                loading={isLoading}
              />
              <AppButton
                title="Save & Exit"
                onPress={handleSubmit(onSaveExit)}
                mt={15}
                disabled={isLoading}
              />
            </>
          )}

          {isEdit && (
            <AppButton
              title="Save & Exit"
              onPress={handleSubmit(onSaveExit)}
              loading={isLoading}
            />
          )}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderWidth: 2,
    borderColor: Colors.SMOOTH_GREY,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardSelected: {
    backgroundColor: '#E0F2F1',
    borderColor: Colors.BRUNSWICK_GREEN,
  },
  bulletList: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletText: {
    flex: 1,
    lineHeight: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Metrics.verticalScale(17),
    marginTop: Metrics.verticalScale(10)
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleDescription: {
    lineHeight: 18,
  },
  footer: { marginTop: 20 },
});

export default CreateEditListingAiDynamicPricingScreen;