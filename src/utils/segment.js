import { AnalyticsBrowser } from "@segment/analytics-next";
const analytics = await AnalyticsBrowser.load({
  writeKey: "4JmIdxFpYV45aYdHO8LGB0ygbyvdv3Qz",
});
export default analytics[0];
