import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Shared Components
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

// Theme & Utility
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';

const HowAutoPilotWork = () => {
  const navigation = useNavigation();

  return (
    <BGImage
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
    >


      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText text="How Autopilot Works" fontSize={32} type="Bold" mb={24} />

        {/* Section 1: Escalation & Responsibility */}
        <GlassCard style={styles.infoCard}>
          <AppText 
            text="Autopilot Message Escalation & Responsibility" 
            fontSize={18} 
            type="Bold" 
            mb={16} 
            lineHeight={24}
          />
          <AppText 
            fontSize={14} 
            color={Colors.DARK_CHARCOAL} 
            lineHeight={20} 
            mb={16}
          >
            Autopilot will escalate messages to you for review based on its confidence. 
            The escalation will be sent via a push notification on your mobile app or 
            in your browser. Autopilot may send incorrect information. By using Autopilot, 
            you agree to be responsible for messages sent by the system.
          </AppText>

          <AppText fontSize={14} color={Colors.DARK_CHARCOAL} type="Bold" mb={4}>
            For best results::
          </AppText>
          <AppText fontSize={14} color={Colors.DARK_CHARCOAL} mb={2}>
            1. Set a 5-10 minute response delay to allow time for review
          </AppText>
          <AppText fontSize={14} color={Colors.DARK_CHARCOAL} mb={16}>
            2. Add relevant information to AI Memory to improve response accuracy
          </AppText>

          <AppText fontSize={14} color={Colors.DARK_CHARCOAL} lineHeight={20}>
            Autopilot will improve over time based on your messages and feedback. 
            You can enhance responses by updating AI Memories.
          </AppText>
        </GlassCard>

        {/* Section 2: Grow Faster Card */}
        <GlassCard style={styles.upgradeCard}>
          <AppText text="Grow Faster with AI Suite" fontSize={18} type="Bold" mb={12} />
          
          <AppText 
            fontSize={14} 
            color={Colors.DARK_CHARCOAL} 
            lineHeight={20} 
            mb={24}
          >
            The Starter Plan includes limited AI access and supports up to 2 bookings 
            per listing. To unlock advanced AI features, higher booking capacity, 
            automated guest communication, dynamic pricing, and full-scale hosting tools, 
            upgrade to the AI Suite plan for a complete smart hosting experience.
          </AppText>

          <AppButton 
            title="Upgrade to AI Suite" 
            onPress={() => console.log('Upgrade Pressed')}
            variant="primary"
            backgroundColor={Colors.TEAL_PRIMARY_ALT}
            mt={50}
          />
        </GlassCard>
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.verticalScale(40),

  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for the back button
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: Metrics.scale(24),
    paddingBottom: Metrics.verticalScale(40),
    paddingTop: Metrics.verticalScale(20),
  },
  infoCard: {
    padding: Metrics.scale(20),
    borderRadius: 20,
    width: '100%',
    marginBottom: Metrics.verticalScale(20),
  },
  upgradeCard: {
    padding: Metrics.scale(20),
    borderRadius: 20,
    width: '100%',
  },
});

export default HowAutoPilotWork;