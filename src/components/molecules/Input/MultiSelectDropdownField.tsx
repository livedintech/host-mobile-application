import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { MultiSelect } from 'react-native-element-dropdown';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import CheckboxChecked from '@/assets/icons/checkbox-primary-checked.svg';
import CheckboxUnchecked from '@/assets/icons/checkbox-primary-unchecked.svg';

interface DropdownItem {
    label: string;
    value: string | number;
}

interface MultiSelectDropdownFieldProps {
    name: string;
    control: Control<any>;
    errors: FieldErrors;
    label: string;
    data: DropdownItem[];
    placeholder?: string;
    disabled?: boolean;
}

const MultiSelectDropdownField: React.FC<MultiSelectDropdownFieldProps> = ({
    name,
    control,
    errors,
    label,
    data,
    placeholder = 'Select',
    disabled = false,
}) => {
    const error = errors[name]?.message as string;

    return (
        <View style={styles.wrapper}>
            <AppText text={label} style={styles.label} />
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => {

                    const renderDropdownItem = (item: DropdownItem) => {
                        const isSelected = value?.includes(item.value);

                        return (
                            <View style={styles.itemContainer}>
                                {isSelected ? <CheckboxChecked /> : <CheckboxUnchecked />}
                                <AppText text={item.label} fontSize={12} color={Colors.GRAY} type='SemiBold'/>
                            </View>
                        );
                    };

                    return (
                        <MultiSelect
                            searchPlaceholder='Search...'
                            search
                            style={[styles.dropdown, !!error && styles.errorBorder, disabled && styles.disabled]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={data}
                            labelField="label"
                            valueField="value"
                            placeholder={placeholder}
                            value={value || []}
                            onChange={onChange}
                            disable={disabled}
                            renderRightIcon={() => <ChevronDownIcon width={18} height={18} />}
                            selectedStyle={styles.selectedStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            renderItem={renderDropdownItem}
                        />
                    );
                }}
            />
            {error && <AppText text={error} color={Colors.INDIAN_RED} style={styles.errorText} />}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Metrics.verticalScale(18),
    },
    label: {
        color: Colors.GRAY,
        marginBottom: 8,
        fontSize: Metrics.generatedFontSize(14),
    },
    dropdown: {
        minHeight: Metrics.verticalScale(56),
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: Metrics.verticalScale(8),
        borderWidth: 1,
        borderColor: Colors.GAINSBORO,
    },
    disabled: {
        backgroundColor: Colors.ANTI_FLASH_WHITE,
    },
    errorBorder: {
        borderColor: Colors.INDIAN_RED,
    },
    placeholderStyle: {
        fontSize: 16,
        color: Colors.GRAY,
    },
    selectedTextStyle: {
        fontSize: 14,
        color: Colors.EERIE_BLACK,
    },
   
    errorText: {
        marginTop: 5,
        fontSize: 12,
        color: Colors.INDIAN_RED,
    },
    inputSearchStyle: {
        color: Colors.EERIE_BLACK,
    },
    selectedStyle: {
        borderRadius: 12,
        backgroundColor: Colors.CULTURED,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginVertical: 4,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Metrics.scale(16),
        gap:8,
    },
});

export default MultiSelectDropdownField;