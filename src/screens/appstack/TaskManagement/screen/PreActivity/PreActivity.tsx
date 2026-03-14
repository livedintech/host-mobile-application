import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Video from 'react-native-video';

import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import BGImage from '@/components/molecules/BGImage/BGImage';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const { width, height } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const PreActivity = ({ route }: any) => {
  const taskData = route?.params?.taskData || {};
  
  const images = taskData?.images || [];
  const videos = taskData?.video || [];
  const allMedia = [...images, ...videos];

  // State for Image Viewer
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for Video Player
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const imageSources = images.map((img: any) => ({ uri: img.file_path }));

  const handleMediaPress = (item: any) => {
    if (item.type === 'video') {
      setSelectedVideo(item.file_path);
      setIsVideoLoading(true);
    } else {
      const imgIndex = images.findIndex((img: any) => img.id === item.id);
      setCurrentImageIndex(imgIndex >= 0 ? imgIndex : 0);
      setIsImageViewerVisible(true);
    }
  };

  const renderMediaItem = ({ item, index }: { item: any, index: number }) => {
    const isVideo = item.type === 'video';
    const isLarge = index === 0;

    return (
      <ButtonView 
        onPress={() => handleMediaPress(item)}
        style={[
          styles.mediaWrapper, 
          isLarge ? styles.largeMedia : styles.smallMedia
        ]}
      >
        {isVideo ? (
          <Video
            source={{ uri: item.file_path }}
            style={styles.mediaImage}
            paused={true}          
            resizeMode="cover"
            muted={true}
          />
        ) : (
          <Image
            source={{ uri: item.file_path }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        )}
        
        {isVideo && (
          <View style={styles.videoOverlay}>
            <View style={styles.playButtonCircle}>
               <Svgicons path={'webcampIcon'} size={isLarge ? 30 : 22} />
            </View>
          </View>
        )}
      </ButtonView>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.header}>
       
          <AppText text="Pre-activity Preview" fontSize={28} type="Bold" mt={20} mb={10} />
          <AppText 
            text="View the uploaded photos to check the condition before the task begins." 
            fontSize={14} 
            color={Colors.DARK_CHARCOAL_OPACITY}
            lineHeight={20}
          />
        </View>

        <FlatList
          data={allMedia}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
               <AppText text="No media uploaded for this task." color={Colors.DARK_CHARCOAL} />
            </View>
          }
        />

        {/* Image Viewer */}
        <ImageView
          images={imageSources}
          imageIndex={currentImageIndex}
          visible={isImageViewerVisible}
          onRequestClose={() => setIsImageViewerVisible(false)}
        />

        {/* Video Fullscreen Modal */}
        <Modal
          visible={!!selectedVideo}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setSelectedVideo(null)}
        >
          <View style={styles.videoModalContainer}>
            <ButtonView 
              style={styles.closeVideoBtn} 
              onPress={() => setSelectedVideo(null)}
            >
              <Svgicons path="closeIcon" size={30} color={Colors.WHITE} />
            </ButtonView>

            {selectedVideo && (
              <Video
                source={{ uri: selectedVideo }}
                style={styles.fullVideo}
                controls={true}
                resizeMode="contain"
                onLoad={() => setIsVideoLoading(false)}
              />
            )}
            
            {isVideoLoading && (
              <ActivityIndicator 
                size="large" 
                color={Colors.PRIMARY_TEAL} 
                style={StyleSheet.absoluteFill} 
              />
            )}
          </View>
        </Modal>

   
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 25, paddingTop: 10, marginBottom: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  listContent: { paddingHorizontal: 25, paddingBottom: 150 },
  mediaWrapper: { 
    borderRadius: 24, 
    overflow: 'hidden', 
    backgroundColor: '#E8E8E8', 
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  largeMedia: { width: '100%', height: 220, marginRight: -width },
  smallMedia: { width: COLUMN_WIDTH, height: COLUMN_WIDTH, marginRight: 15 },
  mediaImage: { width: '100%', height: '100%' },
  videoOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.15)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  playButtonCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8
  },
  emptyState: { marginTop: 50, alignItems: 'center' },
  
  // Video Modal
  videoModalContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  fullVideo: { width: width, height: height * 0.8 },
  closeVideoBtn: { position: 'absolute', top: 50, right: 25, zIndex: 10, padding: 10 }
});

export default PreActivity;