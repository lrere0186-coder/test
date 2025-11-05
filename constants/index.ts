import { Slot, SlotStatus, Profile, TimelineEvent } from '@/types';

export const TOTAL_SLOTS = 10000;
export const INITIAL_PRICE = 5000;
export const PRICE_INCREMENT = 50;
export const LAUNCH_DATE = new Date('2025-12-31T23:59:59');

// SEULEMENT 30 SLOTS DISPONIBLES pour les tests
export const AVAILABLE_SLOTS_COUNT = 30;

export const generateMockSlots = (): Slot[] => {
  const slots: Slot[] = [];
  let currentPrice = INITIAL_PRICE;
  
  for (let i = 1; i <= TOTAL_SLOTS; i++) {
    let status: SlotStatus;
    
    if (i <= 30) {
      status = SlotStatus.Available;     // Slots 1-30 : Disponibles
    } else if (i <= 100) {
      status = SlotStatus.Sold;          // Slots 31-100 : Vendus (exemples)
    } else {
      status = SlotStatus.Locked;        // Slots 101-10000 : Pas encore disponibles
    }
    
    slots.push({
      id: i,
      price: currentPrice,
      status: status,
    });
    
    if (i % 2 === 0) {
      currentPrice += PRICE_INCREMENT;
    }
  }
  
  return slots;
};

export const MOCK_PROFILE: Profile = {
  slotId: 1,
  fullName: "Eleonora Vance",
  birthDate: "1888-03-15",
  deathDate: "1972-07-20",
  quote: "The future is a canvas, and memory is the paint.",
  profileImage: "https://picsum.photos/seed/eleonora/400/400",
  biography: "Eleonora Vance was a pioneering cartographer and explorer, known for her expeditions into uncharted territories of the Amazon rainforest in the early 20th century. Born in a small coastal town, she developed a fascination with maps and the unknown from a young age. Her work not only filled in vast blank spaces on world maps but also documented numerous new species of flora and fauna. Vance was a staunch advocate for conservation, long before it became a global movement. Her journals, filled with detailed sketches and vivid descriptions, are considered masterpieces of exploration literature and continue to inspire adventurers and scientists alike. Her legacy is one of courage, curiosity, and a profound respect for the natural world.",
  gallery: [
    "https://picsum.photos/seed/gallery1/800/600",
    "https://picsum.photos/seed/gallery2/800/600",
    "https://picsum.photos/seed/gallery3/800/600",
    "https://picsum.photos/seed/gallery4/800/600",
    "https://picsum.photos/seed/gallery5/800/600",
    "https://picsum.photos/seed/gallery6/800/600",
  ],
  timeline: [
    { year: 1888, title: "Born in Cornwall, England", description: "Eleonora was born to a family of lighthouse keepers, sparking her lifelong love for the sea and distant lands." },
    { year: 1910, title: "First Expedition", description: "Embarked on her first major expedition to the Amazon, funded by a small inheritance and the Royal Geographical Society." },
    { year: 1925, title: "Published 'The Green Labyrinth'", description: "Her first book detailing her discoveries became an international bestseller." },
    { year: 1940, title: "War Efforts", description: "Served as a consultant for Allied forces, using her cartographical skills for strategic mapping." },
    { year: 1965, title: "Established the Vance Foundation", description: "Founded an organization dedicated to preserving wilderness areas around the world." },
    { year: 1972, title: "Passed Away", description: "Died peacefully at her home, leaving behind a legacy of exploration and conservation." },
  ],
};
