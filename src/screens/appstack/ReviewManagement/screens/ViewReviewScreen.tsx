import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import TextareaField from '@/components/molecules/Input/TextareaField';
import AppButton from '@/components/molecules/AppButton/AppButton';

const ViewReviewScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const FeedbackBar = ({ label, value }: { label: string, value: number }) => (
    <View style={styles.barRow}>
      <AppText text={label} style={{ flex: 1 }} />
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${(value / 5) * 100}%` }]} />
      </View>
      <AppText text={value.toFixed(1)} ml={10} type="Bold" />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <AppText text="Overall Rating" fontSize={22} type="Bold" mb={10} />
      <View style={styles.starRow}>
         {[1,2,3,4,5].map(s => <Svgicons key={s} path="StarIcon" size={25} fill={s <= 4 ? Colors.BOTTLE_GREEN : Colors.SMOOTH_GREY}/>)}
         <AppText text="4/5" ml={10} />
      </View>

      <AppText text="Review" type="Bold" mt={20} mb={10} />
      <AppText 
        text="The stay was absolutely perfect! The host was super responsive, and the property was clean, cozy, and exactly as described..." 
        color={Colors.SUPER_GREY} lineHeight={22}
      />

      <View style={styles.replyBox}>
        <AppText text="Your Reply" type="Medium" mb={10} />
        <TextareaField name="reply" control={control} errors={errors} placeholder="Type here" multiline />
        <AppButton title="Submit" style={styles.submitBtn} onPress={handleSubmit((d) => console.log(d))} />
      </View>

      <View style={styles.detailsCard}>
        <AppText text="Detailed Feedback" type="Bold" fontSize={18} mb={20} />
        <FeedbackBar label="Cleanliness" value={5.0} />
        <FeedbackBar label="Accuracy" value={5.0} />
        <FeedbackBar label="Communication" value={5.0} />
        <FeedbackBar label="Location" value={5.0} />
        <FeedbackBar label="Check-in" value={5.0} />
        <FeedbackBar label="Value" value={5.0} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  starRow: { flexDirection: 'row', alignItems: 'center' },
  replyBox: { marginTop: 30 },
  submitBtn: { alignSelf: 'flex-end', width: 100, paddingVertical: 8 },
  detailsCard: { marginTop: 30, padding: 15, borderWidth: 1, borderColor: Colors.SMOOTH_GREY, borderRadius: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  barBg: { flex: 2, height: 6, backgroundColor: Colors.ANTI_FLASH_WHITE, borderRadius: 3, marginHorizontal: 10 },
  barFill: { height: '100%', backgroundColor: Colors.BOTTLE_GREEN, borderRadius: 3 }
});

export default ViewReviewScreen;