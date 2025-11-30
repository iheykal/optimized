import { useTradeContext } from '../contexts/TradeContext'
import Card from '../components/UI/Card'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
    calculateWinRate,
    calculateProfitFactor,
    calculateExpectancy,
    calculateAverageWin,
    calculateAverageLoss,
    getPerformanceByStrategy,
    getPerformanceByPair,
    getPerformanceBySession,
    getEquityCurveData,
    getMistakeFrequency
} from '../utils/calculations'
import './Analytics.css'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

const Analytics = () => {
    const { trades, settings } = useTradeContext()

    if (trades.length === 0) {
        return (
            <div className="analytics">
                <h1>Analytics</h1>
                <Card>
                    <p className="text-center text-muted">
                        No trades to analyze yet. Start logging trades to see your performance insights!
                    </p>
                </Card>
            </div>
        )
    }

    const winRate = calculateWinRate(trades)
    const profitFactor = calculateProfitFactor(trades)
    const expectancy = calculateExpectancy(trades)
    const avgWin = calculateAverageWin(trades)
    const avgLoss = calculateAverageLoss(trades)

    const strategyPerf = getPerformanceByStrategy(trades)
    const pairPerf = getPerformanceByPair(trades)
    const sessionPerf = getPerformanceBySession(trades)
    const equityCurve = getEquityCurveData(trades, settings.accountBalance)
    const mistakes = getMistakeFrequency(trades)

    const winLossData = [
        { name: 'Wins', value: trades.filter(t => t.profitLoss > 0).length },
        { name: 'Losses', value: trades.filter(t => t.profitLoss < 0).length }
    ]

    return (
        <div className="analytics">
            <div className="analytics-header">
                <h1>Analytics</h1>
                <p className="text-secondary">Deep insights into your trading performance</p>
            </div>

            <div className="analytics-grid">
                <Card>
                    <h3>Equity Curve</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={equityCurve}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="trade"
                                stroke="#94a3b8"
                                label={{ value: 'Trade Number', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                label={{ value: 'Balance', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                            />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#cbd5e1' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="balance"
                                stroke="#6366f1"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card>
                    <h3>Win/Loss Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={winLossData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {winLossData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="full-width">
                    <h3>Performance by Strategy</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={strategyPerf}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#cbd5e1' }}
                            />
                            <Legend />
                            <Bar dataKey="profitLoss" name="Profit/Loss" fill="#6366f1" />
                            <Bar dataKey="winRate" name="Win Rate %" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="full-width">
                    <h3>Performance by Currency Pair</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={pairPerf}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#cbd5e1' }}
                            />
                            <Legend />
                            <Bar dataKey="profitLoss" name="Profit/Loss" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card>
                    <h3>Session Analysis</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sessionPerf}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#cbd5e1' }}
                            />
                            <Legend />
                            <Bar dataKey="profitLoss" name="Profit/Loss" fill="#06b6d4" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card>
                    <h3>Most Common Mistakes</h3>
                    {mistakes.length === 0 ? (
                        <p className="text-muted">No mistakes logged yet!</p>
                    ) : (
                        <div className="mistakes-list">
                            {mistakes.slice(0, 5).map((mistake, index) => (
                                <div key={index} className="mistake-item">
                                    <div className="mistake-bar" style={{ width: `${(mistake.count / mistakes[0].count) * 100}%` }} />
                                    <span className="mistake-name">{mistake.name}</span>
                                    <span className="mistake-count">{mistake.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <div className="key-metrics">
                <h2>Key Metrics Summary</h2>
                <div className="metrics-grid">
                    <Card className="metric-card">
                        <div className="metric-label">Win Rate</div>
                        <div className="metric-value">{winRate}%</div>
                    </Card>
                    <Card className="metric-card">
                        <div className="metric-label">Profit Factor</div>
                        <div className="metric-value">{profitFactor}</div>
                    </Card>
                    <Card className="metric-card">
                        <div className="metric-label">Expectancy</div>
                        <div className="metric-value">{settings.currency} {expectancy}</div>
                    </Card>
                    <Card className="metric-card">
                        <div className="metric-label">Avg Win</div>
                        <div className="metric-value text-success">{settings.currency} {avgWin}</div>
                    </Card>
                    <Card className="metric-card">
                        <div className="metric-label">Avg Loss</div>
                        <div className="metric-value text-danger">{settings.currency} {avgLoss}</div>
                    </Card>
                    <Card className="metric-card">
                        <div className="metric-label">Total Trades</div>
                        <div className="metric-value">{trades.length}</div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Analytics
