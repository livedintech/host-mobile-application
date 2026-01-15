import React from 'react';
import { StyleSheet, View, Pressable, Image, FlatList, Modal, ActivityIndicator } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Metrics from '@/utility/Metrics';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { useMediaUpload, MediaItem } from './useMediaUpload';

interface PhotoUploadTemplateProps {
    step?: string;
    screenTitle: string;
    sectionTitle: string;
    maxImages: number;
    maxVideos: number;
    mediaList: MediaItem[];
    onMediaChange: (list: MediaItem[]) => void;
    loading?: boolean;
    isFetching?: boolean;
    secondaryBtnTitle?: string;
    onSecondaryPress: () => void;
    secondaryLoading?: boolean;
    secondaryDisable?: boolean;
    primaryBtnTitle?: string;
    onPrimaryPress: () => void;
    primaryLoading?: boolean;
    primaryDisable?: boolean;
}

const PhotoUploadTemplate = (props: PhotoUploadTemplateProps) => {
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
        onMediaChange: props.onMediaChange
    });

    // Helper to render each image/video thumbnail
    const renderMediaItem = ({ item, index }: { item: MediaItem; index: number }) => {
        const isVideo = item.type?.includes('video');
        return (
            <View style={styles.mediaWrapper}>
                <Image source={{ uri: item.path }} style={styles.thumbnail} />
                {isVideo && (
                    <View style={styles.videoBadge}>
                        <Svgicons path="videoIcon" size={12} color={Colors.WHITE} />
                    </View>
                )}
                <Pressable style={styles.deleteBtn} onPress={() => removeMedia(index)}>
                    <Svgicons path="closeCircleIcon" size={25} />
                </Pressable>
            </View>
        );
    };

    // Agar data fetch ho raha ho (GET API)
    if (props.isFetching) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
                <AppText text="Loading data..." textAlign="center" mt={10} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Step Header */}
                {props.step && (
                    <AppText text={props.step} fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" />
                )}

                <View style={styles.subTitleRow}>
                    <AppText text={props.screenTitle} fontSize={24} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path="imageIcon" size={24} />
                </View>

                {/* Instructions Section */}
                <View style={styles.infoSection}>
                    <View style={styles.bulletRow}>
                        <View style={styles.bullet} />
                        <AppText
                            text={`Upload up to ${props.maxImages} images and ${props.maxVideos} video per section.`}
                            fontSize={10} color={Colors.PINE_FOREST}
                        />
                    </View>
                    <View style={styles.bulletRow}>
                        <View style={styles.bullet} />
                        <AppText text="Allowed formats: jpg, png, mp4." fontSize={10} color={Colors.PINE_FOREST} />
                    </View>
                    <View style={styles.bulletRow}>
                        <View style={styles.bullet} />
                        <AppText text="Video limit: ≤ 20 MB." fontSize={10} color={Colors.PINE_FOREST} />
                    </View>
                </View>

                <AppText text={props.sectionTitle} fontSize={22} type="SemiBold" color={Colors.BRUNSWICK_GREEN} textAlign="center" mt={20} />

                {/* Main Upload Box or Grid */}
                {props.mediaList.length === 0 ? (
                    <GradientBorder borderRadius={20} style={styles.uploadBoxWrapper}>
                        <Pressable style={styles.uploadBoxInner} onPress={handlePick}>
                            <Svgicons path="fileUploadIcon" size={60} />
                            <AppText text="Upload Images" fontSize={24} type="SemiBold" mt={10} />
                        </Pressable>
                    </GradientBorder>
                ) : (
                    <GradientBorder borderRadius={15} style={styles.gridWrapper}>
                        <View style={styles.gridInner}>
                            <FlatList
                                data={[...props.mediaList, { isButton: true }]}
                                numColumns={4}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                    (item as any).isButton ? (
                                        <GradientBorder borderRadius={12} style={styles.plusBtnWrapper}>
                                            <Pressable style={styles.plusBtnInner} onPress={handlePick}>
                                                <Svgicons path="plusIcon" size={22} color={Colors.BRUNSWICK_GREEN} />
                                            </Pressable>
                                        </GradientBorder>
                                    ) : renderMediaItem({ item: item as MediaItem, index })
                                }
                            />
                        </View>
                    </GradientBorder>
                )}

                {/* Upload Options Modal */}
                <Modal visible={isPopupVisible} transparent animationType="slide">
                    <Pressable style={styles.modalOverlay} onPress={() => setPopupVisible(false)}>
                        <View style={styles.modalContent}>
                            <AppText text="Select Media" type="Bold" fontSize={18} mb={20} textAlign="center" />

                            <ButtonView style={styles.optionRow} onPress={uploadActions.fromGallery}>
                                <Svgicons path="imageIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
                                <AppText text="Gallery (Photo & Video)" ml={15} fontSize={16} />
                            </ButtonView>

                            <ButtonView style={styles.optionRow} onPress={uploadActions.takePhoto}>
                                <Svgicons path="cameraIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
                                <AppText text="Take Photo" ml={15} fontSize={16} />
                            </ButtonView>

                            <ButtonView style={styles.optionRow} onPress={uploadActions.recordVideo}>
                                <Svgicons path="videoIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
                                <AppText text="Record Video" ml={15} fontSize={16} />
                            </ButtonView>

                            <AppButton title="Cancel" mt={20} onPress={() => setPopupVisible(false)} />
                        </View>
                    </Pressable>
                </Modal>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <AppButton
                        title={props.primaryBtnTitle || "Next"}
                        onPress={props.onPrimaryPress}
                        loading={props.primaryLoading}
                        disabled={props.primaryDisable}
                    />
                    <AppButton
                        title={props.secondaryBtnTitle || "Save & Exit"}
                        onPress={props.onSecondaryPress}
                        loading={props.secondaryLoading}
                        disabled={props.secondaryDisable}
                        mt={15}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    subTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Metrics.verticalScale(24),
        marginTop: Metrics.verticalScale(49),
        gap: Metrics.scale(6)
    },
    infoSection: {
        marginTop: 15,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.PINE_FOREST,
        marginRight: 8,
    },
    uploadBoxWrapper: { marginTop: 40, height: 250 },
    uploadBoxInner: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridWrapper: { marginTop: 30, height: Metrics.verticalScale(220) },
    gridInner: {
        flex: 1,
        borderRadius: 15,
        backgroundColor: Colors.WHITE,
        padding: 10,
    },
    mediaWrapper: {
        width: '23%',
        height: Metrics.verticalScale(88),
        margin: '1%',
        borderRadius: 12,
        position: 'relative',
        marginTop: Metrics.verticalScale(10)
    },
    thumbnail: { width: '100%', height: '100%', borderRadius: 12, backgroundColor: '#EEE' },
    videoBadge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: Colors.WHITE, borderRadius: 4, padding: 2 },
    deleteBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: Colors.WHITE,
        borderRadius: 100,
        zIndex: 10
    },
    plusBtnWrapper: {
        width: '23%',
        height: Metrics.verticalScale(88),
        margin: '1%',
        marginTop: Metrics.verticalScale(10)
    },
    plusBtnInner: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        paddingBottom: 40
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    footer: { marginTop: 'auto', marginBottom: Metrics.verticalScale(20) },
});

export default PhotoUploadTemplate;