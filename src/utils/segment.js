import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = AnalyticsBrowser.load({ writeKey: "4JmIdxFpYV45aYdHO8LGB0ygbyvdv3Qz" }).catch((err) => console.error(err));
