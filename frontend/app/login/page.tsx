"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/discover");
    } catch (submitError) {
      setError((submitError as Error).message);
    }
  }

  return (
    <section className="auth-layout glass-card">
      <div className="section-heading">
        <span className="section-label">Sign In</span>
        <h2>Jump Back Into The Match</h2>
        <p>
          Access discovery, requests, communities, and your profile with one
          account.
        </p>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button button-primary" type="submit">
          Sign in
        </button>
      </form>
      <p className="helper-text">
        Need an account? <Link href="/register">Join free</Link>
      </p>
    </section>
  );
}
