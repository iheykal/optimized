# TradeFlow - Forex Trade Journal

![TradeFlow](./public/icon.svg)

A comprehensive, analytics-driven forex trade journal that transforms raw trading data into actionable insights for systematic trader improvement.

## 🚀 Quick Start

```bash
# Navigate to the project
cd "c:\Users\ILYAAS ABDIRAHMAN\Desktop\journal"

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will automatically open at `http://localhost:3000`

---

## ✨ Features

### 📝 **Comprehensive Trade Logging**
- Log all 25 data points per trade
- Pre-trade checklist (customizable)
- Real-time R:R ratio calculator
- Emotional state tracking
- Mistake tagging system
- Trade grading (A-F scale)

### 📊 **Advanced Analytics**
- Equity curve visualization
- Win/Loss distribution charts
- Performance by strategy
- Performance by currency pair
- Trading session analysis
- Most common mistakes tracker

### 📈 **Performance Metrics**
- Win Rate percentage
- Profit Factor
- Expectancy (per trade)
- Average Win vs Average Loss
- Net P&L tracking
- Drawdown monitoring

### 🔍 **Trade History**
- Advanced filtering (pair, strategy, outcome, dates)
- Searchable table view
- Detailed trade modal
- Delete trades functionality

### ⚙️ **Settings & Data**
- Account configuration
- Checklist editor
- Export to CSV (Excel compatible)
- Backup to JSON
- Import/Restore from JSON
- Clear all data option

### 🎨 **Premium UI/UX**
- Modern glassmorphism design
- Smooth animations
- Fully responsive (mobile, tablet, desktop)
- Toast notifications
- Dark theme optimized
- Inter font typography

---

## 📊 Data Points Captured

### Pre-Trade (6)
1. Setup Date & Time
2. Currency Pair
3. Direction (Long/Short)
4. Strategy/Setup
5. Entry Reason
6. Pre-trade Emotion

### Execution (7)
7. Entry Price
8. Stop Loss
9. Take Profit
10. Position Size
11. Risk Percentage
12. R:R Ratio (auto-calculated)
13. Entry Emotion

### Post-Trade (6)
14. Exit Date & Time
15. Exit Price
16. Pips Gained/Lost
17. Profit/Loss (monetary)
18. Commission/Swap
19. Exit Emotion

### Psychology (6)
20. Trade Grade (A-F)
21. Mistakes Made (tags)
22. What Went Well
23. Notes & Lessons
24. Positive Actions
25. Created Timestamp

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **React Router 6** - Navigation
- **Recharts** - Data visualization
- **Vanilla CSS** - Styling
- **LocalStorage** - Data persistence

---

## 📱 Screenshots

### Dashboard
![Dashboard](./docs/dashboard.png)

### Trade Entry
![Trade Entry](./docs/new-trade.png)

### Analytics
![Analytics](./docs/analytics.png)

---

## 🧮 Calculation Formulas

```javascript
Win Rate = (Winning Trades / Total Trades) × 100

Profit Factor = Gross Profit / Gross Loss

Expectancy = (Win Rate × Avg Win) - (Loss Rate × Avg Loss)

R:R Ratio = (Take Profit - Entry) / (Entry - Stop Loss)

Drawdown = ((Peak - Current) / Peak) × 100
```

---

## 📦 Project Structure

```
journal/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # Global state management
│   ├── pages/            # Application pages
│   ├── utils/            # Utility functions
│   └── index.css         # Design system
├── public/               # Static assets
└── package.json
```

---

## 🔒 Privacy & Data

- ✅ All data stays **on your device**
- ✅ No backend servers
- ✅ No tracking or analytics
- ✅ Export your data anytime
- ✅ Full control over your information

---

## 🎯 Usage Tips

1. **Complete the Checklist** - Always fill out the pre-trade checklist before logging
2. **Be Honest** - Accurate emotional and mistake tracking reveals patterns
3. **Review Regularly** - Check analytics weekly to identify improvements
4. **Grade Yourself** - Focus on execution quality, not just P&L
5. **Export Often** - Regular backups protect your trading history

---

## 🔮 Future Enhancements

Optional features that can be added:

- [ ] Image/Chart upload
- [ ] Voice notes recording
- [ ] Position size calculator tool
- [ ] Visual drawdown monitor
- [ ] Dark/Light theme toggle
- [ ] Trade template system
- [ ] Onboarding tutorial
- [ ] Cloud sync option

---

## 🐛 Troubleshooting

### Data not saving?
- Check browser localStorage is enabled
- Clear cache and reload
- Export data before clearing

### Charts not showing?
- Ensure you have logged trades
- Check date filters in analytics
- Refresh the page

### App not loading?
```bash
# Reinstall dependencies
npm ci

# Clear cache
npm cache clean --force

# Reinstall
npm install
```

---

## 📄 License

This project is created for personal use. Feel free to modify and enhance!

---

## 🙏 Acknowledgments

Built with modern web technologies to empower forex traders with data-driven insights.

**Happy Trading! 📈💰**
