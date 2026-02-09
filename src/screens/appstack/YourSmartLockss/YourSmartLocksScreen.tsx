import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import DropdownField from '@/components/molecules/Input/DropdownField';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useYourSmartLockssContainer from './YourSmartLockssContainer';
import { goBack } from '@/services/navigationService';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';

export interface SmartLock {
    lock_id: number;
    alias: string;
    lp_name: string | null;
    listing_id: number | null;
    battery_percentage: string;
    battery_status: string;
    ttlock_date: string;
}

const YourSmartLocksScreen = () => {
    const {
        locksData,
        LISTING_OPTIONS,
        control,
        errors,
        getBatteryColor,
        handleConnectNewAccount,
        isLoading,
        refetch,
        goToScreen,
        selectDropdown,
    } = useYourSmartLockssContainer();

    const renderLockCard = ({
        item,
    }: {
        item: SmartLock;
    }) => {
        const batteryValue = Number(
            item.battery_percentage?.replace('%', '')
        );

        return (
            <Pressable
                style={styles.card}
                onPress={() =>
                    goToScreen(item?.lock_id)
                }
            >
                {/* Title */}
                <View style={styles.row}>
                    <Svgicons
                        path="keyholeLock"
                        size={18}
                        color={Colors.BRUNSWICK_GREEN}
                    />
                    <AppText
                        text={item.alias}
                        fontSize={20}
                        type="Bold"
                        color={Colors.BRUNSWICK_GREEN}
                        ml={10}
                    />
                </View>

                {/* Info */}
                <View style={styles.infoSection}>
                    <View style={styles.rowSmall}>
                        <Svgicons
                            path="keyIcon"
                            size={16}
                            color={Colors.BRUNSWICK_GREEN}
                        />
                        <AppText
                            text="Lock ID: "
                            fontSize={16}
                            type="SemiBold"
                            color={Colors.BRUNSWICK_GREEN}
                            ml={8}
                        />
                        <AppText
                            text={item.lock_id.toString()}
                            fontSize={16}
                            color={Colors.BRUNSWICK_GREEN}
                        />
                    </View>

                    <View style={styles.rowSmall}>
                        <Svgicons
                            path="batteryIcon"
                            size={16}
                            color={Colors.BRUNSWICK_GREEN}
                        />
                        <AppText
                            text="Battery: "
                            fontSize={16}
                            type="SemiBold"
                            color={Colors.BRUNSWICK_GREEN}
                            ml={8}
                        />
                        <AppText
                            text={item.battery_percentage}
                            fontSize={16}
                            type="Bold"
                            color={getBatteryColor(batteryValue)}
                        />
                    </View>
                </View>

                {/* Assign Listing */}
                <DropdownField
                    label="Assign Listing"
                    name={`lock_${item.lock_id}_listing`}
                    control={control}
                    errors={errors}
                    data={LISTING_OPTIONS}
                    placeholder="Select Property"
                    dropdownPosition="bottom"
                    onSelect={(value) => {
                        selectDropdown(value?.value, item.lock_id)
                    }}
                    extraPayload={item?.lock_id}
                />
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ButtonView style={styles.backBtn} onPress={() => goBack()}>
                    <Svgicons path="arrowLeftIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
                </ButtonView>
            </View>
            <View style={styles.scrollContent}>
                <View style={styles.titleContainer}>
                    <AppText text="Your Smart Locks" fontSize={32} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path="lockInfoIcon" size={28} color={Colors.BRUNSWICK_GREEN} ml={10} />
                </View>
                <FlatListSimpleHandler
                    data={locksData}
                    keyExtractor={item => item.lock_id.toString()}
                    isLoading={isLoading}
                    renderItem={renderLockCard}
                    onRefresh={refetch}
                />
                <AppButton
                    title="Connect New Account"
                    onPress={handleConnectNewAccount}
                    backgroundColor={Colors.WHITE}
                    color={Colors.BRUNSWICK_GREEN}
                    borderColor={Colors.SMOOTH_GREY}
                    mt={Metrics.verticalScale(20)}
                />
            </View>
        </View>
    );
};


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
    logsBtn: {
        paddingVertical: 8, paddingHorizontal: 15,
        borderRadius: 20, borderWidth: 1, borderColor: Colors.SMOOTH_GREY
    },
    scrollContent: { paddingHorizontal: Metrics.scale(25), paddingBottom: Metrics.verticalScale(200) },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Metrics.verticalScale(0)
    },
    card: {
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        borderRadius: 20,
        padding: Metrics.scale(20),
        marginBottom: Metrics.verticalScale(20),
        backgroundColor: Colors.WHITE,
        zIndex: 1, // Dropdown visibility ke liye zaroori hai
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowSmall: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoSection: { marginVertical: Metrics.verticalScale(15) },
});

export default YourSmartLocksScreen;