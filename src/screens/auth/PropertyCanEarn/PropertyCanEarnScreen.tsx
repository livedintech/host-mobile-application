import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/molecules/Pagination/Pagination';
import usePropertyCanEarnContainer from './PropertyCanEarnContainer';
import Metrics from '@/utility/Metrics';
import { LineChart } from 'react-native-wagmi-charts';


const data = [
  { timestamp: 0, value: 10000 },
  { timestamp: 1, value: 25000 }, // Jan
  { timestamp: 2, value: 22000 },
  { timestamp: 3, value: 45000 }, // Feb Peak (Dot here)
  { timestamp: 4, value: 38000 },
  { timestamp: 5, value: 42000 }, // Mar
  { timestamp: 6, value: 32000 },
  { timestamp: 7, value: 45000 }, // Apr
  { timestamp: 8, value: 35000 },
  { timestamp: 9, value: 20000 }, // May
];

const PropertyCanEarnScreen = () => {
  const { control, errors, handleSubmit, showResults, isLoading, goTologinWithPhone, goToConnectAccountIntro } =
    usePropertyCanEarnContainer();

  return (
    <SafeAreaView style={styles.container}>
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
            mt={10}
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
                data={[{ label: 'Riyadh', value: '1' }]}
                placeholder="Select your city"
              />
              <DropdownField
                name="district"
                label=""
                control={control}
                errors={errors}
                data={[{ label: 'Al Olaya', value: '1' }]}
                placeholder="Select District"
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
                data={[{ label: '2 Bedrooms', value: '2' }]}
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
                fontSize={20}
                type="Bold"
                textAlign="center"
                color={Colors.BRUNSWICK_GREEN}
              />
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <AppText
                    text="Monthly Income"
                    fontSize={12}
                    color="#707070"
                  />
                  <AppText
                    text="SAR 1,810"
                    type="Bold"
                    color={Colors.BRUNSWICK_GREEN}
                  />
                </View>
                <View style={styles.statBox}>
                  <AppText text="Yearly Income" fontSize={12} color="#707070" />
                  <AppText
                    text="SAR 16,871"
                    type="Bold"
                    color={Colors.BRUNSWICK_GREEN}
                  />
                </View>
              </View>

              {/* Placeholder for Graph */}
              {/* <View style={styles.graphPlaceholder} /> */}
              <PropertyAreaChart />

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
    </SafeAreaView>
  );
};

const PropertyAreaChart = () => {
  const chartHeight = 180;
  const yAxisLabels = ['SAR 60K', 'SAR 50K', 'SAR 40K', 'SAR 30K', 'SAR 20K', 'SAR 10K', '0'];
  const xAxisLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.chartRow}>

        {/* 1. Left Y-Axis Labels */}
        <View style={[styles.yAxis, { height: chartHeight }]}>
          {yAxisLabels.map((label, index) => (
            <Text key={index} style={styles.axisText}>{label}</Text>
          ))}
        </View>

        {/* 2. Chart Area */}
        <View style={styles.chartContainer}>
          <LineChart.Provider data={data}>
            <LineChart height={chartHeight} width={Metrics.screenWidth - 120}>
              {/* Background Grid Lines */}
              {[10000, 20000, 30000, 40000, 50000, 60000].map((val) => (
                <LineChart.HorizontalLine
                  key={val}
                  at={{ value: val }}
                  color="#E0E0E0"
                />
              ))}
              <LineChart.Path color={Colors.BRUNSWICK_GREEN} width={2}>
                <LineChart.Gradient color={Colors.BRUNSWICK_GREEN + '30'} />
              </LineChart.Path>
              <LineChart.CursorCrosshair color={Colors.PINE_FOREST}>
                <LineChart.Tooltip />
              </LineChart.CursorCrosshair>
            </LineChart>
          </LineChart.Provider>
        </View>
      </View>

      {/* 3. Bottom X-Axis Labels */}
      <View style={styles.xAxis}>
        {xAxisLabels.map((month, index) => (
          <Text key={index} style={styles.axisText}>{month}</Text>
        ))}
      </View>
    </View>
  );
};

export default PropertyCanEarnScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerRight: { flexDirection: 'row' },
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
  titleSection: { marginTop: Metrics.verticalScale(40), alignItems: 'center' },

  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 20,
    marginTop: Metrics.verticalScale(58),
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
