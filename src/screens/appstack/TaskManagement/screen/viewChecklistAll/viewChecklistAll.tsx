import { useTranslation } from 'react-i18next';
import React, { useRef, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import InputField from '@/components/molecules/Input/InputField';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import useViewChecklistAllContainer from '../../container/viewChecklistAllContainer/viewChecklistAllContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { getChecklistIcon } from '@/utility/getChecklistIcon';
import Metrics from '@/utility/Metrics';
import HeaderApp from '@/components/molecules/Header/HeaderApp';
import { useTaskStore } from '@/store/taskStore';
import ViewChecklistAllSkeleton from '@/components/Skeletons/ViewChecklistAllSkeleton';

const ViewChecklistAll = () => {
  const {
    taskId,
    taskStatus: storeTaskStatus,
    taskType,
  } = useTaskStore();
  const buttonStatus = storeTaskStatus == "todo" || storeTaskStatus === "inprogress" || storeTaskStatus === "pending" || storeTaskStatus === "template";

  const insets = useSafeAreaInsets(); // Hook to get notch height
  const route = useRoute<any>();
  // const { taskId, fromEdit, taskType } = route.params || {};
  const { fromEdit } = route.params || {};


  const { checklistData, isLoading, addSection, onRefresh } =
    useViewChecklistAllContainer({ taskId, taskType });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['70%'], []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { sectionName: '' },
  });

  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    reset();
  };

  const onAddSectionSubmit = (data: any) => {
    addSection(data.sectionName);
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

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ButtonView
        onPress={() =>
          navigate(NavigationRoutes.APP_STACK.CHECKLIST_DETAIL, {
            title: item.name,
            sectionId: item.id,
            taskId: taskId,
            fromEdit,
          })
        }
      >
        <GlassCard width="100%" style={styles.cardInternal}>
          <View style={styles.cardRow}>
            <Svgicons path={getChecklistIcon(item.key)} size={24} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <AppText text={item.name} fontSize={18} type="Medium" />
            </View>
          </View>
        </GlassCard>
      </ButtonView>
    ),
    [taskId, fromEdit],
  );

  const ListHeader = () => (
    <View>
      {/* HEADER SECTION WITH BACK BUTTON */}

      <AppText
        // text={fromEdit ? 'Post-activity Preview' : 'Checklist Management'}
        text={fromEdit ? t('app.task_management.post_activity_preview') : t('app.task_management.checklist_management')}
        fontSize={28}
        type="Bold"
        // mt={10}
        mb={20}
      />
      <AppText
        text={t('app.task_management.checklist_click_hint')}
        color={Colors.DARK_CHARCOAL_OPACITY}
        fontSize={14}
        type="Regular"
        lineHeight={20}
        mb={30}
      />
      {storeTaskStatus !== 'completed' && (
        <View style={styles.addSectionContainer}>
          <ButtonView onPress={handleOpenPress}>
            <GlassCard width="auto" style={styles.addSectionBtn}>
              <AppText text={t('app.task_management.view_checklist_add_section')} fontSize={14} type="Medium" />
            </GlassCard>
          </ButtonView>
        </View>
      )}
    </View>
  );

  const { t } = useTranslation();
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      {/* Replace SafeAreaView with a standard View + Top Padding */}
      <View style={[styles.container]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <HeaderApp isGoBackAfterLogo />
          <FlatListSimpleHandler
            data={checklistData}
            renderItem={renderItem}
            isLoading={isLoading}
            renderSkeleton={() => <ViewChecklistAllSkeleton />}
            onRefresh={onRefresh}
            contentContainerStyle={styles.listContent}
            HeaderComponent={<ListHeader />}
            ListFooterComponent={<View style={{ height: 120 }} />}
            keyExtractor={item => item.id.toString()}
          />

          {buttonStatus && (
            <View style={[styles.footer, { marginBottom: insets.bottom || 20 }]}>
              <AppButton
                title={t('app.task_management.next')}
                backgroundColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                borderColor={Colors.PRIMARY_TEAL}
                onPress={() => navigate(NavigationRoutes.APP_STACK.STAFF_NOTES)}
              />
            </View>
          )}
        </KeyboardAvoidingView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.sheetIndicator}
        >
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled">
            <View style={styles.sheetHeader}>
              <AppText text={t('app.task_management.view_checklist_add_section')} fontSize={24} type="Medium" />
              <ButtonView
                onPress={handleClosePress}
                style={styles.closeButton}
              >
                <Svgicons
                  path="crossIconTask"
                  size={14}
                  color={Colors.BLACK}
                />
              </ButtonView>
            </View>

            <View style={styles.inputWrapper}>
              <InputField
                name="sectionName"
                label={t('app.task_management.section_name_label')}
                control={control}
                errors={errors}
                placeholder={t('app.task_management.section_name_placeholder')}
                rules={{ required: t('app.task_management.section_required') }}
              />
            </View>

            <AppButton
              title={t('app.task_management.add')}
              mt={25}
              backgroundColor={Colors.PRIMARY_TEAL}
              borderColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              onPress={handleSubmit(onAddSectionSubmit)}
              borderRadius={30}
            />
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: Metrics.verticalScale(10),
  },
  headerActionRow: {
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
  backIconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: -10,
  },
  addSectionContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  addSectionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cardInternal: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 25,
    right: 25,
  },
  // sheetContent: {
  //   padding: 25,
  //   backgroundColor: Colors.TRANSLUCENT_WHITE_C9,
  // },
  // sheetHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 20,
  // },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    zIndex: -999999999,
    position: 'relative',
  },


  // 


  sheetBackground: {
    // This creates the translucent white "Glass" look
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 40,
    // marginHorizontal: 10, 
  },
  sheetIndicator: {
    backgroundColor: '#ccc',
    width: 60,
  },
  sheetContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#BFBFBF',
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    // If your InputField doesn't have a white background, add it here
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // borderRadius: 15,
    // borderWidth: 1,
    // borderColor: '#FFF',
  },
});

export default ViewChecklistAll;
