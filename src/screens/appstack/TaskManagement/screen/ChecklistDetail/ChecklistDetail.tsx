import React, { useRef, useMemo, useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
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

const { width, height } = Dimensions.get('window');

const ChecklistDetail = ({ route }: any) => {
  const { title, sectionId, taskId } = route.params;

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

  // Hides "Add more" if any existing item has media from API
  const hasExistingMedia = useMemo(() => {
    return localItems?.some(item => item.images && item.images.length > 0);
  }, [localItems]);

  const onFormSubmit = (data: any) => {
    if (selectedItem) {
      updateItem(selectedItem.id, data.itemName);
    } else {
      addItem(data.itemName);
    }
    bottomSheetRef.current?.close();
    reset();
  };

  const handleOpenEdit = (item: any) => {
    if (item.images && item.images.length > 0) return;
    setSelectedItem({ id: item.id, name: item.name });
    setValue('itemName', item.name);
    bottomSheetRef.current?.expand();
  };

  const renderMedia = (mediaItems: any[]) => {
    if (!mediaItems || mediaItems.length === 0) return null;
    return (
      <View style={styles.mediaGrid}>
        {mediaItems.map((media, index) => {
          const isVideo =
            media.type === 'video' ||
            media.file_path?.toLowerCase().endsWith('.mp4');
          return (
            <TouchableOpacity
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
                <Image
                  source={{ uri: media.file_path }}
                  style={styles.imageAsset}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const isLocked = item.images && item.images.length > 0;
      return (
        <GlassCard width="100%" style={styles.taskCard}>
          <View style={styles.taskRow}>
            <Checkbox
              isChecked={item.isChecked}
              onPress={() => toggleItem(item.id)}
              disabled={isLocked}
            />
            <ButtonView
              style={{ flex: 1, marginLeft: 10 }}
              onPress={() => handleOpenEdit(item)}
              activeOpacity={isLocked ? 1 : 0.7}
            >
              <AppText
                text={item.name}
                fontSize={15}
                color={Colors.BLACK}
                lineHeight={20}
              />
            </ButtonView>
          </View>
          {renderMedia(item.images)}
        </GlassCard>
      );
    },
    [toggleItem],
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
          HeaderComponent={
            <View>
              <AppText
                text={`${title} Checklist`}
                fontSize={28}
                type="Bold"
                mb={12}
                mt={20}
              />
              {!hasExistingMedia && (
                <View style={styles.addMoreContainer}>
                  <ButtonView
                    onPress={() => {
                      setSelectedItem(null);
                      reset();
                      bottomSheetRef.current?.expand();
                    }}
                  >
                    <GlassCard width="auto" style={styles.addMoreBtn}>
                      <View style={styles.addMoreInner}>
                        <Svgicons
                          path="plusIcon"
                          size={14}
                          color={Colors.BLACK}
                        />
                        <AppText
                          text="Add more"
                          fontSize={12}
                          type="Medium"
                          ml={6}
                        />
                      </View>
                    </GlassCard>
                  </ButtonView>
                </View>
              )}
            </View>
          }
          ListFooterComponent={<View style={{ height: 120 }} />}
          keyExtractor={item => item.id.toString()}
        />

        <View style={styles.footer}>
          <AppButton
            title="Save"
            backgroundColor={Colors.PRIMARY_TEAL}
            borderColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            onPress={saveAndContinue}
            loading={isLoading}
          />
        </View>

        {/* Video Player Modal */}
        <Modal
          visible={!!selectedVideo}
          transparent={false}
          animationType="fade"
        >
          <View style={styles.videoModalContainer}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedVideo(null)}
            >
              <Svgicons path="closeIcon" size={30} color={Colors.WHITE} />
            </TouchableOpacity>
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
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
        >
          <BottomSheetView style={styles.sheetContent}>
            <AppText
              text={selectedItem ? 'Edit Checklist' : 'Add New Checklist'}
              fontSize={20}
              type="Bold"
              mb={15}
            />
            <InputField
              name="itemName"
              control={control}
              errors={errors}
              placeholder="e.g. Clean the windows"
              rules={{ required: 'Required' }}
            />
            <AppButton
              title={selectedItem ? 'Update' : 'Add'}
              backgroundColor={Colors.PRIMARY_TEAL}
              color={Colors.WHITE}
              mt={20}
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
  listContent: { paddingHorizontal: 25, paddingBottom: 150 },
  taskCard: { padding: 16, marginBottom: 15, borderRadius: 20 },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start' },
  addMoreContainer: { alignItems: 'flex-end', marginBottom: 12 },
  addMoreBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12 },
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
  footer: { position: 'absolute', bottom: 30, left: 25, right: 25, },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullScreenVideo: { width: width, height: height * 0.8 },
  closeBtn: { position: 'absolute', top: 50, right: 25, zIndex: 10 },
  sheetContent: { padding: 25 },
});

export default ChecklistDetail;
