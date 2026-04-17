import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useDescribeHouseContainer from './DescribeHouseContainer';
import TextareaField from '@/components/molecules/Input/TextareaField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';

const DescribeHouseScreen = () => {
    const {
        control,
        errors,
        handleSubmit,
        onNext,
        isLoading,
        descriptionLength,
        titleLength,
        onSaveExit
    } = useDescribeHouseContainer();

    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
                            <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
                                <Svgicons path='arrowLeftIcon' size={24} />
                            </TouchableOpacity>
                        </GradientBorder>
                        {/* Progress set to 40% as per attachment */}
                        <CircularProgress percentage={40} size={48} strokeWidth={4} />
                    </View>

                    {/* Titles */}
                    <AppText text="Describe your property" fontSize={32} type="Bold" mt={35} mb={28} />
                    <AppText
                        text="Short descriptions work best. You can always change it later"
                        fontSize={12}
                        color={Colors.DARK_CHARCOAL_OPACITY}
                        mt={12}
                        mb={35}
                    />

                    {/* Property Title Input */}
                    <TextareaField
                        name="name"
                        control={control}
                        errors={errors}
                        label="Property Title *"
                        placeholder='"Cozy Villa with Pool in Riyadh"'
                        multiline={true}
                        numberOfLines={2}
                        wordLimit={50}
                        descriptionLength={titleLength}
                        sparkleIcon
                        height={65}
                    />

                    {/* Property Description Input */}
                    <View style={styles.descriptionWrapper}>
                        <TextareaField
                            name="listing_descriptions"
                            control={control}
                            errors={errors}
                            label="Property Description *"
                            placeholder='"Kick back and relax in this calm and stylish space."'
                            multiline={true}
                            numberOfLines={6}
                            wordLimit={500}
                            descriptionLength={descriptionLength} // Shows "0/500 Words"
                            sparkleIcon
                        />
                    </View>
                </ScrollView>

                {/* Fixed Footer Buttons as per attachment */}
                <View style={styles.footerContainer}>
                    <AppButton
                        title="Next"
                        variant="secondary" // Glassy/Transparent style
                        onPress={handleSubmit(onNext)}
                        loading={isLoading}
                        backgroundColor={Colors.WHITE}
                    />
                    <AppButton
                        title="Save & Exit"
                        mt={12}
                        onPress={handleSubmit(onSaveExit)}
                        disabled={isLoading}
                    // Default variant is primary (Solid Green)
                    />
                </View>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 180 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    backBtnWrapper: {
        width: 35,
        height: 35,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backBtn: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    descriptionWrapper: { marginTop: 25 },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 25,
        paddingBottom: 40,
        paddingTop: 20,
    }
});

export default DescribeHouseScreen;