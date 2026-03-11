import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import DropdownField from '@/components/molecules/Input/DropdownField';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';

// Native Formatters
const formatDate = (dateString: string) => {
  if (!dateString) return '--';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

const formatTime = (dateString: string) => {
  if (!dateString) return '--';
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(dateString));
};

const EditTask = ({ route }: any) => {
  // Extract data from navigation params
  const task = route?.params?.taskData || {};
  console.log("taskkkk",task)
  
  // Map API status to UI Logic
  // API: 'todo' | 'inprogress' | 'done'
  const apiStatus = task?.status || 'todo';
  const isCompleted = apiStatus === 'done';
  const isEditable = apiStatus === 'todo' || apiStatus === 'inprogress';

  // Map API status strings to UI display text
  const statusDisplay = {
    todo: 'To do',
    inprogress: 'In Progress',
    done: 'Completed',
  }[apiStatus as 'todo' | 'inprogress' | 'done'] || 'To do';

  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      assignee: task?.assigned_user_id?.toString() || '',
    },
  });

  const assigneeOptions = [
    { label: task?.assigned_user_name || 'Select User', value: task?.assigned_user_id?.toString() || '' },
    // In a real app, you'd fetch all vendors here
  ];

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <RefreshableScrollView
          contentContainerStyle={styles.scrollContent}
          isLoading={false}
        >
          <AppText
            text={task?.task_type ? task.task_type.charAt(0).toUpperCase() + task.task_type.slice(1) + ' Task' : 'Task Details'}
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
              <AppText text="Task Instructions" fontSize={14} type="Bold" mb={4} />
              <AppText
                text={task?.description || 'No instructions provided for this task.'}
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
                  placeholder="Select Assignee"
                />
              ) : (
                <View>
                  <AppText text="Assign Task" fontSize={14} type="Bold" mb={8} />
                  <View style={styles.readOnlyBox}>
                    <AppText
                      text={task?.assigned_user_name || 'Unassigned'}
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
              value={formatDate(task?.date)}
            />
            <TimelineItem
              icon="taskStartDate"
              label="Start Time"
              value={formatTime(task?.date)} // Adjust key if backend sends separate start_time
            />
            <TimelineItem
              icon="taskEndDate"
              label="End Time"
              value={formatTime(task?.assign_datetime)} // Adjust key if backend sends separate end_time
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
                onPress={() => {}}
              />
              <AppButton
                title="Post Activity Preview"
                backgroundColor={Colors.PRIMARY_TEAL}
                borderColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                onPress={() => {}}
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
                onPress={() => navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL, { taskId: task.id })}
              />
              <AppButton
                title="Save Changes"
                backgroundColor={Colors.PRIMARY_TEAL}
                borderColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                onPress={() => {}}
              />
            </>
          )}
        </View>
      </View>
    </BGImage>
  );
};

const TimelineItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
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
  scrollContent: { paddingBottom: 180 },
  glassCard: { padding: 20, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
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
  footer: { position: 'absolute', bottom: Platform.OS === 'ios' ? 40 : 20, left: 25, right: 25 },
});

export default EditTask;