import { AnalyticsBrowser } from "@segment/analytics-next";
const analytics = AnalyticsBrowser.load({
  writeKey: "4JmIdxFpYV45aYdHO8LGB0ygbyvdv3Qz",
}).catch((err) => console.error(err));
export default analytics;
