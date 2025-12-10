// src/utils/api.ts
const API_BASE = "http://localhost:3001/api";

/**
 * Get authentication headers with JWT token
 */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Make authenticated API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login
    throw new Error("Session expired");
  }

  if (response.status === 403) {
    throw new Error("You do not have permission to perform this action");
  }

  if (response.status === 404) {
    throw new Error("Resource not found");
  }

  // Handle error responses
  if (!response.ok || (data.success === false)) {
    throw new Error(data.message || data.error || "API request failed");
  }

  // Return data.data if wrapped, otherwise return data directly
  return data.data !== undefined ? data.data : data;
}

/**
 * Helper methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "GET" }),

  post: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};
