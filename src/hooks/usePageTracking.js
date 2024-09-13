import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import analytics from "../utils/segment"; // Adjust the path as needed

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.page();
  }, [location]);
};
