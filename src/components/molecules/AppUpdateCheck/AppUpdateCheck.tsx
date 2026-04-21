import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet, View, BackHandler } from 'react-native';
import { checkVersion } from 'react-native-check-version';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svg, { Circle, Path, Rect } from 'react-native-svg';


const AppUpdateCheck = () => {
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const UpdateIcon = () => (
        <Svg width={100} height={100} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="48" fill="#E6F7F4" stroke="#00A68A" strokeWidth="2" />

            <Path
                d="M50 70V35M50 35L35 50M50 35L65 50"
                stroke="#00A68A"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <Rect x="30" y="70" width="40" height="5" rx="2.5" fill="#00A68A" />
        </Svg>
    );


    const snapPoints = useMemo(() => ['55%'], []);

    useEffect(() => {
        checkForUpdate();
    }, []);

    useEffect(() => {
        if (isUpdateRequired) {
            bottomSheetRef.current?.expand();
        }
    }, [isUpdateRequired]);

    // 🔒 Disable back button
    useEffect(() => {
        if (!isUpdateRequired) return;

        const handler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => handler.remove();
    }, [isUpdateRequired]);

    const checkForUpdate = async () => {
        try {
            const version = await checkVersion();

            console.log('Version check result:', version);

            // ✅ TEST (force open) — comment after testing
            // setIsUpdateRequired(true);

            if (version?.needsUpdate) {
                setIsUpdateRequired(true);
            }
        } catch (error) {
            console.error('Update check error:', error);
        }
    };

    const handleUpdate = () => {
        const url =
            Platform.OS === 'ios'
                ? 'https://apps.apple.com/us/app/livedin-app/id6760611281'
                : 'https://play.google.com/store/apps/details?id=com.livedinapp';

        Linking.openURL(url);
    };

    const handleSheetChange = useCallback(
        (index: number) => {
            if (index === -1 && isUpdateRequired) {
                bottomSheetRef.current?.expand();
            }
        },
        [isUpdateRequired],
    );

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="none"
                opacity={0.6}
            />
        ),
        [],
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={isUpdateRequired ? 0 : -1} // ✅ main control
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            onChange={handleSheetChange}
            backdropComponent={renderBackdrop} // ✅ ALWAYS pass (no null/undefined issue)
            handleIndicatorStyle={styles.handleBar}
            backgroundStyle={styles.background}
            style={styles.sheet}
        >
            <BottomSheetView style={styles.content}>
                <View style={styles.iconWrapper}>
                         <UpdateIcon />
                    </View>
                <AppText
                    text="Update Available 🚀"
                    fontSize={24}
                    type="Bold"
                    color={Colors.BLACK}
                    textAlign="center"
                    mt={20}
                />

                <AppText
                    text="A new version of Livedin is available. Please update to continue using the app with the latest features and improvements."
                    fontSize={14}
                    color={Colors.DARK_CHARCOAL_OPACITY}
                    textAlign="center"
                    mt={12}
                    lineHeight={22}
                    px={10}
                />

                <AppButton
                    title="Update Now"
                    onPress={handleUpdate}
                    backgroundColor={Colors.TEAL_PRIMARY_ALT}
                    borderColor="transparent"
                    color={Colors.WHITE}
                    mt={30}
                    borderRadius={14}
                />

                <AppText
                    text="You must update to continue using the app."
                    fontSize={12}
                    color={Colors.DARK_CHARCOAL_OPACITY}
                    textAlign="center"
                    mt={12}
                />
            </BottomSheetView>
        </BottomSheet>
    );
};

export default AppUpdateCheck;

const styles = StyleSheet.create({
    sheet: {
        zIndex: 9999,
        elevation: 9999,
    },
    background: {
        backgroundColor: Colors.WHITE,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
    handleBar: {
        backgroundColor: '#D4D4D4',
        width: 40,
        height: 5,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: Metrics.scale(24),
        paddingBottom: Metrics.verticalScale(40),
    },
    iconWrapper: {
        marginTop: 10,
    },
});