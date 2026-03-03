// Store API key
let apiKey = '';

// Main connect function
async function connectAPI() {
    apiKey = document.getElementById('apiKey').value.trim();
    
    if (!apiKey) {
        alert('Please enter your Torn API key');
        return;
    }

    // Save to localStorage
    localStorage.setItem('torn_api_key', apiKey);
    
    // Show loading overlay
    showLoading();
    
    try {
        // Fetch player data
        await loadPlayerData();
        
        // Hide API section and show dashboard
        document.querySelector('.api-section').style.display = 'none';
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Load targets
        await loadTargets();
        
        // Auto-refresh every 5 minutes
        setInterval(refreshData, 300000);
    } catch (error) {
        console.error('Error connecting to Torn API:', error);
        alert('Failed to connect to Torn API. Please check your API key.');
    } finally {
        hideLoading();
    }
}

// Load player data from Torn API
async function loadPlayerData() {
    try {
        // Fetch player basic info
        const basicResponse = await fetch(`https://api.torn.com/user/?selections=basic&key=${apiKey}`);
        const basicData = await basicResponse.json();
        
        // Fetch battle stats
        const battleResponse = await fetch(`https://api.torn.com/user/?selections=battlestats&key=${apiKey}`);
        const battleData = await battleResponse.json();
        
        // Fetch medals
        const medalsResponse = await fetch(`https://api.torn.com/user/?selections=medals&key=${apiKey}`);
        const medalsData = await medalsResponse.json();
        
        // Fetch merits
        const meritsResponse = await fetch(`https://api.torn.com/user/?selections=merits&key=${apiKey}`);
        const meritsData = await meritsResponse.json();
        
        // Fetch education
        const educationResponse = await fetch(`https://api.torn.com/user/?selections=education&key=${apiKey}`);
        const educationData = await educationResponse.json();
        
        // Update UI with fetched data
        updatePlayerInfo(basicData);
        updateBattleStats(battleData);
        updateMedalsAndMerits(medalsData, meritsData);
        updateEducation(educationData);
        
        // Calculate missions left (example - you may need to adjust based on actual game mechanics)
        calculateMissionsLeft(basicData);
        
    } catch (error) {
        console.error('Error loading player data:', error);
        throw error;
    }
}

// Update player basic info
function updatePlayerInfo(data) {
    document.getElementById('playerLevel').textContent = data.level || '-';
    
    // Update stat bars
    if (data.strength) {
        const total = data.strength + data.defense + data.speed + data.dexterity;
        
        document.getElementById('strengthVal').textContent = formatNumber(data.strength);
        document.getElementById('defenseVal').textContent = formatNumber(data.defense);
        document.getElementById('speedVal').textContent = formatNumber(data.speed);
        document.getElementById('dexterityVal').textContent = formatNumber(data.dexterity);
        document.getElementById('totalVal').textContent = formatNumber(total);
        
        // Set progress bar widths (relative to total)
        document.getElementById('strengthBar').style.width = (data.strength / total * 100) + '%';
        document.getElementById('defenseBar').style.width = (data.defense / total * 100) + '%';
        document.getElementById('speedBar').style.width = (data.speed / total * 100) + '%';
        document.getElementById('dexterityBar').style.width = (data.dexterity / total * 100) + '%';
        document.getElementById('totalBar').style.width = '100%';
    }
}

// Update battle stats
function updateBattleStats(data) {
    document.getElementById('attacksWon').textContent = formatNumber(data.attacks_won || 0);
    document.getElementById('attacksLost').textContent = formatNumber(data.attacks_lost || 0);
    document.getElementById('defendsWon').textContent = formatNumber(data.defends_won || 0);
    document.getElementById('defendsLost').textContent = formatNumber(data.defends_lost || 0);
    document.getElementById('bestKillStreak').textContent = formatNumber(data.best_streak || 0);
}

// Update medals and merits
function updateMedalsAndMerits(medalsData, meritsData) {
    // Count medals
    const medalCount = medalsData.medals ? Object.keys(medalsData.medals).length : 0;
    document.getElementById('medalsCount').textContent = medalCount;
    
    // Count merits
    const meritCount = meritsData.merits ? Object.keys(meritsData.merits).length : 0;
    document.getElementById('meritsCount').textContent = meritCount;
}

// Calculate missions left (custom logic based on your needs)
function calculateMissionsLeft(data) {
    // This is a placeholder - you'll need to implement actual mission tracking
    // based on Torn's mission system
    const missionsCompleted = data.missions_completed || 0;
    const totalMissions = 100; // Example total
    const missionsLeft = Math.max(0, totalMissions - missionsCompleted);
    
    document.getElementById('missionsLeft').textContent = missionsLeft;
}

// Update education
function updateEducation(data) {
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';
    
    if (data.education_completed) {
        data.education_completed.forEach(course => {
            const item = document.createElement('div');
            item.className = 'education-item completed';
            item.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success);"></i> ${course.name}`;
            educationList.appendChild(item);
        });
    }
    
    if (data.education_current) {
        const item = document.createElement('div');
        item.className = 'education-item in-progress';
        item.innerHTML = `<i class="fas fa-spinner fa-spin" style="color: var(--warning);"></i> ${data.education_current.name} (${data.education_current.time_left})`;
        educationList.appendChild(item);
    }
}

// Load potential targets (high level, low stats)
async function loadTargets() {
    const minLevel = document.getElementById('minLevel').value;
    const maxStats = document.getElementById('maxStats').value;
    
    try {
        // You'll need to implement a backend API for this
        // For now, we'll use mock data
        const mockTargets = [
            { id: 1, name: 'Player1', level: 25, totalStats: 500000, defense: 150000, strength: 150000, speed: 100000, dexterity: 100000 },
            { id: 2, name: 'Player2', level: 30, totalStats: 750000, defense: 200000, strength: 200000, speed: 175000, dexterity: 175000 },
            { id: 3, name: 'Player3', level: 22, totalStats: 300000, defense: 80000, strength: 80000, speed: 70000, dexterity: 70000 },
        ];
        
        displayTargets(mockTargets);
        
    } catch (error) {
        console.error('Error loading targets:', error);
        document.getElementById('targetsList').innerHTML = '<p class="loading">Error loading targets</p>';
    }
}

// Display targets
function displayTargets(targets) {
    const targetsList = document.getElementById('targetsList');
    targetsList.innerHTML = '';
    
    if (targets.length === 0) {
        targetsList.innerHTML = '<p class="loading">No targets found</p>';
        return;
    }
    
    targets.forEach(target => {
        const card = document.createElement('div');
        card.className = 'target-card';
        card.innerHTML = `
            <h4>${target.name}</h4>
            <div class="target-stats">
                <span>Level:</span> <strong>${target.level}</strong>
                <span>Total Stats:</span> <strong>${formatNumber(target.totalStats)}</strong>
                <span>Strength:</span> <strong>${formatNumber(target.strength)}</strong>
                <span>Defense:</span> <strong>${formatNumber(target.defense)}</strong>
                <span>Speed:</span> <strong>${formatNumber(target.speed)}</strong>
                <span>Dexterity:</span> <strong>${formatNumber(target.dexterity)}</strong>
            </div>
            <button onclick="betOnPlayer(${target.id})" class="bet-button">
                <i class="fas fa-dice"></i> Bet on this player
            </button>
        `;
        targetsList.appendChild(card);
    });
}

// Bet on player function
function betOnPlayer(playerId) {
    alert(`Betting feature for player ${playerId} - Coming soon!`);
    // Implement actual betting logic here
}

// Refresh targets
function refreshTargets() {
    showLoading();
    loadTargets().finally(hideLoading);
}

// Refresh all data
async function refreshData() {
    if (apiKey) {
        showLoading();
        try {
            await loadPlayerData();
            await loadTargets();
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            hideLoading();
        }
    }
}

// Helper function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Loading overlay functions
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Check for saved API key on load
window.addEventListener('load', () => {
    const savedKey = localStorage.getItem('torn_api_key');
    if (savedKey) {
        document.getElementById('apiKey').value = savedKey;
        connectAPI();
    }
});