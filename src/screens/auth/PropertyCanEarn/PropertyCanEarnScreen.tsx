// import React from 'react';
// import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import DropdownField from '@/components/molecules/Input/DropdownField';
// import AppText from '@/components/molecules/AppText/AppText';
// import AppButton from '@/components/molecules/AppButton/AppButton';
// import Pagination from '@/components/molecules/Pagination/Pagination';
// import usePropertyCanEarnContainer from './PropertyCanEarnContainer';
// import Metrics from '@/utility/Metrics';
// import { bedroomOptions } from '@/constants/dropdownOptions';
// import PropertyAreaChart from '../../../components/organisms/PropertyAreaChart/PropertyAreaChart';
// import { vs, ms } from 'react-native-size-matters';
// import BGImage from '@/components/molecules/BGImage/BGImage';

// const PropertyCanEarnScreen = () => {
//   const { 
//     control, errors, handleSubmit, showResults, isLoading, 
//     goTologinWithPhone, availableCityItems, availableDistrictItems, 
//     selectedcity, chartPoints, roundedMax, yAxisLabels, xAxisLabels, chartData 
//   } = usePropertyCanEarnContainer();

//   return (
//     <BGImage source={require('@/assets/img/background/linearBG.png')}>
//       <KeyboardAvoidingView
//         style={[styles.container, { backgroundColor: 'transparent' }]} 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
//       >
//         <ScrollView 
//           style={{ flex: 1, backgroundColor: 'transparent' }}
//           contentContainerStyle={styles.scrollContent} 
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={[styles.titleSection, { alignItems: 'flex-start', paddingHorizontal: 20 }]}>
//             <AppText
//               text="See what your"
//               fontSize={32}
//               textAlign="left"
//               color="#1A332C"
//               type="Medium"
//             />

//             {/* FIX: Changed justifyContent to flex-start and removed negative margin if not needed */}
//             <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
//               <AppText 
//                   text="Property "
//                   fontSize={32} 
//                   color="#21AA8F" 
//                   type="Bold" 
//               />
//               <AppText 
//                   text="can earn" 
//                   fontSize={32} 
//                   color="#1A332C" 
//                   type="Bold" 
//               />
//             </View>

//             <AppText
//               text="Calculate your estimated monthly revenue with Livedin versus standard listings."
//               textAlign="left"
//               color="#5A716A"
//               mt={15}
//               mb={40}
//               fontSize={15}
//             />
//           </View>

//           {/* THE GLASS CARD */}
//           <View style={styles.card}>
//             {!showResults ? (
//               <View style={{ backgroundColor: 'transparent' }}>
//                 <AppText
//                   text="Where is your property located?"
//                   fontSize={18}
//                   type="SemiBold"
//                   color="#1A332C"
//                   mb={20}
//                   textAlign="center"
//                 />

//                 <View style={styles.inputGap}>
//                   <AppText text="City" type="SemiBold" color="#5A716A" mb={11} />
//                   <DropdownField
//                     name="city"
//                     label=""
//                     control={control}
//                     errors={errors}
//                     data={availableCityItems}
//                     placeholder="Select your city"
//                   />
//                 </View>

//                 <View style={styles.inputGap}>
//                   <AppText text="District" type="SemiBold" color="#5A716A" mb={11} />
//                   <DropdownField
//                     name="district"
//                     label=""
//                     control={control}
//                     errors={errors}
//                     data={availableDistrictItems}
//                     placeholder="Select District"
//                     disabled={!selectedcity?.length}
//                   />
//                 </View>

//                 <View style={styles.inputGap}>
//                   <AppText text="Number of Bedrooms" type="SemiBold" color="#5A716A" mb={11} />
//                   <DropdownField
//                     name="bedrooms"
//                     label=""
//                     control={control}
//                     errors={errors}
//                     data={bedroomOptions}
//                     placeholder="Select number"
//                   />
//                 </View>

//                 <AppButton
//                   type='Bold'
//                   onPress={handleSubmit}
//                   title="Next"
//                   loading={isLoading}
//                   style={styles.nextBtn}
//                   color="#FFFFFF"
//                 />
//               </View>
//             ) : (
//               <View style={styles.resultContainer}>
//                 <AppText text="Your Estimate Earnings" fontSize={20} textAlign="center" color="#1A332C" />
//                 <View style={styles.statsRow}>
//                   <View style={styles.statBox}>
//                     <AppText text="Monthly Income" fontSize={12} color="#5A716A" />
//                     <AppText text={`SAR ${chartData?.data?.monthly}`} type="Bold" color="#5A716A" />
//                   </View>
//                   <View style={styles.statBox}>
//                     <AppText text="Yearly Income" fontSize={12} color="#5A716A"/>
//                     <AppText text={`SAR ${chartData?.data?.yearly}`} type="Bold" color="#5A716A" />
//                   </View>
//                 </View>

//                 <PropertyAreaChart
//                   chartPoints={chartPoints}
//                   roundedMax={roundedMax}
//                   yAxisLabels={yAxisLabels}
//                   xAxisLabels={xAxisLabels}
//                 />

//                 <AppButton
//                   title="Unlock this revenue"
//                   style={styles.unlockBtn}
//                   textStyle={{ color: '#FFFFFF' }}
//                   onPress={goTologinWithPhone}
//                   color='#FFFFFF'
//                 />
//               </View>
//             )}
//           </View>
//         </ScrollView>

//         <Pagination activeIndex={0} />
//       </KeyboardAvoidingView>
//     </BGImage>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1,
//   },
//   scrollContent: { 
//     paddingHorizontal: 20, 
//     paddingBottom: 100,
//     paddingTop: vs(40),
//   },
//   titleSection: { 
//     alignItems: 'center',
//     backgroundColor: 'transparent' 
//   },
//   card: {
//     // REDUCED OPACITY: Made it even more transparent to prove it's working
//     backgroundColor: 'rgba(255, 255, 255, 0.12)', 
//     borderRadius: ms(24), 
//     padding: 24,
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.6)', 
//     // IMPORTANT: Absolutely no shadows or elevation
//     elevation: 0,
//     shadowColor: 'transparent',
//     shadowOpacity: 0,
//   },
//   inputGap: {
//     marginBottom: vs(15),
//     backgroundColor: 'transparent'
//   },
//   nextBtn: {
//     backgroundColor: '#21AA8F',
//     marginTop: vs(20),
//     borderRadius: 100,
//     height: vs(48),
//     width: Metrics.scale(160),
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0,
//   },
//   resultContainer: { 
//     width: '100%',
//     backgroundColor: 'transparent'
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 25,
//     marginBottom: 10,
//   },
//   statBox: { 
//     alignItems: 'center' 
//   },
//   unlockBtn: {
//     backgroundColor: '#21AA8F', 
//     borderRadius: 100,
//     height: vs(50),
//     width: '100%',
//     marginTop: 20,
//     borderWidth: 0,
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default PropertyCanEarnScreen;

import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { vs, ms, s } from 'react-native-size-matters';

import DropdownField from '@/components/molecules/Input/DropdownField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import BGImage from '@/components/molecules/BGImage/BGImage';
import PropertyAreaChart from '../../../components/organisms/PropertyAreaChart/PropertyAreaChart';

import usePropertyCanEarnContainer from './PropertyCanEarnContainer';
import Metrics from '@/utility/Metrics';
import { bedroomOptions } from '@/constants/dropdownOptions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Colors } from '@/theme/colors';

const PropertyCanEarnScreen = () => {
  const {
    control, errors, handleSubmit, showResults, isLoading,
    availableCityItems, availableDistrictItems, goToConnectAccountIntro,
    selectedcity, chartPoints, roundedMax, yAxisLabels, xAxisLabels, chartData
  } = usePropertyCanEarnContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TITLE SECTION */}
          <View style={styles.titleSection}>
            <AppText
              text="See what your"
              fontSize={32}
              textAlign="left"
              color={Colors.BLACK}
            />

            <View style={styles.titleRow}>
              <AppText
                text="Property "
                fontSize={32}
                color={Colors.PRIMARY_TEAL}
                type="Bold"
              />
              <AppText
                text="can earn"
                fontSize={32}
                color={Colors.BLACK}
              />
            </View>

            <AppText
              text="Calculate your estimated monthly revenue with Livedin versus standard listings."
              textAlign="left"
              color={Colors.BLACK}
              mt={vs(10)}
              mb={vs(25)} // Reduced from 40
              fontSize={15}
              lineHeight={22}
            />
          </View>

          {/* THE GLASS CARD */}
          <View style={styles.card}>
            {!showResults ? (
              <View>
                <AppText
                  text="Where is your property located?"
                  fontSize={18}
                  type="SemiBold"
                  color="#1A332C"
                  mb={vs(15)}
                  textAlign="center"
                />

                <View style={styles.inputGap}>
                  <AppText text="City" type="SemiBold" color="#5A716A" mb={8} fontSize={14} />
                  <DropdownField
                    name="city"
                    label=""
                    control={control}
                    errors={errors}
                    data={availableCityItems}
                    placeholder="Select your city"
                  />
                </View>

                <View style={styles.inputGap}>
                  <AppText text="District" type="SemiBold" color="#5A716A" mb={8} fontSize={14} />
                  <DropdownField
                    name="district"
                    label=""
                    control={control}
                    errors={errors}
                    data={availableDistrictItems}
                    placeholder="Select District"
                    disabled={!selectedcity?.length}
                  />
                </View>

                <View style={styles.inputGap}>
                  <AppText text="Number of Bedrooms" type="SemiBold" color="#5A716A" mb={8} fontSize={14} />
                  <DropdownField
                    name="bedrooms"
                    label=""
                    control={control}
                    errors={errors}
                    data={bedroomOptions}
                    placeholder="Select number"
                  />
                </View>

                <AppButton
                  type='Bold'
                  onPress={handleSubmit}
                  title="Next"
                  loading={isLoading}
                  style={styles.nextBtn}
                  color="#FFFFFF"
                />
              </View>
            ) : (
              <View style={styles.resultContainer}>
                <AppText text="Your Estimate Earnings" fontSize={20} textAlign="center" color={Colors.BLACK} type='Medium'/>
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <AppText text="Monthly Income" fontSize={12} color={Colors.BLACK} />
                    <AppText text={`SAR ${chartData?.data?.monthly}`}  color={Colors.BLACK}/>
                  </View>
                  <View style={styles.statBox}>
                    <AppText text="Yearly Income" fontSize={12} color={Colors.BLACK} />
                    <AppText text={`SAR ${chartData?.data?.yearly}`} color={Colors.BLACK} />
                  </View>
                </View>

                <PropertyAreaChart
                  chartPoints={chartPoints}
                  roundedMax={roundedMax}
                  yAxisLabels={yAxisLabels}
                  xAxisLabels={xAxisLabels}
                />

                <AppButton
                  title="Unlock this revenue"
                  style={styles.unlockBtn}
                  textStyle={{ color: '#FFFFFF' }}
                  onPress={goToConnectAccountIntro}
                  color='#FFFFFF'
                />
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>

        <Pagination activeIndex={0} />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(20),
    paddingTop: vs(15), // Tightened from 40
  },
  titleSection: {
    alignItems: 'flex-start',
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: ms(24),
    padding: s(20),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    elevation: 0,
    shadowColor: 'transparent',
  },
  inputGap: {
    marginBottom: vs(12),
  },
  nextBtn: {
    backgroundColor: '#21AA8F',
    marginTop: vs(20),
    borderRadius: 100,
    width: s(150),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  resultContainer: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: vs(15),
    marginBottom: vs(10),
  },
  statBox: {
    alignItems: 'center'
  },
  unlockBtn: {
    backgroundColor: '#21AA8F',
    borderRadius: 100,
    width: s(220),
    marginTop: vs(15),
    borderWidth: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PropertyCanEarnScreen;