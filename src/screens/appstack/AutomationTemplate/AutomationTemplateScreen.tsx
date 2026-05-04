import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useAutomationTemplateContainer from './AutomationTemplateContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import { goBack } from '@/services/navigationService';
import NoAutomationScreen from '../NoAutomationScreen/NoAutomationScreen';
import HeaderApp from '@/components/molecules/Header/HeaderApp';
import SpinnerLoader from '@/components/molecules/SmallLoader';
import { useTranslation } from 'react-i18next';

const AutomationTemplatesScreen = () => {
  const {
    toggleSwitch,
    editTemplate,
    createNewTemplate,
    confirm,
    openRemoveConfirmSheet,
    removeSheetRef,
    isLoadingRemoved,
    data,
    dataQuery,
    isFetching,
    isLoading,
    Item,
    isLoadingStatus,
  } = useAutomationTemplateContainer();
  const { t } = useTranslation();


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
              text={item.temp_name}
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
                  onPress={() => editTemplate(item)}
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

          {/* Bottom Row: Listing Info and Toggle */}
          <View style={styles.cardFooter}>
            <View style={{ flex: 1 }}>
              <AppText
                text={t('app.automation_template.listing_access')}
                fontSize={14}
                type="Bold"
                color={Colors.BLACK}
              />
              <AppText
                text={item.listing_label || t('app.automation_template.all_listings')}
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
      </GlassCard>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <HeaderApp isGoBackAfterLogo /> 
      <View style={styles.container}>
     
        {!!data?.length && (
          <View style={styles.topTextSection}>
            <AppText
              text={t('app.automation_template.title')}
              fontSize={28}
              type="Bold"
              color={Colors.BLACK}
              mb={12}
            />
            <AppText
              text={t('app.automation_template.description')}
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
          ListEmptyComponent={
            <NoAutomationScreen onCreatePress={createNewTemplate} />
          }
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <AppButton
            loading={isLoadingRemoved || isLoadingStatus}
            title={t('app.automation_template.create_btn')}
            onPress={createNewTemplate}
            backgroundColor={Colors.TEAL_PRIMARY_ALT}
            borderColor={Colors.TEAL_PRIMARY_ALT}
          />
        </View>

        <ConfirmAction
          ref={removeSheetRef}
          title={`${Item?.temp_name}`}
          content="Are you sure you want to delete this template?"
          confirmText="Confirm"
          closeText="Cancel"
          onConfirm={confirm}
          isLoading={isLoadingRemoved}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1},
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
    paddingHorizontal: 22,
    marginBottom: 25,
  },
  listContainer: {
    paddingHorizontal: 22,
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
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 22,
    right: 22,
  },
});

export default AutomationTemplatesScreen;