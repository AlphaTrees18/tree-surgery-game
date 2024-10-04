let money = 500; // Starting balance set to £500
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
let areaNames = ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Bristol']; // Area 1 is London
let contractTimer = 60; // Contract timer set to 60 seconds
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
        let earnings = currentContract.reward * (1 + prestigeLevel * 0.1); // Increase earnings based on prestige
        money += earnings;
        fuel -= currentContract.fuelCost;
        if (fuel < 0) fuel = 0;
        displayMessage('You completed a contract and earned £' + earnings.toFixed(2) + '!');
        isContractActive = false;
        currentContract = null;
        document.getElementById('contracts').style.display = 'none';
        updateStatus();
    } else {
        let staffAvailable = climberCount + groundsmanCount;
        let crewCount = Math.min(truckCount, Math.floor(staffAvailable / 2));
        let availableChainsaws = chainsawCount - (climberCount + groundsmanCount);
        if (crewCount === 0 || availableChainsaws < 0) {
            displayMessage('You need more crews (trucks with staff, each with chainsaws) to do jobs.');
            return;
        }
        let earnings = 100 * crewCount; // Base earning per crew
        if (hasHedgeTrimmer) earnings += 75 * crewCount;
        if (hasStumpGrinder) earnings += 150 * crewCount;
        let bonus = (areaLevel * 50);
        let prestigeBonus = earnings * (prestigeLevel * 0.1); // Prestige bonus
        money += earnings + bonus + prestigeBonus;
        fuel -= 10 * crewCount; // Use fuel per crew
        if (fuel < 0) fuel = 0;
        updateStatus();
        displayMessage('You earned £' + (earnings + bonus + prestigeBonus).toFixed(2) + ' from doing a job.');
    }
});

// Function to check if player has required equipment and staff
function hasRequiredEquipment(contract) {
    let missingEquipment = [];
    if (contract.requiredEquipment === 'Stump Grinder' && !hasStumpGrinder) {
        missingEquipment.push('Stump Grinder');
    }
    if (contract.requiredEquipment === 'Hedge Trimmer' && !hasHedgeTrimmer) {
        missingEquipment.push('Hedge Trimmer');
    }
    if (contract.requiresClimbingGear && !hasClimbingGear) {
        missingEquipment.push('Climbing Gear');
    }
    if (contract.requiresClimber && climberCount === 0) {
        missingEquipment.push('Climber');
    }
    if (contract.requiresGroundsman && groundsmanCount === 0) {
        missingEquipment.push('Groundsman');
    }
    if (missingEquipment.length > 0) {
        displayMessage('You need the following to complete this contract: ' + missingEquipment.join(', '));
        offerToBuyEquipment(missingEquipment);
        return false;
    }
    return true;
}

// Function to offer to buy missing equipment
function offerToBuyEquipment(equipmentList) {
    equipmentList.forEach(item => {
        if (item === 'Stump Grinder') {
            displayMessage('Tip: Consider buying a Stump Grinder for £700.');
        }
        if (item === 'Hedge Trimmer') {
            displayMessage('Tip: Consider buying a Hedge Trimmer for £300.');
        }
        if (item === 'Climbing Gear') {
            displayMessage('Tip: Consider buying Climbing Gear for £500.');
        }
        if (item === 'Climber') {
            displayMessage('Tip: Consider hiring a Climber for £800.');
        }
        if (item === 'Groundsman') {
            displayMessage('Tip: Consider hiring a Groundsman for £600.');
        }
    });
}

// Function to handle buying items
function buyItem(cost, itemVariable, statusElementId, successMessage) {
    if (money >= cost) {
        money -= cost;
        if (typeof itemVariable === 'number') {
            itemVariable += 1;
            document.getElementById(statusElementId).innerText = itemVariable;
        } else {
            itemVariable = true;
            document.getElementById(statusElementId).innerText = 'Owned';
        }
        updateStatus(successMessage);
        displayMessage(successMessage);
        return itemVariable;
    } else {
        displayMessage('Not enough money to make this purchase.');
    }
    return itemVariable;
}

// Buy Chainsaw
document.getElementById('buyChainsaw').addEventListener('click', function() {
    chainsawCount = buyItem(200, chainsawCount, 'chainsawCount', 'You bought a chainsaw!');
});

// Buy Climbing Gear
document.getElementById('buyClimbingGear').addEventListener('click', function() {
    hasClimbingGear = buyItem(500, hasClimbingGear, 'climbingGearStatus', 'You bought climbing gear!');
});

// Buy Hedge Trimmer
document.getElementById('buyHedgeTrimmer').addEventListener('click', function() {
    hasHedgeTrimmer = buyItem(300, hasHedgeTrimmer, 'hedgeTrimmerStatus', 'You bought a hedge trimmer!');
});

// Buy Stump Grinder
document.getElementById('buyStumpGrinder').addEventListener('click', function() {
    hasStumpGrinder = buyItem(700, hasStumpGrinder, 'stumpGrinderStatus', 'You bought a stump grinder!');
});

// Buy Truck
document.getElementById('buyTruck').addEventListener('click', function() {
    truckCount = buyItem(1000, truckCount, 'truckCount', 'You bought a truck!');
});

// Hire Climber
document.getElementById('hireClimber').addEventListener('click', function() {
    if (chainsawCount >= climberCount + groundsmanCount + 1) {
        climberCount = buyItem(800, climberCount, 'climberCount', 'You hired a climber!');
    } else {
        displayMessage('You need to buy a chainsaw for this staff member.');
    }
});

// Hire Groundsman
document.getElementById('hireGroundsman').addEventListener('click', function() {
    if (chainsawCount >= climberCount + groundsmanCount + 1) {
        groundsmanCount = buyItem(600, groundsmanCount, 'groundsmanCount', 'You hired a groundsman!');
    } else {
        displayMessage('You need to buy a chainsaw for this staff member.');
    }
});

// Buy Fuel
document.getElementById('buyFuel').addEventListener('click', function() {
    if (money >= 50) {
        money -= 50;
        fuel = 100;
        updateStatus('You refueled your equipment.');
        displayMessage('You refueled your equipment.');
    } else {
        displayMessage('Not enough money to buy fuel.');
    }
});

// Unlock Area with new requirements
document.getElementById('unlockArea').addEventListener('click', function() {
    let staffCount = climberCount + groundsmanCount;
    if (money >= 2000 && areaLevel < maxAreas) {
    
