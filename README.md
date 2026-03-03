# Torn City Advanced Dashboard

A comprehensive dashboard for Torn City players with betting analysis and player statistics.

## Features

- 📊 Real-time player statistics display
- 🎯 Mission tracking
- 🏅 Medal and merit counting
- 📈 Battle statistics
- 🎓 Education tracking
- 🎲 High-level low-stats player finder
- 💰 Betting odds calculator

## Setup

1. Get your Torn API key from [Torn City](https://www.torn.com/preferences.php#tab=api)
2. Enter your API key in the dashboard
3. Start exploring your Torn data!

## API Endpoints

The backend provides several endpoints:
- `/api/player/<id>` - Get player data
- `/api/targets` - Find potential betting targets
- `/api/bet/calculate` - Calculate betting odds
- `/api/leaderboard` - Get leaderboard data

## Deployment

### Frontend (GitHub Pages)
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Your site will be live at `https://[username].github.io/torn-dashboard`

### Backend (PythonAnywhere)
1. Upload Python files to PythonAnywhere
2. Set up a web app with Flask
3. Update API endpoints in JavaScript

## Security Note

Your API key is stored locally in your browser and is never sent to our servers. All API requests are made directly to Torn's API.

## License

MIT License