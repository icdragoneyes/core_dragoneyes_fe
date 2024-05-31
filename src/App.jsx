import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Roshambo from "./pages/Roshambo";

const App = () => {
  return (
    <div className="flex justify-center items-center h-[100vh] w-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roshambo" element={<Roshambo />} />
      </Routes>
    </div>
  );
};

export default App;
