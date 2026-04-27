import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import DropdownField from '@/components/molecules/Input/DropdownField';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { getTaskDetail } from '@/services/TaskManagementApi';
import EditTaskContainer from '../../container/EditTaskContainer/EditTaskContainer';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import Metrics from '@/utility/Metrics';
import Toast from 'react-native-toast-message';

// Helper to convert "09:00 pm" to "21:00" or just strip "pm/am"
const convertTo24Hour = (timeStr: string) => {
  if (!timeStr) return '';

  // Clean the string and lower case it
  const time = timeStr.toLowerCase().trim();
  const isPm = time.includes('pm');
  const isAm = time.includes('am');

  // Remove am/pm and keep only the numbers part
  let [hoursStr, minutesStr] = time.replace(/[ap]m/g, '').trim().split(':');

  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr ? minutesStr.padStart(2, '0') : '00';

  if (isPm && hours < 12) {
    hours += 12;
  } else if (isAm && hours === 12) {
    hours = 0;
  }

  // Return exactly "HH:mm"
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};
const formatDateDisplay = (dateString: string) => {
  if (!dateString) return '--';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
};
const EditTask = ({ route }: any) => {
  const { t } = useTranslation();

  const { onDeleteTask, isDeleting, assigneeOptions, onUpdateAssignee } =
    EditTaskContainer();
  const { taskId, taskType } = route?.params || {};
  const [isEditMode, setIsEditMode] = useState(false);

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
  const isEditable = [
    'todo',
    'inprogress',
    'pending',
    'template',
    'resume',
  ].includes(apiStatus);
  const isCompleted = apiStatus === 'completed';

  const statusDisplay =
    {
      todo: 'To do',
      inprogress: 'In Progress',
      pending: 'Pending',
      completed: 'Completed',
      template: 'Template',
      resume: 'Resume',
    }[apiStatus as string] || 'To do';

  const {
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      assignee: '',
      instructions: '',
      task_date: '',
      start_time: '',
      end_time: '',
    },
  });

  useEffect(() => {
    if (task) {
      setValue('assignee', task?.assigned_user?.id?.toString() || '');
      setValue('instructions', task?.description || '');
      setValue('task_date', task?.start_date || '');
      setValue('start_time', task?.start_time || '');
      setValue('end_time', task?.end_time || '');
    }
  }, [task, setValue]);

  const handleCancel = () => {
    reset({
      assignee: task?.assigned_user?.id?.toString() || '',
      instructions: task?.description || '',
      task_date: task?.start_date || '',
      start_time: task?.start_time || '',
      end_time: task?.end_time || '',
    });
    setIsEditMode(false);
  };

  const handleSave = () => {
    const formData = getValues();

    if (!formData.assignee) {
      Toast.show({ type: 'error', text1: t('app.task_management.select_vendor') });
      return;
    }

    // Prepare payload without am/pm
    const payload = {
      vendor_id: Number(formData.assignee),
      description: formData.instructions,
      start_date: formData.task_date,
      start_time: convertTo24Hour(formData.start_time),
      end_time: convertTo24Hour(formData.end_time),
    };

    onUpdateAssignee(taskId, payload);
    setIsEditMode(false);
  };

  if (isLoading || isDeleting) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_TEAL} />
          {isDeleting && (
            <AppText text={t('app.task_management.deleting_task')} mt={10} />
          )}
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
          onRefresh={refetch}
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
              <AppText
                text={t('app.task_management.task_details')}
                fontSize={18}
                type="Medium"
              />
              {isEditable && (
                <TouchableOpacity
                  onPress={
                    isEditMode ? handleCancel : () => setIsEditMode(true)
                  }
                >
                  <GlassCard width={44} style={styles.editGlassIcon}>
                    <Svgicons
                      path={isEditMode ? 'crossIcon' : 'edit_pencil_icon'}
                      size={24}
                    />
                  </GlassCard>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.detailSection}>
              <AppText
                text={t('app.task_management.task_instructions')}
                fontSize={14}
                type="Bold"
                mb={8}
              />
              {isEditMode ? (
                <Controller
                  control={control}
                  name="instructions"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.instructionInput}
                      multiline
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter instructions..."
                      placeholderTextColor={Colors.DARK_CHARCOAL}
                    />
                  )}
                />
              ) : (
                <AppText
                  text={task?.description || 'No instructions provided.'}
                  fontSize={14}
                  color={Colors.DARK_CHARCOAL}
                  mb={20}
                />
              )}

              {task?.key_code && (
                <>
                  {' '}
                  <AppText
                    text={t('app.task_management.door_code')}
                    fontSize={14}
                    type="Bold"
                    mb={4}
                  />
                  <AppText
                    text={task?.key_code}
                    fontSize={14}
                    color={Colors.DARK_CHARCOAL}
                    mb={20}
                  />{' '}
                </>
              )}
              <AppText
                text={t('app.task_management.property')}
                fontSize={14}
                type="Bold"
                mb={4}
              />
              <AppText
                text={task?.listing_title || 'Address not available'}
                fontSize={14}
                color={Colors.DARK_CHARCOAL}
                mb={20}
              />

              {isEditMode || isEditable ? (
                <DropdownField
                  name="assignee"
                  label={t('app.edit_task_screen.assign_task')}
                  control={control}
                  errors={errors}
                  data={assigneeOptions}
                />
              ) : (
                <View>
                  <AppText
                    text={t('app.task_management.assign_task')}
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

          {task.status !== 'template' && (
            <GlassCard width="100%" style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <AppText
                  text={t('app.task_management.task_timeline')}
                  fontSize={18}
                  type="Medium"
                />
                <Svgicons path="taskTimeline" size={24} />
              </View>

              {isEditMode ? (
                <View>
                  <DateTimeInputField
                    name="task_date"
                    control={control}
                    errors={errors}
                    label={t('app.edit_task_screen.task_date')}
                    mode="date"
                  />
                  <DateTimeInputField
                    name="start_time"
                    control={control}
                    errors={errors}
                    label={t('app.edit_task_screen.start_time')}
                    mode="time"
                  />
                  <DateTimeInputField
                    name="end_time"
                    control={control}
                    errors={errors}
                    label={t('app.edit_task_screen.end_time')}
                    mode="time"
                  />
                </View>
              ) : (
                <View>
                  <TimelineItem
                    icon="taskCalendar"
                    label={t('app.edit_task_screen.task_date')}
                    value={formatDateDisplay(task?.start_date)}
                  />
                  <TimelineItem
                    icon="taskStartDate"
                    label={t('app.edit_task_screen.start_time')}
                    value={task?.start_time || '--'}
                  />
                  <TimelineItem
                    icon="taskEndDate"
                    label={t('app.edit_task_screen.end_time')}
                    value={task?.end_time || '--'}
                  />
                </View>
              )}

              <View style={styles.timelineRow}>
                <View style={styles.iconCircle}>
                  <Svgicons path="taskStar" size={18} />
                </View>
                <View>
                  <AppText
                    text={t('app.task_management.task_status_label')}
                    fontSize={14}
                    type="Medium"
                  />
                  <AppText
                    text={statusDisplay}
                    fontSize={13}
                    type="Bold"
                    color={
                      apiStatus === 'todo'
                        ? Colors.ERROR_RED
                        : apiStatus === 'inprogress'
                        ? Colors.GOLDEN_AMBER
                        : Colors.PRIMARY_TEAL
                    }
                  />
                </View>
              </View>
            </GlassCard>
          )}
        </RefreshableScrollView>

        {/* <View style={styles.footer}>
          {isEditMode ? (
            <AppButton title={t('app.edit_task_screen.save_changes')} backgroundColor={Colors.PRIMARY_TEAL} color={Colors.WHITE} onPress={handleSave} />
          ) : (
            <GradientBorder borderRadius={14} borderWidth={1} colors={['rgba(128, 128, 128, 0.66)', 'rgba(255, 255, 255, 0.66)', 'rgba(128, 128, 128, 0.66)']} locations={[0, 0.5356, 1]} style={styles.gradientMargin}>
              <AppButton title={t('app.edit_task_screen.checklist_mgmt')} style={styles.outlineBtn} color={Colors.BLACK} onPress={() => navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL, { taskId, fromEdit: true })} />
            </GradientBorder>
          )}
        </View> */}

        <View style={styles.footer}>
          {isCompleted ? (
            <>
              <AppButton
                title={t('app.edit_task_screen.pre_activity')}
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
                title={t('app.edit_task_screen.post_activity')}
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
              <GradientBorder
                borderRadius={14}
                borderWidth={1}
                colors={[
                  'rgba(128, 128, 128, 0.66)',
                  'rgba(255, 255, 255, 0.66)',
                  'rgba(128, 128, 128, 0.66)',
                ]}
                locations={[0, 0.5356, 1]}
                style={styles.gradientMargin}
              >
                <AppButton
                  title={t('app.edit_task_screen.checklist_mgmt')}
                  style={styles.outlineBtn}
                  color={Colors.BLACK}
                  onPress={() =>
                    navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL, {
                      taskId,
                      fromEdit: true,
                    })
                  }
                />
              </GradientBorder>
              <AppButton
                title={t('app.edit_task_screen.save_changes')}
                backgroundColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                // onPress={() => goBack()}
                onPress={handleSave}
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
  scrollContent: { paddingBottom: Metrics.verticalScale(160) },
  glassCard: { padding: 20, marginBottom: 20 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailSection: { marginTop: 10 },
  editGlassIcon: {
    height: 44,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  instructionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    color: Colors.BLACK,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
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
  gradientMargin: { marginBottom: 12 },
  outlineBtn: { backgroundColor: '#fff', borderRadius: 13, borderWidth: 0 },
});

export default EditTask;
