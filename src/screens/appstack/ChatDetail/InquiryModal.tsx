import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useInquiryModalContainer from './useInquiryModalContainer';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import InputField from '@/components/molecules/Input/InputField';

interface Props {
    visible: boolean;
    onClose: () => void;
    inquiryId: string;
}

const InquiryModal = ({ visible, onClose, inquiryId }: Props) => {
    const {
        viewState,
        control,
        errors,
        isApproving,
        isSendingOffer,
        handlePreApprove,
        handleSpecialOfferClick,
        handleBackToActions,
        handleSubmitOffer,
    } = useInquiryModalContainer({ onClose, inquiryId });

    if (!visible) return null;

    return (
        <View style={styles.absoluteCard}>
            {/* ------ CONDITIONAL RENDERING BASED ON VIEW STATE ------ */}
            
            {viewState === 'actions' ? (
                // --- State 1: Buttons View ---
                <>
                    <View style={styles.headerRow}>
                        <AppText text="Inquiry - Oasis Tower" fontSize={18} type="Bold" color={Colors.BLACK} />
                        <ButtonView onPress={() => console.log('View Details')}>
                            <AppText text="View Details" fontSize={14} type="SemiBold" color={Colors.BLACK} style={{ textDecorationLine: 'underline' }} />
                        </ButtonView>
                    </View>
                    
                    <AppText text="21st - 23rd January, 3 guests" fontSize={15} color={Colors.SUPER_GREY} mt={8} mb={20} />

                    <View style={styles.buttonRow}>
                        {/* Special Offer Button */}
                        <AppButton 
                            title="Special Offer"
                            onPress={handleSpecialOfferClick}
                            disabled={isApproving}
                            backgroundColor={Colors.WHITE}
                            color={Colors.INDIAN_RED} 
                            borderColor={Colors.INDIAN_RED}
                            style={styles.flexBtn}
                        />
                        
                        <View style={{ width: 10 }} />

                        {/* Pre-Approve Button */}
                        <AppButton 
                            title="Pre-approve"
                            onPress={handlePreApprove}
                            loading={isApproving}
                            disabled={isApproving}
                            backgroundColor={Colors.BRUNSWICK_GREEN}
                            color={Colors.WHITE}
                            borderColor={Colors.BRUNSWICK_GREEN}
                            style={styles.flexBtn}
                        />
                    </View>
                </>
            ) : (
                // --- State 2: Special Offer Form View ---
                <>
                    <View style={styles.headerRowForm}>
                        <ButtonView onPress={handleBackToActions} style={styles.backBtn}>
                            <Svgicons path="back" size={20} color={Colors.BLACK} />
                        </ButtonView>
                        <AppText text="Make Offer" fontSize={18} type="Bold" color={Colors.BLACK} />
                        <View style={{ width: 20 }} /> {/* For center alignment */}
                    </View>

                    <View style={styles.formContent}>
                        <InputField
                            label="Offer Amount ($)"
                            name="offerAmount"
                            control={control}
                            errors={errors}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                        />

                        <AppButton 
                            title="Send Offer"
                            onPress={handleSubmitOffer}
                            loading={isSendingOffer}
                            disabled={isSendingOffer}
                            backgroundColor={Colors.BRUNSWICK_GREEN}
                            color={Colors.WHITE}
                            borderColor={Colors.BRUNSWICK_GREEN}
                            mt={20}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    absoluteCard: {
        position: 'absolute',
        top: Metrics.verticalScale(90), // Is value ko apne header ki height ke mutabiq adjust kar lein (e.g. 80, 90, 100)
        left: Metrics.scale(20), // Left se spacing
        right: Metrics.scale(20), // Right se spacing
        zIndex: 100, // Chat list ke upar rakhne ke liye
        backgroundColor: Colors.WHITE,
        borderRadius: 20,
        padding: Metrics.scale(20),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexBtn: {
        flex: 1,
    },
    headerRowForm: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Metrics.verticalScale(20),
    },
    backBtn: {
        padding: 5,
    },
    formContent: {
        width: '100%',
    }
});

export default InquiryModal;