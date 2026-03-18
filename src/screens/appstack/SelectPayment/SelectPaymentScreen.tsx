import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useSelectPaymentContainer from './SelectPaymentContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import Metrics from '@/utility/Metrics';

const SelectPaymentScreen = () => {
  const { paymentMethods, onSelect } = useSelectPaymentContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Screen Title */}
          <View style={styles.titleWrapper}>
            <AppText
              text="Select"
              fontSize={30}
              color={Colors.BLACK}
              textAlign="center"
            />
            <AppText
              text="Payment"
              fontSize={30}
              color={Colors.PRIMARY_TEAL}
              textAlign="center"
              type='SemiBold'
            />
            <AppText
              text="Method"
              fontSize={30}
              color={Colors.BLACK}
              textAlign="center"
            />
          </View>

          {/* Main Selection Card */}
          <GlassCard style={styles.mainCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Metrics.verticalScale(30) }}>
              <AppText
                text="Payment Method"
                fontSize={18}
                type="Medium"
                color={Colors.BLACK}
              />
              <GlassCard width={40} style={styles.iconCircle}>
                <Svgicons path='cardBlack' />
              </GlassCard>
            </View>


            {paymentMethods.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => onSelect(item.id)} // ✅ Pass ID instead of name
              >
                <GlassCard style={styles.mainCardItem}>
                    <GlassCard width={41} style={styles.iconCard}>
                      <Svgicons path={item.icon} size={28} />
                    </GlassCard>
                    <View style={styles.methodInfo}>
                      <AppText
                        text={item.name}
                        fontSize={16}
                        color={Colors.BLACK}
                      />
                    </View>
                </GlassCard>
              </Pressable>
            ))}
          </GlassCard>

        </ScrollView>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 40,
    flexDirection: 'row',
    gap: 10,
    flex: 1,
    flexWrap: 'wrap'
  },
  mainCard: {
    flex: 1,
    width: '100%',
    borderRadius: 17,
    paddingHorizontal: Metrics.scale(30),
  },
  mainCardItem: {
    flex: 1,
    width: '100%',
    borderRadius: 17,
    paddingHorizontal: Metrics.scale(30),
    flexDirection:'row',
    alignItems:'center'
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 40,
    height: 30,
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
  iconCircle: {
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  iconCard: {
    height: 27,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D900',
    marginBottom:0
  },
});

export default SelectPaymentScreen;