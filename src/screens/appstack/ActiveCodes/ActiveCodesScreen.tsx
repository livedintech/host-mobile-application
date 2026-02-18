import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useActiveCodesContainer, { CodeTab } from './ActiveCodesContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { goBack } from '@/services/navigationService';

const ActiveCodesScreen = () => {
    const { activeTab, setActiveTab, currentData, handleGenerateNew, handleViewLogs, isLoading,refetch } =
        useActiveCodesContainer();

          console.log("currentDatacurrentData",currentData)
    const TABS: CodeTab[] = ['Permanent', 'One-time', 'Timed'];

    const renderCodeCard = ({ item }: { item: any }) => {
          console.log("itemmmccn",item)
        return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Svgicons path="lockFrame" size={24} color={Colors.BRUNSWICK_GREEN} />
                <AppText text={item.title} fontSize={20} type="Bold" color={Colors.BRUNSWICK_GREEN} ml={10} />
            </View>

            <View style={styles.cardBody}>
                <DetailRow label="Passcode" value={item.passcode} />
                {activeTab === 'Timed' && (
                    <>
                        <DetailRow label="Date" value={item.date} />
                        <DetailRow label="Start Time" value={item.startTime} />
                        <DetailRow label="End Time" value={item.endTime} />
                        <DetailRow label="Status" value={item.status} />
                    </>
                )}
            </View>
        </View>
        )
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <ButtonView style={styles.backBtn} onPress={() => goBack()}>
                    <Svgicons path="arrowLeftIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
                </ButtonView>

                <ButtonView style={styles.logsBtn} onPress={handleViewLogs}>
                    <AppText text="View Logs" fontSize={14} color={Colors.BRUNSWICK_GREEN} type="Medium" />
                </ButtonView>
            </View>

            {/* Title Section */}
            <View style={styles.titleContainer}>
                <AppText text="Active Codes" fontSize={32} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                <Svgicons path="keyBinary" size={28} color={Colors.BRUNSWICK_GREEN} ml={10} />
            </View>

            {/* Tabs Section */}
            <View style={styles.tabWrapper}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                    >
                        <AppText
                            text={tab}
                            fontSize={14}
                            color={activeTab === tab ? Colors.WHITE : Colors.BRUNSWICK_GREEN}
                            type="Medium"
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* List Section */}
            <FlatListSimpleHandler
                data={currentData}
                renderItem={renderCodeCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                isLoading={isLoading}
                onRefresh={refetch}

            />

            {/* Footer Action */}
            <View style={styles.footer}>
                <AppButton
                    title="Generate New Passcode"
                    onPress={handleGenerateNew}
                />
            </View>
        </View>
    );
};

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.detailRow}>
        <AppText text={`${label}: `} fontSize={14} type="Bold" color={Colors.BRUNSWICK_GREEN} />
        <AppText text={value} fontSize={14} color={Colors.BRUNSWICK_GREEN} />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Metrics.scale(20),
        paddingVertical: Metrics.verticalScale(15),
    },
    backBtn: {
        width: 45, height: 45, borderRadius: 25,
        borderWidth: 1, borderColor: Colors.SMOOTH_GREY,
        justifyContent: 'center', alignItems: 'center'
    },
    titleContainer: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', marginBottom: 25
    },
    tabWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        marginHorizontal: 5,
        backgroundColor: Colors.WHITE
    },
    activeTabButton: {
        backgroundColor: Colors.BRUNSWICK_GREEN,
        borderColor: Colors.BRUNSWICK_GREEN
    },
    listContent: { paddingHorizontal: 25, paddingBottom: 20 },
    card: {
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        backgroundColor: Colors.WHITE
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    cardBody: { marginLeft: 2 },
    detailRow: { flexDirection: 'row', marginBottom: 6 },
    footer: { padding: 25 },
    logsBtn: {
        paddingVertical: 8, paddingHorizontal: 15,
        borderRadius: 20, borderWidth: 1, borderColor: Colors.SMOOTH_GREY
    },
});

export default ActiveCodesScreen;