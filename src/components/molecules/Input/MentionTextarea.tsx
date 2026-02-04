import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

interface Props {
  name: string;
  control: any;
  errors: any;
  label?: string;
  variables: { key: string; label: string }[];
  placeholder?: string; 
}


export default function MentionTextarea({
  name,
  control,
  errors,
  label,
  variables,
  placeholder
}: Props) {
  const inputRef = useRef<TextInput>(null);

  const [showList, setShowList] = useState(false);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [cursorPos, setCursorPos] = useState(0);

  const error = errors[name]?.message;

  const handleChange = (text: string, onChange: any) => {
    onChange(text);

    const lastAt = text.lastIndexOf('@', cursorPos);

    if (lastAt !== -1) {
      const keyword = text.slice(lastAt + 1, cursorPos);

      const matches = variables.filter(v =>
        v.key.toLowerCase().includes(keyword.toLowerCase()),
      );

      setFiltered(matches);
      setShowList(matches.length > 0);
    } else {
      setShowList(false);
    }
  };

  const insertVariable = (
    item: any,
    value: string,
    onChange: any,
  ) => {
    const lastAt = value.lastIndexOf('@', cursorPos);

    const newText =
      value.substring(0, lastAt) +
      `{${item.key}}` +
      value.substring(cursorPos);

    onChange(newText);
    setShowList(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {label && <AppText text={label} />}

      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <>
            <TextInput
              ref={inputRef}
              style={styles.input}
              multiline
              value={value}
              onSelectionChange={e =>
                setCursorPos(e.nativeEvent.selection.start)
              }
              onChangeText={text =>
                handleChange(text, onChange)
              }
               placeholder={placeholder}
            />

            {showList && (
              <View style={styles.dropdown}>
                <FlatList
                  data={filtered}
                  keyExtractor={i => i.key}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() =>
                        insertVariable(item, value, onChange)
                      }>
                      <AppText text={item.key} />
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </>
        )}
      />

      {error && (
        <AppText text={error} color={Colors.INDIAN_RED} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    borderRadius: 12,
    padding: 14,
    textAlignVertical: 'top',
  },

  dropdown: {
    position: 'absolute',
    top: 80,
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    maxHeight: 180,
    zIndex: 99999,
  },

  item: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: Colors.SMOOTH_GREY,
  },
});
