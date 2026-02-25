// src/config/env.js
export const config = {
  GEOAPIFY_API_KEY: import.meta.env.VITE_GEOAPIFY_API_KEY || 'd0afcbf09e904e84bf24522573df526f',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  MAP_DEFAULT_CENTER: [20.5937, 78.9629],
  MAP_DEFAULT_ZOOM: 5
};