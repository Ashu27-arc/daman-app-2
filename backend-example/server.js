// ─────────────────────────────────────────────────────────────────────────────
// backend-example/server.js
// Example Express backend that returns the AppAccessStatus JSON.
// This is a reference implementation — deploy to your own server.
//
// Install:  npm install express cors
// Run:      node server.js
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ─── In a real implementation replace this with your database ─────────────────
const ACCESS_CONFIG = {
  active: true,
  // Activation: 15 August 2026, 20:30 IST → UTC
  activationTime: "2026-08-15T15:00:00.000Z",
  // Expiry: exactly 48 hours later
  expiryTime: "2026-08-17T15:00:00.000Z",
  contactNumber: "+91XXXXXXXXXX", // Replace with real number
};
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/access-status
 *
 * Returns current access configuration.
 * The app will compare expiryTime to determine if access has lapsed.
 *
 * Response:
 * {
 *   "active": true,
 *   "activationTime": "2026-08-15T15:00:00.000Z",
 *   "expiryTime": "2026-08-17T15:00:00.000Z",
 *   "contactNumber": "+91XXXXXXXXXX"
 * }
 */
app.get("/api/access-status", (_req, res) => {
  // Automatically compute active flag based on server time
  const now = new Date();
  const expiry = new Date(ACCESS_CONFIG.expiryTime);
  const isActive = ACCESS_CONFIG.active && now < expiry;

  res.json({
    active: isActive,
    activationTime: ACCESS_CONFIG.activationTime,
    expiryTime: ACCESS_CONFIG.expiryTime,
    contactNumber: ACCESS_CONFIG.contactNumber,
  });
});

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Daman VIP Games API running on port ${PORT}`);
});
