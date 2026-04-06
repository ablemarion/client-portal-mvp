-- Client Portal initial schema
CREATE TABLE IF NOT EXISTS users (
  id       TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email    TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
