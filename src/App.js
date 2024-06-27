import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import your components here
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SpinWheelLanding from "./pages/SpinWheelLanding";
// import MainNavBar from "./components/MainNavBar";
import Roshambo from "./pages/Roshambo";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <MainNavBar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/spin" element={<SpinWheelLanding />} />
          <Route path="/roshambo" element={<Roshambo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
