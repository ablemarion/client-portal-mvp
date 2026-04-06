import { Hono } from "hono";
import { cors } from "hono/cors";
import { betterAuth } from "better-auth";

export interface Env {
  DB: D1Database;
  ADMIN_KEY: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

function createAuth(env: Env) {
  return betterAuth({
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true },
  });
}

const app = new Hono<{ Bindings: Env }>();

app.use(
  "/api/auth/*",
  cors({
    origin: [
      "https://client-portal-mvp.pages.dev",
      "http://localhost:5173",
      "http://localhost:8787",
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.get("/api/health", (c) => {
  return c.json({ status: "ok", service: "client-portal-api", ts: Date.now() });
});

app.all("/api/auth/*", (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

export default app;
