// Main application logic for Narrow Arrow Rankings

// Cache for API data
const cache = {
    levels: {},
    leaderboards: {},
    runs: {},
};

// Utility: Fetch with caching
async function fetchWithCache(url, cacheKey) {
    if (cache[cacheKey]) {
        return cache[cacheKey];
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        cache[cacheKey] = data;
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// Fetch level details
async function fetchLevelDetails(levelId) {
    const url = `${API_BASE}/level-details/${levelId}?isCustomLevel=true`;
    return fetchWithCache(url, `level_${levelId}`);
}

// Fetch leaderboard for a level
async function fetchLeaderboard(levelId) {
    const url = `${API_BASE}/leaderboard?levelId=${levelId}`;
    return fetchWithCache(url, `leaderboard_${levelId}`);
}

// Fetch run details
async function fetchRunDetails(runId) {
    const url = `${API_BASE}/runs/${runId}`;
    return fetchWithCache(url, `run_${runId}`);
}

// Format time in seconds to readable format
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return mins > 0 ? `${mins}:${secs.padStart(6, '0')}` : `${secs}s`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Get rank class for styling
function getRankClass(rank) {
    if (rank === 1) return 'top-1';
    if (rank === 2) return 'top-2';
    if (rank === 3) return 'top-3';
    return '';
}

// Calculate all player data
async function calculatePlayerData() {
    const playerData = {};
    
    for (let i = 0; i < LEVEL_IDS.length; i++) {
        const levelId = LEVEL_IDS[i];
        const levelRank = i + 1; // 1-based rank
        const leaderboard = await fetchLeaderboard(levelId);
        
        if (!leaderboard || !Array.isArray(leaderboard)) continue;
        
        for (const entry of leaderboard) {
            const username = entry.username;
            
            if (!playerData[username]) {
                playerData[username] = {
                    username,
                    totalPoints: 0,
                    completions: [],
                    hardestLevelRank: Infinity,
                };
            }
            
            const points = getPointsForRank(levelRank);
            playerData[username].totalPoints += points;
            
            // Fetch run details for date
            const runDetails = await fetchRunDetails(entry.run_id);
            
            playerData[username].completions.push({
                levelId,
                levelRank,
                points,
                time: entry.completion_time,
                date: runDetails?.finishedAt || null,
            });
            
            // Track hardest level
            if (levelRank < playerData[username].hardestLevelRank) {
                playerData[username].hardestLevelRank = levelRank;
            }
        }
    }
    
    return Object.values(playerData).sort((a, b) => b.totalPoints - a.totalPoints);
}

// ========== PAGE LOADERS ==========

// Load Levels Page (index.html)
async function loadLevelsPage() {
    const container = document.getElementById('levels-container');
    const loading = document.getElementById('loading');
    
    if (!container) return;
    
    loading.style.display = 'block';
    container.innerHTML = '';
    
    for (let i = 0; i < LEVEL_IDS.length; i++) {
        const levelId = LEVEL_IDS[i];
        const rank = i + 1;
        
        const levelDetails = await fetchLevelDetails(levelId);
        const leaderboard = await fetchLeaderboard(levelId);
        
        if (!levelDetails) continue;
        
        const completions = leaderboard ? leaderboard.length : 0;
        const points = getPointsForRank(rank);
        
        const card = document.createElement('div');
        card.className = 'level-card';
        card.onclick = () => window.location.href = `level.html?id=${levelId}`;
        
        card.innerHTML = `
            <div class="level-rank ${getRankClass(rank)}">Top ${rank}</div>
            <h3>${levelDetails.levelInfo.name || 'Unnamed Level'}</h3>
            <p class="level-meta">
                By ${levelDetails.levelInfo.author || 'Unknown'}
                <span class="separator">•</span>
                ${completions} completions
            </p>
            <div class="level-stats">
                <div class="stat">
                    <span class="stat-value">${points}</span>
                    <span class="stat-label">Points</span>
                </div>
                <div class="stat">
                    <span class="stat-value">#${rank}</span>
                    <span class="stat-label">Difficulty</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    }
    
    loading.style.display = 'none';
}

// Load Level Page (level.html)
async function loadLevelPage() {
    const params = new URLSearchParams(window.location.search);
    const levelId = params.get('id');
    
    const loading = document.getElementById('loading');
    const detailsSection = document.getElementById('level-details');
    
    if (!levelId || !loading || !detailsSection) return;
    
    loading.style.display = 'block';
    detailsSection.style.display = 'none';
    
    const levelDetails = await fetchLevelDetails(levelId);
    const leaderboard = await fetchLeaderboard(levelId);
    
    if (!levelDetails || !leaderboard) {
        loading.innerHTML = 'Failed to load level data.';
        return;
    }
    
    const rank = LEVEL_IDS.indexOf(levelId) + 1;
    const points = getPointsForRank(rank);
    
    // Set level header
    document.getElementById('level-rank').innerHTML = `Top ${rank}`;
    document.getElementById('level-rank').className = `level-rank-badge ${getRankClass(rank)}`;
    document.getElementById('level-name').textContent = levelDetails.levelInfo.name || 'Unnamed Level';
    document.getElementById('level-author').textContent = `By ${levelDetails.levelInfo.author || 'Unknown'}`;
    document.getElementById('level-completions').textContent = `${leaderboard.length} completions`;
    document.getElementById('level-points').textContent = `${points} points`;
    
    // Build leaderboard table
    const tableContainer = document.getElementById('leaderboard-table');
    tableContainer.className = 'leaderboard-table';
    
    for (let i = 0; i < leaderboard.length; i++) {
        const entry = leaderboard[i];
        const runDetails = await fetchRunDetails(entry.run_id);
        
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        
        const rankNum = i + 1;
        const rankClass = rankNum === 1 ? 'first' : rankNum === 2 ? 'second' : rankNum === 3 ? 'third' : '';
        
        row.innerHTML = `
            <div class="rank-number ${rankClass}">#${rankNum}</div>
            <img src="${getPlayerAvatar(entry.username)}" alt="${entry.username}" class="player-avatar">
            <a href="player.html?name=${encodeURIComponent(entry.username)}" class="player-link">
                <span class="player-name">${entry.username}</span>
            </a>
            <span class="completion-time">${formatTime(entry.completion_time)}</span>
            <span class="points-badge">${points} pts</span>
            <span class="completion-date">${runDetails?.finishedAt ? formatDate(runDetails.finishedAt) : 'N/A'}</span>
        `;
        
        tableContainer.appendChild(row);
    }
    
    loading.style.display = 'none';
    detailsSection.style.display = 'block';
}

// Load Player Page (player.html)
async function loadPlayerPage() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('name');
    
    const loading = document.getElementById('loading');
    const profileSection = document.getElementById('player-profile');
    
    if (!username || !loading || !profileSection) return;
    
    loading.style.display = 'block';
    profileSection.style.display = 'none';
    
    const allPlayerData = await calculatePlayerData();
    const playerData = allPlayerData.find(p => p.username === username);
    
    if (!playerData) {
        loading.innerHTML = 'Player not found.';
        return;
    }
    
    // Set player header
    document.getElementById('player-avatar').src = getPlayerAvatar(username);
    document.getElementById('player-avatar').alt = username;
    document.getElementById('player-name').textContent = username;
    document.getElementById('total-points').textContent = playerData.totalPoints;
    document.getElementById('completions-count').textContent = playerData.completions.length;
    document.getElementById('hardest-level').textContent = `Top ${playerData.hardestLevelRank}`;
    
    // Build completions list
    const completionsList = document.getElementById('completions-list');
    completionsList.innerHTML = '';
    
    // Sort completions by level difficulty
    const sortedCompletions = playerData.completions.sort((a, b) => a.levelRank - b.levelRank);
    
    for (const completion of sortedCompletions) {
        const levelDetails = await fetchLevelDetails(completion.levelId);
        
        const card = document.createElement('div');
        card.className = 'completion-card';
        
        card.innerHTML = `
            <div class="completion-info">
                <div class="completion-rank ${getRankClass(completion.levelRank)}">Top ${completion.levelRank}</div>
                <a href="level.html?id=${completion.levelId}" class="completion-link">
                    <div class="completion-details">
                        <h4>${levelDetails?.levelInfo.name || 'Unknown Level'}</h4>
                        <p>${formatTime(completion.time)} • ${completion.date ? formatDate(completion.date) : 'Date unknown'}</p>
                    </div>
                </a>
            </div>
            <div class="points-badge">${completion.points} pts</div>
        `;
        
        completionsList.appendChild(card);
    }
    
    loading.style.display = 'none';
    profileSection.style.display = 'block';
}

// Load Leaderboard Page (leaderboard.html)
async function loadLeaderboardPage() {
    const container = document.getElementById('leaderboard-container');
    const loading = document.getElementById('loading');
    
    if (!container) return;
    
    loading.style.display = 'block';
    container.innerHTML = '';
    
    const playerData = await calculatePlayerData();
    
    for (let i = 0; i < playerData.length; i++) {
        const player = playerData[i];
        const rank = i + 1;
        const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : '';
        
        // Get hardest level name
        const hardestLevelId = player.completions.find(c => c.levelRank === player.hardestLevelRank)?.levelId;
        const hardestLevel = hardestLevelId ? await fetchLevelDetails(hardestLevelId) : null;
        
        const row = document.createElement('div');
        row.className = `player-leaderboard-row ${rankClass}`;
        row.onclick = () => window.location.href = `player.html?name=${encodeURIComponent(player.username)}`;
        row.style.cursor = 'pointer';
        
        row.innerHTML = `
            <div class="rank-badge">#${rank}</div>
            <img src="${getPlayerAvatar(player.username)}" alt="${player.username}" class="player-avatar">
            <div>
                <div class="player-name">${player.username}</div>
                <div class="hardest-level-info">Hardest: ${hardestLevel?.levelInfo.name || `Top ${player.hardestLevelRank}`}</div>
            </div>
            <div class="stat">
                <span class="stat-value">${player.totalPoints}</span>
                <span class="stat-label">Points</span>
            </div>
            <div class="stat">
                <span class="stat-value">${player.completions.length}</span>
                <span class="stat-label">Completions</span>
            </div>
        `;
        
        container.appendChild(row);
    }
    
    loading.style.display = 'none';
}