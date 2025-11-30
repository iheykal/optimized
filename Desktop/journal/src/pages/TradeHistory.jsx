import { useState } from 'react'
import { useTradeContext } from '../contexts/TradeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import { toast } from '../components/UI/Toast'
import './TradeHistory.css'

const TradeHistory = () => {
    const { trades, deleteTrade, settings } = useTradeContext()
    const [selectedTrade, setSelectedTrade] = useState(null)
    const [filters, setFilters] = useState({
        pair: '',
        strategy: '',
        outcome: 'all', // all, wins, losses
        dateFrom: '',
        dateTo: ''
    })

    const filteredTrades = trades.filter(trade => {
        if (filters.pair && trade.pair !== filters.pair) return false
        if (filters.strategy && trade.strategy !== filters.strategy) return false
        if (filters.outcome === 'wins' && trade.profitLoss <= 0) return false
        if (filters.outcome === 'losses' && trade.profitLoss >= 0) return false
        if (filters.dateFrom && trade.setupDate < filters.dateFrom) return false
        if (filters.dateTo && trade.setupDate > filters.dateTo) return false
        return true
    })

    const uniquePairs = [...new Set(trades.map(t => t.pair))].filter(Boolean)
    const uniqueStrategies = [...new Set(trades.map(t => t.strategy))].filter(Boolean)

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this trade?')) {
            deleteTrade(id)
            setSelectedTrade(null)
            toast.success('Trade deleted successfully')
        }
    }

    return (
        <div className="trade-history">
            <div className="history-header">
                <h1>Trade History</h1>
                <p className="text-secondary">Review and analyze all your logged trades</p>
            </div>

            <Card className="filters-card">
                <h3>Filters</h3>
                <div className="filters-grid">
                    <div className="form-group">
                        <label className="label">Currency Pair</label>
                        <select
                            className="input"
                            value={filters.pair}
                            onChange={(e) => setFilters({ ...filters, pair: e.target.value })}
                        >
                            <option value="">All Pairs</option>
                            {uniquePairs.map(pair => (
                                <option key={pair} value={pair}>{pair}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Strategy</label>
                        <select
                            className="input"
                            value={filters.strategy}
                            onChange={(e) => setFilters({ ...filters, strategy: e.target.value })}
                        >
                            <option value="">All Strategies</option>
                            {uniqueStrategies.map(strategy => (
                                <option key={strategy} value={strategy}>{strategy}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Outcome</label>
                        <select
                            className="input"
                            value={filters.outcome}
                            onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
                        >
                            <option value="all">All Trades</option>
                            <option value="wins">Wins Only</option>
                            <option value="losses">Losses Only</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">From Date</label>
                        <input
                            type="date"
                            className="input"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">To Date</label>
                        <input
                            type="date"
                            className="input"
                            value={filters.dateTo}
                            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <Button
                            variant="secondary"
                            onClick={() => setFilters({
                                pair: '',
                                strategy: '',
                                outcome: 'all',
                                dateFrom: '',
                                dateTo: ''
                            })}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="results-count">
                Showing {filteredTrades.length} of {trades.length} trades
            </div>

            {filteredTrades.length === 0 ? (
                <Card>
                    <p className="text-center text-muted">No trades found matching your filters.</p>
                </Card>
            ) : (
                <div className="trades-table">
                    <div className="table-header">
                        <div>Date</div>
                        <div>Pair</div>
                        <div>Direction</div>
                        <div>Strategy</div>
                        <div>Entry</div>
                        <div>Exit</div>
                        <div>R:R</div>
                        <div>P&L</div>
                        <div>Actions</div>
                    </div>

                    {filteredTrades.map(trade => (
                        <div key={trade.id} className="table-row" onClick={() => setSelectedTrade(trade)}>
                            <div>{trade.setupDate}</div>
                            <div className="font-semibold">{trade.pair}</div>
                            <div>
                                <span className={`direction-badge ${trade.direction?.toLowerCase()}`}>
                                    {trade.direction}
                                </span>
                            </div>
                            <div>{trade.strategy}</div>
                            <div className="font-mono">{trade.entryPrice}</div>
                            <div className="font-mono">{trade.exitPrice || '-'}</div>
                            <div>{trade.riskRewardRatio || '-'}</div>
                            <div className={`pl-value ${trade.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                                {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss}
                            </div>
                            <div>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedTrade(trade)
                                    }}
                                >
                                    View
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={!!selectedTrade}
                onClose={() => setSelectedTrade(null)}
                title="Trade Details"
                size="lg"
            >
                {selectedTrade && (() => {
                    // Calculate additional metrics
                    const calculateTradeDuration = () => {
                        if (!selectedTrade.setupDate || !selectedTrade.exitDate) return null;
                        const start = new Date(`${selectedTrade.setupDate} ${selectedTrade.setupTime || '00:00'}`);
                        const end = new Date(`${selectedTrade.exitDate} ${selectedTrade.exitTime || '00:00'}`);
                        const diff = end - start;
                        const hours = Math.floor(diff / (1000 * 60 * 60));
                        const days = Math.floor(hours / 24);
                        return days > 0 ? `${days}d ${hours % 24}h` : `${hours}h`;
                    };

                    const calculatePercentageGain = () => {
                        if (!selectedTrade.profitLoss || !settings.currency) return null;
                        // Assuming profitLoss is the actual amount
                        const entry = parseFloat(selectedTrade.entryPrice) || 0;
                        const position = parseFloat(selectedTrade.positionSize) || 1;
                        if (entry === 0) return null;
                        return ((selectedTrade.profitLoss / (entry * position)) * 100).toFixed(2);
                    };

                    const parseRRRatio = (rr) => {
                        if (!rr) return { risk: 1, reward: 1 };
                        const parts = String(rr).split(':');
                        return {
                            risk: parseFloat(parts[0]) || 1,
                            reward: parseFloat(parts[1]) || 1
                        };
                    };

                    const duration = calculateTradeDuration();
                    const percentGain = calculatePercentageGain();
                    const rrRatio = parseRRRatio(selectedTrade.riskRewardRatio);
                    const isWin = selectedTrade.profitLoss >= 0;

                    return (
                        <div className="trade-details-enhanced">
                            {/* P&L Hero Section */}
                            {selectedTrade.exitPrice && (
                                <div className={`pl-hero ${isWin ? 'win' : 'loss'}`}>
                                    <div className="pl-hero-content">
                                        <div className="pl-label">
                                            {isWin ? '🎉 Profit' : '📉 Loss'}
                                        </div>
                                        <div className="pl-amount">
                                            {isWin ? '+' : ''}{selectedTrade.profitLoss} {settings.currency}
                                        </div>
                                        {percentGain && (
                                            <div className="pl-percentage">
                                                {isWin ? '+' : ''}{percentGain}%
                                            </div>
                                        )}
                                        {selectedTrade.pips && (
                                            <div className="pl-pips">
                                                {selectedTrade.pips} pips
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="quick-stats">
                                <div className="quick-stat">
                                    <div className="quick-stat-icon">📅</div>
                                    <div className="quick-stat-content">
                                        <div className="quick-stat-label">Setup Date</div>
                                        <div className="quick-stat-value">{selectedTrade.setupDate}</div>
                                    </div>
                                </div>
                                <div className="quick-stat">
                                    <div className="quick-stat-icon">
                                        {selectedTrade.direction?.toLowerCase() === 'long' ? '📈' : '📉'}
                                    </div>
                                    <div className="quick-stat-content">
                                        <div className="quick-stat-label">Direction</div>
                                        <div className="quick-stat-value">
                                            <span className={`direction-badge ${selectedTrade.direction?.toLowerCase()}`}>
                                                {selectedTrade.direction}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {duration && (
                                    <div className="quick-stat">
                                        <div className="quick-stat-icon">⏱️</div>
                                        <div className="quick-stat-content">
                                            <div className="quick-stat-label">Duration</div>
                                            <div className="quick-stat-value">{duration}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Setup Information Card */}
                            <div className="detail-card setup-card">
                                <div className="detail-card-header">
                                    <h4>📋 Setup Information</h4>
                                </div>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Currency Pair</span>
                                        <span className="detail-value font-semibold">{selectedTrade.pair}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Strategy</span>
                                        <span className="detail-value strategy-badge">{selectedTrade.strategy}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Time</span>
                                        <span className="detail-value">{selectedTrade.setupTime || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Risk %</span>
                                        <span className="detail-value risk-badge">{selectedTrade.riskPercent}%</span>
                                    </div>
                                    {selectedTrade.entryReason && (
                                        <div className="detail-item full-width">
                                            <span className="detail-label">Entry Reason</span>
                                            <span className="detail-value entry-reason">{selectedTrade.entryReason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Execution Card with R:R Visualization */}
                            <div className="detail-card execution-card">
                                <div className="detail-card-header">
                                    <h4>🎯 Execution</h4>
                                </div>

                                {/* Price Levels */}
                                <div className="price-levels">
                                    <div className="price-level tp">
                                        <span className="price-label">Take Profit</span>
                                        <span className="price-value">{selectedTrade.takeProfit}</span>
                                    </div>
                                    <div className="price-level entry">
                                        <span className="price-label">Entry Price</span>
                                        <span className="price-value">{selectedTrade.entryPrice}</span>
                                    </div>
                                    <div className="price-level sl">
                                        <span className="price-label">Stop Loss</span>
                                        <span className="price-value">{selectedTrade.stopLoss}</span>
                                    </div>
                                </div>

                                {/* Risk-Reward Visualization */}
                                {selectedTrade.riskRewardRatio && (
                                    <div className="rr-visualization">
                                        <div className="rr-label">Risk:Reward Ratio</div>
                                        <div className="rr-bar-container">
                                            <div className="rr-bar-risk" style={{ flex: rrRatio.risk }}>
                                                <span className="rr-bar-label">Risk: {rrRatio.risk}</span>
                                            </div>
                                            <div className="rr-bar-reward" style={{ flex: rrRatio.reward }}>
                                                <span className="rr-bar-label">Reward: {rrRatio.reward}</span>
                                            </div>
                                        </div>
                                        <div className="rr-ratio-display">1:{(rrRatio.reward / rrRatio.risk).toFixed(2)}</div>
                                    </div>
                                )}

                                {/* Position Details */}
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Position Size</span>
                                        <span className="detail-value">{selectedTrade.positionSize} lots</span>
                                    </div>
                                    {selectedTrade.exitPrice && (
                                        <div className="detail-item">
                                            <span className="detail-label">Exit Price</span>
                                            <span className="detail-value font-mono">{selectedTrade.exitPrice}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Psychology & Review Card */}
                            <div className="detail-card psychology-card">
                                <div className="detail-card-header">
                                    <h4>🧠 Psychology & Review</h4>
                                </div>
                                <div className="detail-grid">
                                    {selectedTrade.emotion && (
                                        <div className="detail-item">
                                            <span className="detail-label">Overall Emotion</span>
                                            <span className="detail-value emotion-badge">{selectedTrade.emotion}</span>
                                        </div>
                                    )}
                                </div>

                                {selectedTrade.reflection && (
                                    <div className="callout-box mistakes-box">
                                        <div className="callout-icon">🔍</div>
                                        <div className="callout-content">
                                            <div className="callout-title">Trade Reflection</div>
                                            <div className="callout-text">{selectedTrade.reflection}</div>
                                        </div>
                                    </div>
                                )}

                                {selectedTrade.positives && (
                                    <div className="callout-box positives-box">
                                        <div className="callout-icon">✅</div>
                                        <div className="callout-content">
                                            <div className="callout-title">What Went Well</div>
                                            <div className="callout-text">{selectedTrade.positives}</div>
                                        </div>
                                    </div>
                                )}

                                {selectedTrade.notes && (
                                    <div className="callout-box notes-box">
                                        <div className="callout-icon">📝</div>
                                        <div className="callout-content">
                                            <div className="callout-title">Additional Notes</div>
                                            <div className="callout-text">{selectedTrade.notes}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="detail-actions">
                                <Button variant="danger" onClick={() => handleDelete(selectedTrade.id)}>
                                    🗑️ Delete Trade
                                </Button>
                                <Button variant="secondary" onClick={() => setSelectedTrade(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    )
}

export default TradeHistory
