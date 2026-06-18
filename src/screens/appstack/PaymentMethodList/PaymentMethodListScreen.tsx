import { useTranslation } from 'react-i18next';
import React from 'react';
import { StyleSheet, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import usePaymentMethodListContainer from './PaymentMethodListContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Metrics from '@/utility/Metrics';
import PaymentMethodListSkeleton from '@/components/Skeletons/PaymentMethodListSkeleton';

const PaymentMethodListScreen = () => {
  const { t } = useTranslation();
  const {
    isDefault,
    onAddNew,
    cards,
    isLoading,
    refetch,
    handleSetDefault,
  } = usePaymentMethodListContainer();
  

  const getCardLabel = (item: any) => {
    const type = item.payment_method_type?.replace(/_/g, ' ') ?? 'Card';
    const last4 = item.last_four_digits ? `•••• ${item.last_four_digits}` : '••••';
    return `${type} ${last4}`;
  };

  const getExpiry = (item: any) => {
    if (item.expiry_month && item.expiry_year) {
      return `Expiry: ${String(item.expiry_month).padStart(2, '0')}/${String(item.expiry_year).slice(-2)}`;
    }
    return null;
  };

  const isCardDefault = (item: any) =>
    item.default === 1 || isDefault === item.id;

  const renderCard = ({ item }: { item: any }) => (
    <GlassCard width="100%" style={styles.card} >
      {/* Mastercard logo */}
      <Image
        source={require('@/assets/img/mastercard.png')}
        style={styles.cardLogo}
      />

      {/* Card info */}
      <View style={styles.cardInfo}>
        <AppText
          text={getCardLabel(item)}
          fontSize={15}
          type="SemiBold"
          color={Colors.PINE_FOREST}
        />
        {getExpiry(item) ? (
          <AppText
            text={getExpiry(item)!}
            fontSize={13}
            color="#8A9BA8"
            mt={4}
          />
        ) : null}
      </View>

      {/* Actions: icons top, badge bottom */}
      <View style={styles.cardActions}>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Svgicons path="trashIcon" width={19} height={19} color="#8A9BA8" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { marginLeft: 6 }]}>
            <Svgicons path="editIcon" width={19} height={19} color="#8A9BA8" />
          </TouchableOpacity>
        </View>

        <GlassCard
          width="auto"
          style={styles.badge}
          onPress={() => handleSetDefault(item.id)}
        >
          <AppText
            text={isCardDefault(item) ? 'Default' : 'Set Default'}
            fontSize={12}
            color={isCardDefault(item) ? Colors.PINE_FOREST : '#8A9BA8'}
          />
        </GlassCard>
      </View>
    </GlassCard>
  );

  return (
    <ImageBackground
      source={require('@/assets/img/background/moreScreenBG.png')}
      style={styles.container}
    >
      <FlatListSimpleHandler
        data={cards}
        isLoading={isLoading}
        onRefresh={refetch}
        renderSkeleton={() => <PaymentMethodListSkeleton />}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        listEmptyText="No Payment Methods Found"
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <AppButton
          title={t('app.payment_method_list.add_new')}
          onPress={onAddNew}
        />
      </View>
    </ImageBackground>
  );
};

export default PaymentMethodListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 14,
    borderRadius: 17
  },
  cardLogo: {
    width: 46,
    height: 32,
    resizeMode: 'contain',
    marginRight: 14,
    alignSelf: 'center',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 3,
  },
  badge: {
    marginBottom: 0,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: Metrics.verticalScale(10)
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
});
