export type Player = {
  id: string;
  name: string;
  location: string;
  games: string[];
  skill: "Beginner" | "Intermediate" | "Advanced";
  availability: string;
  vibe: string;
};

export type PlayRequest = {
  id: string;
  requester: string;
  game: string;
  slot: string;
  venue: string;
  status: "Pending" | "Accepted" | "Declined";
};

export type Community = {
  id: string;
  name: string;
  area: string;
  focus: string;
  members: number;
  nextSession: string;
};

export const metrics = [
  { label: "Players Onboarded", value: "2.4K+" },
  { label: "Active Play Requests", value: "318" },
  { label: "Match Success Rate", value: "79%" },
  { label: "Repeat Sessions", value: "63%" }
];

export const players: Player[] = [
  {
    id: "u1",
    name: "Aanya Mehta",
    location: "Satellite, Ahmedabad",
    games: ["Badminton", "Table Tennis"],
    skill: "Intermediate",
    availability: "Mon, Wed, Fri · 6:30 PM",
    vibe: "Enjoys fast rallies and casual evening sessions."
  },
  {
    id: "u2",
    name: "Nisha Rao",
    location: "Whitefield, Bengaluru",
    games: ["Chess", "Cards"],
    skill: "Advanced",
    availability: "Sat, Sun · 4:00 PM",
    vibe: "Strategy-first player who loves community meetups."
  },
  {
    id: "u3",
    name: "Kavya Sethi",
    location: "Dwarka, Delhi",
    games: ["Carrom", "Badminton"],
    skill: "Beginner",
    availability: "Tue, Thu · 7:00 PM",
    vibe: "Looking for friendly partners close to home."
  }
];

export const playRequests: PlayRequest[] = [
  {
    id: "r1",
    requester: "Aanya Mehta",
    game: "Badminton",
    slot: "Friday · 6:30 PM",
    venue: "Skyline Society Clubhouse",
    status: "Pending"
  },
  {
    id: "r2",
    requester: "Nisha Rao",
    game: "Chess",
    slot: "Sunday · 5:00 PM",
    venue: "Community Reading Lounge",
    status: "Accepted"
  },
  {
    id: "r3",
    requester: "Kavya Sethi",
    game: "Carrom",
    slot: "Tuesday · 7:30 PM",
    venue: "Block C Indoor Hall",
    status: "Declined"
  }
];

export const communities: Community[] = [
  {
    id: "c1",
    name: "Shuttle Sisters",
    area: "Ahmedabad West",
    focus: "Badminton for working women",
    members: 64,
    nextSession: "Wednesday · 7:00 PM"
  },
  {
    id: "c2",
    name: "Weekend Mind Games Club",
    area: "Bengaluru East",
    focus: "Chess, cards, carrom",
    members: 112,
    nextSession: "Saturday · 5:30 PM"
  },
  {
    id: "c3",
    name: "Society Sports Circle",
    area: "Delhi South West",
    focus: "Mixed indoor + outdoor sessions",
    members: 89,
    nextSession: "Sunday · 8:00 AM"
  }
];
