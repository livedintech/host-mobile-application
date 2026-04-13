import * as yup from 'yup'
export interface BookingComFormValues {
    roomId: string
    hotelId: string
    apartmentId: string | null
    rate?: string
}

export const bookingComSchema = yup.object().shape({
    roomId: yup.string().required('Room ID is required'),
    hotelId: yup.string().required('Hotel ID is required'),

    apartmentId: yup.string().nullable(),

    rate: yup.string().when('apartmentId', {
        is: (val: string | null) => !val || val === '',
        then: (schema) => schema.required('Rate is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
})