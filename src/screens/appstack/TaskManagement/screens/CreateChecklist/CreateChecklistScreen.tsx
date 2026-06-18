import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Checkbox from '@/components/molecules/Input/CheckBox';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import InputField from '@/components/molecules/Input/InputField';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { useQuery } from '@tanstack/react-query';
import { getTaskChecklistDetail } from '@/services/TaskManagementApi';
import { useTaskDraftStore } from '@/store/taskDraftStore';
import CreateChecklistContainer from '../../containers/CreateChecklist/CreateChecklistContainer';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';
import CreateChecklistSkeleton from '@/components/Skeletons/CreateChecklistSkeleton';

const ChecklistItemsList = ({
  sectionId,
  selectedItems,
  toggleItem,
  toggleModal,
}: any) => {
  const { draft } = useTaskDraftStore();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['checklistDetails', sectionId],
    queryFn: async () => {
      const res = await getTaskChecklistDetail(
        sectionId,
        draft?.taskType as string,
      );
      return res.data.map((i: any) => ({ id: String(i.id), label: i.name }));
    },
    enabled: !!sectionId,
  });

  if (isLoading)
    return (
      <ActivityIndicator color={Colors.MEDIUM_JUNGLE_GREEN} style={{ margin: 20 }} />
    );

  return (
    <View>
      {items.map((i: any) => (
        <ButtonView
          key={i.id}
          style={styles.checkRow}
          onPress={() => toggleItem(i.id)}
        >
          <Checkbox
            isChecked={selectedItems.includes(i.id)}
            onPress={() => toggleItem(i.id)}
          />
          <AppText
            text={i.label}
            style={{ marginLeft: 10, flex: 1 }}
            color={Colors.PINE_FOREST}
          />
        </ButtonView>
      ))}
      <ButtonView
        style={styles.addItemBtn}
        onPress={() => toggleModal(sectionId)}
      >
        <AppText text={t('app.task_management.add_item')} color={Colors.PINE_FOREST} type="Medium" />
      </ButtonView>
    </View>
  );
};

const CreateChecklistScreen = () => {
  const { t } = useTranslation();
  const {
    data,
    expandedSections,
    selectedItems,
    toggleSection,
    toggleItem,
    onCreateTask,
    isLoading,
    isModalVisible,
    toggleModal,
    control,
    errors,
    fields,
    addChecklistField,
    onConfirmAddSection,
    activeSectionId,
    isLoadingSections,
  } = CreateChecklistContainer();

  const renderHeader = () => (
    <View style={styles.topHeader}>
      <View style={styles.titleRow}>
        <AppText
          text={t('app.task_management.checklist_title')}
          type="Bold"
          fontSize={24}
          color={Colors.PINE_FOREST}
        />
        <Svgicons path="File_Document" size={30} />
      </View>
      <AppText
        text={t('app.task_management.checklist_subtitle')}
        fontSize={14}
        color={Colors.TRANSLUCENT_NAVY}
        style={styles.subtitle}
      />
      <ButtonView style={styles.addSectionBtn} onPress={() => toggleModal()}>
        <AppText
          text={t('app.task_management.add_section')}
          fontSize={14}
          type="Medium"
          color={Colors.PINE_FOREST}
        />
      </ButtonView>
    </View>
  );

  const renderItem = ({ item }: any) => {
    const expanded = expandedSections.includes(item.id);
    const CardContent = (
      <View style={[styles.card, !expanded && styles.collapsedCard]}>
        <ButtonView
          style={styles.header}
          onPress={() => toggleSection(item.id)}
        >
          <View style={styles.row}>
            <AppText
              text={item.title}
              type="Bold"
              fontSize={18}
              color={Colors.PINE_FOREST}
            />
          </View>
          <View style={styles.chevronCircle}>
            <Svgicons path={expanded ? 'chevronUp' : 'chevronDown'} size={14} />
          </View>
        </ButtonView>
        {expanded && (
          <View style={styles.items}>
            <ChecklistItemsList
              sectionId={item.id}
              selectedItems={selectedItems}
              toggleItem={toggleItem}
              toggleModal={toggleModal}
            />
          </View>
        )}
      </View>
    );

    return expanded ? (
      <GradientBorder style={styles.gradientWrapper} borderRadius={16}>
        {CardContent}
      </GradientBorder>
    ) : (
      <View>{CardContent}</View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoadingSections ? (
        <CreateChecklistSkeleton />
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          data={data}
          renderItem={renderItem}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => toggleModal()}
        style={styles.modalMargin}
        avoidKeyboard
      >
        <View style={styles.modalContent}>
          <AppText
            text={activeSectionId ? 'Add Items' : 'New Section'}
            type="Bold"
            fontSize={18}
            style={styles.modalTitle}
          />

          {!activeSectionId && (
            <InputField
              label={t('app.task_management.section_name')}
              name="sectionName"
              control={control}
              errors={errors}
              placeholder="e.g. Kitchen"
              rules={{ required: 'Section name is required' }}
            />
          )}

          <FlatListSimpleHandler
            data={fields}
            isLoading={isLoading}
            renderItem={({ index }: any) => {
              const fieldName = `items.${index}.value`;
              const itemError = (errors as any)?.items?.[index]?.value;

              return (
                <InputField
                  key={fields[index].id}
                  name={fieldName}
                  control={control}
                  errors={{ [fieldName]: itemError }}
                  placeholder={t('app.task_management.item_name_placeholder')}
                  rules={{ required: 'Item name is required' }}
                />
              );
            }}
          />

          <ButtonView style={styles.addMoreBtn} onPress={addChecklistField}>
            <AppText text={t('app.task_management.add_more')} color={Colors.PINE_FOREST} type="Medium" />
          </ButtonView>

          <View style={styles.modalFooter}>
            <ButtonView style={styles.cancelBtn} onPress={() => toggleModal()}>
              <AppText text={t('app.task_management.cancel')} color={Colors.PINE_FOREST} type="Bold" />
            </ButtonView>
            <ButtonView
              style={styles.confirmBtn}
              onPress={onConfirmAddSection}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.MEDIUM_JUNGLE_GREEN} />
              ) : (
                <AppText
                  text={t('app.task_management.confirm')}
                  type="Bold"
                  color={Colors.PINE_FOREST}
                />
              )}
            </ButtonView>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <AppButton
          title={t('app.task_management.create_task')}
          onPress={onCreateTask}
          loading={isLoading}
          color={Colors.PINE_FOREST}
        />
      </View>
    </View>
  );
};

export default CreateChecklistScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#FFF' },
  topHeader: { marginTop: 10, marginBottom: 20 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  subtitle: { lineHeight: 20, marginBottom: 20 },
  addSectionBtn: {
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
  },
  gradientWrapper: { marginBottom: 15 },
  card: { backgroundColor: '#FFF', padding: 15 },
  collapsedCard: {
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    borderRadius: 16,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevronCircle: {
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, maxWidth: 240 },
  items: { marginTop: 15 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 , flex:1},
  addItemBtn: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 25,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    backgroundColor: '#FFF',
    paddingVertical: 10,
    width:'100%',
    paddingBottom: Metrics.verticalScale(20)
  },
  modalMargin: { margin: 20, justifyContent: 'center' },
  modalContent: { backgroundColor: 'white', padding: 24, borderRadius: 24 },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.PINE_FOREST,
  },
  addMoreBtn: {
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
  },
});
