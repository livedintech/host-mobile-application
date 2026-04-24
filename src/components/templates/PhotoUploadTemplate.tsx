import React, { useState } from 'react';
import {
  StyleSheet, View, Image, FlatList,
  Modal, ActivityIndicator
} from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '../molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '../molecules/BGImage/BGImage';
import { useMediaUpload, MediaItem } from './useMediaUpload';
import Metrics from '@/utility/Metrics';
import RefreshableScrollView from '../organisms/RefreshableScrollView/RefreshableScrollView';
import ImageViewing from 'react-native-image-viewing';
import ButtonView from '../molecules/AppButton/ButtonView';
import { useTranslation } from 'react-i18next';

const PhotoUploadTemplate = (props: any) => {
  const { t } = useTranslation();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const {
    isPopupVisible,
    setPopupVisible,
    uploadActions,
    handlePick,
  } = useMediaUpload({
    maxImages: props.maxImages,
    maxVideos: props.maxVideos,
    mediaList: props.mediaList,
    onMediaChange: props.onMediaChange,
  });

  const featuredItem = props.mediaList.find(item => item.isFeatured);
  console.log('featuredItem',props.mediaList);
  

  const renderMediaItem = ({ item, index }: { item: MediaItem; index: number }) => (
    <View style={styles.mediaWrapper}>
      <ButtonView
        activeOpacity={0.9}
        onPress={() => {
          setSelectedImage(item.path);
          setIsViewerVisible(true);
        }}
      >
        <Image source={{ uri: item.path }} style={styles.thumbnail} />
      </ButtonView>

      {/* ✅ Delete loader */}
      {deletingIndex === index && props.isDeleting ? (
        <View style={styles.deletingOverlay}>
          <ActivityIndicator size="small" color={Colors.WHITE} />
        </View>
      ) : null}

      <ButtonView
        style={styles.moreBtn}
        onPress={() => {
          setSelectedItemIndex(index);
          setShowOptions(true);
        }}
      >
        <Svgicons path="threeDots" size={16} color={Colors.BLACK} />
      </ButtonView>
    </View>
  );

  // ✅ Fetching loader
  if (props.isFetching) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
          <AppText text={t('app.photo_upload.loading')} mt={15} fontSize={14} color={Colors.DARK_CHARCOAL_OPACITY} />
        </View>
      </BGImage>
    );
  }

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <RefreshableScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshing={props.isFetching}
          onRefresh={props.onRefresh}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <ButtonView style={styles.backBtnWrapper} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </ButtonView>
            </GradientBorder>
            {/* ✅ Edit mode mein progress hide */}
            {props.primaryBtnTitle && (
              <CircularProgress percentage={props.percentage} size={48} strokeWidth={4} />
            )}
          </View>

          {props.step && (
            <AppText text={props.step} fontSize={18} type="Medium" mt={25} mb={23} />
          )}
          <AppText text={props.screenTitle} fontSize={32} type="Bold" />

          <View style={styles.infoSection}>
            <AppText text={`Upload up to ${props.maxImages} images and ${props.maxVideos} video per section.`} fontSize={14} color="#6B6B6B" />
            <AppText text={t('app.photo_upload.format_hint')} fontSize={14} color="#6B6B6B" />
            <AppText text={t('app.photo_upload.size_hint')} fontSize={14} color="#6B6B6B" />
          </View>

          <AppText text={props.sectionTitle} fontSize={22} type="Bold" mt={30} mb={15} />

          {props.mediaList.length === 0 ? (
            <View>
              <ButtonView activeOpacity={0.8} style={styles.glassCard} onPress={() => handlePick()}>
                <Svgicons path="plusIcon" size={24} />
                <AppText text={t('app.photo_upload.add_photos')} ml={15} fontSize={16} type="Medium" />
              </ButtonView>
              <ButtonView activeOpacity={0.8} style={styles.glassCard} onPress={() => uploadActions.takePhoto()}>
                <Svgicons path="cameraIcon" size={24} />
                <AppText text={t('app.photo_upload.take_picture')} ml={15} fontSize={16} type="Medium" />
              </ButtonView>
            </View>
          ) : (
            <View>
              <View style={{ alignSelf: 'flex-end' }}>
                <AppButton
                  title="Add More"
                  leftIcon="plusIcon"
                  variant="secondary"
                  fontSize={14}
                  onPress={() => handlePick()}
                  style={styles.addMoreMini}
                  type='SemiBold'
                  borderRadius={13}
                  mb={30}
                />
              </View>

              {featuredItem && (
                <ButtonView
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedImage(featuredItem.path);
                    setIsViewerVisible(true);
                  }}
                  style={{ marginBottom: 20 }}
                >
                  <Image
                    source={{ uri: featuredItem.path }}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 12,
                    }}
                  />
                </ButtonView>
              )}
              <FlatList
                data={props.mediaList}
                renderItem={renderMediaItem}
                numColumns={2}
                keyExtractor={(_, i) => i.toString()}
                scrollEnabled={false}
                style={{ paddingBottom: Metrics.verticalScale(50) }}
              />
            </View>
          )}
        </RefreshableScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {props.primaryBtnTitle && (
            <AppButton
              title={props.primaryBtnTitle}
              variant="secondary"
              onPress={props.onPrimaryPress}
              loading={props.primaryLoading}
            />
          )}
          <AppButton
            title={props.secondaryBtnTitle}
            mt={props.primaryBtnTitle ? 12 : 0}
            onPress={props.onSecondaryPress}
            loading={props.secondaryLoading || props.primaryLoading}
          />
        </View>

        {/* Gallery/Camera Modal */}
        <Modal visible={isPopupVisible} transparent animationType="fade">
          <ButtonView style={styles.modalOverlay} activeOpacity={1} onPress={() => setPopupVisible(false)}>
            <View style={styles.modalContent}>
              <View style={styles.modalIndicator} />
              <AppText text={t('app.photo_upload.select_media')} type="Bold" fontSize={18} mb={20} textAlign="center" />
              <ButtonView style={styles.optionRow} onPress={uploadActions.fromGallery}>
                <Svgicons path="imageIcon" size={24} color={Colors.BLACK} />
                <AppText text={t('app.photo_upload.gallery')} ml={15} fontSize={16} />
              </ButtonView>
              <ButtonView style={styles.optionRow} onPress={uploadActions.takePhoto}>
                <Svgicons path="cameraIcon" size={24} color={Colors.BLACK} />
                <AppText text={t('app.photo_upload.take_photo')} ml={15} fontSize={16} />
              </ButtonView>
              <AppButton title="Cancel" mt={20} onPress={() => setPopupVisible(false)} />
            </View>
          </ButtonView>
        </Modal>

        {/* Actions Modal — Cover/Delete */}
        <Modal visible={showOptions} transparent animationType="fade">
          <ButtonView style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowOptions(false)}>
            <View style={styles.modalContent}>
              <View style={styles.modalIndicator} />

              {/* ✅ Cover photo */}
              <AppButton
                title="Make this picture the cover photo"
                variant="secondary"
                onPress={() => {
                  props.onSetCover?.(selectedItemIndex!);
                  setShowOptions(false);
                }}
              />

              {/* ✅ Delete */}
              <AppButton
                title="Delete picture"
                mt={15}
                onPress={() => {
                  setDeletingIndex(selectedItemIndex!); // ✅ track karo
                  props.onDelete?.(selectedItemIndex!);
                  setShowOptions(false);
                }}
              />

              <AppButton
                title="Cancel"
                mt={15}
                variant="secondary"
                onPress={() => setShowOptions(false)}
              />
            </View>
          </ButtonView>
        </Modal>
      </View>
      <ImageViewing
        images={selectedImage ? [{ uri: selectedImage }] : []}
        imageIndex={0}
        visible={isViewerVisible}
        onRequestClose={() => {
          setIsViewerVisible(false);
          setSelectedImage(null);
        }}
      />
    </BGImage>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 160 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' },
  backBtnWrapper: { width: 32, height: 32, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  infoSection: { marginTop: 15 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16, padding: 25,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 15, borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  addMoreMini: { paddingVertical: Metrics.verticalScale(10), margin: 0 },
  mediaWrapper: { width: '48%', aspectRatio: 1, margin: '1%', borderRadius: 12, overflow: 'hidden' },
  thumbnail: { width: '100%', height: '100%', backgroundColor: '#EEE' },
  featuredBadge: {
    position: 'absolute', bottom: 6, left: 6,
    backgroundColor: Colors.EMERALD_TEAL,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  moreBtn: {
    position: 'absolute', top: 5, right: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10, padding: 4,
  },
  footer: {
    position: 'absolute', bottom: 0, width: '100%',
    padding: 25, backgroundColor: 'rgba(255,255,255,0.95)', paddingBottom: 35,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.WHITE, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, paddingBottom: 40 },
  modalIndicator: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  deletingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default PhotoUploadTemplate;