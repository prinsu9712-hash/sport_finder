"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { DAY_OPTIONS, GAME_OPTIONS, LOCATION_OPTIONS } from "@/lib/options";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "woman",
    role: "user",
    location: "",
    skillLevel: "beginner",
    bio: "",
    timeSlot: "",
    preferredGames: [] as string[],
    preferredLocations: [] as string[],
    days: [] as string[]
  });

  function toggleValue(field: "preferredGames" | "preferredLocations" | "days", value: string) {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value]
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        gender: form.gender,
        role: form.role,
        location: form.location,
        skillLevel: form.skillLevel,
        bio: form.bio,
        preferredGames: form.preferredGames,
        preferredLocations: form.preferredLocations,
        availability: {
          days: form.days,
          timeSlot: form.timeSlot
        }
      });
      router.push("/discover");
    } catch (submitError) {
      setError((submitError as Error).message);
    }
  }

  return (
    <section className="glass-card">
      <div className="section-heading">
        <span className="section-label">Join Free</span>
        <h2>Create Your Player Profile</h2>
        <p>
          Set your games, availability, locations, and account type in one
          onboarding flow.
        </p>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="split-two">
          <input
            className="input"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </div>
        <div className="split-two">
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
            required
          />
        </div>
        <div className="split-two">
          <select
            className="input"
            value={form.gender}
            onChange={(event) => setForm({ ...form, gender: event.target.value })}
          >
            <option value="woman">Woman</option>
            <option value="man">Man</option>
            <option value="other">Other</option>
          </select>
          <select
            className="input"
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
          >
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>
        <div className="split-two">
          <select
            className="input"
            value={form.skillLevel}
            onChange={(event) => setForm({ ...form, skillLevel: event.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            className="input"
            placeholder="Preferred time slot"
            value={form.timeSlot}
            onChange={(event) => setForm({ ...form, timeSlot: event.target.value })}
            required
          />
        </div>
        <textarea
          className="input textarea"
          placeholder="Short bio"
          value={form.bio}
          onChange={(event) => setForm({ ...form, bio: event.target.value })}
        />
        <div>
          <p className="helper-text">Preferred games</p>
          <div className="chip-row">
            {GAME_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip-select ${form.preferredGames.includes(option) ? "chip-select-active" : ""}`}
                onClick={() => toggleValue("preferredGames", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="helper-text">Availability days</p>
          <div className="chip-row">
            {DAY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip-select ${form.days.includes(option) ? "chip-select-active" : ""}`}
                onClick={() => toggleValue("days", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="helper-text">Preferred play locations</p>
          <div className="chip-row">
            {LOCATION_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip-select ${form.preferredLocations.includes(option) ? "chip-select-active" : ""}`}
                onClick={() => toggleValue("preferredLocations", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button button-primary" type="submit">
          Create account
        </button>
      </form>
    </section>
  );
}
