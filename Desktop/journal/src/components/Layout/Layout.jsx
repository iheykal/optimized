import { NavLink } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <aside className="sidebar glass">
                <div className="logo">
                    <h2 className="logo-text">TradeFlow</h2>
                    <p className="logo-subtitle">Forex Journal</p>
                </div>

                <nav className="nav">
                    <NavLink to="/" className="nav-link">
                        <span className="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/new-trade" className="nav-link">
                        <span className="nav-icon">➕</span>
                        <span>New Trade</span>
                    </NavLink>
                    <NavLink to="/history" className="nav-link">
                        <span className="nav-icon">📋</span>
                        <span>History</span>
                    </NavLink>
                    <NavLink to="/analytics" className="nav-link">
                        <span className="nav-icon">📈</span>
                        <span>Analytics</span>
                    </NavLink>
                    <NavLink to="/settings" className="nav-link">
                        <span className="nav-icon">⚙️</span>
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout
