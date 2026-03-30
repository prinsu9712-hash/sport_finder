const gameCategories = [
  { name: "Badminton", type: "outdoor" },
  { name: "Chess", type: "indoor" },
  { name: "Carrom", type: "indoor" },
  { name: "Cards", type: "indoor" },
  { name: "Table Tennis", type: "indoor" },
  { name: "Cricket", type: "outdoor" },
  { name: "Football", type: "outdoor" },
  { name: "Ludo", type: "indoor" }
];

const communities = [
  {
    name: "Shuttle Sisters",
    area: "Ahmedabad West",
    description: "Friendly badminton sessions for women after work.",
    supportedGames: ["Badminton"],
    recurringSlot: "Wednesday 7:00 PM",
    isVerified: true
  },
  {
    name: "Weekend Mind Games Club",
    area: "Bengaluru East",
    description: "Chess, cards, and carrom circles for neighborhood players.",
    supportedGames: ["Chess", "Cards", "Carrom"],
    recurringSlot: "Saturday 5:30 PM",
    isVerified: true
  }
];

const users = [
  {
    name: "Aanya Mehta",
    email: "aanya@example.com",
    password: "password123",
    gender: "woman",
    role: "user",
    location: "Satellite, Ahmedabad",
    preferredGames: ["Badminton", "Table Tennis"],
    skillLevel: "intermediate",
    availability: { days: ["Mon", "Wed", "Fri"], timeSlot: "6:30 PM" },
    preferredLocations: ["Society Clubhouse", "Local Ground"],
    bio: "Enjoys evening rallies and casual fitness sessions."
  },
  {
    name: "Nisha Rao",
    email: "nisha@example.com",
    password: "password123",
    gender: "woman",
    role: "organizer",
    location: "Whitefield, Bengaluru",
    preferredGames: ["Chess", "Cards"],
    skillLevel: "advanced",
    availability: { days: ["Sat", "Sun"], timeSlot: "4:00 PM" },
    preferredLocations: ["Home", "Community Lounge"],
    bio: "Strategy-focused and interested in recurring weekend meetups."
  },
  {
    name: "Kavya Sethi",
    email: "kavya@example.com",
    password: "password123",
    gender: "woman",
    role: "admin",
    location: "Dwarka, Delhi",
    preferredGames: ["Carrom", "Badminton"],
    skillLevel: "beginner",
    availability: { days: ["Tue", "Thu"], timeSlot: "7:00 PM" },
    preferredLocations: ["Society Clubhouse", "Home"],
    bio: "Looking for friendly nearby players."
  }
];

module.exports = {
  gameCategories,
  communities,
  users
};
