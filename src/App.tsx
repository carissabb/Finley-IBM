import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Chat from './pages/Chat';
import BudgetTracker from './pages/BudgetTracker';
import Achievements from './pages/Achievements';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/budget" element={<BudgetTracker />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
