"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

const sports = [
  {
    icon: "♟",
    name: "Chess",
    count: "312 active players",
    badge: "Live"
  },
  {
    icon: "🏸",
    name: "Badminton",
    count: "489 active players",
    badge: "Hot"
  },
  {
    icon: "🎯",
    name: "Carrom",
    count: "218 active players",
    badge: "New"
  }
];

const stats = [
  ["2.4K+", "Players Onboarded"],
  ["318", "Active Play Requests"],
  ["79%", "Match Success Rate"],
  ["63%", "Repeat Sessions"]
] as const;

const features = [
  {
    icon: "🔍",
    title: "Player Discovery",
    copy: "Search by game type, locality, availability, and skill level — no more scattered chat groups or word-of-mouth searching."
  },
  {
    icon: "⚡",
    title: "Quick Match Requests",
    copy: "Send a lightweight request, get an accept or decline response, and confirm the session without heavy coordination overhead."
  },
  {
    icon: "🏘️",
    title: "Community Circles",
    copy: "Support clubhouses, society groups, and recurring neighborhood play sessions from a single organizer-owned product."
  }
];

const featuredPlayers = [
  {
    initials: "AM",
    name: "Aanya Mehta",
    level: "Intermediate",
    levelClass: "intermediate",
    location: "Satellite, Ahmedabad",
    games: ["🏸 Badminton", "🏓 Table Tennis"],
    time: "Mon, Wed, Fri · 6:30 PM"
  },
  {
    initials: "NR",
    name: "Nisha Rao",
    level: "Advanced",
    levelClass: "advanced",
    location: "Whitefield, Bengaluru",
    games: ["♟ Chess", "🃏 Cards"],
    time: "Sat, Sun · 4:00 PM"
  },
  {
    initials: "KS",
    name: "Kavya Sethi",
    level: "Beginner",
    levelClass: "beginner",
    location: "Dwarka, Delhi",
    games: ["🎯 Carrom", "🏸 Badminton"],
    time: "Tue, Thu · 7:00 PM"
  }
];

const requests = [
  {
    game: "🏸 Badminton",
    status: "Pending",
    player: "Aanya Mehta",
    time: "Friday · 6:30 PM",
    venue: "Skyline Society Clubhouse"
  },
  {
    game: "♟ Chess",
    status: "Accepted",
    player: "Nisha Rao",
    time: "Sunday · 5:00 PM",
    venue: "Community Reading Lounge"
  },
  {
    game: "🎯 Carrom",
    status: "Declined",
    player: "Kavya Sethi",
    time: "Tuesday · 7:30 PM",
    venue: "Block C Indoor Hall"
  }
];

const communities = [
  {
    icon: "🏸",
    name: "Shuttle Sisters",
    focus: "Badminton for working women",
    location: "Ahmedabad West",
    members: "64 members",
    nextSession: "Wed · 7:00 PM"
  },
  {
    icon: "♟",
    name: "Weekend Mind Games",
    focus: "Chess, cards & carrom",
    location: "Bengaluru East",
    members: "112 members",
    nextSession: "Sat · 5:30 PM"
  },
  {
    icon: "🏟️",
    name: "Society Sports Circle",
    focus: "Mixed indoor + outdoor sessions",
    location: "Delhi South West",
    members: "89 members",
    nextSession: "Sun · 8:00 AM"
  }
];

const futureItems = [
  "🤖 AI Partner Recommendations",
  "💬 In-App Messaging",
  "🏆 Tournaments & Leaderboards",
  "⭐ Ratings & Trust Signals",
  "📱 Mobile App Expansion",
  "🔔 Smart Notifications"
];

const fadeIn = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: { duration: 0.5 }
};

function SectionIntro({
  tag,
  title,
  copy
}: {
  tag: string;
  title: ReactNode;
  copy: string;
}) {
  return (
    <div className="landing-section-intro">
      <span className="landing-section-tag">{tag}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-ghost">PLAY</div>
        <div className="landing-hero-grid">
          <div className="landing-hero-copy">
            <span className="landing-tag">Neighborhood Play Network</span>
            <h1 id="landing-title">
              Find Local
              <br />
              <em>Game</em>
              <br />
              Partners.
            </h1>
            <p>
              PlayCircle turns nearby homes, society clubhouses, and local
              grounds into an active recreation network — chess, carrom,
              badminton, table tennis, and more.
            </p>
            <div className="landing-actions">
              <Link href="/register" className="button button-primary">
                Start Your Profile ↗
              </Link>
              <Link href="/discover" className="button button-secondary">
                Explore Players
              </Link>
            </div>
            <div className="landing-pills" aria-label="Popular games">
              {["♟ Chess", "🏸 Badminton", "🎯 Carrom", "🏓 Table Tennis", "🃏 Cards"].map(
                (item) => (
                  <span className="landing-pill" key={item}>
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="landing-sports-stack"
          >
            {sports.map((sport) => (
              <article className="landing-sport-card" key={sport.name}>
                <div className="landing-sport-icon">{sport.icon}</div>
                <div>
                  <h2>{sport.name}</h2>
                  <p>{sport.count}</p>
                </div>
                <span>{sport.badge}</span>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="landing-stats" aria-label="PlayCircle statistics">
        {stats.map(([value, label]) => (
          <article className="landing-stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <motion.section {...fadeIn} className="landing-section">
        <SectionIntro
          tag="Why This Works"
          title={
            <>
              Built Around
              <br />
              Real Goals.
            </>
          }
          copy="Every section supports easier partner discovery, stronger community bonding, and lower coordination effort."
        />
        <div className="landing-features-grid">
          {features.map((feature, index) => (
            <article className="landing-feature-card" key={feature.title}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <div>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeIn} className="landing-section" id="discover">
        <SectionIntro
          tag="Featured Players"
          title={
            <>
              Profiles That
              <br />
              Match Fast.
            </>
          }
          copy="Profiles surface games, skill level, and availability clearly — so you can decide whether a nearby match is a good fit in seconds."
        />
        <div className="landing-card-grid">
          {featuredPlayers.map((player) => (
            <article className="landing-player-card" key={player.name}>
              <div className={`landing-avatar avatar-${player.levelClass}`}>
                {player.initials}
              </div>
              <h3>{player.name}</h3>
              <span className={`landing-level level-${player.levelClass}`}>
                {player.level}
              </span>
              <p>📍 {player.location}</p>
              <div className="landing-pills">
                {player.games.map((game) => (
                  <span className="landing-game-tag" key={game}>
                    {game}
                  </span>
                ))}
              </div>
              <small>{player.time}</small>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeIn} className="landing-section" id="requests">
        <SectionIntro
          tag="Open Requests"
          title={
            <>
              Lightweight
              <br />
              Request Flow.
            </>
          }
          copy="Accept, decline, and track history — all without building a full chat product. Phase 1 keeps coordination simple."
        />
        <div className="landing-card-grid">
          {requests.map((request) => (
            <article className="landing-request-card" key={request.game}>
              <div className="landing-request-top">
                <h3>{request.game}</h3>
                <span className={`request-${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>
              <strong>{request.player}</strong>
              <p>{request.time}</p>
              <small>📍 {request.venue}</small>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeIn} className="landing-section" id="community">
        <SectionIntro
          tag="Community Layer"
          title={
            <>
              Societies That
              <br />
              Scale the Network.
            </>
          }
          copy="Recurring sessions and organizer ownership help the platform grow from one-to-one matching into a full neighborhood habit."
        />
        <div className="landing-card-grid">
          {communities.map((community) => (
            <article className="landing-community-card" key={community.name}>
              <div className="landing-community-icon">{community.icon}</div>
              <h3>{community.name}</h3>
              <p>{community.focus}</p>
              <small>📍 {community.location}</small>
              <div className="landing-community-meta">
                <span>👥 {community.members}</span>
                <span>{community.nextSession}</span>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeIn} className="landing-cta" id="future">
        <span className="landing-section-tag">Future Ready</span>
        <h2>
          Built for
          <br />
          What&apos;s Coming Next.
        </h2>
        <p>
          The structure now supports future additions like AI-powered
          recommendations, ratings, chat, and full leaderboards.
        </p>
        <div className="landing-future-list">
          {futureItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <Link href="/register" className="button button-primary">
          Get Early Access →
        </Link>
      </motion.section>
    </div>
  );
}
