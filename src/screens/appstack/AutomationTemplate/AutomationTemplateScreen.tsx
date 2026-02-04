import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useAutomationTemplateContainer from './AutomationTemplateContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';

const AutomationTemplatesScreen = () => {
    const { toggleSwitch, editTemplate, createNewTemplate, confirm, openRemoveConfirmSheet, removeSheetRef, isLoadingRemoved, data, dataQuery, isFetching, isLoading, Item,isLoadingStatus } = useAutomationTemplateContainer();

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.leftInfo}>
                     <CustomSwitch onToggle={() => toggleSwitch(item)} value={item.is_active} disabled={isLoadingStatus} isLoading={item?.id === Item?.id ? isLoadingStatus : false} />
                    <AppText text={item.name} fontSize={18} type="Bold" color={Colors.BRUNSWICK_GREEN} ml={Metrics.scale(10)} />
                </View>

                <View style={styles.actions}>
                    <ButtonView onPress={() => openRemoveConfirmSheet(item)} px={5}>
                        <Svgicons path="TrashFull" size={20} color={Colors.BRUNSWICK_GREEN} />
                    </ButtonView>
                    <ButtonView onPress={() => editTemplate(item)} px={5} ml={Metrics.scale(5)}>
                        <Svgicons path="editIconUserManagement" size={20} color={Colors.BRUNSWICK_GREEN} />
                    </ButtonView>
                </View>
            </View>

        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleWrapper}>
                    <AppText text="Automation Template" fontSize={22} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path="expandIcon" size={18} color={Colors.BRUNSWICK_GREEN} ml={8} />
                </View>
            </View>

            {/* List */}
            <FlatListHandler
                isLoading={isLoading || isFetching}
                data={data}
                meta={dataQuery}
                listEmptyText="No data found"
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* Create Button using AppButton */}
            <View style={styles.footer}>
                <AppButton
                loading={isLoadingRemoved || isLoadingStatus}
                    title="Create New Template"
                    onPress={createNewTemplate}
                />
            </View>
            <ConfirmAction
                ref={removeSheetRef}
                title={`${Item?.name}`}
                content="Are you sure you want delete?"
                confirmText='Confirm'
                closeText='Cancel'
                onConfirm={confirm}
                isLoading={isLoadingRemoved}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Metrics.verticalScale(20),
        justifyContent: 'center'
    },
    backBtn: { position: 'absolute', left: Metrics.scale(20), padding: 8, borderWidth: 1, borderColor: Colors.SMOOTH_GREY, borderRadius: 100 },
    titleWrapper: { flexDirection: 'row', alignItems: 'center' },
    listContainer: { paddingHorizontal: Metrics.scale(20), paddingBottom: Metrics.verticalScale(20) },
    card: {
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        borderRadius: 15,
        padding: Metrics.scale(15),
        marginBottom: Metrics.verticalScale(15),
        backgroundColor: Colors.WHITE
    },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    leftInfo: { flexDirection: 'row', alignItems: 'center' },
    actions: { flexDirection: 'row', alignItems: 'center' },
    bottomRow: { paddingLeft: Metrics.scale(5) },
    switchStyle: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
    footer: { paddingHorizontal: Metrics.scale(20), paddingBottom: Metrics.verticalScale(30) }
});

export default AutomationTemplatesScreen;