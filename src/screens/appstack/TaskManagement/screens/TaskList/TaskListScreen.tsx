import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { Colors } from '@/theme/colors';

import TaskListContainer from '../../containers/TaskList/TaskListContainer';
import { Task } from '@/types/api/taskManagentType';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';

const TaskListScreen: React.FC = () => {
    const { t } = useTranslation();
  
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

  const renderTaskItem = ({ item }: { item: Task }) => (
    <ButtonView
      activeOpacity={0.8}
      onPress={() =>
        navigate(NavigationRoutes.APP_STACK.VIEW_TASK, {
          taskId: item?.id,
          taskStatus: item?.status,
          taskType: item?.task_type,
        })
      }
    >
      <GradientBorder borderRadius={15} style={styles.gradientWrapper}>
        <View style={styles.taskCard}>
          <View style={styles.cardHeader}>
            <AppText
              text={item.title}
              type="Bold"
              fontSize={18}
              color={Colors.BRUNSWICK_GREEN}
              style={styles.flex1}
            />
            <ButtonView onPress={() => handleEditTask(item)}>
              <Svgicons path="edit_icon_2" size={22} />
            </ButtonView>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <AppText
                text={t('app.task_management.description_label')}
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
              <AppText
                text={t('app.task_management.property_label')}
                type="Bold"
                color={Colors.PINE_FOREST}
              />
              <AppText
                text={item.listing_title}
                color={Colors.PINE_FOREST}
                style={styles.flexShrink}
              />
            </View>
            <View style={styles.infoRow}>
              <AppText
                text={t('app.task_management.assigned_to')}
                type="Bold"
                color={Colors.PINE_FOREST}
              />
              <AppText
                text={item.assigned_user_name}
                color={Colors.PINE_FOREST}
              />
            </View>
            <View style={styles.infoRow}>
              <AppText
                text={t('app.task_management.due_date')}
                type="Bold"
                color={Colors.PINE_FOREST}
              />
              <AppText
                text={new Date(item.assign_datetime).toLocaleString()}
                color={Colors.PINE_FOREST}
              />
            </View>
            <View style={styles.infoRow}>
              <AppText text={t('app.task_management.status')} type="Bold" color={Colors.PINE_FOREST} />
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
    </ButtonView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText
          text={t('app.task_management.title')}
          fontSize={26}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
        />
        <ButtonView onPress={toggleFilterModal}>
          <Svgicons path="taskManagementFilterIcon" size={25} />
        </ButtonView>
      </View>

      <View style={styles.flex1}>
        <FlatListHandler
          data={tasks}
          meta={taskQuery}
          isLoading={taskQuery.isLoading}
          renderItem={renderTaskItem}
          listEmptyText="No tasks found"
          contentContainerStyle={styles.listPadding}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreateTask}>
          <AppText text={t('app.task_management.create_task')} type="Bold" color={Colors.PINE_FOREST} />
        </TouchableOpacity>
      </View>
      {isFilterVisible && (
        <Modal
          animationIn={'fadeIn'}
          isVisible={isFilterVisible}
          onBackdropPress={toggleFilterModal}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText
                text={t('app.task_management.apply_filter')}
                fontSize={22}
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
              />
            </View>
            <MultiSelectDropdownField
              name="listings"
              label={t('app.task_management.select_listings')}
              control={control}
              errors={errors}
              data={listingDropdown}
              placeholder={t('app.task_management.select_multiple')}
            />
            <MultiSelectDropdownField
              name="assignee"
              label={t('app.task_management.task_assignee')}
              control={control}
              errors={errors}
              data={vendorDropdown}
              placeholder={t('app.task_management.select_multiple')}
            />
            <MultiSelectDropdownField
              name="status"
              label={t('app.task_management.task_status')}
              control={control}
              errors={errors}
              data={[
                { label: t('app.task_management.status_todo'), value: 'todo' },
                { label: t('app.task_management.status_in_progress'), value: 'inprogress' },
                { label: t('app.task_management.status_completed'), value: 'completed' },
              ]}
              placeholder={t('app.task_management.select_multiple')}
            />
            <View style={styles.modalFooter}>
              <AppButton
                title={t('app.task_management.reset')}
                onPress={onResetFilter}
                style={styles.flex1}
                mx={5}
              />
              <AppButton
                title={t('app.task_management.apply_filter')}
                onPress={handleSubmit(onApplyFilter)}
                style={styles.flex1}
                mx={5}
                color={Colors.PINE_FOREST}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  header: {
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex1: { flex: 1 },
  listPadding: { paddingHorizontal: 20, paddingBottom: 0 }, // Removed extra padding at bottom
  gradientWrapper: { marginBottom: 15 },
  taskCard: { backgroundColor: Colors.WHITE, padding: 20, borderRadius: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardContent: { gap: 6 },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  flexShrink: { flexShrink: 1 },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 15, // Keep space for home indicator
    paddingTop: 5, // Reduced top space
    backgroundColor: Colors.WHITE,
  },
  createBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});

export default TaskListScreen;
