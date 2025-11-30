import { useTradeContext } from '../contexts/TradeContext'
import Card from '../components/UI/Card'
import {
    calculateNetProfitLoss,
    calculateWinRate,
    calculateProfitFactor,
    calculateExpectancy
} from '../utils/calculations'
import './Dashboard.css'

const Dashboard = () => {
    const { trades, settings } = useTradeContext()

    const netPL = calculateNetProfitLoss(trades)
    const winRate = calculateWinRate(trades)
    const profitFactor = calculateProfitFactor(trades)
    const expectancy = calculateExpectancy(trades)

    const currentBalance = parseFloat(settings.accountBalance) + parseFloat(netPL)

    const recentTrades = trades.slice(0, 5)

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="text-secondary">Welcome back, trader! Here's your performance overview.</p>
            </div>

            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-label">Account Balance</div>
                    <div className="stat-value">{settings.currency} {currentBalance.toFixed(2)}</div>
                    <div className={`stat-change ${parseFloat(netPL) >= 0 ? 'positive' : 'negative'}`}>
                        {parseFloat(netPL) >= 0 ? '▲' : '▼'} {Math.abs(netPL)} {settings.currency}
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-label">Total Trades</div>
                    <div className="stat-value">{trades.length}</div>
                    <div className="stat-subtitle">Logged trades</div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-label">Win Rate</div>
                    <div className="stat-value">{winRate}%</div>
                    <div className="stat-subtitle">Success rate</div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-label">Profit Factor</div>
                    <div className="stat-value">{profitFactor}</div>
                    <div className="stat-subtitle">Risk/Reward</div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-label">Expectancy</div>
                    <div className="stat-value">{settings.currency} {expectancy}</div>
                    <div className="stat-subtitle">Per trade</div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-label">Net P&L</div>
                    <div className={`stat-value ${parseFloat(netPL) >= 0 ? 'text-success' : 'text-danger'}`}>
                        {parseFloat(netPL) >= 0 ? '+' : ''}{netPL} {settings.currency}
                    </div>
                    <div className="stat-subtitle">Overall</div>
                </Card>
            </div>

            <div className="recent-section">
                <h2>Recent Trades</h2>
                {recentTrades.length === 0 ? (
                    <Card>
                        <p className="text-center text-muted">No trades logged yet. Start by adding your first trade!</p>
                    </Card>
                ) : (
                    <div className="recent-trades">
                        {recentTrades.map(trade => (
                            <Card key={trade.id} className="trade-card" hover>
                                <div className="trade-card-header">
                                    <div>
                                        <span className="trade-pair">{trade.pair}</span>
                                        <span className={`trade-direction ${trade.direction?.toLowerCase()}`}>
                                            {trade.direction}
                                        </span>
                                    </div>
                                    <div className={`trade-pl ${trade.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                                        {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss} {settings.currency}
                                    </div>
                                </div>
                                <div className="trade-card-body">
                                    <span className="trade-strategy">{trade.strategy}</span>
                                    <span className="trade-date">{trade.setupDate}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
