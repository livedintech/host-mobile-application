import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useTransactionHistoryContainer from './TransactionHistoryContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const TransactionHistoryScreen = () => {
  const { transactions } = useTransactionHistoryContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Title */}
        <AppText text="Latest Transaction" fontSize={26} type="Medium" color={Colors.BRUNSWICK_GREEN} mt={30} mb={20} />

        {/* Transaction List */}
        {transactions.map((item) => (
          <View key={item.id} style={styles.section}>
            <AppText text={item.date} fontSize={14} type="Bold" color={Colors.BRUNSWICK_GREEN} mb={10} />
            <View style={styles.transactionCard}>
              <View style={styles.rowBetween}>
                <View style={styles.cardInfo}>
                  <Image 
                    source={item.cardType === 'mastercard' ? require('@/assets/img/mastercard.png') : require('@/assets/img/visa.png')} 
                    style={styles.cardLogo} 
                  />
                  <AppText text={`****${item.cardNumber}`} fontSize={16} color={Colors.PINE_FOREST} ml={10} />
                </View>
              </View>
              <AppText text={`- ${item.amount}`} fontSize={22} type="Bold" color={Colors.PINE_FOREST} mt={10} />
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  backIcon: { width: 18, height: 18, resizeMode: 'contain' },
  section: { marginBottom: 25, },
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
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flexDirection: 'row', alignItems: 'center' },
  cardLogo: { width: 35, height: 22, resizeMode: 'contain', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 4 },
  downIcon: { width: 14, height: 14, tintColor: Colors.BRUNSWICK_GREEN },
});

export default TransactionHistoryScreen;