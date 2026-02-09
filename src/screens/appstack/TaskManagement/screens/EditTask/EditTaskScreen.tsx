import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Video from 'react-native-video';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Checkbox from '@/components/molecules/Input/CheckBox';
import EditTaskContainer from '../../containers/EditTask/EditTaskContainer';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const { width, height } = Dimensions.get('window');

interface ImageSource {
  uri: string;
}

const EditTaskScreen = () => {
  const {
    taskDetail,
    isLoadingTaskDetail,
    control,
    errors,
    handleSave,
    capitalizeFirst,
    checklists,
    isLoadingChecklist,
    checklistDetail,
    isLoadingChecklistDetail,
    expandedId,
    toggleExpand,
    taskStatus,
    vendorDropdown,
    selectedChecklistIds,
    toggleChecklistItem,
    isSavingVendor,
    isSavingChecklist,
  } = EditTaskContainer();

  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageSource[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [preActivityExpanded, setPreActivityExpanded] = useState(false);

  // Helper to check if file is a video
  const checkIsVideo = (item: any) => {
    const path = item?.file_path?.toLowerCase() || '';
    return (
      item.type === 'video' || path.endsWith('.mp4') || path.endsWith('.mov')
    );
  };

  const handlePreview = (item: any) => {
    const path = item?.file_path;
    if (!path) return;

    if (checkIsVideo(item)) {
      setVideoUrl(path);
    } else {
      setCurrentImage([{ uri: path }]);
      setImageViewerVisible(true);
    }
  };

  const toggleImageLoad = (id: string | number) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  // --- Header Component (Pre-Activity) ---
  const ListHeader = useMemo(() => {
    if (!taskDetail) return null;

    const preActivityMedia = [
      ...(taskDetail?.images || []),
      ...(taskDetail?.video || []),
    ];

    return (
      <View>
        <View style={styles.header}>
          <AppText
            text={capitalizeFirst(taskDetail?.title)}
            fontSize={23}
            type="Bold"
            color={Colors.PINE_FOREST}
            // style={{textAlign:"center"}}
          />
          <Svgicons path="File_Document" size={30} ml={10} />
        </View>

        <View style={styles.infoSection}>
          <AppText
            text="Task Description:"
            fontSize={14}
            type="Medium"
            color={Colors.PINE_FOREST}
            mb={8}
          />
          <AppText
            text={`"${taskDetail?.description || ''}"`}
            fontSize={14}
            color={Colors.BRUNSWICK_GREEN}
            mb={28}
          />
          <AppText
            text="Property:"
            fontSize={14}
            type="Medium"
            color={Colors.PINE_FOREST}
            mb={8}
          />
          <AppText
            text={taskDetail?.listing_title || 'N/A'}
            fontSize={14}
            color={Colors.BRUNSWICK_GREEN}
            mb={28}
          />

          {taskStatus === 'todo' ? (
            <DropdownField
              name="assignTask"
              label="Assign Task"
              control={control}
              errors={errors}
              data={vendorDropdown}
            />
          ) : (
            <View>
              <AppText
                text="Task Assigned:"
                fontSize={14}
                type="Medium"
                color={Colors.PINE_FOREST}
                mb={8}
              />
              <AppText
                text={taskDetail?.assigned_user?.name || 'N/A'}
                fontSize={14}
                color={Colors.BRUNSWICK_GREEN}
                mb={28}
              />
            </View>
          )}
        </View>

        <View style={styles.checklistTitleRow}>
          <AppText
            text="Pre Activity Preview"
            fontSize={23}
            type="Bold"
            color={Colors.PINE_FOREST}
          />
          <Svgicons path="webcampIcon" size={30} />
        </View>

        <GradientBorder
          style={styles.gradientWrapper}
          borderRadius={15}
          borderWidth={1.5}
        >
          <View style={styles.sectionContainer}>
            <ButtonView
              style={styles.sectionHeader}
              onPress={() => setPreActivityExpanded(!preActivityExpanded)}
            >
              <View style={styles.row}>
                <Svgicons path={'bedroom'} size={24} mr={12} />
                <AppText
                  text="View Images/Video"
                  fontSize={18}
                  type="Bold"
                  color={Colors.PINE_FOREST}
                />
              </View>
              <View style={styles.arrowCircle}>
                <Svgicons
                  path="chevronDown"
                  size={14}
                  style={{
                    transform: [
                      { rotate: preActivityExpanded ? '180deg' : '0deg' },
                    ],
                  }}
                />
              </View>
            </ButtonView>

            {preActivityExpanded && (
              <View style={styles.checklistContent}>
                <View style={styles.mediaContainer}>
                  {preActivityMedia.map((media: any, index: number) => {
                    const mediaId = media.id || `pre-${index}`;
                    const isVideo = checkIsVideo(media);
                    return (
                      <ButtonView
                        key={mediaId}
                        onPress={() => handlePreview(media)}
                        style={styles.mediaWrapper}
                      >
                        <ShimmerPlaceholder
                          visible={imageLoaded[mediaId]}
                          style={styles.shimmerStyle}
                        >
                          {isVideo ? (
                            <View
                              style={styles.videoPlaceholder}
                              onLayout={() => toggleImageLoad(mediaId)}
                            >
                              <Svgicons path="webcampIcon" size={30} />
                              <AppText
                                text="Video"
                                fontSize={10}
                                color={Colors.PINE_FOREST}
                                mt={4}
                              />
                            </View>
                          ) : (
                            <Image
                              source={{ uri: media.file_path }}
                              style={styles.mediaImage}
                              onLoad={() => toggleImageLoad(mediaId)}
                            />
                          )}
                        </ShimmerPlaceholder>
                      </ButtonView>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </GradientBorder>

        <View style={styles.checklistTitleRow}>
          <AppText
            text={
              taskStatus === 'todo'
                ? 'Check-list Management'
                : 'Post Activity Preview'
            }
            fontSize={23}
            type="Bold"
            color={Colors.PINE_FOREST}
          />
          <Svgicons
            path={taskStatus === 'todo' ? 'File_Document' : 'webcampIcon'}
            size={30}
          />
        </View>
      </View>
    );
  }, [
    taskDetail,
    preActivityExpanded,
    imageLoaded,
    control,
    errors,
    vendorDropdown,
  ]);

  if (isLoadingTaskDetail) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PINE_FOREST} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatListSimpleHandler
        data={checklists}
        isLoading={isLoadingChecklist}
        listEmptyText="No checklists available"
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <GradientBorder
            style={styles.gradientWrapper}
            borderRadius={15}
            borderWidth={1.5}
          >
            <View style={styles.sectionContainer}>
              <ButtonView
                style={styles.sectionHeader}
                onPress={() => toggleExpand(item.id)}
              >
                <View style={styles.row}>
                  <Svgicons path={'bedroom'} size={24} mr={12} />
                  <AppText
                    text={item.name}
                    fontSize={18}
                    type="Bold"
                    color={Colors.PINE_FOREST}
                    style={{ maxWidth: 240 }}
                  />
                </View>
                <View style={styles.arrowCircle}>
                  <Svgicons
                    path="chevronDown"
                    size={14}
                    style={{
                      transform: [
                        { rotate: expandedId === item.id ? '180deg' : '0deg' },
                      ],
                    }}
                  />
                </View>
              </ButtonView>

              {expandedId === item.id && (
                <View style={styles.checklistContent}>
                  {isLoadingChecklistDetail ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.PINE_FOREST}
                    />
                  ) : (
                    checklistDetail?.items?.map((check: any) => (
                      <View key={check.id} style={styles.checkItemContainer}>
                        <View style={styles.checkItemRow}>
                          {taskStatus === 'todo' && (
                            <Checkbox
                              isChecked={
                                selectedChecklistIds.includes(check.id) ||
                                !!check.completed
                              }
                              onPress={() => toggleChecklistItem(check.id)}
                            />
                          )}
                          <AppText
                            text={check.name}
                            fontSize={12}
                            color={Colors.PINE_FOREST}
                            ml={taskStatus === 'todo' ? 12 : 0}
                          />
                        </View>

                        {/* --- Post Activity / Checklist Media --- */}
                        {check.images?.length > 0 && (
                          <View style={styles.mediaContainer}>
                            {check.images.map((img: any, idx: number) => {
                              const mediaId =
                                img.id || `check-${check.id}-${idx}`;
                              const isVideo = checkIsVideo(img);
                              return (
                                <ButtonView
                                  key={mediaId}
                                  onPress={() => handlePreview(img)}
                                  style={styles.mediaWrapper}
                                >
                                  <ShimmerPlaceholder
                                    visible={imageLoaded[mediaId]}
                                    style={styles.shimmerStyle}
                                  >
                                    {isVideo ? (
                                      <View
                                        style={styles.videoPlaceholder}
                                        onLayout={() =>
                                          toggleImageLoad(mediaId)
                                        }
                                      >
                                        <Svgicons
                                          path="webcampIcon"
                                          size={24}
                                        />
                                        <AppText
                                          text="Video"
                                          fontSize={9}
                                          color={Colors.PINE_FOREST}
                                        />
                                      </View>
                                    ) : (
                                      <Image
                                        source={{ uri: img.file_path }}
                                        style={styles.mediaImage}
                                        onLoad={() => toggleImageLoad(mediaId)}
                                      />
                                    )}
                                  </ShimmerPlaceholder>
                                </ButtonView>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          </GradientBorder>
        )}
      />

      {/* MODALS */}
      <ImageView
        images={currentImage}
        imageIndex={0}
        visible={isImageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />

      <Modal visible={!!videoUrl} transparent={false} animationType="slide">
        <View style={styles.videoModalContainer}>
          <ButtonView
            style={styles.closeVideoBtn}
            onPress={() => setVideoUrl(null)}
          >
            <AppText text="✕ Close" color="#FFF" type="Bold" fontSize={18} />
          </ButtonView>
          {videoUrl && (
            <Video
              source={{ uri: videoUrl }}
              style={styles.fullVideo}
              controls={true}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {taskStatus === 'todo' && (
        <View style={styles.footer}>
          <AppButton
            title={
              isSavingVendor || isSavingChecklist ? 'Saving...' : 'Save Changes'
            }
            color={Colors.PINE_FOREST}
            onPress={handleSave}
            disabled={isSavingVendor || isSavingChecklist}
            loading={isSavingVendor || isSavingChecklist}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal:20
  },
  infoSection: { marginBottom: 25 },
  checklistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
    gap: 10,
  },
  gradientWrapper: { marginBottom: 16 },
  sectionContainer: { backgroundColor: '#FFF', paddingVertical: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  arrowCircle: {
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistContent: { paddingHorizontal: 20, paddingBottom: 20, marginTop: 5 },
  checkItemContainer: { marginBottom: 15 },
  checkItemRow: { flexDirection: 'row', alignItems: 'center' },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 10,
  },
  mediaWrapper: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
  },
  shimmerStyle: { width: 80, height: 80, borderRadius: 10 },
  mediaImage: { width: '100%', height: '100%' },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F2',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullVideo: { width: '100%', height: '80%' },
  closeVideoBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  footer: { padding: 20 },
});

export default EditTaskScreen;
