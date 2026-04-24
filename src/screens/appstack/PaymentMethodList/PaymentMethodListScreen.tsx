import { useTranslation } from 'react-i18next';
import React from 'react';
import { StyleSheet, View, Image, TextInput, Switch } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import usePaymentMethodListContainer from './PaymentMethodListContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';

const PaymentMethodListScreen = () => {
  const { t } = useTranslation();
  const {
    isSecure,
    setIsSecure,
    isDefault,
    onAddNew,
    cards,
    isLoading,
    refetch,
    handleSetDefault
  } = usePaymentMethodListContainer();

  const renderCard = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.paymentCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <AppText
          text={`${item.CardBrand} Card`}
          fontSize={16}
          type="SemiBold"
          color={Colors.PINE_FOREST}
        />
        {/* 3DS Verified Badge */}
        {item.Is3DSVerified && (
          <AppText
            text="3DS Verified"
            fontSize={12}
            color={Colors.BRUNSWICK_GREEN}
          />
        )}
      </View>

      {/* Brand Logo */}
      {item.CardBrand === 'Master' && (
        <Image
          source={require('@/assets/img/mastercard.png')}
          style={styles.mcLogo}
        />
      )}

      {/* Card Number */}
      <AppText
        text={t('app.payment_method_list.card_number')}
        fontSize={14}
        color={Colors.PINE_FOREST}
        mt={15}
        mb={8}
      />
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.flexInput}
          value={item.CardNumber || '--'}
          secureTextEntry={isSecure}
          editable={false}
        />
        <ButtonView onPress={() => setIsSecure(!isSecure)}>
          <Svgicons path={isSecure ? 'eyeSlash' : 'eye'} />
        </ButtonView>
      </View>

      {/* Token Type */}
      <AppText
        text={t('app.payment_method_list.card_type')}
        fontSize={14}
        color={Colors.PINE_FOREST}
        mt={15}
        mb={8}
      />
      <TextInput
        style={styles.disabledInput}
        value={item.CardBrand || '--'}
        editable={false}
      />

      {/* Default Switch */}
      <View style={styles.switchRow}>
        <AppText
          text={t('app.payment_method_list.set_default')}
          fontSize={16}
          color={Colors.PINE_FOREST}
        />
        <Switch
          value={isDefault === item.Token}
          onValueChange={() => handleSetDefault(item.Token)}
          trackColor={{ false: '#E0E0E0', true: Colors.BRUNSWICK_GREEN }}
          thumbColor={Colors.WHITE}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatListSimpleHandler
        data={cards}
        isLoading={isLoading}
        onRefresh={refetch}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        listEmptyText="No Payment Methods Found"
        contentContainerStyle={styles.scrollContent}
        ListFooterComponent={
          <AppButton
            title={t('app.payment_method_list.add_new')}
            onPress={onAddNew}
            mt={!cards || cards.length === 0 ? 40 : 34}
          />
        }
      />
    </View>
  );
};

export default PaymentMethodListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  paymentCard: {
    marginTop: 40,
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: Colors.WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mcLogo: {
    width: 38,
    height: 26,
    marginTop: 15,
    resizeMode: 'contain',
  },
  disabledInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.PINE_FOREST,
    backgroundColor: '#FAFAFA',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
  },
  flexInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.PINE_FOREST,
  },
  rowSplit: {
    flexDirection: 'row',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
});