import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { Colors } from '@/theme/colors';

import TaskListContainer from '../../containers/TaskList/TaskListContainer';
import { Task } from '@/types/api/taskManagentType';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import AppButton from '@/components/molecules/AppButton/AppButton';

const TaskListScreen: React.FC = () => {
  const {
    tasks,
    taskQuery,
    handleCreateTask,
    handleEditTask,
    control,
    errors,
    handleSubmit,
    onApplyFilter,
    onResetFilter,
    isFilterVisible,
    toggleFilterModal,
    listingDropdown,
    vendorDropdown,
  } = TaskListContainer();

  const dropdownData = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  const renderTaskItem = ({ item }: { item: Task }) => (
    <GradientBorder borderRadius={15} style={styles.gradientWrapper}>
      <View style={styles.taskCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <AppText
            text={item.title}
            type="Bold"
            fontSize={18}
            color={Colors.BRUNSWICK_GREEN}
            style={styles.flex1}
          />
          <TouchableOpacity onPress={() => handleEditTask(item)}>
            <Svgicons path="edit_icon_2" size={22} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <AppText
              text="Description: "
              type="Bold"
              color={Colors.PINE_FOREST}
            />
            <AppText
              text={item.description}
              color={Colors.PINE_FOREST}
              style={styles.flexShrink}
            />
          </View>

          <View style={styles.infoRow}>
            <AppText text="Property: " type="Bold" color={Colors.PINE_FOREST} />
            <AppText
              text={item.listing_title}
              color={Colors.PINE_FOREST}
              style={styles.flexShrink}
            />
          </View>

          <View style={styles.infoRow}>
            <AppText
              text="Assigned To: "
              type="Bold"
              color={Colors.PINE_FOREST}
            />
            <AppText
              text={item.assigned_user_name}
              color={Colors.PINE_FOREST}
            />
          </View>

          <View style={styles.infoRow}>
            <AppText text="Status: " type="Bold" color={Colors.PINE_FOREST} />
            <AppText
              text={item.status.toUpperCase()}
              color={
                item.status === 'todo'
                  ? Colors.ALERT_RED
                  : item.status === 'inprogress'
                  ? Colors.GOLDEN_YELLOW
                  : Colors.TEAL_GREEN
              }
              type="Bold"
            />
          </View>
        </View>
      </View>
    </GradientBorder>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <AppText
            text="Task Management"
            fontSize={26}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
        </View>
        {/* Filter Icon */}
        <TouchableOpacity onPress={toggleFilterModal}>
          <Svgicons path="taskManagementFilterIcon" size={25} />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatListHandler
        data={tasks}
        meta={taskQuery}
        isLoading={taskQuery.isLoading}
        renderItem={renderTaskItem}
        listEmptyText="No tasks found"
        contentContainerStyle={styles.listPadding}
      />

      {/* Filter Modal */}
      <Modal
        isVisible={isFilterVisible}
        onBackdropPress={toggleFilterModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <AppText
              text="Apply Filter"
              fontSize={22}
              type="Bold"
              color={Colors.BRUNSWICK_GREEN}
            />
          </View>

          <MultiSelectDropdownField
            name="listings"
            label="Select Listings"
            control={control}
            errors={errors}
            data={listingDropdown}
            placeholder="Select Multiple Options"
            // rules={{
            //   validate: (value: any[]) =>
            //     value?.length > 0 || 'Please select at least one listing',
            // }}
          />

          <MultiSelectDropdownField
            name="assignee"
            label="Task Assignee"
            control={control}
            errors={errors}
            data={vendorDropdown}
            placeholder="Select Multiple Options"
            // rules={{
            //   validate: (value: any[]) =>
            //     value?.length > 0 || 'Please select assignee',
            // }}
          />

          <MultiSelectDropdownField
            name="status"
            label="Task Status"
            control={control}
            errors={errors}
            data={[
              { label: 'Todo', value: 'todo' },
              { label: 'In Progress', value: 'inprogress' },
              { label: 'Completed', value: 'completed' },
            ]}
            placeholder="Select Multiple Options"
            // rules={{
            //   validate: (value: any[]) =>
            //     value?.length > 0 || 'Please select status',
            // }}
          />

          <View style={styles.modalFooter}>
            <AppButton
              title="Reset"
              onPress={onResetFilter}
              style={styles.flex1}
              mx={5}
            />
            <AppButton
              title="Apply Filter"
              onPress={handleSubmit(onApplyFilter)}
              style={styles.flex1}
              mx={5}
              color={Colors.PINE_FOREST}
            />
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreateTask}>
          <AppText text="Create Task" type="Bold" color={Colors.PINE_FOREST} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskListScreen;

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
  },

  /* Header */
  header: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },

  /* List */
  listPadding: { paddingBottom: 140 },
  gradientWrapper: { marginBottom: 15 },
  taskCard: { backgroundColor: Colors.WHITE, padding: 20, borderRadius: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardContent: { gap: 6 },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },

  /* Footer */
  footer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  createBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Modal */
  modal: { justifyContent: 'center', margin: 20 },
  modalContent: {
    backgroundColor: Colors.WHITE,
    borderRadius: 25,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  /* Helpers */
  flex1: { flex: 1 },
  flexShrink: { flexShrink: 1 },
});
