import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import useAIDynamicPricingContainer from './CreateEditListingAiDynamicPricingContainer';
import { useTranslation } from 'react-i18next';

const AIDynamicPricingScreen = () => {
  const { 
    selectedMode, setSelectedMode, 
    manualOverride, setManualOverride, 
    onSave,
    isLoading,
    isEdit
  } = useAIDynamicPricingContainer();
  const { t } = useTranslation();

  const ModeCard = ({ title, type, points }: any) => {
    const isActive = selectedMode === type;
    return (
      <TouchableOpacity 
        style={[styles.card, isActive && styles.activeCard]} 
        onPress={() => setSelectedMode(type)}
        activeOpacity={0.8}
      >
        <AppText text={title} fontSize={20} type="Bold" />
        <AppText text={t('app.ai_dynamic_pricing.choose_if')} fontSize={14} mt={10} color="#6B6B6B" />
        {points.map((p: string, i: number) => (
          <View key={i} style={styles.pointRow}>
            <View style={styles.dot} />
            <AppText text={p} fontSize={13} color="#6B6B6B" />
          </View>
        ))}
        
        {/* Graph Placeholder (As seen in Screenshot 1 & 2) */}
        {isActive && (
           <View style={styles.graphContainer}>
              <AppText text={t('app.ai_dynamic_pricing.result')} fontSize={12} color="#6B6B6B" mb={10} />
              <View style={styles.placeholderGraph}>
                 {/* Yahan aap apna SVG graph laga sakte hain */}
                 <View style={[styles.graphLine, type === 'aggressive' && styles.aggressiveLine]} />
              </View>
              <View style={styles.graphLabels}>
                 <AppText text={t('app.ai_dynamic_pricing.month_april')} fontSize={10} />
                 <AppText text={t('app.ai_dynamic_pricing.month_may')} fontSize={10} />
                 <AppText text={t('app.ai_dynamic_pricing.month_june')} fontSize={10} />
              </View>
           </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => goBack()} style={styles.backBtn}>
              <Svgicons path='arrowLeftIcon' size={24} />
            </TouchableOpacity>
            <CircularProgress percentage={90} size={48} strokeWidth={4} />
          </View>

          <AppText text={t('app.ai_dynamic_pricing.title')} fontSize={32} type="Bold" mt={30} />
          <AppText
            text={t('app.ai_dynamic_pricing.description')}
            fontSize={14} color="#6B6B6B" mt={10} 
          />

          <View style={styles.cardsWrapper}>
            <ModeCard
              title={t('app.ai_dynamic_pricing.conservative_mode')}
              type="conservative"
              points={[t('app.ai_dynamic_pricing.conservative_point_1'), t('app.ai_dynamic_pricing.conservative_point_2'), t('app.ai_dynamic_pricing.conservative_point_3')]}
            />

            <ModeCard
              title={t('app.ai_dynamic_pricing.aggressive_mode')}
              type="aggressive"
              points={[t('app.ai_dynamic_pricing.aggressive_point_1'), t('app.ai_dynamic_pricing.aggressive_point_2'), t('app.ai_dynamic_pricing.aggressive_point_3')]}
            />
          </View>

          <View style={styles.overrideRow}>
            <View style={{ flex: 1 }}>
              <AppText text={t('app.ai_dynamic_pricing.manual_override_title')} fontSize={18} type="Medium" />
              <AppText text={t('app.ai_dynamic_pricing.manual_override_desc')} fontSize={12} color="#6B6B6B" mt={5} />
            </View>
            <Switch 
              value={manualOverride} 
              onValueChange={setManualOverride}
              trackColor={{ false: "#767577", true: "#00A684" }}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {!isEdit && (
            <AppButton
              title={t('app.ai_dynamic_pricing.next')}
              variant="secondary"
              onPress={() => onSave(false)}
              loading={isLoading}
            />
          )}
          <AppButton
            title={t('app.ai_dynamic_pricing.save_exit')}
            mt={!isEdit ? 12 : 0}
            onPress={() => onSave(true)}
            disabled={isLoading}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 220 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 8, borderRadius: 20, backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE' },
  cardsWrapper: { marginTop: 30 },
  card: { 
    backgroundColor: 'rgba(255,255,255,0.6)', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'transparent' 
  },
  activeCard: { borderColor: '#00A684', backgroundColor: 'white' },
  pointRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#6B6B6B', marginRight: 8 },
  overrideRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingBottom: 20 },
  graphContainer: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15 },
  placeholderGraph: { height: 80, backgroundColor: '#F9F9F9', borderRadius: 10, justifyContent: 'flex-end' },
  graphLine: { height: 2, backgroundColor: '#00A684', width: '80%', alignSelf: 'center', marginBottom: 20 },
  aggressiveLine: { transform: [{ rotate: '-10deg' }] },
  graphLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'white', paddingBottom: 40 }
});

export default AIDynamicPricingScreen;