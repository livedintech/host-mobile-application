import * as yup from 'yup'

export interface BookingComFormValues {
    roomId: string
    hotelId: string
    apartmentId: string
}

export const bookingComSchema = yup.object().shape({
    roomId: yup.string().required('Room ID is required'),
    hotelId: yup.string().required('Hotel ID is required'),
    apartmentId: yup.string().required('Please select an apartment'),
})