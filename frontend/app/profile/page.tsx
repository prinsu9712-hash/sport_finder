"use client";

import { FormEvent, useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";

type RecommendedUser = {
  _id: string;
  name: string;
  location: string;
  preferredGames: string[];
};

export default function ProfilePage() {
  const { token, user, refreshUser } = useAuth();
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [recommended, setRecommended] = useState<RecommendedUser[]>([]);

  useEffect(() => {
    setBio(user?.bio || "");
    setLocation(user?.location || "");
    setTimeSlot(user?.availability?.timeSlot || "");
  }, [user]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    apiRequest<RecommendedUser[]>("/recommendations/me", { token })
      .then(setRecommended)
      .catch((error: Error) => setMessage(error.message));
  }, [token, user?._id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !user) {
      setMessage("Please login first.");
      return;
    }

    try {
      await apiRequest("/users/me", {
        method: "PATCH",
        token,
        body: {
          bio,
          location,
          availability: {
            days: user.availability.days,
            timeSlot
          }
        }
      });
      await refreshUser();
      setMessage("Profile updated.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  if (!user) {
    return (
      <section className="glass-card">
        <p>Please login to manage your profile.</p>
      </section>
    );
  }

  return (
    <div className="content-grid">
      <section className="glass-card">
        <SectionTitle
          eyebrow="My Profile"
          title="Manage your player card"
          description="Update the essentials other nearby players use to discover you."
        />
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="split-two">
            <input className="input" value={user.name} disabled />
            <input className="input" value={user.email} disabled />
          </div>
          <div className="split-two">
            <input
              className="input"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <input
              className="input"
              value={timeSlot}
              onChange={(event) => setTimeSlot(event.target.value)}
            />
          </div>
          <textarea
            className="input textarea"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
          <p className="helper-text">
            Games: {user.preferredGames.join(", ")} | Days:{" "}
            {user.availability.days.join(", ")}
          </p>
          {message ? <p className="helper-text">{message}</p> : null}
          <button className="button button-primary" type="submit">
            Save profile
          </button>
        </form>
      </section>

      <section className="glass-card">
        <SectionTitle
          eyebrow="AI Match"
          title="Recommended partners"
          description="These recommendations use shared games, locality similarity, and skill level."
        />
        <div className="card-stack">
          {recommended.map((player) => (
            <article key={player._id} className="mini-card">
              <strong>{player.name}</strong>
              <p>{player.location}</p>
              <div className="chip-row">
                {player.preferredGames.map((game) => (
                  <span key={game} className="game-chip">
                    {game}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
