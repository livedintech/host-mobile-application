import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Controller, Control, FieldErrors, RegisterOptions } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AppText from '../AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

const { width: SCREEN_W } = Dimensions.get('window');

interface DropdownItem {
  label: string;
  value: string | number;
}

interface Props {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  data: DropdownItem[];
  placeholder?: string;
  disabled?: boolean;
  rules?: RegisterOptions;
  onSelect?: (item: DropdownItem) => void;
}

const NativeDropdown: React.FC<Props> = ({
  name,
  control,
  errors,
  label,
  data,
  placeholder,
  disabled = false,
  rules,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [listPos, setListPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<View>(null);
  const error = errors[name]?.message as string;
  const finalPlaceholder = placeholder || t('common.placeholder');

  const open = () => {
    if (disabled) return;
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setListPos({ top: y + h + 4, left: x, width: w });
      setVisible(true);
    });
  };

  const close = () => {
    setVisible(false);
    setSearch('');
  };

  const filtered = search.trim()
    ? data.filter(d => d.label.toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <View style={{ marginBottom: Metrics.verticalScale(18) }}>
      {label ? (
        <AppText text={label} mb={8} color={Colors.BLACK} fontSize={14} type="Medium" />
      ) : null}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => {
          const selected = data.find(d => d.value === value);
          return (
            <>
              <TouchableOpacity
                ref={triggerRef}
                onPress={open}
                activeOpacity={0.8}
                style={[
                  styles.trigger,
                  !!error && styles.errorBorder,
                  disabled && styles.disabled,
                ]}
              >
                <Text
                  style={selected ? styles.selectedText : styles.placeholder}
                  numberOfLines={1}
                >
                  {selected ? selected.label : finalPlaceholder}
                </Text>
                <Svgicons path="ChevronDownIcon" width={15} height={15} color="#2D3142" />
              </TouchableOpacity>

              <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
                <TouchableOpacity style={styles.overlay} onPress={close} activeOpacity={1} />
                <View
                  style={[
                    styles.listContainer,
                    { top: listPos.top, left: listPos.left, width: listPos.width },
                  ]}
                >
                  <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t('common.search')}
                    placeholderTextColor="#aaa"
                    autoCorrect={false}
                  />
                  <FlatList
                    data={filtered}
                    keyExtractor={item => String(item.value)}
                    keyboardShouldPersistTaps="handled"
                    style={{ maxHeight: 220 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          onChange(item.value);
                          if (onSelect) onSelect(item);
                          close();
                        }}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            item.value === value && styles.itemSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </Modal>
            </>
          );
        }}
      />

      {error ? (
        <AppText text={error} color={Colors.INDIAN_RED} fontSize={12} mt={5} ml={4} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    height: Metrics.verticalScale(54),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.WHITE_OPACITY_60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: Colors.WHITE_OPACITY_60,
  },
  errorBorder: {
    borderColor: Colors.INDIAN_RED,
  },
  placeholder: {
    fontSize: Metrics.generatedFontSize(14),
    color: '#7B8D88',
    fontWeight: '400',
    flex: 1,
  },
  selectedText: {
    fontSize: Metrics.generatedFontSize(14),
    color: '#000000',
    fontWeight: '400',
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  searchInput: {
    height: 44,
    paddingHorizontal: 14,
    fontSize: Metrics.generatedFontSize(14),
    color: Colors.MIDNIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#F8F9FA',
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  itemText: {
    fontSize: Metrics.generatedFontSize(14),
    color: Colors.MIDNIGHT,
  },
  itemSelected: {
    color: Colors.PRIMARY_TEAL,
    fontWeight: '600',
  },
});

export default NativeDropdown;
