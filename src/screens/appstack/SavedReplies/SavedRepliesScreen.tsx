import React from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useSavedRepliesContainer } from './SavedRepliesContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Metrics from '@/utility/Metrics';
import { goBack } from '@/services/navigationService';
import NoSavedRepliesScreen from '../NoSavedRepliesScreen/NoSavedRepliesScreen';
import { useTranslation } from 'react-i18next';

const SavedRepliesScreen = () => {
  const {
    toggleSwitch,
    editReply,
    createNewReply,
    data,
    dataQuery,
    isFetching,
    isLoading,
    confirm,
    openRemoveConfirmSheet,
    removeSheetRef,
    isLoadingRemoved,
    Item,
    isLoadingStatus,
  } = useSavedRepliesContainer();
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: any }) => {
    return (
      <GlassCard width="100%" style={styles.glassCardOverride}>
        <View style={styles.cardContent}>
          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <AppText
                text={item.title}
                fontSize={18}
                type="Bold"
                color={Colors.BLACK}
                style={{ flex: 1 }}
              />
              {/* Updated Action Icons with GlassCards */}
              <View style={styles.actionIcons}>
                <GlassCard width={40} style={styles.iconGlassCard}>
                  <Pressable onPress={() => openRemoveConfirmSheet(item)} style={styles.iconBtn}>
                    <Svgicons path="TrashFull" size={20} color={Colors.BLACK} />
                  </Pressable>
                </GlassCard>
                
                <GlassCard width={40} style={styles.iconGlassCard}>
                  <Pressable onPress={() => editReply(item)} style={styles.iconBtn}>
                    <Svgicons path="editIconUserManagement" size={20} color={Colors.BLACK} />
                  </Pressable>
                </GlassCard>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.textDetails}>
                <AppText text={t('app.saved_replies.listing_access')} fontSize={14} type="Bold" color={Colors.BLACK} />
                <AppText 
                   text={item.listing_label || t('app.saved_replies.all_listings')}
                   fontSize={13} 
                   color={Colors.GREY_SHADOW} 
                   mt={2}
                />
              </View>
              <CustomSwitch
                onToggle={() => toggleSwitch(item)}
                value={item.is_active}
                disabled={isLoadingStatus}
                isLoading={item?.id === Item?.id ? isLoadingStatus : false}
              />
            </View>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
      

        {!!data?.length && (
          <View style={styles.topTextSection}>
            <AppText text={t('app.saved_replies.title')} fontSize={28} type="Bold" color={Colors.BLACK} mb={20} />
            <AppText
              text={t('app.saved_replies.description')}
              fontSize={14}
              color={Colors.GREY_SHADOW}
              lineHeight={20}
            />
          </View>
        )}

        <FlatListHandler
          isLoading={isLoading || isFetching}
          data={data}
          meta={dataQuery}
          ListEmptyComponent={<NoSavedRepliesScreen onCreatePress={createNewReply} />}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.footer}>
          <AppButton
            onPress={createNewReply}
            title={t('app.saved_replies.create_btn')}
            backgroundColor={Colors.TEAL_PRIMARY_ALT}
            borderColor={Colors.TEAL_PRIMARY_ALT}
          />
        </View>

        <ConfirmAction
          ref={removeSheetRef}
          title={`${Item?.title}`}
          content={t('app.saved_replies.delete_confirm')}
          confirmText={t('app.saved_replies.confirm_btn')}
          closeText={t('app.saved_replies.cancel_btn')}
          onConfirm={confirm}
          isLoading={isLoadingRemoved}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 20 },
  headerNav: { paddingHorizontal: 22, marginBottom: 15 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  topTextSection: { paddingHorizontal: 22, marginBottom: 25 },
  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 140, 
  },
  glassCardOverride: {
    marginBottom: 16,
    borderRadius: 28,
  },
  cardContent: {
    padding: 4,
  },
  infoSection: { width: '100%' },
  titleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15
  },
  actionIcons: { 
    flexDirection: 'row', 
    gap: 8 
  },
  iconGlassCard: {
    height: 40,
    width: 40,
    borderRadius: 20,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0, // Reset default GlassCard margin
  },
  iconBtn: { 
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  detailsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end' 
  },
  textDetails: { flex: 1 },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 22,
    right: 22,
  },
});

export default SavedRepliesScreen;