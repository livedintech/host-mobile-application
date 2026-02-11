import React from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft } from 'lucide-react-native';

import AIChatSummary from '@/components/molecules/AIChatSummary/AIChatSummary';

const UserManagementScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <AIChatSummary />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: vs(15),
    backgroundColor: '#FFF',
  },
  backCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: '#F8FAF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#1A332C',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: ms(40),
  },
  scrollContainer: {
    paddingBottom: vs(50),
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: s(40),
    marginVertical: vs(10),
  },
});

export default UserManagementScreen;