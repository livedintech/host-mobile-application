// LocationScreen.tsx
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { goBack, navigate } from '@/services/navigationService';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import BGImage from '@/components/molecules/BGImage/BGImage';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const LocationScreen = () => {
  const { params } = useRoute<any>();
  const listing = params?.paramData?.listing;

  const latitude = parseFloat(listing?.lat) || 24.7136;
  const longitude = parseFloat(listing?.lng) || 46.6753;

  const address = [
    listing?.street,
    listing?.apt,
    listing?.city?.name,
    listing?.district?.name,
    listing?.state?.name,
    listing?.country?.name,
  ].filter(Boolean).join(', ');

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>

        {/* Header */}
        <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
          <Pressable style={styles.backBtnWrapper} onPress={() => goBack()}>
            <Svgicons path='arrowLeftIcon' size={24} />
          </Pressable>
        </GradientBorder>

        {/* Title */}
        <AppText
          text="Location"
          fontSize={28}
          type="SemiBold"
          color={Colors.BLACK}
          style={styles.title}
          mt={20}
        />

        {/* Map */}
        <View style={styles.mapWrapper}>
          <MapView
       provider={ Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE }
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            scrollEnabled
            zoomEnabled
            loadingEnabled
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        </View>

        {/* Address Card */}
        <GlassCard width={'100%'} style={styles.addressCard} onPress={() => navigate(
          NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE_SET_LOCATION,
          { paramData: params?.paramData }
        )}>
          <View style={styles.addressRow}>
            <View style={styles.pinIconWrapper}>
              <Svgicons path="pinLocationIcon" size={22} color={Colors.BLACK} />
            </View>
            <View style={styles.addressTextCol}>
              <AppText
                text="Update Address"
                fontSize={16}
                type="Bold"
                color={Colors.BLACK}
                mb={6}
              />
              <AppText
                text={address || 'No address provided'}
                fontSize={14}
                color={Colors.DARK_CHARCOAL_OPACITY}
                lineHeight={22}
              />
            </View>
          </View>
        </GlassCard>

        {/* Footer */}
        <View style={styles.footer}>
          <AppButton
            title="Export"
            onPress={() => { }}
            style={styles.exportBtn}
          />
        </View>

      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
  },
  mapWrapper: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.TRANSPARENT,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pinIconWrapper: {
    marginRight: 12,
    marginTop: 2,
  },
  addressTextCol: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  exportBtn: {
    borderRadius: 30,
    height: 56,
  },
  backBtnWrapper: {
    width: 35,
    height: 35,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default LocationScreen;