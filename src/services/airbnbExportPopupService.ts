import { createRef } from 'react';
import { AirbnbExportPopupRef } from '@/components/molecules/AirbnbExportPopup/AirbnbExportPopup';

export const airbnbExportPopupRef = createRef<AirbnbExportPopupRef>();

export const showAirbnbExportPopup = () => airbnbExportPopupRef.current?.open();
export const hideAirbnbExportPopup = () => airbnbExportPopupRef.current?.close();
