// Local business data for Shimal Trails.
// Every record and departure has a stable ID that never changes, so saved
// plans can be matched against the latest data when they are restored.
//
// Departure dates are stored as `daysFromToday` so the demo always has
// upcoming trips. dateUtils.js turns them into real calendar dates.

import hunza from '../assets/trips/hunza.svg';
import fairyMeadows from '../assets/trips/fairy-meadows.svg';
import naran from '../assets/trips/naran.svg';
import skardu from '../assets/trips/skardu.svg';
import margalla from '../assets/trips/margalla.svg';
import nathiagali from '../assets/trips/nathiagali.svg';
import neelum from '../assets/trips/neelum.svg';
import swat from '../assets/trips/swat.svg';
import khanpur from '../assets/trips/khanpur.svg';
import kumrat from '../assets/trips/kumrat.svg';
import deosai from '../assets/trips/deosai.svg';

export const CATEGORIES = ['Day trip', 'Weekend', 'Road trip', 'Trek', 'Adventure activity'];
export const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging'];

export const experiences = [
  {
    id: 'margalla-sunrise-hike',
    title: 'Margalla Sunrise Hike: Trail 5 to Pir Sohawa',
    region: 'Islamabad Capital Territory',
    category: 'Day trip',
    difficulty: 'Moderate',
    durationDays: 1,
    maxAltitudeM: 1150,
    minAge: 10,
    pricePerPerson: 3500,
    image: margalla,
    imageAlt: 'Illustration of green Margalla ridges at sunrise with a winding trail',
    summary: 'A 3.5-hour guided climb up Trail 5 with breakfast at the top and transport back down.',
    description:
      'We meet at the Trail 5 car park before first light and climb steadily through pine and scrub to the Pir Sohawa ridge. Breakfast is served at a ridge-top cafe, then a van brings you back to the start. Expect about 700 m of ascent on a rocky, well-marked path.',
    includes: ['Trail guide', 'Breakfast at Pir Sohawa', 'Van back to Trail 5 car park'],
    notIncluded: ['Transport to the trail head', 'Personal snacks'],
    addOns: [{ id: 'poles', label: 'Trekking pole hire', pricePerPerson: 500 }],
    departures: [
      { id: 'mgl-1', daysFromToday: 2, seatsLeft: 6 },
      { id: 'mgl-2', daysFromToday: 5, seatsLeft: 12 },
      { id: 'mgl-3', daysFromToday: 9, seatsLeft: 14 },
    ],
  },
  {
    id: 'khanpur-lake-day',
    title: 'Khanpur Lake Kayak and Cliff Day',
    region: 'Haripur, Khyber Pakhtunkhwa',
    category: 'Adventure activity',
    difficulty: 'Easy',
    durationDays: 1,
    maxAltitudeM: 600,
    minAge: 8,
    pricePerPerson: 6500,
    image: khanpur,
    imageAlt: 'Illustration of a turquoise lake with kayaks below rocky hills',
    summary: 'Kayaking, a supervised cliff jump and lunch at the lake, an hour from Islamabad.',
    description:
      'A relaxed day on Khanpur Lake. Our instructors run a safety briefing, then you kayak across to the cliffs where confident swimmers can try a supervised jump. Life jackets are provided for everyone and lunch is served on the shore.',
    includes: ['Return transport from Islamabad', 'Kayak and life jacket', 'Instructor', 'Lunch'],
    notIncluded: ['Swimwear', 'Personal expenses'],
    addOns: [{ id: 'jetski', label: 'Jet ski ride (15 min)', pricePerPerson: 2500 }],
    departures: [
      { id: 'khp-1', daysFromToday: 4, seatsLeft: 3 },
      { id: 'khp-2', daysFromToday: 7, seatsLeft: 16 },
      { id: 'khp-3', daysFromToday: 11, seatsLeft: 0 },
    ],
  },
  {
    id: 'nathiagali-weekend',
    title: 'Nathiagali and Mushkpuri Weekend',
    region: 'Galiyat, Khyber Pakhtunkhwa',
    category: 'Weekend',
    difficulty: 'Easy',
    durationDays: 2,
    maxAltitudeM: 2800,
    minAge: 0,
    pricePerPerson: 14500,
    image: nathiagali,
    imageAlt: 'Illustration of pine forest hills with a small cottage and mist',
    summary: 'Pine forest walks, the Mushkpuri top hike and a night in a Nathiagali guest house.',
    description:
      'An easy escape for families and first-timers. Saturday covers Ayubia and the Pipeline Track, Sunday morning is the optional Mushkpuri top hike before the drive home. Rooms are shared by two to four people.',
    includes: ['Return transport', '1 night guest house (shared rooms)', 'Dinner and breakfast', 'Guide'],
    notIncluded: ['Lunches', 'Ayubia chairlift ticket'],
    addOns: [
      { id: 'chairlift', label: 'Ayubia chairlift ticket', pricePerPerson: 800 },
      { id: 'private-room', label: 'Private room upgrade', pricePerPerson: 3000 },
    ],
    departures: [
      { id: 'nth-1', daysFromToday: 6, seatsLeft: 10 },
      { id: 'nth-2', daysFromToday: 13, seatsLeft: 18 },
    ],
  },
  {
    id: 'naran-saiful-malook',
    title: 'Naran, Saif-ul-Malook and Babusar Top',
    region: 'Kaghan Valley, Khyber Pakhtunkhwa',
    category: 'Road trip',
    difficulty: 'Easy',
    durationDays: 3,
    maxAltitudeM: 4170,
    minAge: 0,
    pricePerPerson: 26500,
    image: naran,
    imageAlt: 'Illustration of a blue alpine lake beneath a snow-capped peak',
    summary: 'The Kaghan valley road, a jeep to Lake Saif-ul-Malook and the view from Babusar Top.',
    description:
      'Three days up the Kaghan valley. We stay two nights in Naran, take local jeeps up to Lake Saif-ul-Malook and drive to Babusar Top on day two. Long drives of six to seven hours on day one and three.',
    includes: ['Return transport in a coaster', '2 nights hotel (shared rooms)', 'Breakfast and dinner', 'Tour leader'],
    notIncluded: ['Lunches', 'Jeep to Saif-ul-Malook', 'Horse ride at the lake'],
    addOns: [
      { id: 'jeep', label: 'Jeep to Lake Saif-ul-Malook (shared)', pricePerPerson: 2000 },
      { id: 'lunch', label: 'Lunch package (3 days)', pricePerPerson: 3600 },
    ],
    departures: [
      { id: 'nrn-1', daysFromToday: 3, seatsLeft: 4 },
      { id: 'nrn-2', daysFromToday: 10, seatsLeft: 20 },
      { id: 'nrn-3', daysFromToday: 17, seatsLeft: 20 },
    ],
  },
  {
    id: 'swat-kalam',
    title: 'Swat, Malam Jabba and Kalam',
    region: 'Swat, Khyber Pakhtunkhwa',
    category: 'Road trip',
    difficulty: 'Easy',
    durationDays: 4,
    maxAltitudeM: 2900,
    minAge: 0,
    pricePerPerson: 34000,
    image: swat,
    imageAlt: 'Illustration of a river valley with terraced fields and forested slopes',
    summary: 'Mingora, the Malam Jabba chairlift, Kalam and the Ushu forest in four unhurried days.',
    description:
      'A gentle road trip through Swat. We visit the Swat Museum in Saidu Sharif, ride the chairlift at Malam Jabba, and spend two nights in Kalam with a morning walk in the Ushu forest.',
    includes: ['Return transport', '3 nights hotel (shared rooms)', 'Breakfast and dinner', 'Tour leader'],
    notIncluded: ['Lunches', 'Malam Jabba chairlift', 'Jeep to Mahodand lake'],
    addOns: [
      { id: 'chairlift', label: 'Malam Jabba chairlift', pricePerPerson: 1500 },
      { id: 'mahodand', label: 'Jeep to Mahodand lake (shared)', pricePerPerson: 2500 },
    ],
    departures: [
      { id: 'swt-1', daysFromToday: 8, seatsLeft: 2 },
      { id: 'swt-2', daysFromToday: 15, seatsLeft: 16 },
    ],
  },
  {
    id: 'neelum-arang-kel',
    title: 'Neelum Valley and Arang Kel',
    region: 'Neelum, Azad Kashmir',
    category: 'Trek',
    difficulty: 'Moderate',
    durationDays: 4,
    maxAltitudeM: 2400,
    minAge: 12,
    pricePerPerson: 31000,
    image: neelum,
    imageAlt: 'Illustration of a river through a forested valley with a meadow village above',
    summary: 'Keran and Sharda by the Neelum river, then the cable car and steep hike to Arang Kel.',
    description:
      'Four days along the Neelum river. The highlight is Arang Kel, reached by a short cable car across the river and a steep 90-minute climb through forest to a meadow village. Nights are in guest houses with shared bathrooms.',
    includes: ['Return transport', '3 nights guest house', 'Breakfast and dinner', 'Guide', 'Cable car ticket'],
    notIncluded: ['Lunches', 'Pony for the Arang Kel climb'],
    addOns: [{ id: 'pony', label: 'Pony for the Arang Kel climb', pricePerPerson: 2500 }],
    departures: [
      { id: 'nlm-1', daysFromToday: 1, seatsLeft: 8 },
      { id: 'nlm-2', daysFromToday: 12, seatsLeft: 9 },
      { id: 'nlm-3', daysFromToday: 19, seatsLeft: 14 },
    ],
  },
  {
    id: 'fairy-meadows',
    title: 'Fairy Meadows and Nanga Parbat Base Camp',
    region: 'Diamer, Gilgit-Baltistan',
    category: 'Trek',
    difficulty: 'Challenging',
    durationDays: 5,
    maxAltitudeM: 3967,
    minAge: 16,
    pricePerPerson: 47000,
    image: fairyMeadows,
    imageAlt: 'Illustration of a large snow-covered mountain above green meadows and pine trees',
    summary: 'The Raikot jeep track, two nights at Fairy Meadows and a 7 to 9 hour base camp hike.',
    description:
      'For fit walkers. After a long drive and the Raikot bridge jeep track, you hike 3 to 4 hours up to Fairy Meadows. Day three is the base camp hike: 7 to 9 hours on forest trail and glacier moraine. Nights at the meadows are in cabins with shared facilities.',
    includes: ['Return transport', 'Jeeps Raikot to Tato', '4 nights (hotel and cabins)', 'Breakfast and dinner', 'Guide'],
    notIncluded: ['Lunches', 'Pony for the walk up', 'Sleeping bag'],
    addOns: [
      { id: 'pony', label: 'Pony from Tato to Fairy Meadows', pricePerPerson: 4000 },
      { id: 'sleeping-bag', label: 'Sleeping bag hire', pricePerPerson: 1500 },
    ],
    departures: [
      { id: 'frm-1', daysFromToday: 5, seatsLeft: 5 },
      { id: 'frm-2', daysFromToday: 14, seatsLeft: 0 },
      { id: 'frm-3', daysFromToday: 21, seatsLeft: 12 },
    ],
  },
  {
    id: 'hunza-khunjerab',
    title: 'Hunza Valley and Khunjerab Pass',
    region: 'Hunza, Gilgit-Baltistan',
    category: 'Road trip',
    difficulty: 'Easy',
    durationDays: 6,
    maxAltitudeM: 4693,
    minAge: 0,
    pricePerPerson: 58000,
    image: hunza,
    imageAlt: 'Illustration of jagged peaks above a valley with apricot trees and a fort',
    summary: 'Karimabad, Baltit Fort, Attabad Lake and the border crossing at Khunjerab.',
    description:
      'Up the Karakoram Highway to Hunza. Visit Baltit and Altit forts, take a boat on Attabad Lake, cross the Passu suspension bridge viewpoint and drive to the Pakistan-China border at Khunjerab (4,693 m). Most of the trip is by road with short walks.',
    includes: ['Return transport', '5 nights hotel (shared rooms)', 'Breakfast and dinner', 'Fort entry tickets', 'Tour leader'],
    notIncluded: ['Lunches', 'Boat ride on Attabad Lake', 'Khunjerab park fee for foreign nationals'],
    addOns: [
      { id: 'boat', label: 'Attabad Lake boat ride', pricePerPerson: 1500 },
      { id: 'private-room', label: 'Private room upgrade', pricePerPerson: 9000 },
    ],
    departures: [
      { id: 'hnz-1', daysFromToday: 4, seatsLeft: 7 },
      { id: 'hnz-2', daysFromToday: 18, seatsLeft: 15 },
    ],
  },
  {
    id: 'skardu-shangrila-deosai',
    title: 'Skardu, Shangrila and Deosai Plains',
    region: 'Skardu, Gilgit-Baltistan',
    category: 'Road trip',
    difficulty: 'Moderate',
    durationDays: 7,
    maxAltitudeM: 4114,
    minAge: 8,
    pricePerPerson: 69500,
    image: skardu,
    imageAlt: 'Illustration of a cold desert with sand dunes in front of grey mountains',
    summary: 'Shangrila and Upper Kachura lakes, the Sarfaranga cold desert and a day on Deosai.',
    description:
      'A week in Baltistan. Long drives on the Skardu road, nights in Skardu town, and day trips to the Kachura lakes, the Sarfaranga cold desert and the Deosai plains by jeep. Deosai sits above 4,000 m, so warm clothing is essential.',
    includes: ['Return transport', '6 nights hotel', 'Breakfast and dinner', 'Jeep to Deosai', 'Tour leader'],
    notIncluded: ['Lunches', 'Quad biking at Sarfaranga'],
    addOns: [{ id: 'quad', label: 'Quad biking at Sarfaranga', pricePerPerson: 3500 }],
    departures: [
      { id: 'skd-1', daysFromToday: 9, seatsLeft: 1 },
      { id: 'skd-2', daysFromToday: 23, seatsLeft: 14 },
    ],
  },
  {
    id: 'kumrat-valley-camp',
    title: 'Kumrat Valley Riverside Camp',
    region: 'Upper Dir, Khyber Pakhtunkhwa',
    category: 'Weekend',
    difficulty: 'Moderate',
    durationDays: 3,
    maxAltitudeM: 2400,
    minAge: 10,
    pricePerPerson: 22500,
    image: kumrat,
    imageAlt: 'Illustration of tents beside a river under tall deodar trees',
    summary: 'Two nights in tents by the Panjkora river, with a jeep ride to Jahaz Banda base.',
    description:
      'Camping in Kumrat. Expect a long drive, a bumpy jeep section and two nights in shared tents beside the river. Day two is an optional walk towards the waterfall at Kala Chashma.',
    includes: ['Return transport', 'Jeeps in the valley', '2 nights camping (shared tents)', 'All meals at camp', 'Guide'],
    notIncluded: ['Sleeping bag', 'Meals on the road'],
    addOns: [{ id: 'sleeping-bag', label: 'Sleeping bag hire', pricePerPerson: 1200 }],
    departures: [
      { id: 'kmr-1', daysFromToday: 6, seatsLeft: 9 },
      { id: 'kmr-2', daysFromToday: 20, seatsLeft: 12 },
    ],
  },
  {
    id: 'deosai-stargazing',
    title: 'Deosai Plains Overnight Stargazing Camp',
    region: 'Deosai National Park, Gilgit-Baltistan',
    category: 'Adventure activity',
    difficulty: 'Challenging',
    durationDays: 2,
    maxAltitudeM: 4114,
    minAge: 16,
    pricePerPerson: 24000,
    image: deosai,
    imageAlt: 'Illustration of a starry night sky above a high plateau with a tent',
    summary: 'A night at 4,000 m near Sheosar lake with a guide and telescope. Starts in Skardu.',
    description:
      'For travellers already in Skardu. A jeep takes you up to Deosai, where we camp near Sheosar lake. Night temperatures fall below zero even in summer, and altitude can affect anyone, so this camp is limited to adults and older teens.',
    includes: ['Jeep from Skardu', '1 night camping', 'Dinner and breakfast', 'Telescope session', 'Guide'],
    notIncluded: ['Travel to Skardu', 'Sleeping bag'],
    addOns: [{ id: 'sleeping-bag', label: 'Four-season sleeping bag hire', pricePerPerson: 2000 }],
    departures: [
      { id: 'dso-1', daysFromToday: 2, seatsLeft: 6 },
      { id: 'dso-2', daysFromToday: 16, seatsLeft: 8 },
    ],
  },
  {
    id: 'rawal-heritage-evening',
    // Intentionally has no image so the image fallback can be checked.
    title: 'Rawalpindi Heritage Food Walk',
    region: 'Rawalpindi, Punjab',
    category: 'Day trip',
    difficulty: 'Easy',
    durationDays: 1,
    maxAltitudeM: 510,
    minAge: 0,
    pricePerPerson: 4000,
    image: null,
    imageAlt: '',
    summary: 'An evening walk through Raja Bazaar and Saddar with six food tasting stops.',
    description:
      'A three-hour evening walk with a local guide through the old bazaars of Rawalpindi, from Raja Bazaar to Saddar. Six tasting stops are included, from chana chaat to kheer.',
    includes: ['Local guide', 'Six tasting stops', 'Bottled water'],
    notIncluded: ['Transport to Raja Bazaar'],
    addOns: [],
    departures: [
      { id: 'rwp-1', daysFromToday: 3, seatsLeft: 10 },
      { id: 'rwp-2', daysFromToday: 7, seatsLeft: 10 },
    ],
  },
];
