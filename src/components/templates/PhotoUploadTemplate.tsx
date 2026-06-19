import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import CircularProgress from '../molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '../molecules/BGImage/BGImage';
import { useMediaUpload, MediaItem } from './useMediaUpload';
import Metrics from '@/utility/Metrics';
import RefreshableScrollView from '../organisms/RefreshableScrollView/RefreshableScrollView';
import ImageViewing from 'react-native-image-viewing';
import ButtonView from '../molecules/AppButton/ButtonView';
import { useTranslation } from 'react-i18next';
import PhotoUploadTemplateSkeleton from '../Skeletons/PhotoUploadTemplateSkeleton';
// ── Import Reusable Footer ──
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

const PhotoUploadTemplate = (props: any) => {
  const { t } = useTranslation();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );
  const [showOptions, setShowOptions] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { isPopupVisible, setPopupVisible, uploadActions, handlePick } =
    useMediaUpload({
      maxImages: props.maxImages,
      maxVideos: props.maxVideos,
      mediaList: props.mediaList,
      onMediaChange: props.onMediaChange,
    });

  const featuredItem = props.mediaList.find(item => item.isFeatured);

  const renderMediaItem = ({
    item,
    index,
  }: {
    item: MediaItem;
    index: number;
  }) => (
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

      {deletingIndex === index && props.isDeleting ? (
        <View style={styles.deletingOverlay}>
          <ActivityIndicator size="small" color={Colors.MEDIUM_JUNGLE_GREEN} />
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

  if (props.isFetching) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <PhotoUploadTemplateSkeleton />
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
            <ButtonView onPress={() => goBack()}>
              <Svgicons path="back" size={40} />
            </ButtonView>
            {props.primaryBtnTitle && (
              <CircularProgress
                percentage={props.percentage}
                size={48}
                strokeWidth={4}
              />
            )}
          </View>

          {props.step && (
            <AppText text={props.step} fontSize={18} type="Medium" mb={23} />
          )}
          <AppText text={props.screenTitle} fontSize={32} type="Bold" mt={25} />

          <View style={styles.infoSection}>
            <AppText
              text={t('app.photo_upload.upload_limit', {
                maxImages: props.maxImages,
                maxVideos: props.maxVideos,
              })}
              fontSize={14}
              color="#6B6B6B"
            />
            <AppText
              text={t('app.photo_upload.format_hint')}
              fontSize={14}
              color="#6B6B6B"
            />
            <AppText
              text={t('app.photo_upload.size_hint')}
              fontSize={14}
              color="#6B6B6B"
            />
          </View>

          <AppText
            text={props.sectionTitle}
            fontSize={22}
            type="Bold"
            mt={30}
            mb={15}
          />

          {props.mediaList.length === 0 ? (
            <View>
              <ButtonView
                activeOpacity={0.8}
                style={styles.glassCard}
                onPress={() => handlePick()}
              >
                <Svgicons path="plusIcon" size={24} />
                <AppText
                  text={t('app.photo_upload.add_photos')}
                  ml={15}
                  fontSize={16}
                  type="Medium"
                />
              </ButtonView>
              <ButtonView
                activeOpacity={0.8}
                style={styles.glassCard}
                onPress={() => uploadActions.takePhoto()}
              >
                <Svgicons path="cameraIcon" size={24} />
                <AppText
                  text={t('app.photo_upload.take_picture')}
                  ml={15}
                  fontSize={16}
                  type="Medium"
                />
              </ButtonView>
            </View>
          ) : (
            <View>
              <View style={{ alignSelf: 'flex-end' }}>
                <AppButton
                  title={t('app.photo_upload.add_more')}
                  leftIcon="plusIcon"
                  variant="secondary"
                  fontSize={14}
                  onPress={() => handlePick()}
                  style={styles.addMoreMini}
                  type="SemiBold"
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
                    style={{ width: '100%', height: 200, borderRadius: 12 }}
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

        {/* ── Reusable Footer Actions (hidden in edit mode — these only navigate, no API call) ── */}
        {!props.isEdit && (
          <FormFooterActions
            primaryTitle={props.primaryBtnTitle}
            onPrimaryPress={props.onPrimaryPress}
            isPrimaryLoading={props.primaryLoading}
            secondaryTitle={props.secondaryBtnTitle}
            onSecondaryPress={props.onSecondaryPress}
            isSecondaryLoading={props.secondaryLoading || props.primaryLoading}
          />
        )}

        {/* Gallery/Camera Modal */}
        <Modal visible={isPopupVisible} transparent animationType="fade">
          <ButtonView
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setPopupVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalIndicator} />
              <AppText
                text={t('app.photo_upload.select_media')}
                type="Bold"
                fontSize={18}
                mb={20}
                textAlign="center"
              />
              <ButtonView
                style={styles.optionRow}
                onPress={uploadActions.fromGallery}
              >
                <Svgicons path="imageIcon" size={24} color={Colors.BLACK} />
                <AppText
                  text={t('app.photo_upload.gallery')}
                  ml={15}
                  fontSize={16}
                />
              </ButtonView>
              <ButtonView
                style={styles.optionRow}
                onPress={uploadActions.takePhoto}
              >
                <Svgicons path="cameraIcon" size={24} color={Colors.BLACK} />
                <AppText
                  text={t('app.photo_upload.take_photo')}
                  ml={15}
                  fontSize={16}
                />
              </ButtonView>
              <AppButton
                title={t('app.photo_upload.cancel')}
                mt={20}
                onPress={() => setPopupVisible(false)}
              />
            </View>
          </ButtonView>
        </Modal>

        {/* Actions Modal — Cover/Delete */}
        <Modal visible={showOptions} transparent animationType="fade">
          <ButtonView
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowOptions(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalIndicator} />
              <AppButton
                title={t('app.photo_upload.set_cover')}
                variant="secondary"
                onPress={() => {
                  props.onSetCover?.(selectedItemIndex!);
                  setShowOptions(false);
                }}
              />
              <AppButton
                title={t('app.photo_upload.delete_picture')}
                mt={15}
                onPress={() => {
                  setDeletingIndex(selectedItemIndex!);
                  props.onDelete?.(selectedItemIndex!);
                  setShowOptions(false);
                }}
              />
              <AppButton
                title={t('app.photo_upload.cancel')}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
  },
  infoSection: { marginTop: 15 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  addMoreMini: { paddingVertical: Metrics.verticalScale(10), margin: 0 },
  mediaWrapper: {
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: { width: '100%', height: '100%', backgroundColor: '#EEE' },
  moreBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 40,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default PhotoUploadTemplate;
