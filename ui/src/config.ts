export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5140/api",
  // Helper to get the base URL without /api suffix if needed
  baseUrl: (
    import.meta.env.VITE_API_URL || "http://localhost:5140/api"
  ).replace(/\/api$/, ""),
};
