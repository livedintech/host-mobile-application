import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import NoTaskContainer from '../../containers/NoTask/NoTaskContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { useTaskStore } from '@/store/taskStore';

const NoTaskScreen = () => {
  const { handleCreateTask } = NoTaskContainer();

  return (
    <View style={styles.container}>
      <AppText
        text={'No Task Available'}
        fontSize={28}
        type="Bold"
        color={Colors.BRUNSWICK_GREEN}
        textAlign="center"
        mb={40}
      />
      <View style={styles.infoCard}>
        <View style={styles.row}>
          <View style={styles.activeDot} />
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/img/img3.png')}
              style={styles.avatar}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <View style={styles.rowBetween}>
              <AppText
                text="A.LI - Livedin"
                type="Bold"
                color={Colors.PINE_FOREST}
              />
              <AppText text="9:36 AM" color="#999" fontSize={12} />
              <Svgicons path="chevronRight" size={17} />
            </View>
            <AppText
              text={
                'Connect your Airbnb, Gathern, or other platforms to manage all your listings in one place.'
              }
              color={Colors.PINE_FOREST}
              mt={5}
              lineHeight={20}
            />
          </View>
        </View>
      </View>

      {/* <TouchableOpacity style={styles.connectBtn}>
        <AppText
          text="Create Task"
          color={Colors.BRUNSWICK_GREEN}
          type="Medium"
        />
      </TouchableOpacity> */}

      <View style={styles.footer}>
        <AppButton
          title="Create Task"
          onPress={handleCreateTask}
          backgroundColor={Colors.WHITE}
          borderColor={Colors.ARGENT}
          color={Colors.PINE_FOREST}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
  },
  infoCard: {
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: Colors.WHITE,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    position: 'relative',
    backgroundColor: '#BDF0C5',
    borderRadius: 100,
    width: Metrics.scale(72),
    height: Metrics.scale(72),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: { width: 55, height: 55, borderRadius: 40 },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1A4D2E',
    marginRight: 8,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  connectBtn: {
    marginTop: 40,
    height: 55,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // paddingHorizontal: 30,
    // paddingBottom: 40,
    // backgroundColor: Colors.WHITE,
    marginTop: 30,
  },
});
export default NoTaskScreen;
