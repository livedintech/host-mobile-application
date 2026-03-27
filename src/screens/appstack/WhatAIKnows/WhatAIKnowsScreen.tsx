import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import { goBack } from '@/services/navigationService';

const KNOWLEDGE_DATA = [
    {
        title: 'Availability Details',
        items: [
            'Listing allows same-day check-in on the guest departure (check-out) date',
            'Listing allows same-day check-out on the guest arrival (check-in) date',
            'Listing is available one day before guest’s arrival date',
            'Listing is available on the guest’s departure date',
        ],
    },
    {
        title: 'Conversation Messages',
        items: ['All incoming messages', 'All outgoing messages'],
    },
    {
        title: 'Listing Details',
        items: [
            'Amenities (comma-separated)',
            'Cancellation policy',
            'Cleaning status',
            'External Name, address, city',
            'Bathroom number and type',
            'Bedrooms: number, beds, and type',
            'House rules',
            'Maximum children/pets allowed',
            'Person capacity',
            'Room type',
            'Special instructions',
            'Wi-Fi credentials',
        ],
    },
    {
        title: 'Reservation Details',
        items: [
            'Door code',
            'Check-in/check-out times',
            'Guest country',
            'Guest name',
            'Number of guests, children, pets, infants',
            'Payment status',
            'Reservation status',
        ],
    },
];

const WhatAIKnowsScreen = () => {
    return (
        <BGImage source={require('@/assets/img/background/linearBG.png')}>
            <View style={styles.container}>
             

                <ScrollView 
                    contentContainerStyle={styles.scrollContainer} 
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.titleSection}>
                        <AppText 
                            text="What AI Already Knows" 
                            fontSize={28} 
                            type="Bold" 
                            color={Colors.BLACK} 
                        />
                    </View>

                    {KNOWLEDGE_DATA.map((section, index) => (
                        <GlassCard key={index} width="100%" style={styles.glassCardOverride}>
                            <View style={styles.cardPadding}>
                                {/* Section Title */}
                                <AppText
                                    text={section.title}
                                    fontSize={18}
                                    type="Bold"
                                    color={Colors.BLACK}
                                    mb={Metrics.verticalScale(15)}
                                />

                                {/* Bullet Items */}
                                {section.items.map((item, itemIndex) => (
                                    <View key={itemIndex} style={styles.bulletRow}>
                                        <View style={styles.bulletPoint} />
                                        <AppText
                                            text={item}
                                            fontSize={14}
                                            color={Colors.BLACK}
                                            style={styles.bulletText}
                                        />
                                    </View>
                                ))}
                            </View>
                        </GlassCard>
                    ))}
                </ScrollView>
            </View>
        </BGImage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.verticalScale(40),
    },
    header: {
        paddingHorizontal: Metrics.scale(22),
        marginBottom: Metrics.verticalScale(10),
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    titleSection: {
        marginBottom: Metrics.verticalScale(25),
    },
    scrollContainer: {
        paddingHorizontal: Metrics.scale(22),
        paddingBottom: Metrics.verticalScale(40),
    },
    glassCardOverride: {
        marginBottom: Metrics.verticalScale(20),
        borderRadius: 22,
    },
    cardPadding: {
        padding: Metrics.scale(20),
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Metrics.verticalScale(5),
    },
    bulletPoint: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.BLACK,
        marginTop: Metrics.verticalScale(8),
        marginRight: Metrics.scale(12),
    },
    bulletText: {
        flex: 1,
        lineHeight: 20,
    },
});

export default WhatAIKnowsScreen;