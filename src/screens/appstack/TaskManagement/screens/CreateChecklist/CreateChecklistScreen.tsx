import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Checkbox from '@/components/molecules/Input/CheckBox';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import InputField from '@/components/molecules/Input/InputField';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';

import { ChecklistSection } from '@/types/api/taskManagentType';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import SpinnerLoader from '@/components/molecules/SmallLoader';
import CreateChecklistContainer from '../../containers/CreateChecklist/CreateChecklistContainer';

const CreateChecklistScreen = () => {
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
    loadingSections,
  } = CreateChecklistContainer();

  // --------------------------
  // Header above FlatList
  // --------------------------
  const renderHeader = () => (
    <View style={styles.topHeader}>
      <View style={styles.titleRow}>
        <AppText
          text="Check-list Management"
          type="Bold"
          fontSize={24}
          color={Colors.PINE_FOREST}
        />
        <Svgicons path="File_Document" size={30} />
      </View>

      <AppText
        text="Please select what you require from the user for this checklist."
        fontSize={14}
        color={Colors.TRANSLUCENT_NAVY}
        style={styles.subtitle}
      />

      <ButtonView
        style={styles.addSectionBtn}
        onPress={() => toggleModal()} // No id = add section
      >
        <AppText
          text="Add Section"
          fontSize={14}
          type="Medium"
          color={Colors.PINE_FOREST}
        />
      </ButtonView>
    </View>
  );

  // --------------------------
  // Section Card
  // --------------------------
  const renderItem = ({ item }: { item: ChecklistSection }) => {
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
            {loadingSections.includes(item.id) ? (
              <View style={{ paddingVertical: 20 }}>
                <SpinnerLoader size="small" />
              </View>
            ) : (
              item.items.map(i => (
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
              ))
            )}

            {/* Add Checklist Item Button */}
            {!loadingSections.includes(item.id) && (
              <ButtonView
                style={styles.addItemBtn}
                onPress={() => toggleModal(item.id)} // id = add items
              >
                <AppText text="Add" color={Colors.PINE_FOREST} type="Medium" />
              </ButtonView>
            )}
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
      <FlatList
        ListHeaderComponent={renderHeader}
        data={data}
        renderItem={renderItem}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* -------------------------
          MODAL: ADD SECTION / ITEM
      ------------------------- */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => toggleModal()}
        style={styles.modalMargin}
        avoidKeyboard
      >
        <View style={styles.modalContent}>
          <AppText
            text={activeSectionId ? 'Add Items to Section' : 'Create New Section'}
            type="Bold"
            fontSize={18}
            style={styles.modalTitle}
          />

          {/* Section Name Input only when adding section */}
          {!activeSectionId && (
            <InputField
              label="Section Name:"
              name="sectionName"
              control={control}
              errors={errors}
              placeholder="e.g. Kitchen"
              rules={{ required: 'Section name is required' }}
            />
          )}

          {/* Checklist Item Inputs */}
          <FlatListSimpleHandler
            data={fields}
            isLoading={isLoading}
            renderItem={({ item, index }: any) => (
              <InputField
                key={item.id}
                name={`items.${index}.value`}
                control={control}
                errors={errors}
                placeholder="Checklist item"
              />
            )}
          />

          <ButtonView style={styles.addMoreBtn} onPress={addChecklistField}>
            <AppText text="Add More" color={Colors.PINE_FOREST} type="Medium" />
          </ButtonView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <ButtonView
              style={styles.cancelBtn}
              onPress={() => toggleModal()}
            >
              <AppText text="Cancel" color={Colors.PINE_FOREST} type="Medium" />
            </ButtonView>
            <ButtonView
              style={styles.confirmBtn}
              onPress={onConfirmAddSection}
            >
              <AppText text="Confirm" color={Colors.PINE_FOREST} type="Bold" />
            </ButtonView>
          </View>
        </View>
      </Modal>

      {/* -------------------------
          FOOTER: CREATE TASK
      ------------------------- */}
      <View style={styles.footer}>
        <AppButton
          title="Create Task"
          onPress={onCreateTask}
          loading={isLoading}
          backgroundColor={Colors.WHITE}
          borderColor={Colors.ARGENT}
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
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  subtitle: { lineHeight: 20, marginBottom: 20 },
  addSectionBtn: { alignSelf: 'flex-end', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.ARGENT },
  gradientWrapper: { marginBottom: 15 },
  card: { backgroundColor: '#FFF', padding: 15 },
  collapsedCard: { borderWidth: 1, borderColor: Colors.ARGENT, borderRadius: 16, marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chevronCircle: { width: 35, height: 35, borderRadius: 35, backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.ARGENT, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  items: { marginTop: 15 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addItemBtn: { borderWidth: 1, borderColor: '#EEE', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 25, alignSelf: 'flex-start', marginTop: 10 },
  footer: { position: 'absolute', left: 20, right: 20, bottom: 20, backgroundColor: '#FFF', paddingVertical: 10 },
  modalMargin: { margin: 20, justifyContent: 'center' },
  modalContent: { backgroundColor: 'white', padding: 24, borderRadius: 24 },
  modalTitle: { textAlign: 'center', marginBottom: 20, color: Colors.PINE_FOREST },
  addMoreBtn: { borderWidth: 1, borderColor: Colors.ARGENT, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start', marginTop: 15 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, gap: 15 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: Colors.ARGENT, borderRadius: 30, padding: 15, alignItems: 'center' },
  confirmBtn: { flex: 1, backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.ARGENT, borderRadius: 30, padding: 15, alignItems: 'center' },
});
