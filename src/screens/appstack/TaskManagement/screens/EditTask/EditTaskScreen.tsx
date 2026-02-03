import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import EditTaskContainer from '../../containers/EditTask/EditTaskContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import DropdownField from '@/components/molecules/Input/DropdownField';

const EditTaskScreen = () => {
  const { task, expandedSections, toggleSection, handleSaveChanges } =
    EditTaskContainer();
  console.log('taskEditScreen', task);

  if (!task) return null;

  const isTodo = task.status === 'To-do';
  const isInProgress = task.status === 'In-Progress';
  const isCompleted = task.status === 'Completed';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <AppText
            text={task.taskName}
            type="Bold"
            fontSize={26}
            color={Colors.PINE_FOREST}
          />
          <Svgicons path="File_Document" size={28} />
        </View>

        {/* Task Details Card */}
        <View style={styles.detailBox}>
          <AppText
            text="Task Description:"
            type="Bold"
            fontSize={16}
            color={Colors.PINE_FOREST}
          />
          <AppText
            text={`"${task.description}"`}
            style={styles.descriptionText}
            color={Colors.BRUNSWICK_GREEN}
          />

          <AppText
            text="Property:"
            type="Bold"
            fontSize={16}
            style={styles.labelMargin}
            color={Colors.PINE_FOREST}
          />
          <AppText text={task.property} color={Colors.BRUNSWICK_GREEN} />

          <AppText
            text={isTodo ? 'Assign Task' : 'Task Assigned:'}
            type="Bold"
            fontSize={16}
            style={styles.labelMargin}
            color={Colors.PINE_FOREST}
          />
          {isTodo ? (
            <></>
            // <ButtonView style={styles.dropdownPlaceholder}>
            //   <AppText text={task.assignedTask} />
            //   <Svgicons path="chevronDown" size={14} />
            // </ButtonView>
            // <DropdownField
            //   name="assignTask"
            //   control={control}
            //   errors={errors}
            //   label="Assign Task"
            //   data={userOptions}
            //   placeholder="Select User"
            //   rules={{ required: 'User assignment is required' }}
            // />
          ) : (
            <AppText text={task.assignedTask} color={Colors.BRUNSWICK_GREEN} />
          )}

          {isInProgress && (
            <View style={styles.statusRow}>
              <AppText text="Task Status:" type="Bold" fontSize={16} />
              <AppText
                text="In-Progress"
                color={Colors.GOLDEN}
                style={{ marginLeft: 8 }}
              />
            </View>
          )}
        </View>

        {/* Pre Activity Preview - Visible for InProgress & Completed */}
        {(isInProgress || isCompleted) && (
          <View style={styles.previewContainer}>
            <View style={styles.sectionTitleRow}>
              <AppText
                text="Pre Activity Preview"
                type="Bold"
                fontSize={22}
                color={Colors.PINE_FOREST}
              />
              <Svgicons path="video_icon" size={26} />
            </View>
            <TouchableOpacity style={styles.mediaCollapseBtn}>
              <AppText text="View Images/Video" />
              <Svgicons path="chevronDown" size={14} />
            </TouchableOpacity>
          </View>
        )}

        {/* Checklist Section */}
        <View style={styles.sectionTitleRow}>
          <AppText
            text={
              isCompleted ? 'Post Activity Preview' : 'Check-list Managment'
            }
            type="Bold"
            fontSize={22}
            color={Colors.PINE_FOREST}
          />
          <Svgicons
            path={isCompleted ? 'video_icon' : 'File_Document'}
            size={26}
          />
        </View>

        {task.checklistData.map(section => (
          <View key={section.id} style={styles.accordionCard}>
            <ButtonView
              style={styles.accordionHeader}
              onPress={() => toggleSection(section.id)}
            >
              <View style={styles.row}>
                <Svgicons path={section.icon} size={22} />
                <AppText
                  text={section.title}
                  type="Bold"
                  fontSize={18}
                  style={{ marginLeft: 10 }}
                />
              </View>
              <View style={styles.chevronCircle}>
                <Svgicons
                  path={
                    expandedSections.includes(section.id)
                      ? 'chevronUp'
                      : 'chevronDown'
                  }
                  size={14}
                />
              </View>
            </ButtonView>

            {expandedSections.includes(section.id) && (
              <View style={styles.accordionContent}>
                {section.items.map(item => (
                  <View key={item.id} style={styles.itemContainer}>
                    <AppText
                      text={item.label}
                      fontSize={14}
                      color={Colors.TRANSLUCENT_NAVY}
                    />

                    {/* Media Grid logic - Design 4 */}
                    {(isInProgress || isCompleted) && (
                      <View style={styles.imageGrid}>
                        <View style={styles.mediaPlaceholder} />
                        <View style={styles.mediaPlaceholder} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {isCompleted && (
          <View style={styles.completionBadge}>
            <Svgicons path="check_circle" size={20} />
            <AppText
              text="Task Completed Successfully"
              type="Medium"
              style={{ marginLeft: 8 }}
            />
          </View>
        )}
      </ScrollView>

      {!isCompleted && (
        <View style={styles.footer}>
          <AppButton
            title="Save Changes"
            onPress={handleSaveChanges}
            backgroundColor={Colors.WHITE}
            borderColor={Colors.ARGENT}
            color={Colors.PINE_FOREST}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  detailBox: { marginBottom: 25 },
  descriptionText: {
    marginTop: 8,
    color: Colors.TRANSLUCENT_NAVY,
    lineHeight: 22,
  },
  labelMargin: { marginTop: 15 },
  dropdownPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    borderRadius: 12,
    padding: 15,
    marginTop: 8,
  },
  statusRow: { flexDirection: 'row', marginTop: 15, alignItems: 'center' },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 30,
    marginBottom: 20,
  },
  previewContainer: { marginBottom: 10 },
  mediaCollapseBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    borderRadius: 16,
    padding: 18,
  },
  accordionCard: {
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  accordionContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  chevronCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: { marginBottom: 20 },
  imageGrid: { flexDirection: 'row', gap: 10, marginTop: 12 },
  mediaPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5', // Grey squares from Design 4
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFF',
  },
});

export default EditTaskScreen;
