import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function useReservationDetailsContainer(reservationId?: string) {
    // Dummy Data based on image
    const [details, setDetails] = useState({
        guestName: 'Abdulrahman Al Hassan',
        propertyName: 'Alpha House',
        address: 'King Fahd Road, Al Madinah Al Munawarah, Al Madinah Province 42311, Saudi Arabia',
        unitType: '3 Bedroom Apartment',
        guestEmail: 'alhassan@gmail.com',
        guestPhone: '+966 501223123',
        bookingPlatform: 'Airbnb',
        numberOfGuests: 3,
        numberOfNights: 2,
        checkInTime: '09:00AM',
        checkOutTime: '22:00PM',
        bookingDates: '6 January - 9 January',
        paymentStatus: 'Paid'
    });

    // API Integration placeholder
    const { data, isLoading } = useQuery({
        queryKey: ['reservation', reservationId],
        queryFn: () => Promise.resolve(details), // Replace with real API
        enabled: !!reservationId
    });

    return {
        details: data || details,
        isLoading
    };
}