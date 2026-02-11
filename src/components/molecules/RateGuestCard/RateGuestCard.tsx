import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { Star } from 'lucide-react-native';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const RateGuestCard = () => {
  const [rating, setRating] = useState(0);

  return (
    <View style={styles.outerWrapper}>
      <GradientBorder
        borderRadius={16}
        borderWidth={1}
        style={styles.gradientContainer}
      >
        <View style={styles.innerCard}>
          {/* TITLE */}
          <Text style={styles.titleText}>Rate Your Guest</Text>

          {/* RATING SECTION */}
          <View style={styles.ratingRow}>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((index) => (
                <Pressable key={index} onPress={() => setRating(index)} hitSlop={8}>
                  <Star
                    size={ms(30)}
                    fill={index <= rating ? '#6DB3A2' : '#E0E0E0'}
                    color={index <= rating ? '#6DB3A2' : '#E0E0E0'}
                    style={styles.starIcon}
                  />
                </Pressable>
              ))}
            </View>
            <Text style={styles.scoreText}>/5</Text>
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
            <Text style={styles.submitText}>Submit Rating</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpace} />
        </View>
      </GradientBorder>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    paddingHorizontal: s(20),
    marginVertical: vs(10),
  },
  gradientContainer: {
    width: '100%',
    minHeight: vs(180),
  },
  innerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingTop: vs(24),
    paddingHorizontal: s(24),
    flexGrow: 1,
  },
  titleText: {
    fontSize: ms(20),
    fontWeight: '700',
    color: '#1A332C',
    marginBottom: vs(20),
    letterSpacing: -0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(30),
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: s(12),
  },
  starIcon: {
    marginRight: s(6),
  },
  scoreText: {
    fontSize: ms(22),
    color: '#7B8D88',
    fontWeight: '400',
  },
  submitButton: {
    width: '100%',
    height: vs(54),
    borderRadius: ms(27),
    borderWidth: 1,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: ms(16),
    color: '#7B8D88',
    fontWeight: '500',
  },
  bottomSpace: {
    height: vs(32),
  },
});

export default RateGuestCard;