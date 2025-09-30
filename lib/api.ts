// Central API base for the frontend. Use NEXT_PUBLIC_API_BASE when provided, otherwise
// fall back to the deployed Render backend.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://pool-drizzle-express.onrender.com';
