import { createContext, useContext, useState, useEffect } from 'react'
import { saveTrades, loadTrades } from '../utils/storage'

const TradeContext = createContext()

export const useTradeContext = () => {
    const context = useContext(TradeContext)
    if (!context) {
        throw new Error('useTradeContext must be used within TradeProvider')
    }
    return context
}

export const TradeProvider = ({ children }) => {
    const [trades, setTrades] = useState([])
    const [settings, setSettings] = useState({
        accountBalance: 10000,
        currency: 'USD',
        defaultRiskPercent: 2,
        theme: 'dark',
        checklist: [
            'Is the trend confirmed?',
            'Is risk less than 2%?',
            'Is there clear support/resistance?',
            'Is the R:R ratio at least 1:2?',
            'Am I emotionally stable?'
        ]
    })
    const [templates, setTemplates] = useState([])

    // Load data from localStorage on mount
    useEffect(() => {
        const loadedTrades = loadTrades()
        if (loadedTrades) setTrades(loadedTrades)

        const loadedSettings = localStorage.getItem('tradeflow_settings')
        if (loadedSettings) setSettings(JSON.parse(loadedSettings))

        const loadedTemplates = localStorage.getItem('tradeflow_templates')
        if (loadedTemplates) setTemplates(JSON.parse(loadedTemplates))
    }, [])

    // Save trades to localStorage whenever they change
    useEffect(() => {
        if (trades.length > 0) {
            saveTrades(trades)
        }
    }, [trades])

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('tradeflow_settings', JSON.stringify(settings))
    }, [settings])

    // Save templates to localStorage
    useEffect(() => {
        localStorage.setItem('tradeflow_templates', JSON.stringify(templates))
    }, [templates])

    const addTrade = (trade) => {
        const newTrade = {
            ...trade,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        }
        setTrades(prev => [newTrade, ...prev])
        return newTrade
    }

    const updateTrade = (id, updates) => {
        setTrades(prev => prev.map(trade =>
            trade.id === id ? { ...trade, ...updates } : trade
        ))
    }

    const deleteTrade = (id) => {
        setTrades(prev => prev.filter(trade => trade.id !== id))
    }

    const addTemplate = (template) => {
        const newTemplate = {
            ...template,
            id: Date.now().toString()
        }
        setTemplates(prev => [...prev, newTemplate])
    }

    const deleteTemplate = (id) => {
        setTemplates(prev => prev.filter(t => t.id !== id))
    }

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }))
    }

    const value = {
        trades,
        settings,
        templates,
        addTrade,
        updateTrade,
        deleteTrade,
        addTemplate,
        deleteTemplate,
        updateSettings
    }

    return (
        <TradeContext.Provider value={value}>
            {children}
        </TradeContext.Provider>
    )
}
