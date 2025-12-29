import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Pagination from '@/components/molecules/Pagination/Pagination';
import usePropertyCanEarnContainer from './PropertyCanEarnContainer';
import Metrics from '@/utility/Metrics';
import { bedroomOptions } from '@/constants/dropdownOptions';
import PropertyAreaChart from '../../../components/organisms/PropertyAreaChart/PropertyAreaChart';

const PropertyCanEarnScreen = () => {
  const { control, errors, handleSubmit, showResults, isLoading, goTologinWithPhone, availableCityItems, availableDistrictItems, selectedcity, chartPoints, roundedMax,yAxisLabels,xAxisLabels,chartData } =
    usePropertyCanEarnContainer();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <View style={styles.titleSection}>
          <AppText
            text="See What Your"
            fontSize={32}
            textAlign="center"
            color={Colors.PINE_FOREST}
            type="Medium"
          />
          <AppText
            text="Property Can Earn"
            fontSize={32}
            textAlign="center"
            color={Colors.PINE_FOREST}
            type="Bold"
          />
          <AppText
            text="Calculate your estimated monthly revenue with Livedin versus standard listings."
            textAlign="center"
            color={Colors.PINE_FOREST}
            mt={13}
            mb={58}
            fontSize={15}
            px={40}
          />
        </View>

        {/* Card Content Switching */}
        <View style={styles.card}>
          {!showResults ? (
            <View>
              <AppText
                text="Where is your property located?"
                fontSize={18}
                type="SemiBold"
                color={Colors.BRUNSWICK_GREEN}
                mb={20}
              />

              <DropdownField
                name="city"
                label=""
                control={control}
                errors={errors}
                data={availableCityItems}
                placeholder="Select your city"
              />
              <DropdownField
                name="district"
                label=""
                control={control}
                errors={errors}
                data={availableDistrictItems}
                placeholder="Select District"
                disabled={!selectedcity?.length}
              />
              <AppText
                text="Number of Bedrooms"
                fontSize={18}
                type="SemiBold"
                color={Colors.BRUNSWICK_GREEN}
                mb={11}
              />
              <DropdownField
                name="bedrooms"
                label=""
                control={control}
                errors={errors}
                data={bedroomOptions}
                placeholder="Number Of Bedrooms"
              />

              <AppButton
                type='Bold'
                onPress={handleSubmit}
                title="Next"
                loading={isLoading}
                style={styles.nextBtn}
                textStyle={{ color: Colors.BRUNSWICK_GREEN }}
                pt={5}
                pb={5}
              />
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <AppText
                text="Your Estimated Earnings"
                fontSize={18}
                textAlign="center"
                color={Colors.BRUNSWICK_GREEN}
              />
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <AppText
                    text="Monthly Income"
                    fontSize={11}
                    color={Colors.PINE_FOREST}
                  />
                  <AppText
                    text={`SAR ${chartData?.monthly}`}
                    color={Colors.BRUNSWICK_GREEN}
                  />
                </View>
                <View style={styles.statBox}>
                  <AppText text="Yearly Income" fontSize={11} color={Colors.PINE_FOREST}/>
                  <AppText
                     text={`SAR ${chartData?.yearly}`}
                    color={Colors.BRUNSWICK_GREEN}
                  />
                </View>
              </View>

              {/* Placeholder for Graph */}
              <PropertyAreaChart
                chartPoints={chartPoints}
                roundedMax={roundedMax}
                yAxisLabels={yAxisLabels}
                xAxisLabels={xAxisLabels}
              />

              <AppButton
                title="Unlock This Revenue"
                style={styles.unlockBtn}
                textStyle={{ color: Colors.BRUNSWICK_GREEN }}
                onPress={goTologinWithPhone}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Pagination Footer */}
      <Pagination activeIndex={0} />
    </View>
  );
};

export default PropertyCanEarnScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
scrollContent: { 
  paddingHorizontal: 20, 
  paddingBottom: 40,
  paddingTop: Metrics.verticalScale(20), // add some top padding
},

  arBtn: {
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
  titleSection: { alignItems: 'center' },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 20,
  
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  nextBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.BRUNSWICK_GREEN,
    marginTop: Metrics.verticalScale(19),
    borderRadius: 100,
    width: Metrics.scale(128),
    alignSelf: 'center'
  },
  resultContainer: { alignItems: 'center' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statBox: { alignItems: 'center' },
  graphPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#F0F5F4',
    borderRadius: 10,
    marginVertical: 20,
  },
  unlockBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.BRUNSWICK_GREEN,
    borderRadius: 100,
    width: '100%',
  },
  customDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B3D35', // Dark Forest Green
    borderWidth: 2,
    borderColor: '#fff',
  },
  mainWrapper: {
    marginTop: 20,
    width: '100%',
    marginBottom: Metrics.verticalScale(14)
  },
  chartRow: {
    flexDirection: 'row',
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 10,
    width: Metrics.scale(60),
  },
  chartContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 60,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  axisText: {
    fontSize: 10,
    color: '#707070',
    fontFamily: 'Medium',
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B3D35',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
});
