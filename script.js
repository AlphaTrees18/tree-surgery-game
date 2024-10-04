let money = 500; // Starting balance increased to £500
let truckCount = 1;
let chipperCount = 1;
let chainsawCount = 1;
let hasClimbingGear = false;
let hasStumpGrinder = false;
let hasHedgeTrimmer = false;
let climberCount = 0;
let groundsmanCount = 0;
let fuel = 100;
let prestigeLevel = 0;
let areaLevel = 1;
let maxAreas = 5; // Maximum number of areas
let areaNames = ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Bristol'];
let contractTimer = 60; // Reduced contract timer
let contractsAvailable = 0;
let awards = [];
let baseContractTime = 60; // Starting timer for contracts
let messageQueue = [];
let isDisplayingMessage = false;
let currentContract = null;
let isContractActive = false;
let automateWorkInterval = null; // Store the interval ID for automated work

function displayMessage(message) {
    messageQueue.push(message);
    if (!isDisplayingMessage) {
        showNextMessage();
    }
}

function showNextMessage() {
    if (messageQueue.length > 0) {
        isDisplayingMessage = true;
        const messageText = document.getElementById('messageText');
        messageText.style.opacity = '0';
        setTimeout(() => {
            messageText.innerText = messageQueue.shift();
            messageText.style.opacity = '1';
        }, 500);
        setTimeout(() => {
            messageText.style.opacity = '0';
            setTimeout(() => {
                showNextMessage();
            }, 500);
        }, 5000);
    } else {
        isDisplayingMessage = false;
    }
}

// Update the status of the game
function updateStatus(extraMessage = '') {
    document.getElementById('status').innerText = 'You have £' + money + '. ' + extraMessage;
    document.getElementById('fuelStatus').innerText = 'Fuel: ' + fuel + '%';
    document.getElementById('truckCount').innerText = truckCount;
    document.getElementById('chipperCount').innerText = chipperCount;
    document.getElementById('chainsawCount').innerText = chainsawCount;
    document.getElementById('climbingGearStatus').innerText = hasClimbingGear ? 'Owned' : 'Not owned';
    document.getElementById('stumpGrinderStatus').innerText = hasStumpGrinder ? 'Owned' : 'Not owned';
    document.getElementById('hedgeTrimmerStatus').innerText = hasHedgeTrimmer ? 'Owned' : 'Not owned';
    document.getElementById('climberCount').innerText = climberCount;
    document.getElementById('groundsmanCount').innerText = groundsmanCount;
    document.getElementById('areaStatus').innerText = areaLevel;
    document.getElementById('prestigeStatus').innerText = prestigeLevel;
    updateAwards();
    updateBossChallenge();
    updateEmpire();
}

function updateEmpire() {
    const empireDiv = document.getElementById('empire');
    empireDiv.innerHTML = ''; // Clear existing area boxes
    for (let i = 1; i <= maxAreas; i++) {
        const areaBox = document.createElement('div');
        areaBox.classList.add('areaBox');
        if (i <= areaLevel) {
            areaBox.innerText = areaNames[i - 1];
        } else {
            areaBox.classList.add('locked');
            areaBox.innerText = 'Locked';
        }
        empireDiv.appendChild(areaBox);
    }
}

// Function to handle working
document.getElementById('workButton').addEventListener('click', function() {
    if (fuel <= 0) {
        displayMessage('No fuel! Buy more to continue working.');
        return;
    }
    if (isContractActive) {
        // Check if player has required equipment and staff
        if (!hasRequiredEquipment(currentContract)) {
            return;
        }
        // If a contract is active, earnings are increased
        let earnings = currentContract.reward;
        money += earnings;
        fuel -= currentContract.fuelCost;
        if (fuel < 0) fuel = 0;
        displayMessage('You completed a contract and earned £' + earnings + '!');
        isContractActive = false;
        currentContract = null;
        document.getElementById('contracts').style.display = 'none';
        updateStatus();
    } else {
        let crewCount = Math.min(truckCount, Math.floor(Math.min(climberCount, groundsmanCount) / 2));
        let availableChainsaws = chainsawCount - (climberCount + groundsmanCount);
        if (crewCount === 0 || availableChainsaws < 0) {
            displayMessage('You need more crews (trucks with climbers and groundsmen, each with chainsaws) to do jobs.');
            return;
        }
        let earnings = 100 * crewCount; // Base earning per crew increased for better progression
        if (hasHedgeTrimmer) earnings += 75 * crewCount;
        if (hasStumpGrinder) earnings += 150 * crewCount;
        let bonus = (prestigeLevel * 25) + (areaLevel * 50);
        money += earnings + bonus;
        fuel -= 10 * crewCount; // Use fuel per crew
        if (fuel < 0) fuel = 0;
        updateStatus();
        displayMessage('You earned £' + (earnings + bonus) + ' from doing a job.');
    }
});

// [Rest of the code remains the same as previously provided]

// Initial status update
updateStatus();
