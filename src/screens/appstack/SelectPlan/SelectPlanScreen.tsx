import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Pressable,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import BGImage from '@/components/molecules/BGImage/BGImage';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useSelectPlanContainer from './SelectPlanContainer';
import Metrics from '@/utility/Metrics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SelectPlanScreen = () => {
    const { t } = useTranslation();
    const {
        selectedPlan,
        setSelectedPlan,
        billingCycle,
        setBillingCycle,
        isExpanded,
        setIsExpanded,
        currency,
        price,
        isLoadingPrice,
        features,
        refetch,
        handleStartTrial,
    } = useSelectPlanContainer();

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    const billingLabel = (cycle: 'Monthly' | 'Yearly') =>
        cycle === 'Monthly' ? t('auth.payment.monthly') : t('auth.payment.yearly');

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.container}>
            <RefreshableScrollView
                contentContainerStyle={styles.scrollBody}
                refreshing={isLoadingPrice}
                onRefresh={refetch}
            >
                {/* Title */}
                <View style={styles.titleSection}>
                    <AppText fontSize={30} type="Bold" color={Colors.BLACK}>
                        {t('auth.payment.select_your')}
                        <AppText text={t('auth.payment.plan')} color={Colors.MEDIUM_JUNGLE_GREEN} fontSize={30} type="Bold" />
                    </AppText>
                    <AppText
                        text={t('auth.payment.select_plan_subtitle')}
                        fontSize={13}
                        color={Colors.DARK_CHARCOAL_OPACITY}
                        mt={12}
                        lineHeight={20}
                    />
                </View>

                {/* Plan Tabs */}
                <View style={styles.tabWrapper}>
                    <View style={styles.tabContainer}>
                        <Pressable
                            style={[styles.tab, selectedPlan === 'Starter' && styles.activeTab]}
                            onPress={() => setSelectedPlan('Starter')}
                        >
                            <AppText
                                text={t('auth.payment.tab_starter')}
                                color={selectedPlan === 'Starter' ? Colors.WHITE : Colors.BLACK}
                                type="Bold"
                                fontSize={16}
                            />
                        </Pressable>
                        <Pressable
                            style={[styles.tab, selectedPlan === 'AI Suite' && styles.activeTab]}
                            onPress={() => setSelectedPlan('AI Suite')}
                        >
                            <AppText
                                text={t('auth.payment.tab_ai_suite')}
                                color={selectedPlan === 'AI Suite' ? Colors.WHITE : Colors.BLACK}
                                type="Bold"
                                fontSize={16}
                            />
                        </Pressable>
                    </View>
                </View>

                {/* Monthly / Yearly Radio */}
                <View style={styles.billingToggleRow}>
                    {(['Monthly', 'Yearly'] as const).map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={styles.radioItem}
                            onPress={() => setBillingCycle(item)}
                        >
                            <View
                                style={[
                                    styles.radioOuter,
                                    billingCycle === item && styles.radioOuterActive,
                                ]}
                            >
                                {billingCycle === item && <View style={styles.radioInner} />}
                            </View>
                            <AppText
                                text={billingLabel(item)}
                                fontSize={15}
                                ml={8}
                                color={Colors.BLACK}
                                type="Medium"
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Main Card */}
                <View
                    style={[
                        styles.glassCard,
                        !isExpanded && { maxHeight: Metrics.verticalScale(340) },
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <AppText
                                text={billingLabel(billingCycle)}
                                fontSize={22}
                                type="Bold"
                                color={Colors.BLACK}
                            />
                            <View style={styles.priceRow}>
                                {isLoadingPrice ? (
                                    <SkeletonPlaceholder borderRadius={6}>
                                        <View style={styles.priceSkeleton} />
                                    </SkeletonPlaceholder>
                                ) : (
                                    <>
                                        <AppText
                                            text={
                                                selectedPlan === 'Starter'
                                                    ? t('auth.payment.starting_from', { currency, price })
                                                    : `${currency} ${price}`
                                            }
                                            fontSize={17}
                                            type="Bold"
                                            color={Colors.BLACK}
                                        />
                                        <AppText
                                            text={t('auth.payment.per_listing')}
                                            color={Colors.MEDIUM_JUNGLE_GREEN}
                                            fontSize={17}
                                            type="SemiBold"
                                        />
                                    </>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.viewMoreBtn} onPress={toggleExpand}>
                            <AppText
                                text={isExpanded ? t('auth.payment.view_less') : t('auth.payment.view_more')}
                                fontSize={12}
                                type="Medium"
                                color={Colors.BLACK}
                            />
                        </TouchableOpacity>
                    </View>

                    {selectedPlan === 'AI Suite' && !isExpanded && (
                        <AppText
                            text={t('auth.payment.ai_suite_note')}
                            fontSize={12}
                            color={Colors.DARK_CHARCOAL_OPACITY}
                            mb={14}
                            lineHeight={18}
                        />
                    )}

                    <ScrollView
                        scrollEnabled={isExpanded}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled
                    >
                        {features.map((section, idx) => (
                            <View key={idx} style={styles.featureSection}>
                                <AppText
                                    text={section.title}
                                    fontSize={16}
                                    type="Bold"
                                    mb={8}
                                    color={Colors.BLACK}
                                />
                                {section.items.map((item, i) => (
                                    <View key={i} style={styles.bulletRow}>
                                        <View style={styles.dot} />
                                        <AppText
                                            text={item}
                                            fontSize={12}
                                            color={Colors.DARK_CHARCOAL_OPACITY}
                                            lineHeight={18}
                                            style={{ flex: 1 }}
                                        />
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </RefreshableScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <AppButton
                    title={t('auth.payment.start_30_trial')}
                    onPress={handleStartTrial}
                    backgroundColor={Colors.MEDIUM_JUNGLE_GREEN}
                    loading={isLoadingPrice}
                />
                <AppText
                    textAlign="center"
                    fontSize={10}
                    color={Colors.DARK_CHARCOAL_OPACITY}
                    mt={12}
                    lineHeight={15}
                >
                    {t('auth.payment.legal_trial')}
                    <AppText text={t('auth.payment.terms_of_service')} type="Bold" fontSize={10} color={Colors.BLACK} />
                    {t('auth.payment.legal_2')}
                    <AppText text={t('auth.payment.privacy_policy')} type="Bold" fontSize={10} color={Colors.BLACK} />
                    {t('auth.payment.legal_3')}
                </AppText>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollBody: { paddingHorizontal: 20, paddingBottom: 200 },
    titleSection: { marginTop: 22 },
    tabWrapper: { alignItems: 'center', marginTop: 28 },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        borderRadius: 36,
        padding: 5,
        width: '82%',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    tab: {
        flex: 1,
        paddingVertical: 13,
        alignItems: 'center',
        borderRadius: 32,
    },
    activeTab: {
        backgroundColor: Colors.MEDIUM_JUNGLE_GREEN,
        elevation: 3,
        shadowColor: Colors.MEDIUM_JUNGLE_GREEN,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    billingToggleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 22,
        gap: 30,
    },
    radioItem: { flexDirection: 'row', alignItems: 'center' },
    radioOuter: {
        width: 21,
        height: 21,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.BLACK,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterActive: { borderColor: Colors.MEDIUM_JUNGLE_GREEN },
    radioInner: {
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: Colors.MEDIUM_JUNGLE_GREEN,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.42)',
        borderRadius: 28,
        padding: 22,
        marginTop: 26,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.85)',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        flexWrap: 'wrap',
    },
    viewMoreBtn: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        marginLeft: 10,
    },
    featureSection: { marginBottom: 18 },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.DARK_CHARCOAL_OPACITY,
        marginTop: 7,
        marginRight: 8,
        flexShrink: 0,
    },
    priceSkeleton: { width: 160, height: 20, marginTop: 4 },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 38,
        paddingTop: 20,
        backgroundColor: Colors.WHITE,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 10,
    },
});

export default SelectPlanScreen;
