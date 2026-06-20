import { useTranslation } from 'react-i18next';
import React, { useRef, useMemo, useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  Keyboard,
} from 'react-native';
import AppImage from '@/components/atoms/AppImage/AppImage';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import Video from 'react-native-video';
import ImageView from 'react-native-image-viewing';

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
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Metrics from '@/utility/Metrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderApp from '@/components/molecules/Header/HeaderApp';
import { useTaskStore } from '@/store/taskStore';
import ChecklistDetailSkeleton from '@/components/Skeletons/ChecklistDetailSkeleton';

const { width, height } = Dimensions.get('window');

const ChecklistDetail = ({ route }: any) => {
  const { t } = useTranslation();
  const { taskId: storeTaskId, taskStatus } = useTaskStore();

  const { title, sectionId, taskId, fromEdit } = route.params;
  const insets = useSafeAreaInsets();

  const {
    localItems,
    isLoading,
    toggleItem,
    addItem,
    updateItem,
    saveAndContinue,
    onRefresh,
  } = useChecklistDetailContainer(sectionId, taskId);

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<{ uri: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['70%'], []);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { itemName: '' },
  });

  const hasExistingMedia = useMemo(() => {
    return localItems?.some(item => item.images && item.images.length > 0);
  }, [localItems]);

  const closeSheet = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  }, []);

  const onFormSubmit = (data: any) => {
    if (selectedItem) {
      updateItem(selectedItem.id, data.itemName);
    } else {
      addItem(data.itemName);
    }
    closeSheet();
    reset();
  };

  const handleOpenEdit = useCallback(
    (item: any) => {
      if (
        taskStatus === 'completed' ||
        (item.images && item.images.length > 0)
      ) {
        return;
      }
      setSelectedItem({ id: item.id, name: item.name });
      setValue('itemName', item.name);
      bottomSheetRef.current?.expand();
    },
    [taskStatus, setValue],
  ); // Add dependencies here

  const renderMedia = (mediaItems: any[]) => {
    if (!mediaItems || mediaItems.length === 0) return null;
    return (
      <View style={styles.mediaGrid}>
        {mediaItems.map((media, index) => {
          const isVideo =
            media.type === 'video' ||
            media.file_path?.toLowerCase().endsWith('.mp4');
          return (
            <ButtonView
              key={media.id || index}
              style={styles.mediaBox}
              onPress={() => {
                if (isVideo) setSelectedVideo(media.file_path);
                else {
                  setCurrentImage([{ uri: media.file_path }]);
                  setIsImageViewerVisible(true);
                }
              }}
            >
              {isVideo ? (
                <View style={styles.videoPlaceholder}>
                  <Video
                    source={{ uri: media.file_path }}
                    style={StyleSheet.absoluteFill}
                    paused
                    resizeMode="cover"
                    muted
                  />
                  <View style={styles.playIconCircle}>
                    <Svgicons
                      path="webcampIcon"
                      size={18}
                      color={Colors.WHITE}
                    />
                  </View>
                </View>
              ) : (
                <AppImage
                  source={{ uri: media.file_path }}
                  style={styles.imageAsset}
                />
              )}
            </ButtonView>
          );
        })}
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const isLocked = item.images && item.images.length > 0;
      return (
   <GlassCard
        width="100%"
        style={[
          styles.taskCard,
          // ✅ Add this line to change background color when checked
          item.isChecked && { backgroundColor: Colors.WHITE }
        ]}
      >
          <View style={styles.taskRow}>
            <GlassCard width={46} style={styles.checkboxGlassWrapper}>
              <Checkbox
                isChecked={item.isChecked}
                onPress={() => toggleItem(item.id)}
                disabled={isLocked}
              />
            </GlassCard>
            <ButtonView
              style={{ flex: 1, marginLeft: 10 }}
              onPress={() => handleOpenEdit(item)}
              activeOpacity={isLocked ? 1 : 0.7}
            >
              <AppText
                text={item.name}
                fontSize={14}
                color={Colors.BLACK}
                lineHeight={18}
              />
            </ButtonView>
          </View>
          {renderMedia(item.images)}
        </GlassCard>
      );
    },
    [toggleItem, handleOpenEdit, taskStatus],
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
          <HeaderApp isGoBackAfterLogo />
          <FlatListSimpleHandler
            data={localItems}
            renderItem={renderItem}
            isLoading={isLoading}
            renderSkeleton={() => <ChecklistDetailSkeleton />}
            onRefresh={onRefresh}
            contentContainerStyle={styles.listContent}
            HeaderComponent={
              <View>
                <AppText
                  text={`${title} Checklist`}
                  fontSize={28}
                  type="Bold"
                  mb={12}
                  mt={20}
                />
                {
                  // storeTaskStatus == 'todo' || storeTaskStatus == 'template' || storeTaskStatus == 'inprogress'
                  taskStatus !== 'completed' && (
                    <View style={styles.addMoreContainer}>
                      <ButtonView
                        onPress={() => {
                          setSelectedItem(null);
                          reset();
                          bottomSheetRef.current?.expand();
                        }}
                      >
                        <GlassCard width="auto" style={styles.addMoreBtn}>
                          {/* <View style={styles.addMoreInner}> */}

                          <AppText
                            text={t('app.checklist_detail.add_more')}
                            fontSize={12}
                            type="Medium"
                          />
                          {/* </View> */}
                        </GlassCard>
                      </ButtonView>
                    </View>
                  )
                }
              </View>
            }
            ListFooterComponent={<View style={{ height: 120 }} />}
            keyExtractor={item => item.id.toString()}
          />

          {taskStatus !== 'completed' && (
            <View style={styles.footer}>
              <AppButton
                title={t('app.checklist_detail.save')}
                backgroundColor={Colors.PRIMARY_TEAL}
                borderColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                onPress={saveAndContinue}
                loading={isLoading}
              />
            </View>
          )}

          {/* Video Player Modal */}
          <Modal
            visible={!!selectedVideo}
            transparent={false}
            animationType="fade"
          >
            <View style={styles.videoModalContainer}>
              <ButtonView
                style={styles.closeBtn}
                onPress={() => setSelectedVideo(null)}
              >
                <Svgicons path="closeIcon" size={30} color={Colors.WHITE} />
              </ButtonView>
              {selectedVideo && (
                <Video
                  source={{ uri: selectedVideo }}
                  style={styles.fullScreenVideo}
                  controls
                  resizeMode="contain"
                />
              )}
            </View>
          </Modal>

          {/* Image Viewer */}
          <ImageView
            images={currentImage}
            visible={isImageViewerVisible}
            onRequestClose={() => setIsImageViewerVisible(false)}
          />

          {/* Bottom Sheet for Add/Edit */}
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            onAnimate={(_, toIndex) => {
              if (toIndex === -1) Keyboard.dismiss();
            }}
            backdropComponent={props => (
              <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
              />
            )}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.sheetIndicator}
          >
            <BottomSheetView style={styles.sheetContent}>
              {/* Header with Close Button */}
              <View style={styles.sheetHeader}>
                <AppText
                  text={selectedItem ? 'Edit Checklist' : 'Add New Checklist'}
                  fontSize={24}
                  type="Medium"
                />
                <ButtonView
                  onPress={closeSheet}
                  style={styles.closeButton}
                >
                  <Svgicons
                    path="crossIconTask"
                    size={14}
                    color={Colors.BLACK}
                  />
                </ButtonView>
              </View>

              <View style={styles.inputWrapper}>
                <InputField
                  name="itemName"
                  label={t('app.checklist_detail.add_item')}
                  control={control}
                  errors={errors}
                  placeholder="e.g. Clean the windows"
                  rules={{ required: 'Required' }}
                />
              </View>

              <AppButton
                title={selectedItem ? 'Update' : 'Add'}
                backgroundColor={Colors.PRIMARY_TEAL}
                borderColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                mt={25}
                borderRadius={30}
                onPress={handleSubmit(onFormSubmit)}
              />
            </BottomSheetView>
          </BottomSheet>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: Metrics.verticalScale(0),
  },
  taskCard: { padding: 16, marginBottom: 15, borderRadius: 20 },
  taskRow: { flexDirection: 'row', alignItems: 'center' },
  checkboxGlassWrapper: {
    width: 40,
    height: 40,
    padding: 0, // Remove internal padding to center the checkbox
    marginBottom: 0, // Override GlassCard default margin
    borderRadius: 12, // Matches the slightly rounded corners in your image
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreContainer: { alignItems: 'flex-end', marginBottom: 12 },
  addMoreBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12 },
  addMoreInner: { flexDirection: 'row', alignItems: 'center' },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    marginHorizontal: -5,
  },
  mediaBox: {
    width: (width - 110) / 2,
    height: 120,
    margin: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  imageAsset: { width: '100%', height: '100%' },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: { position: 'absolute', bottom: 30, left: 25, right: 25 },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullScreenVideo: { width: width, height: height * 0.8 },
  closeBtn: { position: 'absolute', top: 50, right: 25, zIndex: 10 },

  //

  sheetBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 40,
    // marginHorizontal: 10,
  },
  sheetIndicator: {
    backgroundColor: '#ccc',
    width: 60,
  },
  sheetContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#BFBFBF',
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    // Optional: consistent background for the input area
    // backgroundColor: 'rgba(255, 255, 255, 0.4)',
    // borderRadius: 15,
  },
});

export default ChecklistDetail;
