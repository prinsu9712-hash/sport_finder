"use client";

import { FormEvent, useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";
import { GAME_OPTIONS } from "@/lib/options";

type Community = {
  _id: string;
  name: string;
  area: string;
  description: string;
  recurringSlot: string;
  supportedGames: string[];
  isVerified: boolean;
};

export default function CommunitiesPage() {
  const { token, user, refreshUser } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    area: "",
    description: "",
    recurringSlot: "",
    supportedGames: [] as string[]
  });

  async function loadCommunities() {
    const data = await apiRequest<Community[]>("/communities");
    setCommunities(data);
  }

  useEffect(() => {
    loadCommunities().catch((error: Error) => setMessage(error.message));
  }, []);

  async function joinCommunity(id: string) {
    if (!token) {
      setMessage("Please login to join communities.");
      return;
    }

    try {
      await apiRequest(`/communities/${id}/join`, {
        method: "POST",
        token
      });
      await refreshUser();
      setMessage("Community joined.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      await apiRequest("/communities", {
        method: "POST",
        token,
        body: form
      });
      setForm({
        name: "",
        area: "",
        description: "",
        recurringSlot: "",
        supportedGames: []
      });
      setMessage("Community created.");
      await loadCommunities();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <div className="stack-lg">
      <section className="glass-card">
        <SectionTitle
          eyebrow="Community"
          title="Build local circles around homes, clubhouses, and grounds"
          description="This area mirrors the reference concept while staying connected to real organizer and join flows."
        />
        <div className="metrics-grid">
          <article className="metric-card">
            <strong>{communities.length}</strong>
            <span>Active communities</span>
          </article>
          <article className="metric-card">
            <strong>{communities.filter((item) => item.isVerified).length}</strong>
            <span>Verified groups</span>
          </article>
          <article className="metric-card">
            <strong>{user?.communities?.length || 0}</strong>
            <span>Your joined groups</span>
          </article>
          <article className="metric-card">
            <strong>{user?.role || "guest"}</strong>
            <span>Current role</span>
          </article>
        </div>
        {message ? <p className="helper-text">{message}</p> : null}
      </section>

      {(user?.role === "organizer" || user?.role === "admin") && token ? (
        <section className="glass-card">
          <h3>Create Community</h3>
          <form className="form-grid" onSubmit={handleCreate}>
            <div className="split-two">
              <input
                className="input"
                placeholder="Community name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Area"
                value={form.area}
                onChange={(event) => setForm({ ...form, area: event.target.value })}
                required
              />
            </div>
            <input
              className="input"
              placeholder="Recurring slot"
              value={form.recurringSlot}
              onChange={(event) =>
                setForm({ ...form, recurringSlot: event.target.value })
              }
            />
            <textarea
              className="input textarea"
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              required
            />
            <div className="chip-row">
              {GAME_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`chip-select ${form.supportedGames.includes(option) ? "chip-select-active" : ""}`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      supportedGames: current.supportedGames.includes(option)
                        ? current.supportedGames.filter((item) => item !== option)
                        : [...current.supportedGames, option]
                    }))
                  }
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="button button-primary" type="submit">
              Create community
            </button>
          </form>
        </section>
      ) : null}

      <section className="players-grid">
        {communities.map((community) => (
          <article key={community._id} className="community-card glass-card">
            <div className="mini-card-header">
              <h3>{community.name}</h3>
              <span className={`status ${community.isVerified ? "status-accepted" : "status-pending"}`}>
                {community.isVerified ? "Verified" : "Pending"}
              </span>
            </div>
            <p>{community.description}</p>
            <div className="split-line">
              <span>{community.area}</span>
              <span>{community.recurringSlot || "To be announced"}</span>
            </div>
            <div className="chip-row">
              {community.supportedGames.map((game) => (
                <span key={game} className="game-chip">
                  {game}
                </span>
              ))}
            </div>
            <button
              className="button button-primary"
              onClick={() => joinCommunity(community._id)}
            >
              Join community
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
