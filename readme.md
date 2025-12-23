# Narrow Arrow Rankings

A beautiful leaderboard tracker for Narrow Arrow game levels with player profiles and points system.

## 🚀 Quick Setup

1. **Create a new GitHub repository**
   - Go to GitHub and create a new repository
   - Name it whatever you want (e.g., `narrow-arrow-rankings`)

2. **Upload all files**
   - Upload these files to your repository:
     - `index.html`
     - `level.html`
     - `player.html`
     - `leaderboard.html`
     - `styles.css`
     - `config.js`
     - `app.js`
     - `README.md`

3. **Enable GitHub Pages**
   - Go to your repository Settings
   - Scroll down to "Pages" section
   - Under "Source", select "main" branch
   - Click Save
   - Your site will be live at: `https://yourusername.github.io/repository-name/`

## ⚙️ Configuration

Edit `config.js` to customize:

### 1. Add Your Level IDs

```javascript
const LEVEL_IDS = [
    '1743661104278',  // Top 1 - Hardest level
    '1234567890123',  // Top 2 - Second hardest
    '9876543210987',  // Top 3
    // Add more levels in order of difficulty
];
```

**Important:** Levels are ranked by their position in the array:
- First level = Top 1 (hardest) = 10 points
- Second level = Top 2 = 8 points
- Third level = Top 3 = 7 points
- And so on...

### 2. Add Player Profile Pictures

```javascript
const PLAYER_AVATARS = {
    'Ripted': 'https://example.com/ripted.png',
    'sqm': 'https://example.com/sqm.png',
    'kiwi': 'https://example.com/kiwi.jpg',
    // Add more players here
};
```

You can use:
- Direct image URLs
- Imgur links
- GitHub raw file URLs
- Any publicly accessible image URL

## 📊 Points System

Points are awarded based on the level's difficulty rank:

| Level Rank | Points |
|------------|--------|
| Top 1      | 10     |
| Top 2      | 8      |
| Top 3      | 7      |
| Top 4      | 6      |
| Top 5      | 5      |
| Top 6-10   | 4      |
| Top 11-25  | 3      |
| Top 26-50  | 2      |
| Top 51+    | 1      |

## 🎨 Features

- **Levels Page**: View all tracked levels ranked by difficulty
- **Level Details**: See complete leaderboard for each level
- **Player Profiles**: Track individual player achievements and points
- **Overall Leaderboard**: Rankings of all players by total points
- **Responsive Design**: Works perfectly on mobile and desktop
- **Automatic Updates**: Data fetched directly from Narrow Arrow API

## 🔧 How It Works

1. The site fetches data from the Narrow Arrow API:
   - Level details from `/level-details/{levelId}`
   - Leaderboards from `/leaderboard?levelId={levelId}`
   - Run details from `/runs/{runId}`

2. Points are calculated based on:
   - Which levels a player has completed
   - The difficulty rank of those levels (position in your array)

3. All data is cached during the session for fast loading

## 📝 Notes

- Level IDs can be found in the Narrow Arrow game or API
- The first level in your `LEVEL_IDS` array is considered the hardest
- Players are automatically tracked when they appear on leaderboards
- Profile pictures default to colored initials if not specified
- Data refreshes each time you load a page (no backend needed!)

## 🐛 Troubleshooting

**Nothing loads / blank page:**
- Check browser console for errors (F12)
- Verify your level IDs are correct
- Make sure all files are uploaded to GitHub

**Images not showing:**
- Verify image URLs are publicly accessible
- Try using direct image links (not preview pages)
- Check that URLs start with `https://`

**Wrong points calculation:**
- Verify levels are in correct order (hardest first)
- Check that level IDs match exactly

## 📱 Browser Support

Works on all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## 🎉 Enjoy!

Your Narrow Arrow rankings site is now live! Share the link with your community and start tracking those completions!