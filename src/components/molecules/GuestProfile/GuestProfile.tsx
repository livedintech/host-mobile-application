import React from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { Star } from 'lucide-react-native';

const GuestProfile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.avatarWrapper}>
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' }}
                style={styles.avatar}
              />
            </View>
          </View>
        </View>

        {/* Info Fields Section */}
        <View style={styles.infoSection}>
          <InfoField label="Guest Name:" value="Ali Masood Ahmed" />
          <InfoField label="Guest Email:" value="a.masoodahmed@gmail.com" />
          <InfoField label="Guest Contact:" value="+966 501223123" />

          {/* Rating Section */}
          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Guest Rating</Text>
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} size={ms(24)} fill="#6DB3A2" color="#6DB3A2" style={styles.star} />
                ))}
                <Star size={ms(24)} fill="#E0E0E0" color="#E0E0E0" />
              </View>
              <Text style={styles.ratingScore}>4/5</Text>
            </View>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: s(30),
    alignItems: 'center',
    paddingTop: vs(20),
  },
  avatarWrapper: {
    marginBottom: vs(40),
  },
  outerRing: {
    width: ms(180),
    height: ms(180),
    borderRadius: ms(90),
    backgroundColor: '#F8FAF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: ms(150),
    height: ms(150),
    borderRadius: ms(75),
    borderWidth: s(4),
    borderColor: '#2D4A41',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  fieldWrapper: {
    marginBottom: vs(25),
  },
  label: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#1A332C',
    marginBottom: vs(4),
  },
  value: {
    fontSize: ms(15),
    color: '#7B8D88',
    fontWeight: '400',
  },
  ratingContainer: {
    marginTop: vs(10),
    width: '100%',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  stars: {
    flexDirection: 'row',
    marginRight: s(15),
  },
  star: {
    marginRight: s(4),
  },
  ratingScore: {
    fontSize: ms(16),
    color: '#7B8D88',
    fontWeight: '500',
  },
});

export default GuestProfile;