export const COOKIE="lm_session";
export const secret=()=>new TextEncoder().encode(process.env.AUTH_SECRET||"dev-secret-change-me-please-use-a-long-one");
