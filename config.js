// Configuration file for Narrow Arrow Rankings

// Level IDs with optional thumbnails - ordered from HARDEST to EASIEST
// Top 1 = Hardest level, Top 2 = Second hardest, etc.
// Format: { id: 'level_id', thumb: 'thumbs/image.png' } or just 'level_id'
const LEVEL_IDS = [
    { id: '1743661104278', thumb: 'thumbs/towerofhell.png' },
    { id: '1750689536836', thumb: 'thumbs/samstowerofhell.png' },
];

// Player profile pictures
// Add username: image_url pairs here
const PLAYER_AVATARS = {
    'Ripted': 'https://cdn.discordapp.com/avatars/1243665459929157738/5ec86ea7ce0037e6da5fb97b094be41b.png?size=4096',
    'sqm': 'https://cdn.discordapp.com/avatars/1273388832326422739/03b589472663daef45c48fdbf417d489.png?size=4096',
    'kiwi': 'https://cdn.discordapp.com/avatars/1377664026602897470/da66e50a4050199bdc72fa70741f253f.png?size=4096',
    'ImBen': 'https://cdn.discordapp.com/avatars/1169981852799471660/3d1241305d832359d4724802cbe11a5e.png?size=4096',
    'DRally_Slave': 'https://cdn.discordapp.com/avatars/1202327373362761821/a_67b95eb1d7d5728a13d504f5847214cb.gif?size=4096',
    'Aqprox': 'https://cdn.discordapp.com/avatars/467941686979592192/6d2a77e10a297dfa632b3740055b34ea.png?size=4096',
    'Ch4mpY': 'https://cdn.discordapp.com/avatars/985798894099247115/d029614082425185bab52e65896679f1.png?size=4096',
};

// API Configuration - Using CORS proxy to fix cross-origin issues
const CORS_PROXY = 'https://corsproxy.io/?';
const API_BASE = CORS_PROXY + encodeURIComponent('https://api.narrowarrow.xyz');

// Points system based on level difficulty rank
const POINTS_SYSTEM = {
    1: 10,   // Top 1
    2: 8,    // Top 2
    3: 7,    // Top 3
    4: 6,    // Top 4
    5: 5,    // Top 5
    6: 4,    // Top 6-10
    7: 4,
    8: 4,
    9: 4,
    10: 4,
    11: 3,   // Top 11-25
    26: 2,   // Top 26-50
    51: 1,   // Top 51+
};

// Get points for a level rank
function getPointsForRank(rank) {
    if (rank <= 5) return POINTS_SYSTEM[rank];
    if (rank <= 10) return 4;
    if (rank <= 25) return 3;
    if (rank <= 50) return 2;
    return 1;
}

// Get default avatar
function getPlayerAvatar(username) {
    return PLAYER_AVATARS[username] || `https://via.placeholder.com/120/9ca3af/ffffff?text=${username.charAt(0).toUpperCase()}`;
}
