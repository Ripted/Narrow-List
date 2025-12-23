// Configuration file for Narrow Arrow Rankings

// Level IDs - ordered from HARDEST to EASIEST
// Top 1 = Hardest level, Top 2 = Second hardest, etc.
const LEVEL_IDS = [
    '1743661104278',  // Top 1 - Hardest
    // Add more level IDs here in order of difficulty
    // Example:
    // '1234567890123',  // Top 2
    // '9876543210987',  // Top 3
];

// Player profile pictures
// Add username: image_url pairs here
const PLAYER_AVATARS = {
    'Ripted': 'https://via.placeholder.com/120/6366f1/ffffff?text=R',
    'sqm': 'https://via.placeholder.com/120/8b5cf6/ffffff?text=S',
    'kiwi': 'https://via.placeholder.com/120/10b981/ffffff?text=K',
    'ImBen': 'https://via.placeholder.com/120/f59e0b/ffffff?text=IB',
    'DRally_Slave': 'https://via.placeholder.com/120/ef4444/ffffff?text=D',
    'Aqprox': 'https://via.placeholder.com/120/3b82f6/ffffff?text=A',
    'Ch4mpY': 'https://via.placeholder.com/120/ec4899/ffffff?text=C',
    // Add more players here:
    // 'PlayerName': 'https://example.com/image.png',
};

// API Configuration
const API_BASE = 'https://api.narrowarrow.xyz';

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