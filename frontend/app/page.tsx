"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { communities, metrics, playRequests, players } from "@/lib/mock-data";
import { SectionTitle } from "@/components/section-title";

const featurePillars = [
  {
    title: "Player Discovery",
    copy: "Search by game type, locality, availability, and skill level instead of relying on scattered chat groups."
  },
  {
    title: "Quick Match Requests",
    copy: "Send a lightweight request, get an accept or decline response, and confirm the session without heavy coordination."
  },
  {
    title: "Community Circles",
    copy: "Support clubhouses, society groups, and recurring neighborhood play sessions from the same product."
  }
];

const productSections = [
  "Women-first registration and login",
  "Game-based profile creation",
  "Availability and location preferences",
  "Nearby partner discovery filters",
  "Play requests and match history",
  "Communities and organizer workflows",
  "Admin reporting and category control"
];

export default function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero-grid">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-copy glass-card"
        >
          <span className="eyebrow">Neighborhood Play Network</span>
          <h1>Find local partners for every indoor and outdoor game.</h1>
          <p>
            PlayCircle turns nearby homes, society clubhouses, and local grounds
            into an active recreation network for chess, carrom, cards,
            badminton, table tennis, and more.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="button button-primary">
              Start your profile
            </Link>
            <Link href="/discover" className="button button-secondary">
              Explore players
            </Link>
            <Link href="/community" className="button button-secondary">
              View communities
            </Link>
          </div>
          <div className="chip-row">
            <span className="chip">Indoor + outdoor games</span>
            <span className="chip">Local community focused</span>
            <span className="chip">Fast matchmaking flow</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="hero-visual glass-card"
        >
          <div className="radar">
            <div className="radar-ring ring-1" />
            <div className="radar-ring ring-2" />
            <div className="radar-ring ring-3" />
            <div className="radar-dot dot-1">Chess</div>
            <div className="radar-dot dot-2">Badminton</div>
            <div className="radar-dot dot-3">Carrom</div>
            <div className="radar-core">
              <span>Smart local discovery</span>
              <strong>Under 3s search goal</strong>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="metrics-grid">
        {metrics.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="metric-card glass-card"
          >
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </motion.article>
        ))}
      </section>

      <section className="content-grid">
        <div className="glass-card">
          <SectionTitle
            eyebrow="Why This Works"
            title="Built around the exact product goals in your documentation"
            description="Every section supports easier partner discovery, stronger community bonding, and lower coordination effort."
          />
          <div className="card-stack">
            {featurePillars.map((item) => (
              <article key={item.title} className="mini-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <SectionTitle
            eyebrow="Platform Coverage"
            title="A fuller feature map, not just a landing page"
            description="The product is structured into distinct experiences so each role can actually use it."
          />
          <div className="timeline">
            {productSections.map((step) => (
              <div key={step} className="timeline-item">
                <span />
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="glass-card">
          <SectionTitle
            eyebrow="Featured Players"
            title="Profiles surface games, level, and availability clearly"
            description="This helps players decide quickly whether a nearby match is a good fit."
          />
          <div className="card-stack">
            {players.map((player) => (
              <article key={player.id} className="mini-card">
                <div className="mini-card-header">
                  <h3>{player.name}</h3>
                  <span>{player.skill}</span>
                </div>
                <p>{player.location}</p>
                <div className="chip-row">
                  {player.games.map((game) => (
                    <span key={game} className="chip">
                      {game}
                    </span>
                  ))}
                </div>
                <small>{player.availability}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <SectionTitle
            eyebrow="Open Requests"
            title="Request-response flow stays lightweight for phase 1"
            description="Accept, decline, and history tracking are all available without building a full chat product."
          />
          <div className="table-list">
            {playRequests.map((request) => (
              <div key={request.id} className="row-card">
                <div>
                  <strong>{request.game}</strong>
                  <p>
                    {request.requester} | {request.slot}
                  </p>
                </div>
                <div>
                  <p>{request.venue}</p>
                  <span className={`status status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="glass-card">
          <SectionTitle
            eyebrow="Community Layer"
            title="Societies and local groups can scale the network"
            description="Recurring sessions and organizer ownership help the platform grow from one-to-one matching into a neighborhood habit."
          />
          <div className="card-stack">
            {communities.map((community) => (
              <article key={community.id} className="mini-card">
                <h3>{community.name}</h3>
                <p>{community.focus}</p>
                <small>{community.area}</small>
                <div className="split-line">
                  <span>{community.members} members</span>
                  <span>{community.nextSession}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <SectionTitle
            eyebrow="Future Ready"
            title="Built with room for AI recommendations and mobile expansion"
            description="The structure now supports future additions like ratings, chat, AI partner matching, and leaderboards."
          />
          <div className="card-stack">
            {[
              "AI-based partner recommendations",
              "In-app messaging and notifications",
              "Tournament and leaderboard modules",
              "Ratings, reviews, and trust signals"
            ].map((item) => (
              <article key={item} className="mini-card">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
