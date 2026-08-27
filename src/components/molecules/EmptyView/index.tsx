import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../AppText/AppText';
import { useTranslation } from 'react-i18next';

type EmptyComponentProps = {
  title?: string;
};

export default function EmptyComponent(props: EmptyComponentProps) {
  const { title } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppText
        text={title || t('app.shared.no_data_found')}
        fontSize={16}
        type="SemiBold"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});