import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Challenges from './pages/Challenges';
import LeaderboardPage from './pages/LeaderboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Challenges />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
