import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useDescribeHouseContainer from './DescribeHouseContainer';
import InputField from '@/components/molecules/Input/InputField';
import TextareaField from '@/components/molecules/Input/TextareaField';

const DescribeHouseScreen = () => {
    const { control, errors, handleSubmit, onNext, isLoading, descriptionLength, isEdit, onSaveExit } = useDescribeHouseContainer();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
                    />
                </View>
                {/* <View style={styles.footer}>
                    {isEdit ? (
                        <AppButton
                            title="Save & Exit"
                            onPress={handleSubmit(onSaveExit)}
                            loading={isLoading}
                        />
                    ) : (
                        <AppButton
                            title="Next"
                            onPress={handleSubmit(onNext)}
                            loading={isLoading}
                        />
                    )}
                </View> */}
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
    row: { flexDirection: 'row', justifyContent: 'space-between', zIndex: 999 },
    halfWidth: { width: '48%' },
    footer: { marginTop: 20 },
});

export default DescribeHouseScreen;