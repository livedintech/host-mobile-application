import React, { useState } from 'react';
import { View, StyleSheet, Modal, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import AppText from '../AppText/AppText';
import ButtonView from '../AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import CloseIcon from '@/assets/icons/close.svg'; // Close icon for modal

interface Option {
    id: string;
    name: string;
}

interface DropdownPickerProps {
    label: string;
    data: Option[];
    selectedValue: Option | null;
    onSelect: (item: Option) => void;
    placeholder: string;
    disabled?: boolean;
    error?: string;
}

const DropdownPicker: React.FC<DropdownPickerProps> = ({
    label,
    data,
    selectedValue,
    onSelect,
    placeholder,
    disabled = false,
    error,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (item: Option) => {
        onSelect(item);
        setModalVisible(false);
    };

    return (
        <View style={styles.wrapper}>
            <AppText text={label} style={styles.label} />
            <ButtonView
                style={[styles.container, disabled && styles.disabled, error && styles.errorBorder]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
            >
                <AppText
                    text={selectedValue ? selectedValue.name : placeholder}
                    style={[styles.placeholder, selectedValue && styles.selectedValue]}
                />
                <ChevronDownIcon width={18} height={18} stroke={Colors.GRAY} />
            </ButtonView>
            {error && <AppText text={error} color={Colors.INDIAN_RED} style={styles.errorText} />}

            <Modal animationType="slide" transparent={false} visible={modalVisible}>
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <AppText text={`Select ${label}`} type="SemiBold" fontSize={18} />
                        <ButtonView onPress={() => setModalVisible(false)}>
                            <CloseIcon width={24} height={24} />
                        </ButtonView>
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item)}>
                                <AppText text={item.name} fontSize={16} />
                            </TouchableOpacity>
                        )}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { marginBottom: Metrics.verticalScale(18) },
    label: { color: Colors.GRAY, marginBottom: 8, fontSize: Metrics.generatedFontSize(14) },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.GAINSBORO,
        borderRadius: 12,
        backgroundColor: '#F7F7F7',
        height: Metrics.verticalScale(56),
        paddingHorizontal: 16,
    },
    disabled: { backgroundColor: '#EFEFEF' },
    errorBorder: { borderColor: Colors.INDIAN_RED },
    placeholder: { color: Colors.GRAY },
    selectedValue: { color: Colors.EERIE_BLACK },
    errorText: { marginTop: 5, fontSize: 12, marginLeft: 4 },
    modalContainer: { flex: 1 },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.GAINSBORO,
    },
    optionItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.GAINSBORO,
    },
});

export default DropdownPicker;