import React, { useRef, useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';

import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';

const AllTask = () => {
  const [activeTab, setActiveTab] = useState('To-do');
  const filterSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['55%'], []);

  const { control, handleSubmit } = useForm();

  // Mock Data - In a real app, this comes from useInfiniteQuery
  const mockTasks = [
    {
      id: '1',
      title: 'Cleaning Task',
      description: 'Need to clean my apartment properly, along with pictures',
      location: 'Alpha House, Riyadh Street 4',
      assignedTo: 'Amjad Sheikh',
      date: '03 March 2026',
      startTime: '09:00am',
      endTime: '09:00am',
      status: 'To-do',
    }
  ];

  // Mock Meta for FlatListHandler
  const mockMeta: any = {
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: () => {},
    refetch: async () => {},
  };

  const handleOpenFilter = () => filterSheetRef.current?.expand();
  const handleCloseFilter = () => filterSheetRef.current?.close();

  const onApplyFilter = (data: any) => {
    console.log('Filters Applied:', data);
    handleCloseFilter();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ), []
  );

  const renderTaskItem = ({ item }: { item: typeof mockTasks[0] }) => (
    <GlassCard width="100%" style={styles.taskCard}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <AppText text={item.title} fontSize={20} type="Bold" mb={4} />
          {item.description && (
            <AppText text={item.description} fontSize={14} color={Colors.DARK_CHARCOAL_OPACITY} mb={12} />
          )}
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Svgicons path="editIcon" size={18} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Svgicons path="locationIcon" size={16} />
        <AppText text={item.location} fontSize={13} ml={8} color={Colors.DARK_CHARCOAL} />
      </View>
      
      <View style={styles.infoRow}>
        <Svgicons path="userIcon" size={16} />
        <AppText text={`Assigned to ${item.assignedTo}`} fontSize={13} ml={8} />
      </View>

      <View style={styles.infoRow}>
        <Svgicons path="calendarIcon" size={16} />
        <AppText text={`Date: ${item.date}`} fontSize={13} ml={8} />
      </View>

      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }}>
            <View style={styles.infoRow}>
                <Svgicons path="clockIcon" size={16} />
                <AppText text={`Start time: ${item.startTime}`} fontSize={13} ml={8} />
            </View>
            <View style={styles.infoRow}>
                <Svgicons path="checkCircleIcon" size={16} />
                <AppText text={`End time: ${item.endTime}`} fontSize={13} ml={8} />
            </View>
        </View>
        <View style={styles.statusBadge}>
            <AppText text={item.status} fontSize={14} color={Colors.INDIAN_RED} />
        </View>
      </View>
    </GlassCard>
  );

  const HeaderComponent = () => (
    <View style={styles.headerContainer}>
      <AppText text="Task Management" fontSize={28} type="Bold" mb={20} />
      <View style={styles.tabWrapper}>
        <View style={styles.tabs}>
          {['To-do', 'In Progress', 'Complete'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
            >
              <AppText
                text={tab}
                color={activeTab === tab ? Colors.WHITE : Colors.BLACK}
                fontSize={14}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={handleOpenFilter}>
          <Svgicons path="filterIcon" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <FlatListHandler
          data={mockTasks}
          meta={mockMeta}
          isLoading={false}
          renderItem={renderTaskItem}
          HeaderComponent={<HeaderComponent />}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.stickyFooter}>
          <AppButton 
            title="Setup Cleaning Schedule" 
            variant="outline" // Assuming you have a light/outline variant
            onPress={() => {}} 
            mb={12}
          />
          <AppButton 
            title="Create Task" 
            backgroundColor={Colors.PRIMARY_TEAL} 
            onPress={() => {}} 
          />
        </View>

        <BottomSheet
          ref={filterSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <AppText text="Apply Filter" fontSize={24} type="Bold" />
              <TouchableOpacity onPress={handleCloseFilter}>
                <Svgicons path="closeIcon" size={24} />
              </TouchableOpacity>
            </View>

            {/* <View style={styles.filterInputs}>
              <AppText text="Select Listing" fontSize={14} type="Medium" mb={8} />
              <MultiSelectInput
                name="listing"
                control={control}
                placeholder="Select Multiple Options"
              />

              <AppText text="Select Task Assignee" fontSize={14} type="Medium" mb={8} mt={16} />
              <MultiSelectInput
                name="assignee"
                control={control}
                placeholder="Select Multiple Options"
              />
            </View> */}

            <AppButton
              title="Apply"
              backgroundColor={Colors.PRIMARY_TEAL}
              onPress={handleSubmit(onApplyFilter)}
              mt={30}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 150 },
  headerContainer: { marginBottom: 15 },
  tabWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20, padding: 4 },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 18 },
  activeTabBtn: { backgroundColor: Colors.PRIMARY_TEAL },
  filterBtn: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' 
  },
  taskCard: { padding: 20, marginBottom: 16, borderRadius: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8E8E8', justifyContent: 'center', alignItems: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 },
  statusBadge: { 
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    paddingHorizontal: 16, paddingVertical: 8, 
    borderRadius: 12, borderWidth: 1, borderColor: '#DDD' 
  },
  stickyFooter: { position: 'absolute', bottom: 30, width: '100%', paddingHorizontal: 25 },
  sheetContent: { padding: 25 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 20 },
  filterInputs: { marginTop: 20 },
});

export default AllTask;