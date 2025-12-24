import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { Controller } from 'react-hook-form';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import { Colors } from '@/theme/colors';
import usePaymentDetailsContainer from './AddCardDetailContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentDetailsScreen = () => {
  const { control, errors, isDefault, setIsDefault, handleSubmit, formatCardNumber, formatExpDate } = usePaymentDetailsContainer();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Card Entry Box */}
        <View style={styles.cardBox}>
          <View style={styles.cardHeader}>
            <AppText text="Credit/ Debit" fontSize={16} type="SemiBold" color={Colors.PINE_FOREST} />
            <Image source={require('@/assets/img/mastercard.png')} style={styles.cardIcon} resizeMode="contain" />
          </View>

          <AppText text="Card Number" fontSize={14} color={Colors.PINE_FOREST} mt={20} mb={8} />
          <Controller
            control={control}
            name="cardNumber"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.inputWrapper, errors.cardNumber && styles.errorBorder]}>
                <TextInput 
                  style={styles.flexInput} 
                  value={value} 
                  onChangeText={(t) => onChange(formatCardNumber(t))}
                  keyboardType="numeric"
                  maxLength={19}
                />
                <Svgicons path='CameraIcon'/>
              </View>
            )}
          />

          <View style={styles.rowSplit}>
            <View style={{ flex: 1, marginRight: 15 }}>
              <AppText text="Exp. Date" fontSize={14} mt={15} mb={8} />
              <Controller
                control={control}
                name="expDate"
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={[styles.smallInput, errors.expDate && styles.errorBorder]} 
                    value={value} 
                    onChangeText={(t) => onChange(formatExpDate(t))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppText text="CVV" fontSize={14} mt={15} mb={8} />
              <Controller
                control={control}
                name="cvv"
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={[styles.smallInput, errors.cvv && styles.errorBorder]} 
                    value={value} 
                    onChangeText={onChange}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Info Form */}
        <View style={styles.infoForm}>
          <AppText text="Country" fontSize={14} mb={8} />
          <DropdownField
            name="country"
            label=""
            control={control}
            errors={errors}
            data={[{ label: 'Saudi Arabia', value: '1' }]}
            placeholder="Select your country"
          />

          <AppText text="Card Holder" fontSize={14} mt={15} mb={8} />
          <Controller
            control={control}
            name="cardHolder"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.fullInput} value={value} onChangeText={onChange} />
            )}
          />

          <AppText text="Zip code" fontSize={14} mt={15} mb={8} />
          <Controller
            control={control}
            name="zipCode"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.fullInput} value={value} onChangeText={onChange} keyboardType="numeric" />
            )}
          />

          {/* Switch Section */}
          <View style={styles.switchRow}>
            <AppText text="Set as default" fontSize={16} type="Medium" color={Colors.PINE_FOREST} />
            <Switch 
              value={isDefault} 
              onValueChange={setIsDefault}
              trackColor={{ false: '#E0E0E0', true: Colors.BRUNSWICK_GREEN }}
              thumbColor={Colors.WHITE}
            />
          </View>
        </View>

        {/* Trial Button */}
        <AppButton 
          title="Start 14-day free trial" 
          onPress={handleSubmit}
          style={styles.trialBtn}
          textStyle={{ color: Colors.BRUNSWICK_GREEN }}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContainer: { paddingHorizontal: 22, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center', marginBottom: 25 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  circleBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  backBtn: { paddingHorizontal: 28, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center' },
  cardBox: { padding: 22, borderRadius: 24, borderWidth: 1, borderColor: '#EBEBEB', backgroundColor: Colors.WHITE },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIcon: { width: 38, height: 26 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 52, borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 12, paddingHorizontal: 15 },
  flexInput: { flex: 1, fontSize: 16, color: Colors.PINE_FOREST },
  cameraIcon: { width: 22, height: 22 },
  rowSplit: { flexDirection: 'row' },
  smallInput: { height: 52, borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  infoForm: { marginTop: 25 },
  fullInput: { height: 52, borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 12, paddingHorizontal: 15, fontSize: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },
  trialBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.BRUNSWICK_GREEN, borderRadius: 100, height: 58, marginTop: 45 },
  errorBorder: { borderColor: 'red' }
});

export default PaymentDetailsScreen;