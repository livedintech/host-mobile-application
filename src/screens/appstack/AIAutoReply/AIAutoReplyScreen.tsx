import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useAIAutoReplyContainer from './AIAutoReplyContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import { goBack } from '@/services/navigationService';
import NoAiAutoReplyScreen from '../NoAiAutoReplyScreen/NoAiAutoReplyScreen';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { useTranslation } from 'react-i18next';
import SpinnerLoader from '@/components/molecules/SmallLoader';

const AIAutoReplyScreen = () => {
  const { t } = useTranslation();
  const {
    data,
    dataQuery,
    isFetching,
    isLoading,
    toggleSwitch,
    handleCreateNew,
    handleEdit,
    handleKnowledgeBase,
    Item,
    confirm,
    openRemoveConfirmSheet,
    isLoadingRemoved,
    removeSheetRef,
    isLoadingStatus,
    isAiAllowed,
    handleToggleAiAllow,
    isLoadingAiAllow,
  } = useAIAutoReplyContainer();

    if (isLoading) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SpinnerLoader size={'large'} />
        </View>
      </BGImage>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    return (
      <GlassCard width="100%" style={styles.glassCardOverride}>
        <View style={styles.cardContent}>
          {/* Top Row: Title and Glass Action Icons */}
          <View style={styles.cardHeader}>
            <AppText
              text={item.name}
              fontSize={18}
              type="Bold"
              color={Colors.BLACK}
              style={{ flex: 1 }}
            />
            <View style={styles.actionIcons}>
              <GlassCard width={40} style={styles.iconGlassCard}>
                <AppPressable
                  onPress={() => openRemoveConfirmSheet(item)}
                  style={styles.iconBtn}
                >
                  <Svgicons path="TrashFull" size={20} color={Colors.BLACK} />
                </AppPressable>
              </GlassCard>

              <GlassCard width={40} style={styles.iconGlassCard}>
                <AppPressable
                  onPress={() => handleEdit(item)}
                  style={styles.iconBtn}
                >
                  <Svgicons
                    path="editIconUserManagement"
                    size={20}
                    color={Colors.BLACK}
                  />
                </AppPressable>
              </GlassCard>
            </View>
          </View>

          {/* Bottom Row: Listing Label and Switch */}
          <View style={styles.cardFooter}>
            <View style={{ flex: 1 }}>
              <AppText
                text={t('app.ai_auto_reply.listing_access')}
                fontSize={14}
                type="Bold"
                color={Colors.BLACK}
              />
              <AppText
                text={item.listing_label || t('app.ai_auto_reply.all_listings')}
                fontSize={13}
                color={Colors.DARK_CHARCOAL_OPACITY}
                mt={2}
              />
            </View>
            <CustomSwitch
              onToggle={() => toggleSwitch(item)}
              value={item.is_enabled}
              disabled={isLoadingStatus}
              isLoading={item?.id === Item?.id ? isLoadingStatus : false}
            />
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>



        <FlatListHandler
          isLoading={isLoading || isFetching}
          data={data}
          meta={dataQuery}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <NoAiAutoReplyScreen onCreatePress={handleCreateNew} />
          }
          ListHeaderComponent={
            <View style={styles.topTextSection}>
              {!!data?.length && (
                <View>
                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <AppText
                      text={t('app.ai_auto_reply.title')}
                      fontSize={28}
                      type="Bold"
                      color={Colors.BLACK}
                      mb={12}
                    />
                    <View style={styles.aiAllowRow}>
                      <CustomSwitch
                        value={isAiAllowed}
                        onToggle={handleToggleAiAllow}
                        isLoading={isLoadingAiAllow}
                      />
                      <AppText
                        text={t('app.ai_auto_reply.ai_allow_label')}
                        fontSize={14}
                        type="SemiBold"
                        color={Colors.BLACK}
                      />
                    </View>
                  </View>


                  <View style={styles.descriptionWrapper}>
                    <AppText
                      text={t('app.ai_auto_reply.description')}
                      fontSize={14}
                      color={Colors.DARK_CHARCOAL_OPACITY}
                      lineHeight={20}
                    />
                    <ButtonView
                      onPress={handleKnowledgeBase}
                      style={styles.knowledgeLink}
                    >
                      <AppText
                        text={t('app.ai_auto_reply.knowledge_base')}
                        fontSize={14}
                        type="Bold"
                        color={Colors.TEAL_PRIMARY_ALT}
                      />
                      <Svgicons
                        path="arrowRightIcon"
                        size={12}
                        color={Colors.TEAL_PRIMARY_ALT}
                        ml={5}
                      />
                    </ButtonView>
                  </View>
                </View>
              )}
            </View>
          }
        />

        <View style={styles.footer}>
          <AppButton
            title={t('app.ai_auto_reply.create_new')}
            onPress={handleCreateNew}
            backgroundColor={Colors.TEAL_PRIMARY_ALT}
            borderColor={Colors.TEAL_PRIMARY_ALT}
          />
        </View>

        <ConfirmAction
          ref={removeSheetRef}
          title={`${Item?.name}`}
          content={t('app.ai_auto_reply.delete_confirm')}
          confirmText={t('app.ai_auto_reply.confirm_btn')}
          closeText={t('app.ai_auto_reply.cancel_btn')}
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
  topTextSection: {
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  descriptionWrapper: { marginTop: 5 },
  knowledgeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.verticalScale(8),
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  glassCardOverride: {
    marginBottom: 16,
    borderRadius: 28,
  },
  cardContent: { padding: 6 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 0,
  },
  iconBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  aiAllowRow: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 22,
    right: 22,
  },
});

export default AIAutoReplyScreen;