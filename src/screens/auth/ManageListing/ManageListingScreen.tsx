import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useManageListingContainer, { listingData } from './ManageListingContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

const ManageListingScreen = () => {
    const { selectedListing, onSelect, isLoading} = useManageListingContainer();

    if (isLoading) {
    return (
        <SafeAreaView style={styles.loaderContainer}>
            <ActivityIndicator
                size="large" 
                color={Colors.BRUNSWICK_GREEN} 
            />
            <AppText
                text="Loading listings..."
                fontSize={14}
                color={Colors.SUPER_GREY}
                style={{ marginTop: 10 }}
            />
        </SafeAreaView>
    );
}


    return (
        <SafeAreaView style={styles.container}>
            {/* Background Decorative Circles */}
            <View style={styles.circleContainer} pointerEvents="none">
                <View style={styles.circleLarge} />
                <View style={styles.circleMedium} />
                <View style={styles.circleSmall} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <AppText 
                    text="How many listing do you manage?" 
                    textAlign="center" 
                    fontSize={32} 
                    color={Colors.BLACK}
                    style={styles.title}
                />

                <View style={styles.grid}>
                    {listingData.map((item) => {
                        const isSelected = selectedListing === item.id;
                        
                        return (
                            <ButtonView 
                                key={item.id}
                                activeOpacity={0.9}
                                style={[styles.card, isSelected && styles.cardActive]}
                                onPress={() => onSelect(item.id)}
                                disabled={!item?.isEnable}
                            >
                                <Svgicons path='property' size={40}/>
                                <AppText 
                                    text={item.label} 
                                    fontSize={16} 
                                    type="Medium" 
                                    color={isSelected ? Colors.BRUNSWICK_GREEN : Colors.BLACK}
                                    style={styles.cardLabel}
                                />
                            </ButtonView>
                        );
                    })}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Metrics.scale(20),
        marginTop: Metrics.verticalScale(10),
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    backBtn: {
        paddingHorizontal: 25,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        marginBottom: Metrics.verticalScale(50),
        lineHeight: 42,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    card: {
        width: (Metrics.screenWidth - 60) / 3,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    cardActive: {
        borderColor: Colors.BRUNSWICK_GREEN,
        borderWidth: 1.5,
    },
    cardLabel: {
        marginTop: 10,
    },
    // Background Circles Styling
    circleContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    circleLarge: {
        width: Metrics.screenWidth * 1.5,
        height: Metrics.screenWidth * 1.5,
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: '#F8F8F8',
        position: 'absolute',
    },
    circleMedium: {
        width: Metrics.screenWidth * 1.1,
        height: Metrics.screenWidth * 1.1,
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: '#F4F4F4',
        position: 'absolute',
    },
    circleSmall: {
        width: Metrics.screenWidth * 0.7,
        height: Metrics.screenWidth * 0.7,
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        position: 'absolute',
    },
    iconContainer: {
        width: 30,
        height: 35,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    buildingBase: {
        width: 18,
        height: 30,
        borderWidth: 2,
        borderRadius: 2,
        padding: 2,
        justifyContent: 'space-around',
    },
    buildingSide: {
        width: 10,
        height: 20,
        borderWidth: 2,
        borderLeftWidth: 0,
        borderRadius: 2,
    },
    window: {
        width: '100%',
        height: 2,
    },
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
},

});

export default ManageListingScreen;