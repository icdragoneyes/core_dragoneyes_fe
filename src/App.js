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

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-center" theme="colored" className="toast-position" />
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
