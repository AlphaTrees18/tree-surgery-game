let money = 5000; // Starting balance set to £5000
let truckCount = 1;
let chipperCount = 1;
let chainsawCount = 2; // Updated to 2 to match the starting staff
let hasClimbingGear = false;
let hasStumpGrinder = false;
let hasHedgeTrimmer = false;
let climberCount = 1; // Starting with 1 climber
let groundsmanCount = 1; // Starting with 1 groundsman
let fuel = 100;
let prestigeLevel = 0;
let areaLevel = 1;
let maxAreas = 5; // Maximum number of areas
let areaNames = ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Bristol'];
let contractTimer = 60; // Contract timer starts at 60 seconds
let currentContract = null;
let isContractActive = false;

function updateStatus(extraMessage = '') {
    document.getElementById('status').innerText = 'You have £' + money.toFixed(2) + '. ' + extraMessage;
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

document.getElementById('workButton').addEventListener('click', function() {
    if (fuel <= 0) {
        displayMessage('No fuel! Buy more to continue working.');
        return;
    }
    if (isContractActive) {
        // Process contract
        let earnings = currentContract.reward * (1 + prestigeLevel * 0.1);
        money += earnings;
        fuel -= currentContract.fuelCost;
        if (fuel < 0) fuel = 0;
        displayMessage('You completed a contract and earned £' + earnings.toFixed(2) + '!');
        isContractActive = false;
        currentContract = null;
        document.getElementById('contracts').style.display = 'none';
        updateStatus();
    } else {
        // Basic job
        let earnings = 500; // Base job earnings
        if (hasHedgeTrimmer) earnings += 150;
        if (hasStumpGrinder) earnings += 300;
        let bonus = areaLevel * 100;
        let prestigeBonus = earnings * (prestigeLevel * 0.1);
        money += earnings + bonus + prestigeBonus;
        fuel -= 10; // Fuel consumption per job
        if (fuel < 0) fuel = 0;
        updateStatus();
        displayMessage('You earned £' + (earnings + bonus + prestigeBonus).toFixed(2) + ' from doing a job.');
    }
});

function displayMessage(message) {
    const messageText = document.getElementById('messageText');
    messageText.style.opacity = '0';
    setTimeout(() => {
        messageText.innerText = message;
        messageText.style.opacity = '1';
    }, 500);
    setTimeout(() => {
        messageText.style.opacity = '0';
    }, 5000);
}

// Timer for contracts, correcting timer freezing
setInterval(function() {
    if (contractTimer > 0) {
        contractTimer--;
        document.getElementById('contractTimer').innerText = contractTimer;
    } else {
        generateContract();
        contractTimer = 60 + (areaLevel * 10); // Reset timer with increasing time for more cities
    }
}, 1000);

function generateContract() {
    const treeServices = [
        { description: 'Oak Tree Removal', reward: 1400, fuelCost: 40 },
        { description: 'Crown Reduction of Beech Tree', reward: 1000, fuelCost: 25 },
        { description: 'Stump Grinding', reward: 600, fuelCost: 20, requiredEquipment: 'Stump Grinder' },
        { description: 'Hedge Cutting', reward: 500, fuelCost: 15, requiredEquipment: 'Hedge Trimmer' },
        { description: 'Sycamore Tree Pruning', reward: 1200, fuelCost: 30 }
    ];
    currentContract = treeServices[Math.floor(Math.random() * treeServices.length)];
    document.getElementById('contractDetails').innerText = `Contract: ${currentContract.description} - Reward: £${currentContract.reward}, Fuel Cost: ${currentContract.fuelCost}%`;
    document.getElementById('contracts').style.display = 'block';
    displayMessage('A new contract is available!');
}

document.getElementById('acceptContractButton').addEventListener('click', function() {
    if (isContractActive) {
        displayMessage('You are already working on a contract!');
        return;
    }
    if (fuel < currentContract.fuelCost) {
        displayMessage('Not enough fuel to accept this contract.');
        return;
    }
    isContractActive = true;
    displayMessage('You accepted a contract: ' + currentContract.description);
});

// Initial status update
updateStatus();
