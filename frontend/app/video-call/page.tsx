"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { SectionTitle } from "@/components/section-title";
import { useAuth } from "@/components/auth-provider";
import socket from "@/lib/socket";
import { apiRequest } from "@/lib/api";

type UserSummary = {
  _id: string;
  name: string;
};

export default function VideoCallPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [status, setStatus] = useState("Waiting to start call...");
  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    apiRequest<UserSummary[]>("/users")
      .then((data) => setUsers(data.filter((item) => item._id !== user?._id)))
      .catch((error: Error) => setStatus(error.message));
  }, [user?._id]);

  useEffect(() => {
    function handleSignal({
      signal,
      fromUserId
    }: {
      signal: Peer.SignalData;
      fromUserId: string;
    }) {
      setSelectedUserId(fromUserId);
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    }

    socket.on("video:signal", handleSignal);
    return () => {
      socket.off("video:signal", handleSignal);
    };
  }, []);

  async function startCall() {
    if (!user || !selectedUserId) {
      setStatus("Choose a player first.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    streamRef.current = stream;

    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peerRef.current = peer;

    peer.on("signal", (signal) => {
      socket.emit("video:signal", {
        toUserId: selectedUserId,
        fromUserId: user._id,
        signal
      });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream;
      }
      setStatus("Video call connected.");
    });

    setStatus("Calling...");
  }

  return (
    <div className="stack-lg">
      <section className="glass-card">
        <SectionTitle
          eyebrow="Video Call"
          title="Peer-to-peer video call signaling for local match coordination"
          description="This page uses WebRTC with Socket.io signaling. Open the app in two sessions to test properly."
        />
        <div className="action-row">
          <select
            className="input"
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
          >
            <option value="">Choose a player</option>
            {users.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
          <button className="button button-primary" onClick={startCall}>
            Start call
          </button>
        </div>
        <p className="helper-text">{status}</p>
      </section>

      <section className="content-grid">
        <div className="glass-card">
          <h3>Your Video</h3>
          <video ref={myVideo} autoPlay muted playsInline style={{ width: "100%" }} />
        </div>
        <div className="glass-card">
          <h3>Remote Video</h3>
          <video ref={remoteVideo} autoPlay playsInline style={{ width: "100%" }} />
        </div>
      </section>
    </div>
  );
}
