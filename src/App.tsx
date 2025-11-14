import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Chat from './pages/Chat';
import BudgetTracker from './pages/BudgetTracker';
import Achievements from './pages/Achievements';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/Expenses';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

function AppContent() {
	const location = useLocation();
	const hideNav = location.pathname === '/' || location.pathname === '/login';

	const routes = (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/dashboard" element={<DashboardPage />} />
			<Route path="/chat" element={<Chat />} />
			<Route path="/budget" element={<BudgetTracker />} />
			<Route path="/login" element={<LoginPage />} />
  			<Route path="/signup" element={<SignupPage />} />
			<Route path="/expenses" element={<ExpensesPage />} />
			<Route path="/achievements" element={<Achievements />} />
			<Route path="/account" element={<AccountPage />} />
		</Routes>
	);

	if (hideNav) {
		return <main className="min-h-screen">{routes}</main>;
	}

	return (
		<div className="flex min-h-screen bg-slate-50">
			<Navigation />
			<main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">{routes}</main>
		</div>
	);
}

export default App;
