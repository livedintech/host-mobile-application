import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';

import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import AllTaskContainer from '../../container/AllTaskContainer/AllTaskContainer';

// Native date formatter
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const AllTask = () => {
  const { 
    taskList, meta, isLoading, activeTab, 
    handleTabChange, listingOptions, assigneeOptions, applyFilters 
  } = AllTaskContainer();

  const filterSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { listings: [], assignees: [] },
  });

  const handleOpenFilter = () => filterSheetRef.current?.expand();
  const handleCloseFilter = () => filterSheetRef.current?.close();

  const onApplyFilter = (data: any) => {
    applyFilters(data);
    handleCloseFilter();
  };

  const onResetFilter = () => {
    reset({ listings: [], assignees: [] });
    applyFilters({ listings: [], assignees: [] });
    handleCloseFilter();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  const renderTaskItem = ({ item }: { item: any }) => (
    <GlassCard width="100%" style={styles.taskCard}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, marginBottom: 20 }}>
          <AppText
            text={item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Task'}
            fontSize={22}
            type="Medium"
            color={Colors.BLACK}
            mb={8}
          />
          <AppText
            text={item.listing_title || 'No Location Provided'}
            fontSize={14}
            color={Colors.BLACK}
            mb={16}
            lineHeight={20}
          />
        </View>

        <ButtonView
          onPress={() => navigate(NavigationRoutes.APP_STACK.EDIT_TASK, { taskData: item })}
        >
          <GlassCard width={40} style={styles.editGlassIcon}>
            <Svgicons path="edit_pencil_icon" size={24} />
          </GlassCard>
        </ButtonView>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Svgicons path="userIcon" size={16} />
          <AppText
            text={`Assigned to ${item.assigned_user_name || 'Unassigned'}`}
            fontSize={13}
            ml={10}
            color={Colors.DARK_CHARCOAL}
          />
        </View>
        <View style={styles.infoRow}>
          <Svgicons path="taskCalendar" size={16} />
          <AppText
            text={`Date: ${formatDate(item.date)}`}
            fontSize={13}
            ml={10}
            color={Colors.DARK_CHARCOAL}
          />
        </View>
      </View>
    </GlassCard>
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <AppText text="Task Management" fontSize={26} type="Medium" mb={24} />
      <View style={styles.filterRow}>
        <View style={styles.tabContainer}>
          {['To-do', 'In Progress', 'Complete'].map(tab => (
            <ButtonView
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => handleTabChange(tab)}
            >
              <AppText
                text={tab}
                fontSize={13}
                type="Medium"
                color={activeTab === tab ? Colors.WHITE : Colors.DARK_CHARCOAL_OPACITY_80}
              />
            </ButtonView>
          ))}
        </View>
        <ButtonView style={styles.filterIconButton} onPress={handleOpenFilter}>
          <Svgicons path="filterIcon" size={20} />
        </ButtonView>
      </View>
    </View>
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <FlatListHandler
          data={taskList}
          meta={meta}
          isLoading={isLoading}
          renderItem={renderTaskItem}
          ListHeaderComponent={<ListHeader />}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.actionFooter}>
          <GradientBorder
            borderRadius={14}
            borderWidth={1}
            colors={['rgba(128, 128, 128, 0.66)', 'rgba(255, 255, 255, 0.66)', 'rgba(128, 128, 128, 0.66)']}
            locations={[0, 0.5356, 1]}
            style={styles.gradientMargin}
          >
            <AppButton
              title="Setup Cleaning Schedule"
              style={styles.outlineBtn}
              color={Colors.BLACK}
              onPress={() => navigate(NavigationRoutes.APP_STACK.RECURRING_INITIAL_SCREEN)}
            />
          </GradientBorder>

          <AppButton
            title="Create Task"
            backgroundColor={Colors.PRIMARY_TEAL}
            borderColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            onPress={() => navigate(NavigationRoutes.APP_STACK.CREATE_TASK_NON_CLEANING)}
          />
        </View>

        <BottomSheet
          ref={filterSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{ backgroundColor: Colors.SMOOTH_GREY }}
        >
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <AppText text="Apply Filter" fontSize={24} type="Bold" />
              <ButtonView onPress={onResetFilter}>
                <AppText text="Reset" color={Colors.PRIMARY_TEAL} type="Medium" />
              </ButtonView>
            </View>

            <View style={styles.formContent}>
              <MultiSelectDropdownField
                name="listings"
                label="Select Listing"
                placeholder="Select Multiple Options"
                data={listingOptions}
                control={control}
                errors={errors}
              />

              <View style={{ marginTop: 20 }}>
                <MultiSelectDropdownField
                  name="assignees"
                  label="Select Task Assignee"
                  placeholder="Select Multiple Options"
                  data={assigneeOptions}
                  control={control}
                  errors={errors}
                />
              </View>

              <AppButton
                title="Apply"
                mt={30}
                backgroundColor={Colors.PRIMARY_TEAL}
                borderColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                onPress={handleSubmit(onApplyFilter)}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: 25, paddingTop: Metrics.verticalScale(20), paddingBottom: 220 },
  header: { marginBottom: 20 },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 25, padding: 4, flex: 0.95 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  activeTab: { backgroundColor: Colors.PRIMARY_TEAL },
  filterIconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.4)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)' },
  taskCard: { padding: 24, borderRadius: 28, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  editGlassIcon: { height: 40, borderRadius: 16, justifyContent: 'center', alignItems: 'center', padding: 0 },
  infoContainer: { gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  actionFooter: { position: 'absolute', bottom: Platform.OS === 'ios' ? 40 : 20, left: 25, right: 25 },
  gradientMargin: { marginBottom: 12 },
  outlineBtn: { backgroundColor: '#fff', borderRadius: 13, borderWidth: 0 },
  sheetContent: { padding: 25 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  formContent: { marginTop: 10 },
});

export default AllTask;