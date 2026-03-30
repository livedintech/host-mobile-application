import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useCreateListingStepOneContainer from './CreateListingStepOneContainer';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Metrics from '@/utility/Metrics';

const CreateListingStepOneScreen = ({ navigation }: any) => {
  const {
    control,
    propertyOptions,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading,
    isChannelMissing,
    isPropertySelected
  } = useCreateListingStepOneContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
            <AppText
              text="Step 1"
              fontSize={18}
              type="Medium"
              color={Colors.BLACK}
              mb={10}
            />

            <AppText
              text="Tell us about your property"
              fontSize={32}
              type="Bold"
              color={Colors.BLACK}
              style={styles.heading}
            />
          </View>
          <View style={{
            marginHorizontal:Metrics.baseMargin
          }}>
          <GlassCard width={'100%'} style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <AppText
                text="Select Property Type"
                fontSize={18}
                type="SemiBold"
                color={Colors.BLACK}
              />
              <GlassCard style={styles.deskIconWrapper}>
                <Svgicons path="living_room" width={24} height={24} />
              </GlassCard>
            </View>

            <Controller
              control={control}
              name="propertyType"
              render={({ field: { onChange, value } }) => (
                <View style={styles.optionsWrapper}>
                  {propertyOptions.map((item) => {
                    const isSelected = value === item.value;
                    return (
                      <GlassCard width={'100%'} style={[
                            styles.optionItem,
                            isSelected && styles.selectedItem
                          ]}>
                        <ButtonView
                          key={item.value}
                          style={[
                            styles.optionItem,
                            // isSelected && styles.selectedItem
                          ]}
                          activeOpacity={0.7}
                          onPress={() => onChange(item.value)}
                        >
                          <View style={styles.optionIcon}>
                            <Svgicons path={item.icon} width={20} height={20} stroke={Colors.BLACK} />
                          </View>
                          <AppText
                            text={item.label}
                            fontSize={16}
                            type="Regular"
                            color={Colors.BLACK}
                          />
                        </ButtonView>
                      </GlassCard>
                    );
                  })}
                </View>
              )}
            />
          </GlassCard>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title="Next"
            onPress={handleSubmit(onNext)}
            fontSize={16}
            mb={15}
            loading={isLoading}
            disabled={isChannelMissing || !isPropertySelected}
          />

          <AppButton
            title="Save & Exit"
            onPress={onSaveExit}
            fontSize={16}
            disabled={isLoading || isChannelMissing || !isPropertySelected}
          />
        </View>

      </View>
    </BGImage>
  );
};

export default CreateListingStepOneScreen;

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 166, 138, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 166, 138, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  heading: {
    marginTop: 10,
    lineHeight: 40,
  },
  cardContainer: {
    padding: Metrics.scale(20),
    borderRadius: 21,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  deskIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsWrapper: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius:17,
    paddingHorizontal: Metrics.scale(10),
    paddingVertical: Metrics.verticalScale(10)
  },
  selectedItem: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.WHITE,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionIcon: {
    marginRight: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 'auto',
  },
});