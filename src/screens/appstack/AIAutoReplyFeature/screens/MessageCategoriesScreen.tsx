import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Shared Components
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

// Theme & Utility
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import NavigationRoutes from '@/navigation/NavigationRoutes';

interface CategoryItem {
  id: string;
  title: string;
  confidence: number;
  percentageOfMessages: string;
  isEnabled: boolean;
}

const MessageCategoriesScreen = () => {
  const navigation = useNavigation<any>();

  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: '1',
      title: 'Discount Requests',
      confidence: 99,
      percentageOfMessages: '21.7%',
      isEnabled: true,
    },
    {
      id: '2',
      title: 'Booking Inquiry',
      confidence: 87,
      percentageOfMessages: '15.0%',
      isEnabled: true,
    },
    {
      id: '3',
      title: 'Booking Changes',
      confidence: 95,
      percentageOfMessages: '8.0%',
      isEnabled: true,
    },
    {
      id: '4',
      title: 'Check-in/Check-out',
      confidence: 100,
      percentageOfMessages: '4.5%',
      isEnabled: true,
    },
    {
      id: '5',
      title: 'Booking Cancellation',
      confidence: 85,
      percentageOfMessages: '4.5%',
      isEnabled: true,
    },
    {
      id: '6',
      title: 'Guest Complaints',
      confidence: 45,
      percentageOfMessages: '4.5%',
      isEnabled: true,
    },
    {
      id: '7',
      title: 'Maintenance Issues',
      confidence: 30,
      percentageOfMessages: '4.5%',
      isEnabled: true,
    },
  ]);

  const toggleSwitch = (id: string) => {
    setCategories(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isEnabled: !item.isEnabled } : item,
      ),
    );
  };

  const getConfidenceColor = (value: number) => {
    if (value >= 80) return Colors.MEDIUM_SEA_GREEN;
    if (value >= 50) return Colors.GOLDEN_AMBER;
    return Colors.INDIAN_RED;
  };

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText text="Message Categories" fontSize={32} type="Bold" mb={12} />
        <AppText
          text="Choose which types of messages Autopilot should handle automatically. If a message category is off, you will receive an escalation notification."
          fontSize={14}
          color={Colors.BLACK_60_PERCENT}
          lineHeight={18}
          mb={24}
        />

        {categories.map(item => (
          <GlassCard key={item.id} style={styles.card}>
            {/* Row 1: Title and Pencil Icon */}
            <View style={styles.topRow}>
              <AppText text={item.title} fontSize={17} type="Bold" />

              <GlassCard style={styles.pencilGlassWrapper}>
                <ButtonView
                  style={styles.editIcon}
                  onPress={() =>
                    navigation.navigate(
                      NavigationRoutes.APP_STACK.CATEGORY_CUSTOM_INSTRUCTIONS,
                      {
                        title: item.title,
                      },
                    )
                  }
                >
                  <Svgicons
                    path="pencilEdit"
                    size={16}
                    color={Colors.BLACK_53_PERCENT}
                  />
                </ButtonView>
              </GlassCard>
            </View>

            {/* Row 2: Stats (Confidence/Percentage) and Switch */}
            <View style={styles.bottomRow}>
              <View style={styles.statsContainer}>
                <AppText
                  text="Confidence: "
                  fontSize={13}
                  color={Colors.BLACK_60_PERCENT}
                  type="Medium"
                >
                  <AppText
                    text={`${item.confidence}%`}
                    color={getConfidenceColor(item.confidence)}
                    fontSize={13}
                    type="Bold"
                  />
                </AppText>
                <AppText
                  text={`${item.percentageOfMessages} of messages`}
                  fontSize={13}
                  color={Colors.BLACK_35_PERCENT}
                  mt={2}
                />
              </View>

              <CustomSwitch
                value={item.isEnabled}
                onToggle={() => toggleSwitch(item.id)}
              />
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Save Changes"
          onPress={() => navigation.goBack()}
          variant="primary"
          backgroundColor={Colors.TEAL_PRIMARY_ALT}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.verticalScale(50),
  },

  scrollContent: {
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(120),
  },
  card: {
    padding: Metrics.scale(16),
    borderRadius: 24,
    marginBottom: Metrics.verticalScale(14),
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(8), // Space between title row and stats row
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Aligns switch to the bottom of the stats block
  },
  statsContainer: {
    flex: 1,
  },
  pencilGlassWrapper: {
    padding: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    width: Metrics.scale(40),
  },
  editIcon: {
    width: Metrics.scale(40),
    height: Metrics.scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    // Removed flexDirection: 'row' to stack lines
    justifyContent: 'center',
  },
  actionColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: Metrics.verticalScale(70),
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(30),
    backgroundColor: 'transparent',
  },
});

export default MessageCategoriesScreen;
