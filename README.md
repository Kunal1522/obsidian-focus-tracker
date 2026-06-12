# Calm Focus Log for Obsidian

A minimal focus session tracker that lives inside Obsidian. Heatmap of the last 90 days, log sessions with a completion slider, no streaks pressure, no timers — just a visual record of what you did.

Data is stored in `focus-tracker-data.json` at your vault root.

## Screenshots

![Calm Focus Log heatmap](https://raw.githubusercontent.com/Kunal1522/obsidian-focus-tracker/main/images/overview-1.png)

![Day sessions view](https://raw.githubusercontent.com/Kunal1522/obsidian-focus-tracker/main/images/overview-2.png)

![Log session dialog](https://raw.githubusercontent.com/Kunal1522/obsidian-focus-tracker/main/images/overview-3.png)

## Install

### Manual

1. Open your vault's plugin folder: `YOUR_VAULT/.obsidian/plugins/`
2. Clone this repo:

```bash
cd "YOUR_VAULT/.obsidian/plugins"
git clone https://github.com/Kunal1522/obsidian-focus-tracker.git calm-focus-log
```

3. In Obsidian: **Settings → Community plugins → Turn on community plugins**
4. Click **Refresh**, then enable **Calm Focus Log**

### Update

```bash
cd "YOUR_VAULT/.obsidian/plugins/calm-focus-log"
git pull
```

## Use

- Click the **calendar-check** ribbon icon, or
- Command palette → **Open calm focus log**
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

## License

MIT
