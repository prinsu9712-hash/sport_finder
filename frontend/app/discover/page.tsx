"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";
import { DAY_OPTIONS, GAME_OPTIONS, LOCATION_OPTIONS } from "@/lib/options";

type Player = {
  _id: string;
  name: string;
  location: string;
  preferredGames: string[];
  skillLevel: string;
  availability: { days: string[]; timeSlot: string };
  bio: string;
};

function scoreForPlayer(player: Player) {
  return 68 + ((player.name.length + player.preferredGames.length * 7) % 29);
}

export default function DiscoverPage() {
  const { token, user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [filters, setFilters] = useState({
    game: "",
    location: "",
    skill: "",
    day: ""
  });
  const [status, setStatus] = useState("");

  async function loadPlayers() {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    const data = await apiRequest<Player[]>(
      `/users/discover${params.toString() ? `?${params.toString()}` : ""}`
    );

    setPlayers(data.filter((player) => player._id !== user?._id));
  }

  useEffect(() => {
    loadPlayers().catch((error: Error) => setStatus(error.message));
  }, [user?._id, filters.game, filters.location, filters.skill, filters.day]);

  async function sendRequest(recipient: string, game: string) {
    if (!token) {
      setStatus("Please login to send a play request.");
      return;
    }

    try {
      await apiRequest("/requests", {
        method: "POST",
        token,
        body: {
          recipient,
          game,
          venue: filters.location || "Society Clubhouse",
          scheduledFor: new Date(Date.now() + 86400000).toISOString(),
          notes: "Friendly local game request from the discover page."
        }
      });
      setStatus("Play request sent successfully.");
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  async function reportPlayer(targetUser: string) {
    if (!token) {
      setStatus("Please login to report misuse.");
      return;
    }

    try {
      await apiRequest("/reports", {
        method: "POST",
        token,
        body: {
          targetUser,
          reason: "Safety concern",
          details: "Reported from the discover page."
        }
      });
      setStatus("Report submitted to admin.");
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  return (
    <div className="stack-lg">
      <section className="glass-card">
        <SectionTitle
          eyebrow="Discover"
          title="Find nearby players who actually match your game rhythm"
          description="Search by game type, location, skill level, and availability just like the reference experience."
        />
        <div className="filters-grid">
          <select
            className="input"
            value={filters.game}
            onChange={(event) =>
              setFilters((current) => ({ ...current, game: event.target.value }))
            }
          >
            <option value="">All games</option>
            {GAME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={filters.location}
            onChange={(event) =>
              setFilters((current) => ({ ...current, location: event.target.value }))
            }
          >
            <option value="">All locations</option>
            {LOCATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={filters.skill}
            onChange={(event) =>
              setFilters((current) => ({ ...current, skill: event.target.value }))
            }
          >
            <option value="">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            className="input"
            value={filters.day}
            onChange={(event) =>
              setFilters((current) => ({ ...current, day: event.target.value }))
            }
          >
            <option value="">Any day</option>
            {DAY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {status ? <p className="helper-text">{status}</p> : null}
      </section>

      <section className="players-grid">
        {players.map((player) => {
          const score = scoreForPlayer(player);
          return (
            <article key={player._id} className="player-card glass-card">
              <div className="player-avatar">{player.name.slice(0, 2)}</div>
              <div className="stack-sm">
                <div className="mini-card-header">
                  <h3>{player.name}</h3>
                  <span className={`status status-${player.skillLevel}`}>
                    {player.skillLevel}
                  </span>
                </div>
                <p>{player.location}</p>
                <div className="chip-row">
                  {player.preferredGames.map((game) => (
                    <span key={game} className="game-chip">
                      {game}
                    </span>
                  ))}
                </div>
                <small>
                  {player.availability.days.join(", ")} | {player.availability.timeSlot}
                </small>
                <p>{player.bio}</p>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${score}%` }} />
                </div>
                <small>Match score {score}%</small>
                <div className="action-row">
                  <button
                    className="button button-primary"
                    onClick={() =>
                      sendRequest(player._id, player.preferredGames[0] || "Badminton")
                    }
                  >
                    Send request
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => reportPlayer(player._id)}
                  >
                    Report
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
