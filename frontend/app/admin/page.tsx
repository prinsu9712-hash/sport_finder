"use client";

import { FormEvent, useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";

type Overview = {
  users: number;
  pendingRequests: number;
  totalRequests: number;
  communities: number;
  games: number;
  successfulMatchRate: number;
  openReports: number;
};

type ReportItem = {
  _id: string;
  reason: string;
  details: string;
  status: string;
  reporter?: { name: string };
  targetUser?: { name: string };
};

export default function AdminPage() {
  const { token, user } = useAuth();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [message, setMessage] = useState("");
  const [gameName, setGameName] = useState("");
  const [gameType, setGameType] = useState("indoor");

  async function loadAdminData() {
    if (!token) {
      return;
    }

    const [overviewData, reportsData] = await Promise.all([
      apiRequest<Overview>("/admin/overview", { token }),
      apiRequest<ReportItem[]>("/admin/reports", { token })
    ]);
    setOverview(overviewData);
    setReports(reportsData);
  }

  useEffect(() => {
    loadAdminData().catch((error: Error) => setMessage(error.message));
  }, [token]);

  async function addGame(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    try {
      await apiRequest("/games", {
        method: "POST",
        token,
        body: { name: gameName, type: gameType }
      });
      setGameName("");
      setMessage("Game category added.");
      await loadAdminData();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  if (user?.role !== "admin") {
    return (
      <section className="glass-card">
        <p>Admin access only.</p>
      </section>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="section-label">Admin Panel</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", margin: "0.5rem 0 1rem" }}>
          Dashboard
        </h3>
        <div className="card-stack">
          <span className="sidebar-link sidebar-link-active">Dashboard</span>
          <span className="sidebar-link">Users</span>
          <span className="sidebar-link">Games</span>
          <span className="sidebar-link">Communities</span>
          <span className="sidebar-link">Reports</span>
        </div>
      </aside>
      <div className="stack-lg">
        <section className="glass-card">
          <SectionTitle
            eyebrow="Admin Dashboard"
            title="Track usage, categories, and open reports"
            description="This dashboard is now backed by live admin API data."
          />
          {message ? <p className="helper-text">{message}</p> : null}
          {overview ? (
            <div className="metrics-grid">
              {[
                ["Users", overview.users],
                ["Pending Requests", overview.pendingRequests],
                ["Total Requests", overview.totalRequests],
                ["Communities", overview.communities],
                ["Games", overview.games],
                ["Match Rate", `${overview.successfulMatchRate}%`],
                ["Open Reports", overview.openReports]
              ].map(([label, value]) => (
                <article key={String(label)} className="metric-card nested-card">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section className="content-grid">
          <div className="glass-card">
          <h3>Add game category</h3>
          <form className="form-grid" onSubmit={addGame}>
            <input
              className="input"
              placeholder="Game name"
              value={gameName}
              onChange={(event) => setGameName(event.target.value)}
              required
            />
            <select
              className="input"
              value={gameType}
              onChange={(event) => setGameType(event.target.value)}
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
            <button className="button button-primary" type="submit">
              Save category
            </button>
          </form>
          </div>
          <div className="glass-card">
            <h3>Reports</h3>
            <div className="card-stack">
              {reports.map((report) => (
                <article key={report._id} className="mini-card">
                  <strong>{report.reason}</strong>
                  <p>{report.details || "No extra details"}</p>
                  <small>
                    Reporter: {report.reporter?.name || "Unknown"} | Target:{" "}
                    {report.targetUser?.name || "General"}
                  </small>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
