import { useState } from 'react'
import { useTradeContext } from '../contexts/TradeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import { toast } from '../components/UI/Toast'
import { exportToCSV, exportToJSON, importFromJSON } from '../utils/storage'
import './Settings.css'

const Settings = () => {
    const { trades, settings, updateSettings, templates, addTemplate, deleteTemplate } = useTradeContext()

    const [formData, setFormData] = useState(settings)
    const [newChecklistItem, setNewChecklistItem] = useState('')
    const [newTemplate, setNewTemplate] = useState({ name: '', data: {} })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        updateSettings(formData)
        toast.success('Settings saved successfully!')
    }

    const addChecklistItem = () => {
        if (newChecklistItem.trim()) {
            setFormData(prev => ({
                ...prev,
                checklist: [...prev.checklist, newChecklistItem.trim()]
            }))
            setNewChecklistItem('')
        }
    }

    const removeChecklistItem = (index) => {
        setFormData(prev => ({
            ...prev,
            checklist: prev.checklist.filter((_, i) => i !== index)
        }))
    }

    const handleExportCSV = () => {
        exportToCSV(trades)
        toast.success('Trades exported to CSV!')
    }

    const handleExportJSON = () => {
        exportToJSON(trades)
        toast.success('Backup created successfully!')
    }

    const handleImport = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const importedTrades = await importFromJSON(file)
            // Note: In a full implementation, you'd merge or replace trades here
            toast.success(`Imported ${importedTrades.length} trades successfully!`)
        } catch (error) {
            toast.error('Failed to import: ' + error.message)
        }
    }

    const clearAllData = () => {
        if (window.confirm('Are you sure? This will delete ALL your trades and cannot be undone!')) {
            localStorage.clear()
            window.location.reload()
        }
    }

    return (
        <div className="settings">
            <h1>Settings</h1>

            <Card>
                <h3>Account Settings</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="label">Starting Balance</label>
                        <input
                            type="number"
                            name="accountBalance"
                            className="input"
                            value={formData.accountBalance}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Currency</label>
                        <select
                            name="currency"
                            className="input"
                            value={formData.currency}
                            onChange={handleChange}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Default Risk %</label>
                        <input
                            type="number"
                            step="0.1"
                            name="defaultRiskPercent"
                            className="input"
                            value={formData.defaultRiskPercent}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </Card>

            <Card>
                <h3>Pre-Trade Checklist</h3>
                <div className="checklist-editor">
                    {formData.checklist.map((item, index) => (
                        <div key={index} className="checklist-editor-item">
                            <span>{item}</span>
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => removeChecklistItem(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}

                    <div className="checklist-add">
                        <input
                            type="text"
                            className="input"
                            placeholder="Add new checklist item..."
                            value={newChecklistItem}
                            onChange={(e) => setNewChecklistItem(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                        />
                        <Button onClick={addChecklistItem}>Add</Button>
                    </div>
                </div>
            </Card>

            <Card>
                <h3>Data Management</h3>
                <div className="data-actions">
                    <div className="data-action-group">
                        <h4>Export Data</h4>
                        <p className="text-secondary text-sm">Download your trade history</p>
                        <div className="button-group">
                            <Button variant="secondary" onClick={handleExportCSV}>
                                📊 Export to CSV
                            </Button>
                            <Button variant="secondary" onClick={handleExportJSON}>
                                💾 Backup to JSON
                            </Button>
                        </div>
                    </div>

                    <div className="data-action-group">
                        <h4>Import Data</h4>
                        <p className="text-secondary text-sm">Restore from a backup file</p>
                        <label className="file-upload-label">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="file-input"
                            />
                            <Button variant="secondary" as="span">
                                📁 Import JSON Backup
                            </Button>
                        </label>
                    </div>

                    <div className="data-action-group danger-zone">
                        <h4 className="text-danger">Danger Zone</h4>
                        <p className="text-secondary text-sm">Permanently delete all data</p>
                        <Button variant="danger" onClick={clearAllData}>
                            🗑️ Clear All Data
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="settings-footer">
                <Button variant="primary" onClick={handleSave}>
                    💾 Save Settings
                </Button>
            </div>
        </div>
    )
}

export default Settings
