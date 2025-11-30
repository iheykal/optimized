import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTradeContext } from '../contexts/TradeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import { toast } from '../components/UI/Toast'
import { calculateRiskRewardRatio } from '../utils/calculations'
import './NewTrade.css'

const CURRENCY_PAIRS = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD',
    'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAU/USD', 'Other'
]

const STRATEGIES = [
    'Breakout', 'Pullback', 'Range Trading', 'Trend Following', 'News Trading',
    'Scalping', 'Swing Trading', 'Support/Resistance', 'Pattern Trading', 'Other'
]

const EMOTIONS = [
    'Confident', 'Fearful', 'Greedy', 'Revengeful', 'Bored', 'Excited',
    'Anxious', 'Calm', 'Frustrated', 'Patient'
]

const MISTAKES = [
    'Overtraded', 'Ignored Stop Loss', 'Moved Stop Loss', 'Cut Profits Short',
    'Held Loss Too Long', 'Early Entry', 'Late Entry', 'Overrisked',
    'No Plan', 'Emotional Trading', 'Revenge Trading'
]

const NewTrade = () => {
    const navigate = useNavigate()
    const { addTrade, settings, templates } = useTradeContext()

    const [formData, setFormData] = useState({
        // Pre-Trade Data
        setupDate: new Date().toISOString().split('T')[0],
        setupTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
        pair: '',
        direction: 'LONG',
        strategy: '',
        entryReason: '',

        // Execution Data
        entryPrice: '',
        stopLoss: '',
        takeProfit: '',
        positionSize: '',
        riskPercent: settings.defaultRiskPercent,

        // Post-Trade Data
        exitDate: '',
        exitTime: '',
        exitPrice: '',
        pips: '',
        profitLoss: '',

        // Psychological Data
        emotion: '',
        reflection: '',
        positives: '',
        notes: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const getRiskRewardRatio = () => {
        if (formData.entryPrice && formData.stopLoss && formData.takeProfit) {
            return calculateRiskRewardRatio(
                parseFloat(formData.entryPrice),
                parseFloat(formData.stopLoss),
                parseFloat(formData.takeProfit)
            )
        }
        return 'N/A'
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validation
        if (!formData.pair || !formData.strategy || !formData.entryPrice) {
            toast.error('Please fill in all required fields')
            return
        }

        const tradeData = {
            ...formData,
            riskRewardRatio: getRiskRewardRatio(),
            profitLoss: parseFloat(formData.profitLoss) || 0,
            pips: parseFloat(formData.pips) || 0
        }

        addTrade(tradeData)
        toast.success('Trade logged successfully!')
        navigate('/history')
    }

    const applyTemplate = (template) => {
        setFormData(prev => ({ ...prev, ...template.data }))
        toast.info(`Template "${template.name}" applied`)
    }

    return (
        <div className="new-trade">
            <h1>Log New Trade</h1>

            {templates.length > 0 && (
                <Card className="templates-section">
                    <h3>Quick Templates</h3>
                    <div className="templates-grid">
                        {templates.map(template => (
                            <Button
                                key={template.id}
                                variant="secondary"
                                size="sm"
                                onClick={() => applyTemplate(template)}
                            >
                                {template.name}
                            </Button>
                        ))}
                    </div>
                </Card>
            )}



            <form onSubmit={handleSubmit}>
                <Card>
                    <h3>Setup Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="label label-required">Date</label>
                            <input
                                type="date"
                                name="setupDate"
                                className="input"
                                value={formData.setupDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label label-required">Time</label>
                            <input
                                type="time"
                                name="setupTime"
                                className="input"
                                value={formData.setupTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label label-required">Currency Pair</label>
                            <select
                                name="pair"
                                className="input"
                                value={formData.pair}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select pair...</option>
                                {CURRENCY_PAIRS.map(pair => (
                                    <option key={pair} value={pair}>{pair}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="label label-required">Direction</label>
                            <select
                                name="direction"
                                className="input"
                                value={formData.direction}
                                onChange={handleChange}
                                required
                            >
                                <option value="LONG">🔼 LONG (Buy)</option>
                                <option value="SHORT">🔽 SHORT (Sell)</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label className="label label-required">Strategy/Setup</label>
                            <select
                                name="strategy"
                                className="input"
                                value={formData.strategy}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select strategy...</option>
                                {STRATEGIES.map(strat => (
                                    <option key={strat} value={strat}>{strat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label className="label label-required">Entry Reason</label>
                            <textarea
                                name="entryReason"
                                className="input"
                                value={formData.entryReason}
                                onChange={handleChange}
                                placeholder="Why are you taking this trade? Technical/fundamental reasons..."
                                required
                            />
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3>Execution Details</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="label label-required">Entry Price</label>
                            <input
                                type="number"
                                step="0.00001"
                                name="entryPrice"
                                className="input"
                                value={formData.entryPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label label-required">Stop Loss</label>
                            <input
                                type="number"
                                step="0.00001"
                                name="stopLoss"
                                className="input"
                                value={formData.stopLoss}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label label-required">Take Profit</label>
                            <input
                                type="number"
                                step="0.00001"
                                name="takeProfit"
                                className="input"
                                value={formData.takeProfit}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">R:R Ratio</label>
                            <div className="rr-display">{getRiskRewardRatio()}</div>
                        </div>

                        <div className="form-group">
                            <label className="label">Position Size (Lots)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="positionSize"
                                className="input"
                                value={formData.positionSize}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Risk %</label>
                            <input
                                type="number"
                                step="0.1"
                                name="riskPercent"
                                className="input"
                                value={formData.riskPercent}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3>Trade Outcome</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="label">Exit Date</label>
                            <input
                                type="date"
                                name="exitDate"
                                className="input"
                                value={formData.exitDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Exit Time</label>
                            <input
                                type="time"
                                name="exitTime"
                                className="input"
                                value={formData.exitTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Exit Price</label>
                            <input
                                type="number"
                                step="0.00001"
                                name="exitPrice"
                                className="input"
                                value={formData.exitPrice}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Pips Gained/Lost</label>
                            <input
                                type="number"
                                step="0.1"
                                name="pips"
                                className="input"
                                value={formData.pips}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Profit/Loss ({settings.currency})</label>
                            <input
                                type="number"
                                step="0.01"
                                name="profitLoss"
                                className="input"
                                value={formData.profitLoss}
                                onChange={handleChange}
                            />
                        </div>


                    </div>
                </Card>

                <Card>
                    <h3>Psychology & Review</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="label">Overall Emotion</label>
                            <select
                                name="emotion"
                                className="input"
                                value={formData.emotion}
                                onChange={handleChange}
                            >
                                <option value="">Select emotion...</option>
                                {EMOTIONS.map(emo => (
                                    <option key={emo} value={emo}>{emo}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label className="label">Trade Reflection</label>
                            <textarea
                                name="reflection"
                                className="input"
                                value={formData.reflection}
                                onChange={handleChange}
                                placeholder="What mistakes did you make? What could be improved?"
                                rows="3"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="label">What Went Well</label>
                            <textarea
                                name="positives"
                                className="input"
                                value={formData.positives}
                                onChange={handleChange}
                                placeholder="Things you did correctly..."
                                rows="2"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="label">Notes & Lessons Learned</label>
                            <textarea
                                name="notes"
                                className="input"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Detailed notes, what you would do differently..."
                                rows="3"
                            />
                        </div>
                    </div>
                </Card>

                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        Save Trade
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default NewTrade
