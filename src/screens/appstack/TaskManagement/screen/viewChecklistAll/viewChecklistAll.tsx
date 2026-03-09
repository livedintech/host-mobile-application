import React, { useRef, useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import InputField from '@/components/molecules/Input/InputField';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';

const ViewChecklistAll = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  // State for RefreshableScrollView
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { sectionName: '' },
  });

  // Mock Refresh Logic
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    reset();
  };

  const onAddSection = (data: any) => {
    console.log('New Section:', data.sectionName);
    handleClosePress();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const sections = [
    { id: '1', title: 'Bedroom 1', icon: 'bedroom' },
    { id: '2', title: 'Bedroom 2', icon: 'bedroom' },
    { id: '3', title: 'Bathroom', icon: 'bedroom' },
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        {/* Swapped ScrollView for RefreshableScrollView */}
        <RefreshableScrollView
          style={styles.content}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          isLoading={isPageLoading}
        >
          <AppText
            text="Checklist Management"
            fontSize={28}
            type="Bold"
            lineHeight={32}
            mb={16}
          />
          <AppText
            text="Select the required checklist items for this section. Open the section and choose the checklist(s) you want the user to complete."
            fontSize={14}
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={20}
            mb={24}
          />

          <View style={styles.addSectionContainer}>
            <TouchableOpacity onPress={handleOpenPress}>
              <GlassCard width="auto" style={styles.addSectionBtn}>
                <AppText
                  text="Add Section"
                  fontSize={14}
                  type="Medium"
                  color={Colors.BLACK}
                />
              </GlassCard>
            </TouchableOpacity>
          </View>

          {sections.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                navigate(NavigationRoutes.APP_STACK.CHECKLIST_DETAIL, {
                  title: item.title,
                })
              }
            >
              <GlassCard width="100%" style={styles.cardInternal}>
                <View style={styles.cardRow}>
                  <Svgicons path={item.icon} size={24} />
                  <AppText
                    text={item.title}
                    fontSize={18}
                    type="Medium"
                    ml={16}
                  />
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </RefreshableScrollView>

        <View style={styles.footer}>
          <AppButton
            title="Next"
            backgroundColor={Colors.PRIMARY_TEAL}
            borderColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            onPress={() => {
              navigate(NavigationRoutes.APP_STACK.STAFF_NOTES);
            }}
          />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{ backgroundColor: Colors.SMOOTH_GREY }}
        >
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <AppText text="Add Section" fontSize={24} type="Bold" />
              <TouchableOpacity onPress={handleClosePress}>
                <Svgicons path="closeIcon" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <InputField
                name="sectionName"
                label="Section Name"
                control={control}
                errors={errors}
                placeholder="Kitchen"
                rules={{ required: 'Section name is required' }}
              />
            </View>

            <AppButton
              title="Add"
              mt={20}
              backgroundColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              onPress={handleSubmit(onAddSection)}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  addSectionContainer: { alignItems: 'flex-end', marginBottom: 8 },
  addSectionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cardInternal: { height: 80, justifyContent: 'center', paddingHorizontal: 20 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  footer: {
    paddingHorizontal: 25,
    marginBottom: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  sheetContent: { padding: 25 },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputWrapper: { marginTop: 10 },
});

export default ViewChecklistAll;
