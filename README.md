# Focus Tracker for Obsidian

A minimal focus session tracker that lives inside Obsidian. Heatmap of the last 90 days, log sessions with a completion slider, no streaks pressure, no timers — just a visual record of what you did.

Data is stored in `focus-tracker-data.json` at your vault root.

## Install

### Manual

1. Open your vault's plugin folder: `YOUR_VAULT/.obsidian/plugins/`
2. Clone this repo into a folder named `focus-tracker`:

```bash
cd "YOUR_VAULT/.obsidian/plugins"
git clone https://github.com/Kunal1522/obsidian-focus-tracker.git focus-session-tracker
```

3. In Obsidian: **Settings → Community plugins → Turn on community plugins**
4. Click **Refresh**, then enable **Focus Tracker**

### Update

```bash
cd "YOUR_VAULT/.obsidian/plugins/focus-session-tracker"
git pull
```

Restart Obsidian if the plugin does not reload automatically.

## Use

- Click the **calendar-check** ribbon icon, or
- Command palette → **Open focus tracker**
- Click a heatmap day to view sessions
- **+ session** to log (date, label, duration, completion 80/90/100%)

## Data format

```json
{
  "2026-06-13": [
    { "id": "abc123", "label": "writing", "dur": 25, "pct": 100 }
  ]
}
```

- `dur` — planned duration in minutes
- `pct` — completion (80, 90, or 100). Heatmap uses effective time: `dur × pct / 100`

## Philosophy

No goals, no progress bars toward targets, no congratulatory messages. The heatmap color is the only nudge — see yesterday, match it if you want.

## License

MIT
