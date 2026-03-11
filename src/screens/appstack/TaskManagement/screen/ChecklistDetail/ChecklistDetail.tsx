import React, { useRef, useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import InputField from '@/components/molecules/Input/InputField';
import Checkbox from '@/components/molecules/Input/CheckBox';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import useChecklistDetailContainer from '../../container/ChecklistDetailContainer/ChecklistDetailContainer';
import { navigate, goBack } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const ChecklistDetail = ({ route }: any) => {
  const { title, sectionId } = route.params;
  const {
    localItems,
    isLoading,
    toggleItem,
    addItem,
    updateItem,
    saveAndContinue,
    onRefresh,
  } = useChecklistDetailContainer(sectionId);

  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { itemName: '' },
  });

  const handleOpenAdd = () => {
    setSelectedItem(null);
    reset({ itemName: '' });
    bottomSheetRef.current?.expand();
  };

  const handleOpenEdit = (item: any) => {
    setSelectedItem({ id: item.id, name: item.name });
    setValue('itemName', item.name);
    bottomSheetRef.current?.expand();
  };

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    setSelectedItem(null);
    reset();
  };

  const onFormSubmit = (data: any) => {
    if (selectedItem) {
      updateItem(selectedItem.id, data.itemName);
    } else {
      addItem(data.itemName);
    }
    handleClosePress();
  };

  const handleSaveAndContinue = async () => {
    try {
      await saveAndContinue();
      goBack();
    } catch (error) {
      // Error handled in container mutation
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <GlassCard width="100%" style={styles.taskCard}>
        <View style={styles.taskRow}>
          <Checkbox
            isChecked={item.isChecked}
            onPress={() => toggleItem(item.id)}
          />
          <ButtonView
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => handleOpenEdit(item)}
          >
            <AppText text={item.name} fontSize={14} color={Colors.BLACK} />
          </ButtonView>
        </View>
      </GlassCard>
    ),
    [toggleItem],
  );

  const ListHeader = () => (
    <View>
      <AppText
        text={`${title} Checklist`}
        fontSize={28}
        type="Bold"
        mb={12}
        mt={20}
      />
      <View style={styles.addMoreContainer}>
        <ButtonView onPress={handleOpenAdd}>
          <GlassCard width="auto" style={styles.addMoreBtn}>
            <AppText text="Add more" fontSize={12} type="Medium" />
          </GlassCard>
        </ButtonView>
      </View>
    </View>
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <FlatListSimpleHandler
          data={localItems}
          renderItem={renderItem}
          isLoading={isLoading}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
          HeaderComponent={<ListHeader />}
          ListFooterComponent={<View style={{ height: 120 }} />}
          keyExtractor={item => item.id.toString()}
        />

        <View style={styles.footer}>
          <AppButton
            title="Save"
            backgroundColor={Colors.PRIMARY_TEAL}
            borderColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            onPress={handleSaveAndContinue}
            loading={isLoading}
          />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <AppText
                text={selectedItem ? 'Update Item' : 'Add Item'}
                fontSize={24}
                type="Bold"
              />
              <ButtonView onPress={handleClosePress}>
                <Svgicons path="closeIcon" size={24} />
              </ButtonView>
            </View>
            <InputField
              name="itemName"
              control={control}
              errors={errors}
              placeholder="Enter checklist item"
              rules={{ required: 'Required' }}
            />
            <AppButton
              title={selectedItem ? 'Update' : 'Add'}
              mt={20}
              backgroundColor={Colors.PRIMARY_TEAL}
              borderColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              onPress={handleSubmit(onFormSubmit)}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: 25 },
  addMoreContainer: { alignItems: 'flex-end', marginBottom: 12 },
  addMoreBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12 },
  taskCard: {
    minHeight: 64,
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  taskRow: { flexDirection: 'row', alignItems: 'center' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 25,
    right: 25,
  },
  sheetContent: { padding: 25 },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default ChecklistDetail;
