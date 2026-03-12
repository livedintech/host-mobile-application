import React, { useRef, useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import InputField from '@/components/molecules/Input/InputField';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import Checkbox from '@/components/molecules/Input/CheckBox';

const ChecklistDetail = ({ route }: any) => {
  const title = route?.params?.title || 'Bedroom 2';
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // Track which item we are editing
  
  const [taskData, setTaskData] = useState([
    { id: 1, text: 'Empty the trash bins and replace the new liner', checked: true },
    { id: 2, text: 'Windows glass & channels cleaned', checked: true },
    { id: 3, text: 'Curtains Set / Unstained', checked: true },
    { id: 4, text: 'Wardrobe Check and Dust', checked: true },
    { id: 5, text: 'Floor Mopped / Carpet Vacuum', checked: true },
    { id: 6, text: 'Sofa Set & Cushions', checked: true },
    { id: 7, text: 'Ceiling Lights Working', checked: true },
  ]);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { itemName: '' },
  });

  const toggleTask = (id: number) => {
    setTaskData(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleOpenPress = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setValue('itemName', item.text); // Populate the input with existing text
    } else {
      setEditingId(null);
      reset({ itemName: '' });
    }
    bottomSheetRef.current?.expand();
  };

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    setEditingId(null);
    reset();
  };

  const onSubmit = (data: any) => {
    if (editingId) {
      // UPDATE existing item
      setTaskData(prev => prev.map(item => 
        item.id === editingId ? { ...item, text: data.itemName } : item
      ));
    } else {
      // ADD new item
      const newItem = {
        id: Date.now(),
        text: data.itemName,
        checked: true
      };
      setTaskData(prev => [...prev, newItem]);
    }
    handleClosePress();
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    []
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>


        <RefreshableScrollView
          style={styles.content}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          isLoading={isPageLoading}
        >
          <AppText text={`${title} Checklist`} fontSize={28} type="Bold" lineHeight={38} mb={12} />
          <AppText 
            text="Please select what you require from the user for this checklist."
            fontSize={14} color={Colors.DARK_CHARCOAL_OPACITY} mb={20}
          />

          <View style={styles.addMoreContainer}>
            <TouchableOpacity onPress={() => handleOpenPress()}>
              <GlassCard width="auto" style={styles.addMoreBtn}>
                <AppText text="Add more" fontSize={12} type="Medium" />
              </GlassCard>
            </TouchableOpacity>
          </View>

          {taskData.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => handleOpenPress(item)}>
                <GlassCard width="100%" style={styles.taskCard}>
                <View style={styles.taskRow}>
                    <Checkbox 
                    isChecked={item.checked} 
                    onPress={() => toggleTask(item.id)} 
                    />
                    <AppText
                    text={item.text}
                    fontSize={14}
                    color={Colors.BLACK}
                    ml={12}
                    style={{ flex: 1 }}
                    />
                </View>
                </GlassCard>
            </TouchableOpacity>
          ))}
          <View style={{ height: 60 }} />
        </RefreshableScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{ backgroundColor: Colors.SMOOTH_GREY }}
        >
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <AppText text={editingId ? "Update Item" : "Add Item"} fontSize={24} type="Bold" />
              <TouchableOpacity onPress={handleClosePress}>
                <Svgicons path="closeIcon" size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                name="itemName"
                label="Item Name"
                control={control}
                errors={errors}
                placeholder="Enter checklist item"
                rules={{ required: 'Item name is required' }}
              />
            </View>
            <AppButton
              title={editingId ? "Update" : "Add"}
              mt={20}
              backgroundColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              onPress={handleSubmit(onSubmit)}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 25 },
  addMoreContainer: { alignItems: 'flex-end', marginBottom: 8 },
  addMoreBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12 },
  taskCard: {
    minHeight: 64,
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 20,
    paddingVertical: 10,
  },
  taskRow: { flexDirection: 'row', alignItems: 'center' },
  sheetContent: { padding: 25 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  inputWrapper: { marginTop: 10 },
});

export default ChecklistDetail;