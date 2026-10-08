import { SRI_LANKAN_ACCOMMODATIONS } from '../data/accommodationsData';
import type { Hotel } from '../types';

// Curated tourism destinations; parks have no forced province assignment.
export const HOTEL_DESTINATIONS: { name: string; province?: string }[] = [
  {
    "name": "Colombo",
    "province": "Western"
  },
  {
    "name": "Negombo",
    "province": "Western"
  },
  {
    "name": "Mount Lavinia",
    "province": "Western"
  },
  {
    "name": "Kalutara",
    "province": "Western"
  },
  {
    "name": "Wadduwa",
    "province": "Western"
  },
  {
    "name": "Beruwala",
    "province": "Western"
  },
  {
    "name": "Bentota",
    "province": "Southern"
  },
  {
    "name": "Galle",
    "province": "Southern"
  },
  {
    "name": "Unawatuna",
    "province": "Southern"
  },
  {
    "name": "Hikkaduwa",
    "province": "Southern"
  },
  {
    "name": "Ahungalla",
    "province": "Southern"
  },
  {
    "name": "Balapitiya",
    "province": "Southern"
  },
  {
    "name": "Ambalangoda",
    "province": "Southern"
  },
  {
    "name": "Koggala",
    "province": "Southern"
  },
  {
    "name": "Ahangama",
    "province": "Southern"
  },
  {
    "name": "Weligama",
    "province": "Southern"
  },
  {
    "name": "Mirissa",
    "province": "Southern"
  },
  {
    "name": "Matara",
    "province": "Southern"
  },
  {
    "name": "Polhena",
    "province": "Southern"
  },
  {
    "name": "Talalla",
    "province": "Southern"
  },
  {
    "name": "Dikwella",
    "province": "Southern"
  },
  {
    "name": "Tangalle",
    "province": "Southern"
  },
  {
    "name": "Rekawa",
    "province": "Southern"
  },
  {
    "name": "Hambantota",
    "province": "Southern"
  },
  {
    "name": "Trincomalee",
    "province": "Eastern"
  },
  {
    "name": "Nilaveli",
    "province": "Eastern"
  },
  {
    "name": "Uppuveli",
    "province": "Eastern"
  },
  {
    "name": "Pasikuda",
    "province": "Eastern"
  },
  {
    "name": "Kalkudah",
    "province": "Eastern"
  },
  {
    "name": "Batticaloa",
    "province": "Eastern"
  },
  {
    "name": "Arugam Bay",
    "province": "Eastern"
  },
  {
    "name": "Pottuvil",
    "province": "Eastern"
  },
  {
    "name": "Panama",
    "province": "Eastern"
  },
  {
    "name": "Ampara",
    "province": "Eastern"
  },
  {
    "name": "Kandy",
    "province": "Central"
  },
  {
    "name": "Peradeniya",
    "province": "Central"
  },
  {
    "name": "Nuwara Eliya",
    "province": "Central"
  },
  {
    "name": "Hatton",
    "province": "Central"
  },
  {
    "name": "Nallathanniya",
    "province": "Central"
  },
  {
    "name": "Sigiriya",
    "province": "Central"
  },
  {
    "name": "Dambulla",
    "province": "Central"
  },
  {
    "name": "Habarana",
    "province": "Central"
  },
  {
    "name": "Ella",
    "province": "Uva"
  },
  {
    "name": "Haputale",
    "province": "Uva"
  },
  {
    "name": "Bandarawela",
    "province": "Uva"
  },
  {
    "name": "Diyatalawa",
    "province": "Uva"
  },
  {
    "name": "Badulla",
    "province": "Uva"
  },
  {
    "name": "Monaragala",
    "province": "Uva"
  },
  {
    "name": "Tissamaharama",
    "province": "Southern"
  },
  {
    "name": "Kataragama",
    "province": "Uva"
  },
  {
    "name": "Wellawaya",
    "province": "Uva"
  },
  {
    "name": "Buttala",
    "province": "Uva"
  },
  {
    "name": "Anuradhapura",
    "province": "North Central"
  },
  {
    "name": "Mihintale",
    "province": "North Central"
  },
  {
    "name": "Polonnaruwa",
    "province": "North Central"
  },
  {
    "name": "Ritigala",
    "province": "North Central"
  },
  {
    "name": "Medawachchiya",
    "province": "North Central"
  },
  {
    "name": "Kekirawa",
    "province": "North Central"
  },
  {
    "name": "Jaffna",
    "province": "Northern"
  },
  {
    "name": "Nallur",
    "province": "Northern"
  },
  {
    "name": "Point Pedro",
    "province": "Northern"
  },
  {
    "name": "Chavakachcheri",
    "province": "Northern"
  },
  {
    "name": "Kilinochchi",
    "province": "Northern"
  },
  {
    "name": "Mullaitivu",
    "province": "Northern"
  },
  {
    "name": "Mannar",
    "province": "Northern"
  },
  {
    "name": "Talaimannar",
    "province": "Northern"
  },
  {
    "name": "Vavuniya",
    "province": "Northern"
  },
  {
    "name": "Kalpitiya",
    "province": "North Western"
  },
  {
    "name": "Puttalam",
    "province": "North Western"
  },
  {
    "name": "Chilaw",
    "province": "North Western"
  },
  {
    "name": "Marawila",
    "province": "North Western"
  },
  {
    "name": "Kurunegala",
    "province": "North Western"
  },
  {
    "name": "Ratnapura",
    "province": "Sabaragamuwa"
  },
  {
    "name": "Kitulgala",
    "province": "Sabaragamuwa"
  },
  {
    "name": "Pinnawala",
    "province": "Sabaragamuwa"
  },
  {
    "name": "Kegalle",
    "province": "Sabaragamuwa"
  },
  {
    "name": "Belihuloya",
    "province": "Sabaragamuwa"
  },
  {
    "name": "Embilipitiya",
    "province": "Sabaragamuwa"
  },
  {
    "name": "Udawalawe",
    "province": "Sabaragamuwa"
  },
  {
    "name": "Yala"
  },
  {
    "name": "Wilpattu"
  },
  {
    "name": "Minneriya"
  },
  {
    "name": "Kaudulla"
  }
];
export const HOTEL_PROVINCES = ["Western","Southern","Eastern","Central","Uva","North Central","Northern","North Western","Sabaragamuwa"];
const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const aliases: Record<string, string> = { passikudah: 'pasikuda', pasikudah: 'pasikuda', dickwella: 'dikwella', arugambay: 'arugam bay' };
const canonical = (value: string) => aliases[normalize(value)] || normalize(value);

export function matchesHotelDestination(hotel: Hotel, destination: string): boolean {
  if (destination === 'All') return true;
  const record = SRI_LANKAN_ACCOMMODATIONS.find(item => item.id === hotel.id);
  // Match locality/area phrases, not road names mentioned in an address.
  return [record?.city, record?.area, hotel.destinationName].some(value =>
    value && (' ' + canonical(value) + ' ').includes(' ' + canonical(destination) + ' '));
}

export function matchesHotelProvince(hotel: Hotel, province: string): boolean {
  if (province === 'All') return true;
  const record = SRI_LANKAN_ACCOMMODATIONS.find(item => item.id === hotel.id);
  // A property's recorded address can identify its province even in a multi-province park.
  return !!record && record.address.split(',').some(part => normalize(part) === normalize(province + ' Province'));
}
