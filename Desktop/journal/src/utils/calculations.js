// Calculation utilities for trade analytics

// ==================== Basic Metrics ====================

export const calculateWinRate = (trades) => {
    if (trades.length === 0) return 0
    const wins = trades.filter(t => t.profitLoss > 0).length
    return ((wins / trades.length) * 100).toFixed(2)
}

export const calculateProfitFactor = (trades) => {
    const wins = trades.filter(t => t.profitLoss > 0)
    const losses = trades.filter(t => t.profitLoss < 0)

    const totalWins = wins.reduce((sum, t) => sum + t.profitLoss, 0)
    const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.profitLoss, 0))

    if (totalLosses === 0) return totalWins > 0 ? '∞' : '0.00'
    return (totalWins / totalLosses).toFixed(2)
}

export const calculateAverageWin = (trades) => {
    const wins = trades.filter(t => t.profitLoss > 0)
    if (wins.length === 0) return 0
    return (wins.reduce((sum, t) => sum + t.profitLoss, 0) / wins.length).toFixed(2)
}

export const calculateAverageLoss = (trades) => {
    const losses = trades.filter(t => t.profitLoss < 0)
    if (losses.length === 0) return 0
    return (losses.reduce((sum, t) => sum + t.profitLoss, 0) / losses.length).toFixed(2)
}

export const calculateNetProfitLoss = (trades) => {
    return trades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0).toFixed(2)
}

export const calculateLargestWin = (trades) => {
    const wins = trades.filter(t => t.profitLoss > 0)
    if (wins.length === 0) return 0
    return Math.max(...wins.map(t => t.profitLoss)).toFixed(2)
}

export const calculateLargestLoss = (trades) => {
    const losses = trades.filter(t => t.profitLoss < 0)
    if (losses.length === 0) return 0
    return Math.min(...losses.map(t => t.profitLoss)).toFixed(2)
}

// ==================== Expectancy ====================

export const calculateExpectancy = (trades) => {
    if (trades.length === 0) return 0

    const winRate = parseFloat(calculateWinRate(trades)) / 100
    const avgWin = parseFloat(calculateAverageWin(trades))
    const avgLoss = Math.abs(parseFloat(calculateAverageLoss(trades)))

    const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss)
    return expectancy.toFixed(2)
}

// ==================== Risk-Reward Ratio ====================

export const calculateRiskRewardRatio = (entry, stopLoss, takeProfit) => {
    const risk = Math.abs(entry - stopLoss)
    const reward = Math.abs(takeProfit - entry)

    if (risk === 0) return '0:0'
    const ratio = (reward / risk).toFixed(2)
    return `1:${ratio}`
}

// ==================== Position Size Calculator ====================

export const calculatePositionSize = (accountBalance, riskPercent, entry, stopLoss, pipValue = 10) => {
    const riskAmount = accountBalance * (riskPercent / 100)
    const stopLossPips = Math.abs(entry - stopLoss) * 10000 // Convert to pips

    if (stopLossPips === 0) return 0

    const positionSize = riskAmount / (stopLossPips * pipValue)
    return positionSize.toFixed(2)
}

// ==================== Drawdown ====================

export const calculateDrawdown = (trades) => {
    let peak = 0
    let maxDrawdown = 0
    let currentBalance = 0

    trades.forEach(trade => {
        currentBalance += parseFloat(trade.profitLoss) || 0

        if (currentBalance > peak) {
            peak = currentBalance
        }

        const drawdown = ((peak - currentBalance) / peak) * 100
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown
        }
    })

    return maxDrawdown.toFixed(2)
}

export const getCurrentDrawdown = (trades, startingBalance) => {
    const currentBalance = startingBalance + parseFloat(calculateNetProfitLoss(trades))
    const peak = trades.reduce((max, t, i) => {
        const balanceAtTrade = startingBalance + trades.slice(0, i + 1).reduce((sum, tr) => sum + parseFloat(tr.profitLoss), 0)
        return Math.max(max, balanceAtTrade)
    }, startingBalance)

    if (peak <= startingBalance) return 0

    const drawdown = ((peak - currentBalance) / peak) * 100
    return drawdown > 0 ? drawdown.toFixed(2) : '0.00'
}

// ==================== Performance by Category ====================

export const getPerformanceByStrategy = (trades) => {
    const strategies = {}

    trades.forEach(trade => {
        const strategy = trade.strategy || 'Unknown'
        if (!strategies[strategy]) {
            strategies[strategy] = {
                name: strategy,
                trades: 0,
                wins: 0,
                losses: 0,
                profitLoss: 0
            }
        }

        strategies[strategy].trades++
        strategies[strategy].profitLoss += parseFloat(trade.profitLoss) || 0

        if (trade.profitLoss > 0) strategies[strategy].wins++
        else if (trade.profitLoss < 0) strategies[strategy].losses++
    })

    return Object.values(strategies).map(s => ({
        ...s,
        winRate: s.trades > 0 ? ((s.wins / s.trades) * 100).toFixed(2) : '0.00',
        profitLoss: s.profitLoss.toFixed(2)
    }))
}

export const getPerformanceByPair = (trades) => {
    const pairs = {}

    trades.forEach(trade => {
        const pair = trade.pair || 'Unknown'
        if (!pairs[pair]) {
            pairs[pair] = {
                name: pair,
                trades: 0,
                wins: 0,
                losses: 0,
                profitLoss: 0
            }
        }

        pairs[pair].trades++
        pairs[pair].profitLoss += parseFloat(trade.profitLoss) || 0

        if (trade.profitLoss > 0) pairs[pair].wins++
        else if (trade.profitLoss < 0) pairs[pair].losses++
    })

    return Object.values(pairs).map(p => ({
        ...p,
        winRate: p.trades > 0 ? ((p.wins / p.trades) * 100).toFixed(2) : '0.00',
        profitLoss: p.profitLoss.toFixed(2)
    }))
}

export const getPerformanceBySession = (trades) => {
    const sessions = {
        'Asian (00:00-08:00)': { name: 'Asian', trades: 0, profitLoss: 0, wins: 0 },
        'London (08:00-16:00)': { name: 'London', trades: 0, profitLoss: 0, wins: 0 },
        'New York (16:00-24:00)': { name: 'New York', trades: 0, profitLoss: 0, wins: 0 }
    }

    trades.forEach(trade => {
        if (!trade.setupTime) return

        const hour = parseInt(trade.setupTime.split(':')[0])
        let session

        if (hour >= 0 && hour < 8) session = 'Asian (00:00-08:00)'
        else if (hour >= 8 && hour < 16) session = 'London (08:00-16:00)'
        else session = 'New York (16:00-24:00)'

        sessions[session].trades++
        sessions[session].profitLoss += parseFloat(trade.profitLoss) || 0
        if (trade.profitLoss > 0) sessions[session].wins++
    })

    return Object.values(sessions).map(s => ({
        ...s,
        winRate: s.trades > 0 ? ((s.wins / s.trades) * 100).toFixed(2) : '0.00',
        profitLoss: s.profitLoss.toFixed(2)
    }))
}

// ==================== Equity Curve Data ====================

export const getEquityCurveData = (trades, startingBalance) => {
    let balance = startingBalance

    return trades.map((trade, index) => {
        balance += parseFloat(trade.profitLoss) || 0
        return {
            date: trade.exitDate || trade.setupDate,
            balance: parseFloat(balance.toFixed(2)),
            trade: index + 1
        }
    })
}

// ==================== Mistake Analysis ====================

export const getMistakeFrequency = (trades) => {
    const mistakes = {}

    trades.forEach(trade => {
        if (trade.mistakes && Array.isArray(trade.mistakes)) {
            trade.mistakes.forEach(mistake => {
                mistakes[mistake] = (mistakes[mistake] || 0) + 1
            })
        }
    })

    return Object.entries(mistakes)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
}
