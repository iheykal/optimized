import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import NewTrade from './pages/NewTrade'
import TradeHistory from './pages/TradeHistory'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Toast from './components/UI/Toast'
import './App.css'

function App() {
    return (
        <Router>
            <Toast />
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/new-trade" element={<NewTrade />} />
                    <Route path="/history" element={<TradeHistory />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
