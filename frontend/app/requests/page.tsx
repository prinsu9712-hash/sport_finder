"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";

type RequestItem = {
  _id: string;
  game: string;
  venue: string;
  status: "pending" | "accepted" | "declined";
  scheduledFor: string;
  requester: { _id: string; name: string };
  recipient: { _id: string; name: string };
};

type Tab = "incoming" | "sent" | "history";

export default function RequestsPage() {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("incoming");

  async function loadRequests() {
    if (!token) return;
    const data = await apiRequest<RequestItem[]>("/requests", { token });
    setRequests(data);
  }

  useEffect(() => {
    loadRequests().catch((error: Error) => setMessage(error.message));
  }, [token]);

  async function respond(id: string, status: "accepted" | "declined") {
    if (!token) return;

    try {
      await apiRequest(`/requests/${id}/respond`, {
        method: "PATCH",
        token,
        body: { status }
      });
      setMessage(`Request ${status}.`);
      await loadRequests();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  const filteredRequests = useMemo(() => {
    if (!user) return [];

    if (activeTab === "incoming") {
      return requests.filter(
        (request) =>
          request.recipient._id === user._id && request.status === "pending"
      );
    }

    if (activeTab === "sent") {
      return requests.filter(
        (request) => request.requester._id === user._id && request.status === "pending"
      );
    }

    return requests.filter((request) => request.status !== "pending");
  }, [activeTab, requests, user]);

  return (
    <div className="stack-lg">
      <section className="glass-card">
        <SectionTitle
          eyebrow="Requests"
          title="Incoming, sent, and history in one control room"
          description="Every request action now works through the backend instead of static demo buttons."
        />
        <div className="tab-row">
          {(["incoming", "sent", "history"] as const).map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "tab-btn-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {message ? <p className="helper-text">{message}</p> : null}
      </section>

      <section className="card-stack">
        {!token ? (
          <article className="glass-card">
            <p>Please login to see your requests.</p>
          </article>
        ) : null}

        {filteredRequests.map((request) => {
          const incoming = request.recipient._id === user?._id;
          return (
            <article key={request._id} className="request-card">
              <div className="mini-card-header">
                <div>
                  <strong>{request.game}</strong>
                  <p>
                    {request.requester.name} to {request.recipient.name}
                  </p>
                </div>
                <span className={`status status-${request.status}`}>
                  {request.status}
                </span>
              </div>
              <p>{request.venue}</p>
              <small>{new Date(request.scheduledFor).toLocaleString()}</small>
              <div className="action-row" style={{ marginTop: "1rem" }}>
                {incoming && request.status === "pending" ? (
                  <>
                    <button
                      className="button button-primary"
                      onClick={() => respond(request._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="button button-secondary"
                      onClick={() => respond(request._id, "declined")}
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span className="nav-meta">Tracked in match history</span>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
