import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';

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
            'Key pickup instructions',
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
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleWrapper}>
                    <AppText text="What AI Already Knows" fontSize={22} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path="expandIcon" size={18} color={Colors.BRUNSWICK_GREEN} ml={8} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {KNOWLEDGE_DATA.map((section, index) => (
                    <View key={index} style={styles.sectionWrapper}>
                        {/* Section Title */}
                        <AppText
                            text={section.title}
                            fontSize={18}
                            type="SemiBold"
                            color={Colors.MIDNIGHT}
                            mb={Metrics.verticalScale(12)}
                        />

                        {/* Bullet Items */}
                        {section.items.map((item, itemIndex) => (
                            <View key={itemIndex} style={styles.bulletRow}>
                                <View style={styles.bulletPoint} />
                                <AppText
                                    text={item}
                                    fontSize={14}
                                    color={Colors.SUPER_GREY}
                                    style={styles.bulletText}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Metrics.verticalScale(20),
        justifyContent: 'center',
    },
    backBtn: {
        position: 'absolute',
        left: Metrics.scale(20),
        padding: Metrics.scale(8),
        borderWidth: 1,
        borderColor: Colors.SMOOTH_GREY,
        borderRadius: 100
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    scrollContainer: {
        paddingHorizontal: Metrics.scale(25),
        paddingBottom: Metrics.verticalScale(40)
    },
    sectionWrapper: {
        marginTop: Metrics.verticalScale(25),
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Metrics.verticalScale(8),
        paddingLeft: Metrics.scale(5),
    },
    bulletPoint: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: Colors.SUPER_GREY,
        marginTop: Metrics.verticalScale(8),
        marginRight: Metrics.scale(10),
    },
    bulletText: {
        flex: 1,
        lineHeight: 20,
    },
});

export default WhatAIKnowsScreen;