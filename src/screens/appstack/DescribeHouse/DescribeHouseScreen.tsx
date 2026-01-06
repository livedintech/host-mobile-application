import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Metrics from '@/utility/Metrics';
import useDescribeHouseContainer from './DescribeHouseContainer';
import InputField from '@/components/molecules/Input/InputField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import TextareaField from '@/components/molecules/Input/TextareaField';

const DescribeHouseScreen = () => {
    const { control, errors, handleSubmit, onSubmit, isLoading, descriptionLength } = useDescribeHouseContainer();

    const bookingData = [{ label: 'Instant Booking', value: 'Instant Booking' }];
    const guestData = [{ label: 'Any Guest', value: 'Any Guest' }];
    const timeData = [{ label: '09:00', value: '09:00' }, { label: '22:00', value: '22:00' }];

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
                    name="title"
                    control={control}
                    errors={errors}
                    label="House Title"
                    placeholder='"Cozy Villa with Pool in Riyadh"'
                />

                {/* House Description with Counter */}
                <View style={styles.descriptionWrapper}>
                    <TextareaField
                        name="description"
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

                {/* Dropdowns */}
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <DropdownField name="bookingType" control={control} errors={errors} label="Booking Type" data={bookingData} />
                    </View>
                    <View style={styles.halfWidth}>
                        <DropdownField name="guestEligibility" control={control} errors={errors} label="Guest Eligibility" data={guestData} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <DropdownField name="checkInTime" control={control} errors={errors} label="Check-in Time" data={timeData} />
                    </View>
                    <View style={styles.halfWidth}>
                        <DropdownField name="checkOutTime" control={control} errors={errors} label="Check-out Time" data={timeData} />
                    </View>
                </View>

                <View style={styles.footer}>
                    <AppButton title="Next" onPress={handleSubmit(onSubmit)} loading={isLoading} />
                    <AppButton title="Save & Exit" mt={15} onPress={() => { }} />
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