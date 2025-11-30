// Storage utility functions for localStorage and IndexedDB

const TRADES_KEY = 'tradeflow_trades'
const IMAGES_DB = 'TradeFlowDB'
const IMAGES_STORE = 'images'

// ==================== LocalStorage for Trade Data ====================

export const saveTrades = (trades) => {
    try {
        localStorage.setItem(TRADES_KEY, JSON.stringify(trades))
        return true
    } catch (error) {
        console.error('Error saving trades:', error)
        return false
    }
}

export const loadTrades = () => {
    try {
        const data = localStorage.getItem(TRADES_KEY)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Error loading trades:', error)
        return []
    }
}

// ==================== IndexedDB for Images ====================

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(IMAGES_DB, 1)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            if (!db.objectStoreNames.contains(IMAGES_STORE)) {
                db.createObjectStore(IMAGES_STORE, { keyPath: 'id' })
            }
        }
    })
}

export const saveImage = async (id, imageData) => {
    try {
        const db = await openDB()
        const transaction = db.transaction([IMAGES_STORE], 'readwrite')
        const store = transaction.objectStore(IMAGES_STORE)

        await store.put({ id, data: imageData })
        return true
    } catch (error) {
        console.error('Error saving image:', error)
        return false
    }
}

export const loadImage = async (id) => {
    try {
        const db = await openDB()
        const transaction = db.transaction([IMAGES_STORE], 'readonly')
        const store = transaction.objectStore(IMAGES_STORE)

        return new Promise((resolve, reject) => {
            const request = store.get(id)
            request.onsuccess = () => resolve(request.result?.data || null)
            request.onerror = () => reject(request.error)
        })
    } catch (error) {
        console.error('Error loading image:', error)
        return null
    }
}

export const deleteImage = async (id) => {
    try {
        const db = await openDB()
        const transaction = db.transaction([IMAGES_STORE], 'readwrite')
        const store = transaction.objectStore(IMAGES_STORE)

        await store.delete(id)
        return true
    } catch (error) {
        console.error('Error deleting image:', error)
        return false
    }
}

// ==================== Export/Import Functions ====================

export const exportToCSV = (trades) => {
    const headers = [
        'Date', 'Time', 'Pair', 'Direction', 'Strategy', 'Entry', 'Exit',
        'Stop Loss', 'Take Profit', 'Position Size', 'Risk %', 'R:R',
        'Pips', 'P&L', 'Commission', 'Emotion Entry', 'Emotion Exit',
        'Grade', 'Mistakes', 'Notes'
    ]

    const rows = trades.map(t => [
        t.setupDate,
        t.setupTime,
        t.pair,
        t.direction,
        t.strategy,
        t.entryPrice,
        t.exitPrice,
        t.stopLoss,
        t.takeProfit,
        t.positionSize,
        t.riskPercent,
        t.riskRewardRatio,
        t.pips,
        t.profitLoss,
        t.commission,
        t.emotionEntry,
        t.emotionExit,
        t.grade,
        (t.mistakes || []).join('; '),
        t.notes
    ])

    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell || ''}"`).join(','))
        .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tradeflow_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

export const exportToJSON = (trades) => {
    const json = JSON.stringify(trades, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tradeflow_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
}

export const importFromJSON = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const trades = JSON.parse(e.target.result)
                resolve(trades)
            } catch (error) {
                reject(new Error('Invalid JSON file'))
            }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
    })
}
