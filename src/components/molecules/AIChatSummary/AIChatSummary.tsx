import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { Sparkles } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AIChatSummary = () => {
  return (
    <View style={styles.container}>
      {/* --- HEADER SECTION --- */}
      <View style={styles.headerRow}>
        <Sparkles
          size={ms(32)}
          color="#1A332C"
          strokeWidth={1.5}
          style={styles.icon}
        />
        <Text style={styles.headerTitle}>AI Chat Summary</Text>
      </View>

      {/* --- SUMMARY TEXT SECTION --- */}
      <View style={styles.bodyContainer}>
        <Text style={styles.summaryText}>
          The guest contacted the host to confirm early check-in availability and asked
          about parking access. The host confirmed that early check-in is possible
          from 1:00 PM at no extra cost and shared parking instructions. The guest
          acknowledged the details and confirmed arrival time. No unresolved issues remain.
        </Text>
      </View>

      {/* --- ACTION SECTION --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Continue Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: s(40),
    paddingVertical: vs(40),
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(35),
  },
  icon: {
    marginRight: s(10),
  },
  headerTitle: {
    fontSize: ms(28),
    fontWeight: '700',
    color: '#1A332C',
    letterSpacing: -0.5,
  },
  bodyContainer: {
    width: '100%',
    marginBottom: vs(60),
  },
  summaryText: {
    fontSize: ms(17),
    lineHeight: ms(26),
    color: '#7B8D88',
    textAlign: 'center',
    fontWeight: '400',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    width: SCREEN_WIDTH * 0.75,
    height: vs(55),
    borderRadius: ms(27.5),
    borderWidth: 1,
    borderColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: ms(18),
    color: '#1A332C',
    fontWeight: '500',
  },
});

export default AIChatSummary;