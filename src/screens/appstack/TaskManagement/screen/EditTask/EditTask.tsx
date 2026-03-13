import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import DropdownField from '@/components/molecules/Input/DropdownField';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { getTaskDetail } from '@/services/TaskManagementApi';
import EditTaskContainer from '../../container/EditTaskContainer/EditTaskContainer';

const formatDate = (dateString: string) => {
  if (!dateString) return '--';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

const EditTask = ({ route }: any) => {
  const { onDeleteTask, isDeleting } = EditTaskContainer();
  const { taskId, taskType } = route?.params || {};

  const {
    data: task,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_DETAIL, taskId],
    queryFn: () => getTaskDetail(taskId, taskType),
    enabled: !!taskId,
  });

  const apiStatus = task?.status || 'todo';
  const isCompleted = apiStatus === 'completed';
  const isEditable = apiStatus === 'todo' || apiStatus === 'inprogress';

  const statusDisplay =
    {
      todo: 'To do',
      inprogress: 'In Progress',
      completed: 'Completed',
    }[apiStatus as 'todo' | 'inprogress' | 'completed'] || 'To do';

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { assignee: '' },
  });

  useEffect(() => {
    if (task?.assigned_user?.id) {
      setValue('assignee', task.assigned_user.id.toString());
    }
  }, [task, setValue]);

  const assigneeOptions = [
    {
      label: task?.assigned_user?.name || 'Select User',
      value: task?.assigned_user?.id?.toString() || '',
    },
  ];

  if (isLoading || isDeleting) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_TEAL} />
          {isDeleting && <AppText text="Deleting task..." mt={10} />}
        </View>
      </BGImage>
    );
  }

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ButtonView
            onPress={() => onDeleteTask(taskId)}
            style={styles.iconBtn}
          >
            <Svgicons path="deleteTask" size={24} />
          </ButtonView>
        </View>

        <RefreshableScrollView
          contentContainerStyle={styles.scrollContent}
          isLoading={false}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        >
          <AppText
            text={`${task?.task_type_key
              ?.charAt(0)
              .toUpperCase()}${task?.task_type_key?.slice(1)} Task`}
            fontSize={28}
            type="Bold"
            mb={30}
            mt={20}
          />

          <GlassCard width="100%" style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <AppText text="Task Details" fontSize={18} type="Medium" />
              <Svgicons path="copiedIcon" size={24} />
            </View>

            <View style={styles.detailSection}>
              <AppText
                text="Task Instructions"
                fontSize={14}
                type="Bold"
                mb={4}
              />
              <AppText
                text={task?.description || 'No instructions provided.'}
                fontSize={14}
                color={Colors.DARK_CHARCOAL}
                mb={20}
              />

              <AppText text="Property" fontSize={14} type="Bold" mb={4} />
              <AppText
                text={task?.listing_title || 'Address not available'}
                fontSize={14}
                color={Colors.DARK_CHARCOAL}
                mb={20}
              />

              {isEditable ? (
                <DropdownField
                  name="assignee"
                  label="Assign Task"
                  control={control}
                  errors={errors}
                  data={assigneeOptions}
                />
              ) : (
                <View>
                  <AppText
                    text="Assign Task"
                    fontSize={14}
                    type="Bold"
                    mb={8}
                  />
                  <View style={styles.readOnlyBox}>
                    <AppText
                      text={task?.assigned_user?.name || 'Unassigned'}
                      fontSize={14}
                      color={Colors.DARK_CHARCOAL}
                    />
                  </View>
                </View>
              )}
            </View>
          </GlassCard>

          <GlassCard width="100%" style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <AppText text="Task Timeline" fontSize={18} type="Medium" />
              <Svgicons path="taskTimeline" size={24} />
            </View>

            <TimelineItem
              icon="taskCalendar"
              label="Task Date"
              value={formatDate(task?.start_date)}
            />
            <TimelineItem
              icon="taskStartDate"
              label="Start Time"
              value={task?.start_time || '--'}
            />
            <TimelineItem
              icon="taskEndDate"
              label="End Time"
              value={task?.end_time || '--'}
            />

            <View style={styles.timelineRow}>
              <View style={styles.iconCircle}>
                <Svgicons path="taskStar" size={18} />
              </View>
              <View>
                <AppText text="Task Status:" fontSize={14} type="Medium" />
                <AppText
                  text={statusDisplay}
                  fontSize={13}
                  type="Bold"
                  color={
                    apiStatus === 'todo'
                      ? Colors.ERROR_RED
                      : apiStatus === 'inprogress'
                      ? Colors.GOLDEN_AMBER
                      : Colors.TEAL_PRIMARY_ALT
                  }
                />
              </View>
            </View>
          </GlassCard>
        </RefreshableScrollView>

        <View style={styles.footer}>
          {isCompleted ? (
            <>
              <AppButton
                title="Pre-activity Preview"
                backgroundColor={Colors.WHITE}
                borderColor={Colors.SMOOTH_GREY}
                color={Colors.BLACK}
                mb={12}
                onPress={() =>
                  navigate(NavigationRoutes.APP_STACK.PRE_ACTIVITY_SCREEN, {
                    taskData: task,
                  })
                }
              />
              <AppButton
                title="Post Activity Preview"
                backgroundColor={Colors.PRIMARY_TEAL}
                borderColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                onPress={() =>
                  navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL, {
                    taskId,
                    fromEdit: true,
                  })
                }
              />
            </>
          ) : (
            <>
              <AppButton
                title="Checklist Management"
                backgroundColor={Colors.WHITE}
                borderColor={Colors.SMOOTH_GREY}
                color={Colors.BLACK}
                mb={12}
                onPress={() =>
                  navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL, {
                    taskId,
                    fromEdit: true,
                  })
                }
              />
              <AppButton
                title="Save Changes"
                backgroundColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                onPress={() => goBack()}
              />
            </>
          )}
        </View>
      </View>
    </BGImage>
  );
};

const TimelineItem = ({ icon, label, value }: any) => (
  <View style={styles.timelineRow}>
    <View style={styles.iconCircle}>
      <Svgicons path={icon} size={22} />
    </View>
    <View>
      <AppText text={label} fontSize={14} type="Medium" />
      <AppText text={value} fontSize={13} color={Colors.DARK_CHARCOAL} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 180 },
  glassCard: { padding: 20, marginBottom: 20 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailSection: { marginTop: 10 },
  readOnlyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 20,
  },
  timelineRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 25,
    right: 25,
  },
});

export default EditTask;
