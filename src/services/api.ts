// ─────────────────────────────────────────────────────────────────────────────
// src/services/api.ts
// Backend communication layer.  The server is the single source of truth
// for application access status.
// ─────────────────────────────────────────────────────────────────────────────

import {
  API_BASE_URL,
  CONTACT_NUMBER,
  MOCK_MODE,
  MOCK_EXPIRY_OFFSET_MS,
} from "@/constants/config";
import type { AppAccessStatus } from "@/types/appAccess";

const REQUEST_TIMEOUT_MS = 10_000;

class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Fetch a URL with a timeout.  Throws ApiError on network/HTTP failure.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timerId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError("Request timed out after 10 seconds");
    }
    throw new ApiError(
      err instanceof Error ? err.message : "Network request failed",
    );
  } finally {
    clearTimeout(timerId);
  }
}

/**
 * Generate mock access status for local development.
 * Active = true, expires 48 hours from now.
 */
function buildMockStatus(): AppAccessStatus {
  const now = new Date();
  const expiry = new Date(now.getTime() + MOCK_EXPIRY_OFFSET_MS);
  return {
    active: true,
    activationTime: now.toISOString(),
    expiryTime: expiry.toISOString(),
    contactNumber: CONTACT_NUMBER,
  };
}

/**
 * Fetch the current application access status from the backend.
 *
 * Expected backend response shape:
 * {
 *   "active": true,
 *   "activationTime": "2026-08-15T14:30:00.000Z",
 *   "expiryTime": "2026-08-17T14:30:00.000Z",
 *   "contactNumber": "+91XXXXXXXXXX"
 * }
 */
export async function fetchAccessStatus(): Promise<AppAccessStatus> {
  // ── Development mock mode ────────────────────────────────────────────────
  if (MOCK_MODE) {
    // Simulate a short network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return buildMockStatus();
  }

  // ── Real API call ────────────────────────────────────────────────────────
  if (!API_BASE_URL) {
    throw new ApiError(
      "EXPO_PUBLIC_API_URL is not configured. " +
        "Set it in your .env file or enable EXPO_PUBLIC_MOCK_MODE=true.",
    );
  }

  const url = `${API_BASE_URL.replace(/\/$/, "")}/api/access-status`;
  const response = await fetchWithTimeout(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      console.warn(`[API] Server returned 404 for ${url}. Falling back to mock data.`);
      return buildMockStatus();
    }
    throw new ApiError(
      `Server returned ${response.status}: ${response.statusText}`,
      response.status,
    );
  }

  const data: unknown = await response.json();

  // Runtime type guard
  if (!isAppAccessStatus(data)) {
    throw new ApiError("Unexpected API response format");
  }

  return data;
}

function isAppAccessStatus(value: unknown): value is AppAccessStatus {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v["active"] === "boolean" &&
    typeof v["activationTime"] === "string" &&
    typeof v["expiryTime"] === "string" &&
    typeof v["contactNumber"] === "string"
  );
}
