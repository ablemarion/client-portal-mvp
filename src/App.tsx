import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type Mode = "signin" | "signup";

interface AuthState {
  email: string;
  password: string;
  name: string;
}

function App() {
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState<AuthState>({ email: "", password: "", name: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);

    const endpoint =
      mode === "signup"
        ? `${API_BASE}/api/auth/sign-up/email`
        : `${API_BASE}/api/auth/sign-in/email`;

    const body =
      mode === "signup"
        ? { email: form.email, password: form.password, name: form.name }
        : { email: form.email, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? data.error ?? "Request failed");
      } else {
        setStatus(mode === "signup" ? "Account created." : `Signed in as ${data.user?.email ?? form.email}`);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 400, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Client Portal</h1>
      <div>
        <button onClick={() => setMode("signin")} disabled={mode === "signin"}>Sign in</button>
        {" "}
        <button onClick={() => setMode("signup")} disabled={mode === "signup"}>Sign up</button>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
          minLength={8}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>
      {status && <p style={{ color: "green" }}>{status}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}

export default App;
