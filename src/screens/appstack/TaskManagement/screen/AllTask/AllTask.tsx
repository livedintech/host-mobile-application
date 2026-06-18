import React, {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  BackHandler,
} from 'react-native';
import {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';

import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import MultiSelectDropdownField from '@/components/molecules/Input/MultiSelectDropdownField';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useRoute } from '@react-navigation/native';
import AllTaskContainer from '../../container/AllTaskContainer/AllTaskContainer';
import NoTaskScreen from '../NoTaskScreen/NoTaskScreen';
import { useTaskStore } from '@/store/taskStore';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';
import NoListingScreen from '@/screens/appstack/NoListingScreen/NoListingScreen';
import AllTaskSkeleton from '@/components/Skeletons/AllTaskSkeleton';

const tabs = [
  { key: 'todo', labelKey: 'app.task_management.tabs.todo' },
  { key: 'in_progress', labelKey: 'app.task_management.tabs.in_progress' },
  { key: 'complete', labelKey: 'app.task_management.tabs.complete' },
  { key: 'template', labelKey: 'app.task_management.tabs.template' },
];

const ListHeader = React.memo(
  ({
    t,
    activeTab,
    handleTabChange,
    handleOpenFilter,
  }: {
    t: any;
    activeTab: string;
    handleTabChange: (key: string) => void;
    handleOpenFilter: () => void;
  }) => (
    <View style={styles.header}>
      <AppText
        text={t('app.task_management.title')}
        fontSize={26}
        type="Medium"
        mb={24}
      />
      <View style={styles.filterRow}>
        <View style={styles.tabScrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContainer}
          >
            {tabs.map(tab => (
              <ButtonView
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => handleTabChange(tab.key)}
              >
                <AppText
                  text={t(tab.labelKey)}
                  fontSize={14}
                  type={activeTab === tab.key ? 'Bold' : 'Medium'}
                  color={
                    activeTab === tab.key
                      ? Colors.WHITE
                      : Colors.DARK_CHARCOAL_OPACITY_80
                  }
                />
              </ButtonView>
            ))}
          </ScrollView>
        </View>

        <ButtonView style={styles.filterIconButton} onPress={handleOpenFilter}>
          <Svgicons path="filterIcon" size={20} />
        </ButtonView>
      </View>
    </View>
  ),
);

// Native date formatter
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const AllTask = () => {
  const route = useRoute<any>();
  const initialListingId = route.params?.listing_id?.toString();
  const initialTab = route.params?.initialTab;

  const {
    isLoading,
    activeTab,
    handleTabChange,
    listingOptions,
    assigneeOptions,
    applyFilters,
    setTaskInfo,
    dataQuery,
    isFetching,
    rawList,
  } = AllTaskContainer(initialListingId, initialTab);
  const { t } = useTranslation();

  const { resetTaskStore } = useTaskStore();
  const { user } = useAuthStore();

  const filterSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      handleTabChange(initialTab);
    }
  }, [route.params?._t]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isFilterOpen) {
          filterSheetRef.current?.dismiss();
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [isFilterOpen]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { listings: [], assignees: [] },
  });

  useEffect(() => {
    if (initialListingId) {
      reset({ listings: [initialListingId], assignees: [] });
    }
  }, [initialListingId]);

  const handleOpenFilter = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);
  const handleCloseFilter = () => {
    filterSheetRef.current?.close();
  };

  const onApplyFilter = (data: any) => {
    applyFilters(data);
    handleCloseFilter();
  };

  const onResetFilter = () => {
    reset({ listings: [], assignees: [] });
    applyFilters({ listings: [], assignees: [] });
    handleCloseFilter();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const listHeader = useMemo(
    () => (
      <ListHeader
        t={t}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        handleOpenFilter={handleOpenFilter}
      />
    ),
    [t, activeTab, handleTabChange, handleOpenFilter],
  );

  if (!user?.has_listing) {
    return <NoListingScreen />;
  }

  const renderTaskItem = ({ item }: { item: any }) => {
    const isCompleted = item.status?.toLowerCase() === 'completed';
    const handlePress = () => {
      // Navigate on every status
      setTaskInfo(item.id, item.task_type, item.status, item.description);

      navigate(NavigationRoutes.APP_STACK.EDIT_TASK, {
        taskId: item.id,
        taskType: item.type,
      });
    };
    return (
      <ButtonView onPress={handlePress}>
        <GlassCard width="100%" style={styles.taskCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, marginBottom: 20 }}>
              <AppText
                text={
                  item.type
                    ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
                    : 'Task'
                }
                fontSize={18}
                type="Medium"
                color={Colors.BLACK}
                mb={16}
              />
              <AppText
                text={item.listing_title || 'No Location Provided'}
                fontSize={13}
                color={Colors.BLACK}
                mb={16}
                lineHeight={16}
              />
            </View>

            {!isCompleted && (
              <ButtonView
                onPress={() => {
                  setTaskInfo(
                    item.id,
                    item.task_type,
                    item.status,
                    item.description,
                  );

                  navigate(NavigationRoutes.APP_STACK.EDIT_TASK, {
                    taskId: item.id,
                    taskType: item.type,
                  });
                }}
              >
                <GlassCard width={44} style={styles.editGlassIcon}>
                  <Svgicons path="edit_pencil_icon" size={24} />
                </GlassCard>
              </ButtonView>
            )}
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Svgicons path="assignTask" size={16} />
              <AppText
                text={
                  item.assigned_user_name
                    ? `${t('app.task_management.assigned_to_user')} ${
                        item.assigned_user_name
                      }`
                    : `${t('app.task_management.unassigned')}`
                }
                fontSize={13}
                ml={10}
                color={Colors.DARK_CHARCOAL}
              />
            </View>
            {item?.status !== 'template' && (
              <View style={styles.infoRow}>
                <Svgicons path="task_calendar" size={16} />
                <AppText
                  text={`${t('app.task_management.date_value')} ${
                    item?.date ? formatDate(item.date) : '--'
                  }`}
                  fontSize={13}
                  ml={10}
                  color={Colors.DARK_CHARCOAL}
                />
              </View>
            )}
          </View>
        </GlassCard>
      </ButtonView>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.safeArea}>
        <FlatListHandler
          data={rawList}
          meta={dataQuery}
          isLoading={isLoading || isFetching}
          renderItem={renderTaskItem}
          ListHeaderComponent={listHeader}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            isLoading || isFetching ? (
              <AllTaskSkeleton />
            ) : (
              <NoTaskScreen
                activeTab={activeTab}
                hasListings={listingOptions.length > 0}
              />
            )
          }
        />

        <View style={styles.actionFooter}>
          <AppButton
            variant="secondary"
            title={t('app.task_management.setup_cleaning')}
            onPress={() => {
              resetTaskStore();
              navigate(NavigationRoutes.APP_STACK.RECURRING_INITIAL_SCREEN);
            }}
            // backgroundColor={Colors.WHITE}
            mb={11}
          />

          <AppButton
            title={t('app.task_management.create_task')}
            onPress={() => {
              resetTaskStore();
              navigate(NavigationRoutes.APP_STACK.CREATE_TASK_NON_CLEANING);
            }}
          />
        </View>

        <BottomSheetModal
          ref={filterSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.sheetIndicator}
          onChange={index => setIsFilterOpen(index >= 0)}
        >
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <AppText
                text={t('app.task_management.apply_filter')}
                fontSize={24}
                type="Medium"
              />
              <ButtonView onPress={onResetFilter}>
                {/* <AppText
                  text={t('app.task_management.reset')}
                  color={Colors.BLACK}
                  type="Medium"
                /> */}
                <Svgicons path="crossIcon" size={30} />
              </ButtonView>
            </View>

            <View style={styles.formContent}>
              <MultiSelectDropdownField
                name="listings"
                label={t('app.task_management.filters.select_listing')}
                placeholder={t('app.task_management.select_multiple')}
                data={listingOptions}
                control={control as any}
                errors={errors}
                dropdownPosition="top"
              />

              <View style={{ marginTop: 10 }}>
                <MultiSelectDropdownField
                  name="assignees"
                  label={t('app.task_management.filters.select_task_assignee')}
                  placeholder={t('app.task_management.select_multiple')}
                  data={assigneeOptions}
                  control={control as any}
                  errors={errors}
                  dropdownPosition="top"
                />
              </View>

              <AppButton
                title={t('app.task_management.apply')}
                mt={30}
                backgroundColor={Colors.PRIMARY_TEAL}
                borderColor={Colors.PRIMARY_TEAL}
                color={Colors.WHITE}
                onPress={handleSubmit(onApplyFilter)}
              />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: {
    paddingHorizontal: 25,
    paddingTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(260),
  },
  header: { marginBottom: 20 },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabScrollWrapper: {
    flex: 1,
    marginRight: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 30,
    padding: 4,
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 25,
    marginRight: 4,
    // borderWidth:1,
    // borderColor: Colors.WHITE
    // backgroundColor:Colors.WHITE
  },
  activeTab: {
    backgroundColor: Colors.EMERALD_TEAL,
    // Soft shadow for active tab
    ...Platform.select({
      ios: {
        shadowColor: Colors.EMERALD_TEAL,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: { elevation: 4 },
    }),
  },
  filterIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  taskCard: {
    padding: 24,
    borderRadius: 28,
    marginBottom: 16,
    // Add extra shadow logic here if you want tasks to pop even more
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  editGlassIcon: {
    height: 44,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    marginBottom: 0, // Reset margin for the icon
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  infoContainer: { gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  actionFooter: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 90, // 40/20 se badha ke tab bar ke upar
    left: 25,
    right: 25,
  },
  gradientMargin: { marginBottom: 12 },
  outlineBtn: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 0 },
  sheetContent: { padding: 25 },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  formContent: { marginTop: 10 },
  bottomSheetBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 40,
  },
  sheetIndicator: {
    backgroundColor: '#ccc',
    width: 60,
  },
});

export default AllTask;
