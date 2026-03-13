import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';

import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate, goBack } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import InputField from '@/components/molecules/Input/InputField';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import useViewChecklistAllContainer from '../../container/viewChecklistAllContainer/viewChecklistAllContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { getChecklistIcon } from '@/utility/getChecklistIcon';

const ViewChecklistAll = () => {
  const route = useRoute<any>();
  const { taskId, fromEdit, taskType } = route.params || {};
  console.log('taskIDINViewCheclist', taskId);

  // Pass navigation params directly to the container
  const { checklistData, isLoading, addSection, onRefresh } =
    useViewChecklistAllContainer({ taskId, taskType });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%'], []);

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
    [taskId],
  );

  const ListHeader = () => (
    <View>
      <AppText
        text={fromEdit ? 'Post-activity Preview' : 'Checklist Management'}
        fontSize={28}
        type="Bold"
        mt={20}
        mb={25}
      />
      <AppText
        text={
          'Click on each section to view images section-wise and verify the condition after the task is completed.'
        }
        color={Colors.DARK_CHARCOAL_OPACITY}
        fontSize={14}
        type="Regular"
        mb={45}
      />
      {!fromEdit && (
        <View style={styles.addSectionContainer}>
          <ButtonView onPress={handleOpenPress}>
            <GlassCard width="auto" style={styles.addSectionBtn}>
              <AppText text="Add Section" fontSize={14} type="Medium" />
            </GlassCard>
          </ButtonView>
        </View>
      )}
    </View>
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <FlatListSimpleHandler
          data={checklistData}
          renderItem={renderItem}
          isLoading={isLoading}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
          HeaderComponent={<ListHeader />}
          ListFooterComponent={<View style={{ height: 120 }} />}
          keyExtractor={item => item.id.toString()}
        />
        {!fromEdit && (
          <View style={styles.footer}>
            <AppButton
              title={fromEdit ? 'Done' : 'Next'}
              backgroundColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              borderColor={Colors.PRIMARY_TEAL}
              onPress={() => {
                if (fromEdit) {
                  goBack();
                } else {
                  navigate(NavigationRoutes.APP_STACK.STAFF_NOTES);
                }
              }}
            />
          </View>
        )}

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <AppText text="Add Section" fontSize={24} type="Bold" />
              <ButtonView onPress={handleClosePress}>
                <Svgicons path="closeIcon" size={24} />
              </ButtonView>
            </View>
            <InputField
              name="sectionName"
              label="Section Name"
              control={control}
              errors={errors}
              placeholder="e.g. Kitchen"
              rules={{ required: 'Required' }}
            />
            <AppButton
              title="Add"
              mt={20}
              backgroundColor={Colors.PRIMARY_TEAL}
              borderColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              onPress={handleSubmit(onAddSectionSubmit)}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: 25 },
  addSectionContainer: { alignItems: 'flex-end', marginBottom: 12 },
  addSectionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cardInternal: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  footer: { position: 'absolute', bottom: 30, left: 25, right: 25 },
  sheetContent: { padding: 25 },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default ViewChecklistAll;
