import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
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

const PhotoUploadTemplate = (props: any) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  // Hook for media selection logic
  const {
    isPopupVisible,
    setPopupVisible,
    uploadActions,
    removeMedia,
    handlePick
  } = useMediaUpload({
    maxImages: props.maxImages,
    maxVideos: props.maxVideos,
    mediaList: props.mediaList,
    onMediaChange: props.onMediaChange,
  });

  const renderMediaItem = ({ item, index }: { item: MediaItem; index: number }) => (
    <View style={styles.mediaWrapper}>
      <Image source={{ uri: item.path }} style={styles.thumbnail} />
      <TouchableOpacity
        style={styles.moreBtn}
        onPress={() => {
          setSelectedItemIndex(index);
          setShowOptions(true);
        }}
      >
        <Svgicons path="threeDots" size={16} color={Colors.BLACK} />
      </TouchableOpacity>
    </View>
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <TouchableOpacity style={styles.backBtnWrapper} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </TouchableOpacity>
            </GradientBorder>
            <CircularProgress percentage={props.percentage} size={48} strokeWidth={4} />
          </View>

          {props.step && (
            <AppText text={props.step} fontSize={18} type="Medium" mt={25} mb={23} />
          )}
          <AppText text={props.screenTitle} fontSize={32} type="Bold" />

          <View style={styles.infoSection}>
            <AppText text={`Upload up to ${props.maxImages} images and ${props.maxVideos} video per section.`} fontSize={14} color="#6B6B6B" />
            <AppText text="Allowed formats: jpg, png, mp4" fontSize={14} color="#6B6B6B" />
            <AppText text="Video limit: ≤ 20 MB" fontSize={14} color="#6B6B6B" />
          </View>

          <AppText text={props.sectionTitle} fontSize={22} type="Bold" mt={30} mb={15} />

          {/* Upload Area */}
          {props.mediaList.length === 0 ? (
            <View>
              <TouchableOpacity activeOpacity={0.8} style={styles.glassCard} onPress={() => handlePick()}>
                <Svgicons path="plusIcon" size={24} />
                <AppText text="Add Photos & Videos" ml={15} fontSize={16} type="Medium" />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.glassCard} onPress={() => uploadActions.takePhoto()}>
                <Svgicons path="cameraIcon" size={24} />
                <AppText text="Take New Picture" ml={15} fontSize={16} type="Medium" />
              </TouchableOpacity>
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
              <FlatList
                data={props.mediaList}
                renderItem={renderMediaItem}
                numColumns={2}
                keyExtractor={(_, i) => i.toString()}
                scrollEnabled={false}
                style={{
                  paddingBottom: Metrics.verticalScale(50)
                }}
              />
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
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
            mt={12}
            onPress={props.onSecondaryPress}
            loading={props.primaryLoading}
          />
        </View>

        {/* Selection Modal (Gallery/Camera) */}
        <Modal visible={isPopupVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setPopupVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalIndicator} />
              <AppText text="Select Media" type="Bold" fontSize={18} mb={20} textAlign="center" />

              <TouchableOpacity style={styles.optionRow} onPress={uploadActions.fromGallery}>
                <Svgicons path="imageIcon" size={24} color={Colors.PRIMARY} />
                <AppText text="Gallery (Photo & Video)" ml={15} fontSize={16} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionRow} onPress={uploadActions.takePhoto}>
                <Svgicons path="cameraIcon" size={24} color={Colors.PRIMARY} />
                <AppText text="Take Photo" ml={15} fontSize={16} />
              </TouchableOpacity>

              <AppButton title="Cancel" mt={20} onPress={() => setPopupVisible(false)} />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Actions Modal (Cover/Delete) */}
        <Modal visible={showOptions} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowOptions(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalIndicator} />
              <AppButton
                title="Make this picture the cover photo"
                variant="secondary"
                onPress={() => setShowOptions(false)}
              />
              <AppButton
                title="Delete picture"
                mt={15}
                onPress={() => {
                  removeMedia(selectedItemIndex!);
                  setShowOptions(false);
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 160 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' },
  backBtnWrapper: { width: 32, height: 32, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  infoSection: { marginTop: 15 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  addMoreMini: {
    paddingVertical: Metrics.verticalScale(10),
    margin: 0,
    marginRight: 0
  },
  mediaWrapper: { width: '48%', aspectRatio: 1, margin: '1%', borderRadius: 12, overflow: 'hidden' },
  thumbnail: { width: '100%', height: '100%', backgroundColor: '#EEE' },
  moreBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 4 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'rgba(255,255,255,0.95)', paddingBottom: 35 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.WHITE, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, paddingBottom: 40 },
  modalIndicator: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
});

export default PhotoUploadTemplate;