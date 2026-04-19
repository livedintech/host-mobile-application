import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import useDiscountsContainer from './DiscountsContainer';

const AddDiscountsScreen = () => {
    const { control, errors, handleSubmit, onSubmit, isLoading, isModalVisible, setModalVisible, isEdit } = useDiscountsContainer();

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => goBack()} style={styles.backBtn}>
                            <Svgicons path='arrowLeftIcon' size={24} />
                        </TouchableOpacity>
                        {!isEdit && <CircularProgress percentage={85} size={48} strokeWidth={4} />}
                    </View>

                    <AppText text="Add discounts" fontSize={32} type="Bold" mt={30} />
                    <AppText text="Create discounts to attract more bookings and offer special pricing for specific situations like last-minute stays or longer reservations." fontSize={12} color={Colors.DARK_CHARCOAL_OPACITY} mt={10} mb={15} pr={40} />

                    <View style={styles.formGroup}>
                        <InputField name="weekly_discount" label="Weekly Discounts" control={control as any} errors={errors} placeholder="4%" keyboardType="numeric"/>
                        <View style={styles.gap} />
                        <InputField name="monthly_discount" label="Monthly Discounts" control={control as any} errors={errors} placeholder="4%" keyboardType="numeric"/>
                        <View style={styles.gap} />
                        <InputField name="last_minute_discount" label="Last Minute Discount" control={control as any} errors={errors} placeholder="10%" keyboardType="numeric"/>
                        <InputField name="early_bird_price_change" label="Early Bird Price Change" control={control as any} errors={errors} placeholder="10%" keyboardType="numeric"/>

                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    {!isEdit && (
                        <AppButton
                            title="Next"
                            variant="secondary"
                            onPress={handleSubmit((d) => onSubmit(d, false))}
                            loading={isLoading}
                        />
                    )}
                    <AppButton
                        title="Save & Exit"
                        mt={!isEdit ? 12 : 0}
                        onPress={handleSubmit((d) => onSubmit(d, true))}
                        disabled={isLoading}
                    />
                </View>

                {/* Add Discount Modal (Screenshot 2 & 5) */}
                <Modal visible={isModalVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <AppText text="Add Discount" fontSize={24} type="Bold" />
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Svgicons path="closeIcon" size={24} />
                                </TouchableOpacity>
                            </View>
                            <DropdownField
                                errors={errors}
                                name="temp_discount"
                                label="Select Discount"
                                control={control as any}
                                data={[{ label: 'Last Minute Discount', value: 'lmd' }]}
                                placeholder="Last Minute Discount"
                            />
                            <AppButton title="Save" mt={30} onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 220 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backBtn: { padding: 8, borderRadius: 20, backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: '#EEE' },
    addBtn: { alignSelf: 'flex-end', backgroundColor: '#00A684', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 13, marginTop: 10 },
    formGroup: { marginTop: 20 },
    gap: { height: 15 },
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'white', paddingBottom: 40 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 50 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }
});

export default AddDiscountsScreen;