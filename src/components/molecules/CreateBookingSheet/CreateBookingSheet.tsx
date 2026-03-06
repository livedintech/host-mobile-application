// import React from 'react';
// import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
// import { s, vs, ms } from 'react-native-size-matters';
// import { useWatch } from 'react-hook-form'; 
// import BottomSheetComponent from '@/components/molecules/BottomSheetComponent/BottomSheetComponent';
// import AppText from '@/components/molecules/AppText/AppText';
// import DropdownField from '@/components/molecules/Input/DropdownField';
// import InputField from '@/components/molecules/Input/InputField';
// import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
// import Svgicons from '@/components/atoms/Svgicons/Svgicons';
// import { Colors } from '@/theme/colors';
// import AppButton from '../AppButton/AppButton';

// interface Props {
//   isVisible: boolean;
//   onClose: () => void;
//   bookingType: string;
//   setBookingType: (type: string) => void;
//   control: any;
//   errors: any;
//   listingOptions: any[];
//   selectedListingId: string;
//   onSubmit: () => void;
// }

// export const CreateBookingSheet = ({
//   isVisible,
//   onClose,
//   bookingType,
//   setBookingType,
//   control,
//   errors,
//   listingOptions,
//   selectedListingId,
//   onSubmit,
// }: Props) => {
//   // 1. Get Today's date to prevent back-dating
//   const today = new Date();

//   // 2. Watch the start_date to dynamically restrict the end_date
//   const startDateValue = useWatch({
//     control,
//     name: 'start_date',
//   });

//   // 3. Logic for minimum selectable dates
//   // Start Date cannot be before Today (Feb 18, 2026)
//   const minStartDate = today;
  
//   // End Date cannot be before the selected Start Date. 
//   // If no start date is picked yet, default to Today.
//   const minEndDate = startDateValue ? new Date(startDateValue) : today;

//   return (
//     <BottomSheetComponent isVisible={isVisible} onClose={onClose}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//         {/* Type Selector: Direct Booking vs Pricing */}
//         <View style={styles.radioRow}>
//           {['direct', 'pricing'].map((type) => (
//             <Pressable key={type} style={styles.radioItem} onPress={() => setBookingType(type)}>
//               <View style={[styles.radioOuter, bookingType === type && styles.radioActive]}>
//                 {bookingType === type && <View style={styles.radioInner} />}
//               </View>
//               <AppText text={type === 'direct' ? "Direct Booking" : "Pricing"} />
//             </Pressable>
//           ))}
//         </View>

//         {/* Property Selection */}
//         {(!selectedListingId || selectedListingId === "all") && (
//           <DropdownField 
//             name="listing_id" 
//             control={control} 
//             errors={errors} 
//             label="Property Listing" 
//             placeholder="Select a property"
//             data={listingOptions.filter((o: any) => o.value !== "" && !o.label.toLowerCase().includes('all'))} 
//           />
//         )}

//         {bookingType === 'direct' ? (
//           <View>
//             <DropdownField 
//               name="booking_type" 
//               control={control} 
//               errors={errors} 
//               label="Stay Type" 
//               placeholder="Select stay type"
//               data={[{label: 'Host', value: 'host'}, {label: 'Livedin', value: 'livedin'}]} 
//             />
//             <InputField 
//               name="name" 
//               control={control} 
//               errors={errors} 
//               label="Guest Name" 
//               placeholder="Enter guest name" 
//             />
//             <InputField 
//               name="email" 
//               control={control} 
//               errors={errors} 
//               label="Email" 
//               placeholder="guest@example.com" 
//               keyboardType="email-address" 
//             />
//             <InputField 
//               name="phone" 
//               control={control} 
//               errors={errors} 
//               label="Phone" 
//               placeholder="+966..." 
//               keyboardType="phone-pad" 
//             />
//           </View>
//         ) : (
//           <InputField 
//             name="rate" 
//             control={control} 
//             errors={errors} 
//             label="Pricing (SAR)" 
//             placeholder="e.g. 500" 
//             keyboardType="numeric" 
//           />
//         )}
        
//         {/* Check-in Date - Cannot be before Today */}
//         <DateTimeInputField 
//           name="start_date" 
//           control={control} 
//           errors={errors} 
//           label="Start Date" 
//           placeholder="MM/DD/YY"
//           mode='date'
//           minimumDate={minStartDate} 
//           rules={{ required: 'Check-in date is required' }}
//           rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />} 
//         />

//         {/* Check-out Date - Cannot be before the Check-in Date */}
//         <DateTimeInputField 
//           name="end_date" 
//           control={control} 
//           errors={errors} 
//           label="End Date" 
//           placeholder="MM/DD/YY"
//           mode='date'
//           minimumDate={minEndDate} 
//           rules={{ required: 'Check-out date is required' }}
//           rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />} 
//         />

//         <View style={styles.buttonContainer}>
//           <AppButton 
//             title={bookingType === 'direct' ? "Create Direct Booking" : "Set Pricing"} 
//             onPress={onSubmit}
//           />
//         </View>
//       </ScrollView>
//     </BottomSheetComponent>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContent: {
//     paddingBottom: vs(30),
//   },
//   radioRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     gap: s(30), 
//     marginVertical: vs(20) 
//   },
//   radioItem: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: s(8) 
//   },
//   radioOuter: { 
//     width: ms(20), 
//     height: ms(20), 
//     borderRadius: 10, 
//     borderWidth: 1.5, 
//     borderColor: '#2D4A41', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   radioInner: { 
//     width: ms(10), 
//     height: ms(10), 
//     borderRadius: 5, 
//     backgroundColor: '#2D4A41' 
//   },
//   radioActive: { 
//     borderColor: '#2D4A41' 
//   },
//   buttonContainer: {
//     marginTop: vs(20),
//     marginBottom: vs(10)
//   }
// });

// export default CreateBookingSheet;

import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { useWatch } from 'react-hook-form'; 
import BottomSheetComponent from '@/components/molecules/BottomSheetComponent/BottomSheetComponent';
import AppText from '@/components/molecules/AppText/AppText';
import DropdownField from '@/components/molecules/Input/DropdownField';
import InputField from '@/components/molecules/Input/InputField';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import AppButton from '../AppButton/AppButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  bookingType: string;
  setBookingType: (type: string) => void;
  control: any;
  errors: any;
  listingOptions: any[];
  selectedListingId: string;
  onSubmit: () => void;
}

export const CreateBookingSheet = ({
  isVisible,
  onClose,
  bookingType,
  setBookingType,
  control,
  errors,
  listingOptions,
  selectedListingId,
  onSubmit,
}: Props) => {
  const today = new Date();
  const startDateValue = useWatch({ control, name: 'start_date' });
  const minStartDate = today;
  const minEndDate = startDateValue ? new Date(startDateValue) : today;

  return (
    <BottomSheetComponent isVisible={isVisible} onClose={onClose}>
      {/* 1. GRAB ZONE: Creates a transparent 40px area at the top 
          that is NOT part of the ScrollView. Touching here triggers the drag. */}
      <View style={styles.grabZone} pointerEvents="box-none" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={true} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          // Prevents the ScrollView from absorbing the "pull down" motion
          bounces={false} 
          overScrollMode="never"
        >
          {/* Type Selector */}
          <View style={styles.radioRow}>
            {['direct', 'pricing'].map((type) => (
              <Pressable key={type} style={styles.radioItem} onPress={() => setBookingType(type)}>
                <View style={[styles.radioOuter, bookingType === type && styles.radioActive]}>
                  {bookingType === type && <View style={styles.radioInner} />}
                </View>
                <AppText text={type === 'direct' ? "Direct Booking" : "Pricing"} />
              </Pressable>
            ))}
          </View>

          {(!selectedListingId || selectedListingId === "all") && (
            <DropdownField 
              name="listing_id" 
              control={control} 
              errors={errors} 
              label="Property Listing" 
              placeholder="Select a property"
              data={listingOptions.filter((o: any) => o.value !== "" && !o.label.toLowerCase().includes('all'))} 
            />
          )}

          {bookingType === 'direct' ? (
            <View>
              <DropdownField 
                name="booking_type" 
                control={control} 
                errors={errors} 
                label="Stay Type" 
                placeholder="Select stay type"
                data={[{label: 'Host', value: 'host'}, {label: 'Livedin', value: 'livedin'}]} 
              />
              <InputField name="name" control={control} errors={errors} label="Guest Name" placeholder="Enter guest name" />
              <InputField name="email" control={control} errors={errors} label="Email" placeholder="guest@example.com" keyboardType="email-address" />
              <InputField name="phone" control={control} errors={errors} label="Phone" placeholder="+966..." keyboardType="phone-pad" />
            </View>
          ) : (
            <InputField name="rate" control={control} errors={errors} label="Pricing (SAR)" placeholder="e.g. 500" keyboardType="numeric" />
          )}
          
          <DateTimeInputField 
            name="start_date" 
            control={control} 
            errors={errors} 
            label="Start Date" 
            placeholder="MM/DD/YY"
            mode='date'
            minimumDate={minStartDate} 
            rules={{ required: 'Check-in date is required' }}
            rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />} 
          />

          <DateTimeInputField 
            name="end_date" 
            control={control} 
            errors={errors} 
            label="End Date" 
            placeholder="MM/DD/YY"
            mode='date'
            minimumDate={minEndDate} 
            rules={{ required: 'Check-out date is required' }}
            rightIcon={<Svgicons path="Calendar_Days" size={20} color={Colors.BRUNSWICK_GREEN} />} 
          />

          <View style={styles.buttonContainer}>
            <AppButton 
              title={bookingType === 'direct' ? "Create Direct Booking" : "Set Pricing"} 
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  grabZone: {
    height: vs(40),
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 999,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingBottom: vs(100),
    paddingTop: vs(10), 
  },
  radioRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: s(30), 
    marginVertical: vs(15) 
  },
  radioItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: s(8) 
  },
  radioOuter: { 
    width: ms(18), 
    height: ms(18), 
    borderRadius: 10, 
    borderWidth: 1.5, 
    borderColor: '#2D4A41', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioInner: { 
    width: ms(9), 
    height: ms(9), 
    borderRadius: 5, 
    backgroundColor: '#2D4A41' 
  },
  radioActive: { 
    borderColor: '#2D4A41' 
  },
  buttonContainer: {
    marginTop: vs(20),
    marginBottom: vs(10)
  }
});

export default CreateBookingSheet;