import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useSelectPaymentContainer from './SelectPaymentContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

const SelectPaymentScreen = () => {
  const { paymentMethods, onSelect, navigation } = useSelectPaymentContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Screen Title */}
        <View style={styles.titleWrapper}>
          <AppText 
            text="Select Payment Method" 
            fontSize={30} 
            type="Bold" 
            color={Colors.BRUNSWICK_GREEN} 
            textAlign="center" 
          />
        </View>

        {/* Main Selection Card */}
        <View style={styles.mainCard}>
          <AppText 
            text="Payment Method" 
            fontSize={16} 
            type="SemiBold" 
            color={Colors.PINE_FOREST} 
            mb={20} 
          />
          
          {paymentMethods.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.methodRow} 
              onPress={() => onSelect(item.id)} // ✅ Pass ID instead of name
              activeOpacity={0.7}
            >
              <View style={styles.leftContent}>
                <Image source={item.icon} style={styles.methodIcon} />
                <View style={styles.methodInfo}>
                  <AppText 
                    text={item.name} 
                    fontSize={16} 
                    color={Colors.PINE_FOREST} 
                    type="SemiBold"
                  />
                  {/* Optional: Show method type */}
                  <AppText 
                    text={item.isCardMethod ? 'Card Payment' : 'Quick Pay'} 
                    fontSize={11} 
                    color={Colors.SUPER_GREY} 
                    mt={2}
                  />
                </View>
              </View>
              <View style={styles.arrowCircle}>
                <Svgicons path='arrowRightIcon'/>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Info */}
        <View style={styles.securityBadge}>
          <AppText 
            text="🔒 All payment methods are secure and encrypted" 
            fontSize={12} 
            color={Colors.SUPER_GREY} 
            textAlign="center"
          />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.WHITE 
  },
  scrollContent: { 
    paddingHorizontal: 22, 
    paddingBottom: 40 
  },
  backBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    borderWidth: 1, 
    borderColor: '#EBEBEB', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15 
  },
  backIcon: { 
    width: 18, 
    height: 18, 
    resizeMode: 'contain' 
  },
  titleWrapper: { 
    marginTop: 60, 
    marginBottom: 40 
  },
  mainCard: { 
    padding: 24, 
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: '#F0F0F0', 
    backgroundColor: Colors.WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3
  },
  methodRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    minHeight: 70, // Increased for subtitle
    borderWidth: 1, 
    borderColor: '#EBEBEB', 
    borderRadius: 15, 
    paddingHorizontal: 15,
    paddingVertical: 12, 
    marginBottom: 12,
    backgroundColor: Colors.WHITE
  },
  leftContent: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: { 
    width: 40, 
    height: 25, 
    resizeMode: 'contain' 
  },
  methodInfo: {
    marginLeft: 15,
    flex: 1,
  },
  arrowCircle: { 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    borderWidth: 1, 
    borderColor: '#EBEBEB', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 10,
  },
  smallArrow: { 
    width: 12, 
    height: 12, 
    tintColor: Colors.BRUNSWICK_GREEN 
  },
  securityBadge: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
  },
});

export default SelectPaymentScreen;