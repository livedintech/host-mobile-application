import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const AgentIntroScreen = () => {
    
  const goToLoginViaPhoneNumber = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.introSection}>
          <View style={styles.titleRow}>
            <AppText
              text="Hi, I’m "
              fontSize={32}
              type="Medium"
              color={Colors.BLACK}
            />
            <AppText
              text="Agent A.I."
              fontSize={32}
              type="BoldItalic"
              color={Colors.BLACK}
            />
          </View>
          <AppText
            text="Let’s get you started."
            fontSize={32}
            type="Medium"
            color={Colors.BLACK}
            textAlign="center"
          />

          <AppText
            text="I’m your dedicated expert to guide you from scratch; from creating your listing to securing your first booking. No experience needed."
            textAlign="center"
            color={Colors.PINE_FOREST}
            mt={20}
            fontSize={15}
            lineHeight={22}
          />
        </View>

        {/* Agent/Sphere Graphic */}
        <View style={styles.graphicContainer}>
          <Image
            source={require('@/assets/img/agent_ali.png')}
            style={styles.sphereImage}
            resizeMode="contain"
          />
        </View>

        {/* Action Button */}
        <AppButton
          mt={62}
          title="Start my Setup"
          onPress={goToLoginViaPhoneNumber}
        />
      </ScrollView>

      {/* Pagination - Active dot is the 3rd one */}
      <Pagination activeIndex={2} />
    </View>
  );
};

export default AgentIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  getStartedBtn: {
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  introSection: {
    marginTop: 50,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  sphereImage: {
    width: Metrics.scale(280),
    height: Metrics.scale(280),
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.BRUNSWICK_GREEN,
    borderRadius: 100,
    marginTop: 20,
    width: '100%',
    height: 56,
  },
  btnText: {
    color: Colors.BRUNSWICK_GREEN,
    fontSize: 16,
    fontWeight: '700',
  },
});
