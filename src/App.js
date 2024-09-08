import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your components here
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SpinWheelLanding from "./pages/SpinWheelLanding";
import Roshambo from "./pages/Roshambo";
import EyeeRollLanding from "./pages/EyeeRollLanding";
import Friend from "./components/eyeroll/Friend";
import EarnTask from "./components/eyeroll/EarnTask";
import Leaderboard from "./components/eyeroll/Leaderboard";
import { HelmetProvider } from "react-helmet-async";
import Telegram from "./pages/Telegram";
import { TwaAnalyticsProvider } from "@tonsolutions/telemetree-react";
function App() {
  const projectId = process.env.REACT_APP_TELEMETREE_API_KEY;
  const apiKey = process.env.REACT_APP_TELEMETREE_API_KEY;

  console.log(projectId, apiKey);
  return (
    <TwaAnalyticsProvider projectId={projectId} apiKey={apiKey} appName="roshambo_telegram">
      <HelmetProvider>
        <Router>
          <div className="App">
            <ToastContainer position="top-center" theme="colored" className="toast-position" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/fap" element={<SpinWheelLanding />} />
              <Route path="/roshambo" element={<Roshambo />} />
              <Route path="/eyeroll" element={<EyeeRollLanding />} />
              <Route path="/eyeroll/friend" element={<Friend />} />
              <Route path="/eyeroll/quest" element={<EarnTask />} />
              <Route path="/eyeroll/leaderboard" element={<Leaderboard />} />
              <Route path="/roshambo_telegram" element={<Telegram />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </HelmetProvider>
    </TwaAnalyticsProvider>
  );
}

export default App;
