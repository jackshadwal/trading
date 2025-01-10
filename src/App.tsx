import Navbar from "./components/Navbar";
import CoinPage from "./pages/CoinPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/:coinId" element={<CoinPage />} />
          <Route path="/" element={<CoinPage />} /> {/* Default to Bitcoin */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
