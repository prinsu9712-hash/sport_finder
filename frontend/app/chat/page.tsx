"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";
import socket from "@/lib/socket";

type UserSummary = {
  _id: string;
  name: string;
  location: string;
};

type Message = {
  _id: string;
  text: string;
  sender: UserSummary;
  receiver: UserSummary;
  createdAt: string;
};

export default function ChatPage() {
  const { token, user } = useAuth();
  const [players, setPlayers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  async function loadPlayers() {
    const data = await apiRequest<UserSummary[]>("/users");
    setPlayers(data.filter((player) => player._id !== user?._id));
  }

  async function loadMessages(withUser: string) {
    if (!token || !withUser) return;
    const data = await apiRequest<Message[]>(
      `/messages?withUser=${withUser}`,
      { token }
    );
    setMessages(data);
  }

  useEffect(() => {
    loadPlayers().catch((error: Error) => setStatus(error.message));
  }, [user?._id]);

  useEffect(() => {
    loadMessages(selectedUserId).catch((error: Error) => setStatus(error.message));
  }, [selectedUserId, token]);

  useEffect(() => {
    function handleMessage(message: Message) {
      if (
        message.sender._id === selectedUserId ||
        message.receiver._id === selectedUserId
      ) {
        setMessages((current) => [...current, message]);
      }
    }

    socket.on("chat:message", handleMessage);
    return () => {
      socket.off("chat:message", handleMessage);
    };
  }, [selectedUserId]);

  const selectedUser = useMemo(
    () => players.find((player) => player._id === selectedUserId),
    [players, selectedUserId]
  );

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !selectedUserId || !text.trim()) {
      return;
    }

    socket.emit("chat:send", {
      sender: user._id,
      receiver: selectedUserId,
      text
    });

    setText("");
  }

  return (
    <div className="content-grid">
      <section className="glass-card">
        <SectionTitle
          eyebrow="Chat"
          title="WhatsApp-style chat for confirmed local coordination"
          description="Use this page for lightweight real-time messages after discovery and requests."
        />
        <div className="card-stack">
          {players.map((player) => (
            <button
              key={player._id}
              className={`chip-select ${selectedUserId === player._id ? "chip-select-active" : ""}`}
              onClick={() => setSelectedUserId(player._id)}
            >
              {player.name}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card">
        <div className="section-heading">
          <span className="section-label">Conversation</span>
          <h2>{selectedUser ? selectedUser.name : "Choose a player"}</h2>
          <p>{status || "Real-time chat is connected through Socket.io."}</p>
        </div>
        <div className="card-stack" style={{ minHeight: "20rem" }}>
          {messages.map((message) => {
            const mine = message.sender._id === user?._id;
            return (
              <div
                key={message._id}
                className="mini-card"
                style={{
                  justifySelf: mine ? "end" : "start",
                  maxWidth: "80%",
                  borderColor: mine ? "rgba(205,255,0,0.35)" : undefined
                }}
              >
                <strong>{mine ? "You" : message.sender.name}</strong>
                <p>{message.text}</p>
              </div>
            );
          })}
        </div>
        <form className="action-row" onSubmit={handleSend}>
          <input
            className="input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type your message"
          />
          <button className="button button-primary" type="submit">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
