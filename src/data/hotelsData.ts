import { Hotel } from '../types/index';
import { getAccommodationHotels } from './accommodationsData';

export const hotelsData: Hotel[] = getAccommodationHotels();
