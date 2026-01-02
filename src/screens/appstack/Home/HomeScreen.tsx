import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, TextInput } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import useHomeContainer from './HomeContainer';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const { onConnect } = useHomeContainer();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AppText text="Hi Tooba , how can i help you today?" fontSize={32} type="Medium" color={Colors.PINE_FOREST} />
        
        <View style={styles.cardContainer}>
          {['Connect Airbnb', 'Connect Gathern', 'Connect New Listing'].map((item) => (
            <TouchableOpacity key={item} style={styles.platformBtn} onPress={() => onConnect(item)}>
              <AppText text={item} fontSize={16} color={Colors.PINE_FOREST} />
              {/* <Image source={require('@/assets/img/upload.png')} style={styles.icon} /> */}
              <Svgicons path='UploadIcon'/>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomSearch}>
        <View style={styles.searchInput}>
          <TextInput placeholder="Ask me any question" style={{flex: 1}} />
          {/* <Image source={require('@/assets/img/mic.png')} style={styles.icon} /> */}
          <Svgicons path='MicIcon'/>
        </View>
        <TouchableOpacity style={styles.sendBtn}>
          {/* <Image source={require('@/assets/img/send.png')} style={styles.icon} /> */}
          <Svgicons path='SendIcon'/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  circleBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 25, marginTop: 40 },
  cardContainer: { marginTop: 30, padding: 20, borderRadius: 30, backgroundColor: Colors.WHITE, elevation: 5, shadowOpacity: 0.1 },
  platformBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 30, paddingHorizontal: 20, marginBottom: 15 },
  icon: { width: 20, height: 20 },
  bottomSearch: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  searchInput: { flex: 1, flexDirection: 'row', height: 55, backgroundColor: '#F9F9F9', borderRadius: 30, paddingHorizontal: 20, alignItems: 'center', marginRight: 10 },
  sendBtn: { width: 55, height: 55, borderRadius: 28, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }
});
export default HomeScreen;