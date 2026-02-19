import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useDescribeHouseContainer from './DescribeHouseContainer';
import InputField from '@/components/molecules/Input/InputField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';

const DescribeHouseScreen = () => {
    const { control, errors, handleSubmit, onNext, isLoading, descriptionLength, isEdit, onSaveExit } = useDescribeHouseContainer();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
                        <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
                            <Svgicons path='arrowLeftIcon' size={24} />
                        </Pressable>
                    </GradientBorder>
                    <CircularProgress percentage={40} size={48} strokeWidth={4} />
                </View>

                <AppText text="Step 4" fontSize={42} type="Bold" color={Colors.BRUNSWICK_GREEN} textAlign="center" />

                <View style={styles.subTitleRow}>
                    <AppText text="Describe Your House" fontSize={24} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path="homeIcon" size={24} />
                </View>

                {/* House Title */}
                <InputField
                    name="name"
                    control={control}
                    errors={errors}
                    label="House Title"
                    placeholder='"Cozy Villa with Pool in Riyadh"'
                />

                {/* House Description with Counter */}
                <View style={styles.descriptionWrapper}>
                    <TextareaField
                        name="listing_descriptions"
                        control={control}
                        errors={errors}
                        label="House Description"
                        placeholder='"Kick back and relax in this calm and stylish space."'
                        multiline={true}
                        numberOfLines={6}
                        descriptionLength={descriptionLength}
                        wordLimit={250}
                        sparkleIcon
                    />
                </View>

                {/* Wifi Username */}
                <InputField
                    name="wifi_username"
                    control={control}
                    errors={errors}
                    label="Wifi Username"
                    placeholder="Wifi_Network_1"
                />

                {/* Wifi Password */}
                <InputField
                    name="wifi_password"
                    control={control}
                    errors={errors}
                    label="Wifi Password"
                    placeholder="Livedin123"
                />

                {/* Door Lock Code */}
                <InputField
                    name="door_lock_code"
                    control={control}
                    errors={errors}
                    label="Door Lock Code"
                    placeholder="345678"
                    keyboardType="numeric"
                />

                <View style={styles.footer}>
                    {!isEdit && (
                        <>
                            <AppButton
                                title="Next"
                                onPress={handleSubmit(onNext)}
                                loading={isLoading}
                            />
                            <AppButton
                                title="Save & Exit"
                                onPress={handleSubmit(onSaveExit)}
                                mt={15}
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {isEdit && (
                        <AppButton
                            title="Save & Exit"
                            onPress={handleSubmit(onSaveExit)}
                            loading={isLoading}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
    subTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20, gap: 8 },
    descriptionWrapper: { position: 'relative' },
    footer: { marginTop: 20 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    arrowCircleInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
});

export default DescribeHouseScreen;