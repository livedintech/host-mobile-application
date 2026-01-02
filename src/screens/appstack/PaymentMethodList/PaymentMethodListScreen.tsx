import React from 'react';
import { StyleSheet, View, Image, TextInput, Switch, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import usePaymentMethodListContainer from './PaymentMethodListContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';

const PaymentMethodListScreen = () => {
  const { isSecure, setIsSecure, isDefault, setIsDefault, onAddNew } = usePaymentMethodListContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.paymentCard}>
          <View style={styles.cardHeader}>
            <AppText text="Credit/ Debit" fontSize={16} type="SemiBold" color={Colors.PINE_FOREST} />
            <View style={styles.actionIcons}>
              <ButtonView>
                <Svgicons path='trashIcon'/>

              </ButtonView>
              <ButtonView style={{ marginLeft: 12 }}>
                <Svgicons path='editIcon'/>
              </ButtonView>
            </View>
          </View>

          <Image source={require('@/assets/img/mastercard.png')} style={styles.mcLogo} />

          <AppText text="Card Holder Name" fontSize={14} color={Colors.PINE_FOREST} mt={15} mb={8} />
          <TextInput style={styles.disabledInput} value="Ahmed Arif" editable={false} />

          <AppText text="Card Number" fontSize={14} color={Colors.PINE_FOREST} mt={15} mb={8} />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.flexInput}
              value="4691 5100 2231 1234"
              secureTextEntry={isSecure}
              editable={false}
            />
            <ButtonView onPress={() => setIsSecure(!isSecure)}>
              <Svgicons path='eyeSlash'/>
            </ButtonView>
          </View>

          <View style={styles.rowSplit}>
            <View style={{ flex: 1, marginRight: 15 }}>
              <AppText text="Exp. Date" fontSize={14} mt={15} mb={8} />
              <TextInput style={styles.disabledInput} value="03/26" editable={false} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText text="CVV" fontSize={14} mt={15} mb={8} />
              <TextInput style={styles.disabledInput} value="***" editable={false} />
            </View>
          </View>

          <View style={styles.switchRow}>
            <AppText text="Set as default" fontSize={16} color={Colors.PINE_FOREST} />
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: '#E0E0E0', true: Colors.BRUNSWICK_GREEN }}
              thumbColor={Colors.WHITE}
            />
          </View>
        </View>

        {/* Add New Button */}
        <AppButton title='Add New Payment Method' onPress={onAddNew} mt={34}/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  backIcon: { width: 18, height: 18, resizeMode: 'contain' },
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
    elevation: 3
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionIcons: { flexDirection: 'row' },
  topIcon: { width: 20, height: 20, resizeMode: 'contain', tintColor: Colors.BRUNSWICK_GREEN },
  mcLogo: { width: 38, height: 26, marginTop: 15, resizeMode: 'contain' },
  disabledInput: { height: 52, borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 12, paddingHorizontal: 15, fontSize: 16, color: Colors.PINE_FOREST, backgroundColor: '#FAFAFA' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 52, borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 12, paddingHorizontal: 15, backgroundColor: '#FAFAFA' },
  flexInput: { flex: 1, fontSize: 16, color: Colors.PINE_FOREST },
  eyeIcon: { width: 20, height: 20, tintColor: Colors.BRUNSWICK_GREEN },
  rowSplit: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },
  addBtn: { marginTop: 40, height: 58, borderRadius: 30, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center' }
});

export default PaymentMethodListScreen;