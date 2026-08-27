import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import GlassCard from '../GlassCard/GlassCard';
import ButtonView from '../AppButton/ButtonView';

interface MenuItem {
  title: string;
  icon: string;
  onPress: () => void;
}

interface SectionProps {
  title: string;
  headerIcon: string;
  items: MenuItem[];
}

const MenuSection = ({ title, headerIcon, items }: SectionProps) => {
  return (
    <GlassCard width="100%" style={styles.sectionCard}>
      <View style={styles.header}>
        <AppText text={title} type="Bold" fontSize={18} color={Colors.BLACK} />
        <View  style={styles.iconCircle}>
          <Svgicons path={headerIcon} size={22} />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <ButtonView key={index} onPress={item.onPress}>
            <GlassCard width="100%" style={styles.menuItemGlass}>
              <View style={styles.leftContent}>
                <Svgicons path={item.icon} size={22} mr={12} />
                <AppText text={item.title} type="Medium" fontSize={14} />
              </View>
            </GlassCard>
          </ButtonView>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    padding: Metrics.scale(20),
    borderRadius: 32,
    backgroundColor: '#D9D9D900',
    marginBottom: Metrics.verticalScale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(15),
    paddingHorizontal: Metrics.scale(4),
  },
  iconCircle: {
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    padding: 0,
    backgroundColor: '#D9D9D900',
  },
  itemsContainer: {
   
  },
  menuItemGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.verticalScale(18),
    paddingHorizontal: Metrics.scale(16),
    borderRadius: 17,
    marginBottom: Metrics.verticalScale(8), 
    backgroundColor: '#CBCECD26',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default MenuSection;