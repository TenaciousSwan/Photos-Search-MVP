const PHOTO_BASE = "https://picsum.photos/id";

function src(id, w = 800) {
  return `${PHOTO_BASE}/${id}/${w}/${w}`;
}

/** Real Lorem Picsum photographs (Unsplash originals). IDs are known-good. */
const LIBRARY = [
  { id: "p01", img: 225, taken: "2026-10-04T11:24:00", place: "Artisan Cafe", city: "Portland", people: ["Maya"], kind: "photo", isNew: true, album: "Oregon", favorite: true, tags: ["cafe", "lunch", "coffee"] },
  { id: "p02", img: 1015, taken: "2026-10-04T16:02:00", place: "Washington Park", city: "Portland", people: ["Maya", "Arjun"], kind: "photo", isNew: true, burstId: "b-park", burstIndex: 0, album: "Oregon", tags: ["park", "trees"] },
  { id: "p03", img: 1016, taken: "2026-10-04T16:02:02", place: "Washington Park", city: "Portland", people: ["Maya", "Arjun"], kind: "photo", isNew: true, burstId: "b-park", burstIndex: 1, album: "Oregon", tags: ["park"] },
  { id: "p04", img: 1018, taken: "2026-10-04T16:02:04", place: "Washington Park", city: "Portland", people: ["Arjun"], kind: "photo", isNew: true, burstId: "b-park", burstIndex: 2, album: "Oregon", tags: ["park"] },
  { id: "p05", img: 1025, taken: "2026-10-04T17:40:00", place: "Alberta Street", city: "Portland", people: ["Luna"], kind: "photo", isNew: true, album: "Oregon", pet: true, tags: ["dog", "walk"] },
  { id: "p06", img: 180, taken: "2026-10-04T18:12:00", place: "Home", city: "Portland", people: [], kind: "screenshot", isNew: true, tags: ["maps"] },

  { id: "p07", img: 292, taken: "2026-10-03T19:10:00", place: "Pike Place", city: "Seattle", people: ["Priya"], kind: "photo", album: "Northwest", favorite: true, tags: ["dinner", "market"] },
  { id: "p08", img: 1019, taken: "2026-10-03T16:30:00", place: "Elliott Bay", city: "Seattle", people: ["Priya", "Maya"], kind: "photo", album: "Northwest", tags: ["waterfront"] },
  { id: "p09", img: 42, taken: "2026-10-03T10:05:00", place: "Cherry Street Coffee", city: "Seattle", people: ["Maya"], kind: "photo", album: "Northwest", tags: ["cafe", "morning"] },

  { id: "p10", img: 367, taken: "2026-10-01T14:22:00", place: "Whole Foods", city: "Portland", people: [], kind: "receipt", tags: ["groceries"] },
  { id: "p11", img: 20, taken: "2026-10-01T14:18:00", place: "Whole Foods", city: "Portland", people: ["Arjun"], kind: "photo", tags: ["shopping"] },

  { id: "p12", img: 28, taken: "2026-09-22T12:40:00", place: "Powell's Books", city: "Portland", people: ["Dad"], kind: "photo", album: "Oregon", tags: ["books"] },
  { id: "p13", img: 24, taken: "2026-09-21T09:12:00", place: "Forest Park", city: "Portland", people: ["Luna"], kind: "photo", album: "Oregon", pet: true, favorite: true, tags: ["hike", "fog"] },
  { id: "p14", img: 122, taken: "2026-09-18T20:05:00", place: "Fremont", city: "Seattle", people: ["Priya"], kind: "photo", album: "Northwest", tags: ["night"] },
  { id: "p15", img: 64, taken: "2026-09-12T13:30:00", place: "Perch Coffee", city: "Portland", people: ["Maya", "Arjun"], kind: "photo", album: "Oregon", tags: ["cafe", "meetup"] },
  { id: "p16", img: 65, taken: "2026-09-08T11:00:00", place: "Waterfront Park", city: "Portland", people: [], kind: "photo", album: "Oregon", tags: ["bridge"] },

  { id: "p17", img: 1011, taken: "2026-08-19T16:20:00", place: "Calangute Beach", city: "Goa", people: ["Maya", "Priya"], kind: "photo", album: "Goa", favorite: true, tags: ["beach", "summer"] },
  { id: "p18", img: 1012, taken: "2026-08-19T17:05:00", place: "Calangute Beach", city: "Goa", people: ["Maya"], kind: "photo", album: "Goa", tags: ["sunset"] },
  { id: "p19", img: 1013, taken: "2026-08-18T13:10:00", place: "Anjuna", city: "Goa", people: ["Priya", "Arjun"], kind: "photo", album: "Goa", tags: ["market"] },
  { id: "p20", img: 1014, taken: "2026-08-17T09:40:00", place: "Baga", city: "Goa", people: [], kind: "photo", album: "Goa", tags: ["boats"] },
  { id: "p21", img: 164, taken: "2026-08-16T21:00:00", place: "Panaji", city: "Goa", people: ["Arjun"], kind: "photo", album: "Goa", tags: ["night"] },
  { id: "p22", img: 163, taken: "2026-08-15T12:15:00", place: "Fontainhas", city: "Goa", people: ["Maya"], kind: "photo", album: "Goa", tags: ["streets"] },

  { id: "p23", img: 201, taken: "2026-07-11T15:00:00", place: "Millennium Park", city: "Chicago", people: ["Dad"], kind: "photo", album: "Midwest", tags: ["skyline"] },
  { id: "p24", img: 202, taken: "2026-07-11T18:40:00", place: "The Bean", city: "Chicago", people: ["Dad", "Maya"], kind: "photo", album: "Midwest", tags: ["cloud gate"] },
  { id: "p25", img: 203, taken: "2026-07-10T12:20:00", place: "Lou Malnati's", city: "Chicago", people: ["Maya"], kind: "photo", album: "Midwest", tags: ["pizza", "lunch"] },
  { id: "p26", img: 204, taken: "2026-07-09T09:50:00", place: "Riverwalk", city: "Chicago", people: [], kind: "photo", album: "Midwest", tags: ["river"] },

  { id: "p27", img: 274, taken: "2026-06-14T17:30:00", place: "Golden Gate", city: "San Francisco", people: ["Arjun"], kind: "photo", album: "California", tags: ["bridge", "fog"] },
  { id: "p28", img: 1036, taken: "2026-06-13T11:10:00", place: "Dolores Park", city: "San Francisco", people: ["Maya", "Priya"], kind: "photo", album: "California", tags: ["picnic"] },
  { id: "p29", img: 1037, taken: "2026-06-12T08:25:00", place: "Ferry Building", city: "San Francisco", people: [], kind: "photo", album: "California", tags: ["market"] },

  { id: "p30", img: 1038, taken: "2026-04-22T19:45:00", place: "Shibuya", city: "Tokyo", people: ["Arjun"], kind: "photo", album: "Japan", favorite: true, tags: ["night", "crossing"] },
  { id: "p31", img: 1039, taken: "2026-04-21T13:00:00", place: "Senso-ji", city: "Tokyo", people: ["Maya"], kind: "photo", album: "Japan", tags: ["temple"] },
  { id: "p32", img: 1040, taken: "2026-04-20T09:15:00", place: "Tsukiji", city: "Tokyo", people: ["Maya", "Arjun"], kind: "photo", album: "Japan", tags: ["breakfast", "market"] },

  { id: "p33", img: 1041, taken: "2025-12-28T16:00:00", place: "Home", city: "Portland", people: ["Dad", "Maya", "Arjun"], kind: "photo", tags: ["family"] },
  { id: "p34", img: 1043, taken: "2025-12-25T10:20:00", place: "Home", city: "Portland", people: ["Dad"], kind: "photo", favorite: true, tags: ["holiday"] },
  { id: "p35", img: 1044, taken: "2025-12-24T21:10:00", place: "Pioneer Courthouse Square", city: "Portland", people: ["Priya"], kind: "photo", tags: ["lights"] },

  { id: "p36", img: 1047, taken: "2025-10-21T19:30:00", place: "Johari Bazaar", city: "Jaipur", people: ["Priya", "Arjun"], kind: "photo", album: "Diwali 2025", favorite: true, tags: ["diwali", "lights", "festival"] },
  { id: "p37", img: 1048, taken: "2025-10-21T20:10:00", place: "Hawa Mahal", city: "Jaipur", people: ["Maya"], kind: "photo", album: "Diwali 2025", tags: ["diwali"] },
  { id: "p38", img: 1049, taken: "2025-10-20T18:40:00", place: "City Palace", city: "Jaipur", people: ["Dad", "Maya"], kind: "photo", album: "Diwali 2025", tags: ["diwali", "palace"] },
  { id: "p39", img: 1050, taken: "2025-10-20T12:05:00", place: "LMB", city: "Jaipur", people: ["Arjun"], kind: "photo", album: "Diwali 2025", tags: ["sweets", "lunch"] },
  { id: "p40", img: 1051, taken: "2025-10-19T09:00:00", place: "Amber Fort", city: "Jaipur", people: ["Priya"], kind: "photo", album: "Diwali 2025", tags: ["fort"] },

  { id: "p41", img: 1052, taken: "2025-08-08T15:20:00", place: "Regent's Park", city: "London", people: ["Maya"], kind: "photo", album: "London", tags: ["summer", "park"] },
  { id: "p42", img: 1053, taken: "2025-08-07T11:45:00", place: "Borough Market", city: "London", people: ["Arjun", "Maya"], kind: "photo", album: "London", tags: ["market", "lunch"] },
  { id: "p43", img: 1054, taken: "2025-08-06T19:00:00", place: "South Bank", city: "London", people: ["Priya"], kind: "photo", album: "London", tags: ["thames"] },
  { id: "p44", img: 1055, taken: "2025-08-05T08:30:00", place: "Columbia Road", city: "London", people: [], kind: "photo", album: "London", tags: ["flowers"] },

  { id: "p45", img: 1056, taken: "2025-05-14T13:10:00", place: "Discovery Park", city: "Seattle", people: ["Luna", "Maya"], kind: "photo", pet: true, tags: ["spring"] },
  { id: "p46", img: 1057, taken: "2025-05-03T16:40:00", place: "Multnomah Falls", city: "Portland", people: ["Dad"], kind: "photo", album: "Oregon", tags: ["waterfall"] },
  { id: "p47", img: 1058, taken: "2025-05-01T10:00:00", place: "Home", city: "Portland", people: [], kind: "document", tags: ["lease"] },

  { id: "p48", img: 1059, taken: "2025-01-18T12:30:00", place: "Powell's Books", city: "Portland", people: ["Maya"], kind: "photo", tags: ["rain"] },
  { id: "p49", img: 1060, taken: "2025-01-12T09:20:00", place: "Home", city: "Portland", people: [], kind: "screenshot", tags: ["tickets"] },
  { id: "p50", img: 1061, taken: "2025-01-04T17:15:00", place: "Tom McCall Waterfront", city: "Portland", people: ["Arjun"], kind: "photo", tags: ["winter"] },

  { id: "p51", img: 1062, taken: "2024-11-16T14:00:00", place: "Lincoln Park", city: "Chicago", people: ["Dad"], kind: "photo", album: "Midwest", tags: ["fall"] },
  { id: "p52", img: 1063, taken: "2024-11-15T11:25:00", place: "The Art Institute", city: "Chicago", people: ["Maya"], kind: "photo", album: "Midwest", tags: ["museum"] },
  { id: "p53", img: 1064, taken: "2024-11-14T19:50:00", place: "Home", city: "Chicago", people: [], kind: "document", tags: ["boarding pass"] },
  { id: "p54", img: 1065, taken: "2024-11-10T08:40:00", place: "O'Hare", city: "Chicago", people: ["Arjun"], kind: "photo", tags: ["airport"] },

  { id: "p55", img: 1066, taken: "2024-07-22T16:10:00", place: "Baker Beach", city: "San Francisco", people: ["Priya", "Maya"], kind: "photo", album: "California", tags: ["beach", "summer"] },
  { id: "p56", img: 1067, taken: "2024-07-21T12:00:00", place: "Mission District", city: "San Francisco", people: ["Arjun"], kind: "photo", album: "California", tags: ["mural"] },
  { id: "p57", img: 1068, taken: "2024-07-20T18:30:00", place: "Twin Peaks", city: "San Francisco", people: [], kind: "photo", album: "California", tags: ["view"] },
  { id: "p58", img: 1069, taken: "2024-07-19T10:45:00", place: "Blue Bottle", city: "San Francisco", people: ["Maya"], kind: "photo", album: "California", tags: ["cafe", "coffee"] },

  { id: "p59", img: 1070, taken: "2024-03-09T15:20:00", place: "Ueno Park", city: "Tokyo", people: ["Maya", "Arjun"], kind: "photo", album: "Japan", tags: ["sakura"] },
  { id: "p60", img: 1071, taken: "2024-03-08T11:00:00", place: "Shimokitazawa", city: "Tokyo", people: ["Priya"], kind: "photo", album: "Japan", tags: ["streets"] },
  { id: "p61", img: 1072, taken: "2024-03-07T19:10:00", place: "Home", city: "Tokyo", people: [], kind: "screenshot", tags: ["transit"] },
  { id: "p62", img: 1073, taken: "2024-03-06T13:35:00", place: "Shinjuku Gyoen", city: "Tokyo", people: ["Dad"], kind: "photo", album: "Japan", tags: ["garden"] }
].map((p) => ({
  ...p,
  src: src(p.img, 800),
  thumb: src(p.img, 400),
  date: new Date(p.taken),
  note: ""
}));

const NOW = new Date("2026-10-04T15:47:00");

const EXTRA_SCENES = [
  { place: "Kyoto Bamboo Grove", city: "Kyoto", album: "Japan", tags: ["bamboo", "temple", "travel"] },
  { place: "Nusa Penida", city: "Bali", album: "Indonesia", tags: ["island", "ocean", "cliffs"] },
  { place: "Marrakech Medina", city: "Marrakech", album: "Morocco", tags: ["market", "colors", "architecture"] },
  { place: "Louvre Courtyard", city: "Paris", album: "Europe", tags: ["museum", "art", "architecture"] },
  { place: "Old Town Square", city: "Prague", album: "Europe", tags: ["square", "historic", "travel"] },
  { place: "Lake Bled", city: "Bled", album: "Europe", tags: ["lake", "mountains", "boat"] },
  { place: "Moraine Lake", city: "Alberta", album: "Canada", tags: ["lake", "hiking", "mountains"] },
  { place: "Banff Trail", city: "Banff", album: "Canada", tags: ["hiking", "forest", "wildlife"] },
  { place: "Brooklyn Bridge", city: "New York", album: "East Coast", tags: ["bridge", "skyline", "city"] },
  { place: "Central Park", city: "New York", album: "East Coast", tags: ["park", "autumn", "walk"] },
  { place: "French Quarter", city: "New Orleans", album: "South", tags: ["music", "street", "food"] },
  { place: "Savannah Riverfront", city: "Savannah", album: "South", tags: ["river", "historic", "sunset"] },
  { place: "Zion Canyon", city: "Utah", album: "Southwest", tags: ["canyon", "hiking", "desert"] },
  { place: "Joshua Tree", city: "California", album: "Southwest", tags: ["desert", "stars", "camping"] },
  { place: "Reykjavik Harbor", city: "Reykjavik", album: "Iceland", tags: ["harbor", "winter", "travel"] },
  { place: "Skogafoss", city: "Iceland", album: "Iceland", tags: ["waterfall", "hiking", "mist"] },
  { place: "Table Mountain", city: "Cape Town", album: "South Africa", tags: ["mountain", "hiking", "ocean"] },
  { place: "Serengeti Plains", city: "Tanzania", album: "Africa", tags: ["safari", "wildlife", "sunset"] },
  { place: "Sydney Harbour", city: "Sydney", album: "Australia", tags: ["harbor", "boats", "city"] },
  { place: "Great Ocean Road", city: "Victoria", album: "Australia", tags: ["coast", "road trip", "cliffs"] },
  { place: "Hoi An Lantern Street", city: "Hoi An", album: "Vietnam", tags: ["lanterns", "night", "street food"] },
  { place: "Ha Long Bay", city: "Vietnam", album: "Vietnam", tags: ["bay", "boat", "islands"] },
  { place: "Sigiriya Rock", city: "Sri Lanka", album: "Sri Lanka", tags: ["historic", "hiking", "view"] },
  { place: "Jaipur Pink City", city: "Jaipur", album: "India", tags: ["market", "palace", "colors"] },
  { place: "Fort Kochi", city: "Kochi", album: "India", tags: ["harbor", "street", "seafood"] },
  { place: "Alleppey Backwaters", city: "Kerala", album: "India", tags: ["canal", "boat", "palm trees"] },
  { place: "Lisbon Tram Line", city: "Lisbon", album: "Europe", tags: ["tram", "street", "city"] },
  { place: "Amalfi Coast", city: "Amalfi", album: "Italy", tags: ["coast", "village", "ocean"] },
  { place: "Swiss Alpine Meadow", city: "Bern", album: "Switzerland", tags: ["meadow", "mountains", "flowers"] },
  { place: "Istanbul Bazaar", city: "Istanbul", album: "Turkey", tags: ["bazaar", "spices", "architecture"] },
  { place: "Patagonia Ridge", city: "El Calafate", album: "Argentina", tags: ["mountains", "trail", "glacier"] },
  { place: "Cape Town Waterfront", city: "Cape Town", album: "South Africa", tags: ["harbor", "city", "sunset"] },
  { place: "Jeju Coast", city: "Jeju", album: "Korea", tags: ["beach", "cliffs", "travel"] },
  { place: "Kyiv Old Town", city: "Kyiv", album: "Ukraine", tags: ["historic", "architecture", "walk"] },
  { place: "Bavarian Village", city: "Munich", album: "Germany", tags: ["village", "church", "winter"] },
  { place: "Santorini Blue Dome", city: "Santorini", album: "Greece", tags: ["island", "ocean", "architecture"] },
  { place: "Machu Picchu Trail", city: "Cusco", album: "Peru", tags: ["ruins", "hiking", "mountains"] },
  { place: "Queenstown Lakefront", city: "Queenstown", album: "New Zealand", tags: ["lake", "adventure", "mountains"] },
  { place: "Sicilian Terrace", city: "Sicily", album: "Italy", tags: ["terrace", "sunset", "village"] },
  { place: "Dubai Marina", city: "Dubai", album: "UAE", tags: ["marina", "city", "night"] },
  { place: "Seoul Night Market", city: "Seoul", album: "Korea", tags: ["night", "market", "food"] },
  { place: "Aegean Shore", city: "Mykonos", album: "Greece", tags: ["shore", "summer", "boats"] },
  { place: "Costa Rica Rainforest", city: "Arenal", album: "Costa Rica", tags: ["forest", "waterfall", "wildlife"] }
];

const EXTRA_PEOPLE = [
  ["Maya", "Arjun"], ["Priya"], ["Dad", "Maya"], [], ["Luna", "Maya"], ["Arjun", "Priya"]
];

const EXTRA_PHOTOS = Array.from({ length: 400 }, (_, index) => {
  const scene = EXTRA_SCENES[index % EXTRA_SCENES.length];
  const captureDate = new Date(NOW.getTime() - (index + 1) * 5 * 24 * 60 * 60 * 1000);
  const id = `p${String(index + 63).padStart(3, "0")}`;
  const kind = index % 31 === 0 ? "screenshot" : index % 47 === 0 ? "document" : "photo";
  const people = EXTRA_PEOPLE[index % EXTRA_PEOPLE.length];
  const seed = `photos-mvp-${id}-${index}`;
  return {
    id,
    img: 2000 + index,
    taken: captureDate.toISOString(),
    date: captureDate,
    place: scene.place,
    city: scene.city,
    people,
    kind,
    album: scene.album,
    tags: [...scene.tags, ...(index % 2 === 0 ? ["travel", "memory"] : ["moments", "story"])],
    pet: people.includes("Luna"),
    src: `https://picsum.photos/seed/${seed}/800/800`,
    thumb: `https://picsum.photos/seed/${seed}/400/400`,
    note: ""
  };
});

LIBRARY.push(...EXTRA_PHOTOS);

const PEOPLE_META = {
  Maya: { img: 64 },
  Arjun: { img: 91 },
  Priya: { img: 338 },
  Dad: { img: 177 },
  Luna: { img: 1025 }
};

const MEMORIES = [
  { id: "m1", label: "On this day", photoId: "p36" },
  { id: "m2", label: "Goa", photoId: "p17" },
  { id: "m3", label: "Diwali", photoId: "p36" },
  { id: "m4", label: "Tokyo", photoId: "p30" },
  { id: "m5", label: "Luna", photoId: "p05" },
  { id: "m6", label: "Chicago", photoId: "p24" }
];
