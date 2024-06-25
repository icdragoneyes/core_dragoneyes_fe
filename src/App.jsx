import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Roshambo from "./pages/Roshambo";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/roshambo" element={<Roshambo />} />
    </Routes>
  );
};

export default App;
