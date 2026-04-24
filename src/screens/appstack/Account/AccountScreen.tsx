import { useTranslation } from 'react-i18next';
import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useAccountContainer from './AccountContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const AccountScreen = () => {
  const { accountOptions, handlePress } = useAccountContainer();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Account Title with Icon */}
        <View style={styles.titleRow}>
          <AppText text={t('app.account_screen.title')} fontSize={32} type="Bold" color={Colors.PINE_FOREST} mr={10}/>
          <Svgicons path='userIcon' size={49}/>
        </View>

        {/* Options List */}
        <View style={styles.listContainer}>
          {accountOptions.map((item) => (
            <GradientBorder key={item.id} borderRadius={22} style={styles.optionCardWrapper}>
              <View 
                style={styles.optionCardInner} 
                
              >
                <AppText text={item.title} fontSize={20} type="Medium" color={Colors.PINE_FOREST} />
                
                {/* Arrow with gradient */}
                <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
                  <Pressable onPress={() => handlePress(item?.route)} style={styles.arrowCircleInner}>
                      <Svgicons path='ArrowUpRightIcon' size={30} />
                  </Pressable>
                </GradientBorder>
              </View>
            </GradientBorder>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 30 },
  listContainer: { marginTop: 10 },

  // Wrapper for GradientBorder
  optionCardWrapper: { marginBottom: 15 },

  // Inner card content
  optionCardInner: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: Colors.WHITE,
    height: 80, 
    borderRadius: 22, 
    paddingHorizontal: 20,
  },

  // Arrow Circle
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default AccountScreen;
