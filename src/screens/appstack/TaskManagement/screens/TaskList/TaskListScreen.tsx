import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  SafeAreaView,
} from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import Modal from 'react-native-modal';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import TaskListContainer from '../../containers/TaskList/TaskListContainer';
import NoTaskScreen from '../NoTask/NoTaskScreen';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types/api/taskManagentType';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import { useTaskDraftStore } from '@/store/taskDraftStore';

const TaskListScreen: React.FC = () => {
  const {
    handleCreateTask,
    handleEditTask,
    isFilterVisible,
    toggleFilterModal,
    control,
    errors,
    onApplyFilter,
    onResetFilter,
    handleSubmit,
  } = TaskListContainer();
  const { tasks } = useTaskStore();
  const { draft } = useTaskDraftStore();
  console.log('getAllTask', tasks);
  console.log('draft', draft);

  const dropdownData = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  if (tasks.length === 0) {
    return <NoTaskScreen />;
  }

  const renderTaskItem: ListRenderItem<Task> = ({ item }) => (
    <GradientBorder borderRadius={15} style={styles.gradientWrapper}>
      <View style={styles.taskCard}>
        <View style={styles.cardHeader}>
          <AppText
            text={item.taskName}
            type="Bold"
            fontSize={18}
            color={Colors.BRUNSWICK_GREEN}
          />
          <TouchableOpacity onPress={() => handleEditTask(item)}>
            <Svgicons path="edit_icon_2" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <AppText
              text="Description: "
              type="Bold"
              color={Colors.PINE_FOREST}
            />
            <AppText
              text={`"${item.description}"`}
              color={Colors.PINE_FOREST}
              style={styles.flexShrink}
            />
          </View>

          <View style={styles.infoRow}>
            <AppText text="Property: " type="Bold" color={Colors.PINE_FOREST} />
            <AppText
              text={item.property}
              color={Colors.PINE_FOREST}
              style={styles.flexShrink}
            />
          </View>

          <View style={styles.infoRow}>
            <AppText
              text="Assigned Task: "
              type="Bold"
              color={Colors.PINE_FOREST}
            />
            <AppText
              text={item.assignedTask}
              color={Colors.PINE_FOREST}
              style={styles.flexShrink}
            />
          </View>

          <View style={styles.infoRow}>
            <AppText
              text="Task Status: "
              type="Bold"
              color={Colors.PINE_FOREST}
            />
            <AppText text={item.status} color="#FF4D4D" />
          </View>
        </View>
      </View>
    </GradientBorder>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Screen Title Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <AppText
            text="Task Managment"
            fontSize={26}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
          <TouchableOpacity style={styles.iconBtn}>
            <Svgicons path="taskManagementIcon" size={25} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleFilterModal}>
          <Svgicons path="taskManagementFilterIcon" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
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
            <Svgicons path="taskManagementFilterIcon" size={18} />
          </View>

          <MultiSelectDropdownField
            name="listings"
            label="Select Listings"
            control={control}
            errors={errors}
            data={dropdownData}
            placeholder="Select Multiple Options"
          />

          <MultiSelectDropdownField
            name="assignee"
            label="Task Asignee"
            control={control}
            errors={errors}
            data={dropdownData}
            placeholder="Select Multiple Options"
          />

          <MultiSelectDropdownField
            name="status"
            label="Task Status"
            control={control}
            errors={errors}
            data={dropdownData}
            placeholder="Select Multiple Options"
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

      <View style={styles.footer}>
        <AppButton
          title="Create Task"
          onPress={handleCreateTask}
          backgroundColor={Colors.WHITE}
          borderColor={Colors.ARGENT}
          color={Colors.PINE_FOREST}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
  },
  brandingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  avatarCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 10 },
  listPadding: { paddingBottom: 150 },
  gradientWrapper: {
    marginBottom: 15,
  },
  taskCard: {
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardContent: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  flexShrink: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  // Modal Styles
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
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
  flex1: { flex: 1 },
});

export default TaskListScreen;
