import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useTransactionHistoryContainer from './TransactionHistoryContainer';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';

const TransactionHistoryScreen = () => {
  const { transactions, isLoading, refetch } = useTransactionHistoryContainer();

  const renderItem = ({ item }: any) => (
    <View style={styles.section}>
      <AppText
        text={item.date}
        fontSize={14}
        type="Bold"
        color={Colors.BRUNSWICK_GREEN}
        mb={10}
      />

      <View style={styles.transactionCard}>
        <View style={styles.rowBetween}>
          <View style={styles.cardInfo}>
            <Image
              source={
                item.cardType === 'mastercard'
                  ? require('@/assets/img/mastercard.png')
                  : require('@/assets/img/visa.png')
              }
              style={styles.cardLogo}
            />
            <AppText
              text={`****${item.cardNumber}`}
              fontSize={16}
              color={Colors.PINE_FOREST}
              ml={10}
            />
          </View>
        </View>

        <AppText
          text={`- ${item.amount}`}
          fontSize={22}
          type="Bold"
          color={Colors.PINE_FOREST}
          mt={10}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatListSimpleHandler
        isLoading={isLoading}
        onRefresh={refetch}
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <AppText
            text="Latest Transaction"
            fontSize={26}
            type="Medium"
            color={Colors.BRUNSWICK_GREEN}
            mt={30}
            mb={20}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },

  section: { marginBottom: 25 },

  transactionCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: Colors.WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardLogo: {
    width: 35,
    height: 22,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 4,
  },
});

export default TransactionHistoryScreen;
