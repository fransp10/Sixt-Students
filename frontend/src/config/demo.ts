// True only in builds made with VITE_DEMO_MODE=true (the hosted demo).
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
