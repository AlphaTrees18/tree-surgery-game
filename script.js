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
let areaNames = ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Bristol']; // Area 1 is London
let contractTimer = 60; // Contract timer starts at 60 seconds
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
        let earnings = 200 * crewCount; // Base earning per crew increased for higher starting money
        if (hasHedgeTrimmer) earnings += 150 * crewCount;
        if (hasStumpGrinder) earnings += 300 * crewCount;
        let bonus = (areaLevel * 100);
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
            displayMessage('Tip: Consider buying a Stump Grinder for £1500.');
        }
        if (item === 'Hedge Trimmer') {
            displayMessage('Tip: Consider buying a Hedge Trimmer for £800.');
        }
        if (item === 'Climbing Gear') {
            displayMessage('Tip: Consider buying Climbing Gear for £1000.');
        }
        if (item === 'Climber') {
            displayMessage('Tip: Consider hiring a Climber for £1500.');
        }
        if (item === 'Groundsman') {
            displayMessage('Tip: Consider hiring a Groundsman for £1200.');
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
    chainsawCount = buyItem(500, chainsawCount, 'chainsawCount', 'You bought a chainsaw!');
});

// Buy Climbing Gear
document.getElementById('buyClimbingGear').addEventListener('click', function() {
    hasClimbingGear = buyItem(1000, hasClimbingGear, 'climbingGearStatus', 'You bought climbing gear!');
});

// Buy Hedge Trimmer
document.getElementById('buyHedgeTrimmer').addEventListener('click', function() {
    hasHedgeTrimmer = buyItem(800, hasHedgeTrimmer, 'hedgeTrimmerStatus', 'You bought a hedge trimmer!');
});

// Buy Stump Grinder
document.getElementById('buyStumpGrinder').addEventListener('click', function() {
    hasStumpGrinder = buyItem(1500, hasStumpGrinder, 'stumpGrinderStatus', 'You bought a stump grinder!');
});

// Buy Truck
document.getElementById('buyTruck').addEventListener('click', function() {
    truckCount = buyItem(2000, truckCount, 'truckCount', 'You bought a truck!');
});

// Hire Climber
document.getElementById('hireClimber').addEventListener('click', function() {
    if (chainsawCount >= climberCount + groundsmanCount + 1) {
        climberCount = buyItem(1500, climberCount, 'climberCount', 'You hired a climber!');
    } else {
        displayMessage('You need to buy a chainsaw for this staff member.');
    }
});

// Hire Groundsman
document.getElementById('hireGroundsman').addEventListener('click', function() {
    if (chainsawCount >= climberCount + groundsmanCount + 1) {
        groundsmanCount = buyItem(1200, groundsmanCount, 'groundsmanCount', 'You hired a groundsman!');
    } else {
        displayMessage('You need to buy a chainsaw for this staff member.');
    }
});

// Buy Fuel
document.getElementById('buyFuel').addEventListener('click', function() {
    if (money >= 100) {
        money -= 100;
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
    if (money >= 5000 && areaLevel < maxAreas) {
        if (truckCount >= 3 && chainsawCount >= 6 && staffCount >= 6) {
            money -= 5000;
            areaLevel += 1;
            updateStatus('You unlocked ' + areaNames[areaLevel - 1] + '!');
            displayMessage('Congratulations! You have expanded to ' + areaNames[areaLevel - 1] + '!');
            checkForAwards();
        } else {
            displayMessage('To unlock a new city, you need at least 3 trucks, 6 chainsaws, and 6 staff members.');
        }
    } else if (areaLevel >= maxAreas) {
        displayMessage('All cities are already unlocked.');
    } else {
        displayMessage('Not enough money to unlock a new city.');
    }
});

// Prestige
document.getElementById('prestige').addEventListener('click', function() {
    if (money >= 20000) {
        prestigeLevel += 1;
        money = 5000; // Reset money to starting balance
        fuel = 100;
        baseContractTime += 60; // Increase timer duration as player progresses
        updateStatus('Business restarted! Prestige Level: ' + prestigeLevel);
        displayMessage('You have prestiged! You now earn more per job and have access to new opportunities.');
        // Note: Equipment and staff are retained
    } else {
        displayMessage('You need at least £20,000 to prestige.');
    }
});

// Timer for contracts, adjusting over time
setInterval(function() {
    if (contractTimer > 0) {
        contractTimer--;
        document.getElementById('contractTimer').innerText = contractTimer;
    } else {
        contractsAvailable++;
        contractTimer = baseContractTime + (areaLevel * 10); // Increase timer with area level
        generateContract();
    }
}, 1000); // Countdown every second

// Function to generate a new contract
function generateContract() {
    const treeServices = [
        {
            description: 'Oak Tree Removal',
            reward: 1400,
            fuelCost: 40,
            requiredEquipment: 'Chainsaw',
            requiresClimbingGear: true,
            requiresClimber: true,
            requiresGroundsman: true
        },
        {
            description: 'Crown Reduction of Beech Tree',
            reward: 1000,
            fuelCost: 25,
            requiredEquipment: 'Chainsaw',
            requiresClimbingGear: true,
            requiresClimber: true,
            requiresGroundsman: true
        },
        {
            description: 'Stump Grinding',
            reward: 600,
            fuelCost: 20,
            requiredEquipment: 'Stump Grinder',
            requiresClimbingGear: false,
            requiresClimber: false,
            requiresGroundsman: true
        },
        {
            description: 'Hedge Cutting',
            reward: 500,
            fuelCost: 15,
            requiredEquipment: 'Hedge Trimmer',
            requiresClimbingGear: false,
            requiresClimber: false,
            requiresGroundsman: true
        },
        {
            description: 'Sycamore Tree Pruning',
            reward: 1200,
            fuelCost: 30,
            requiredEquipment: 'Chainsaw',
            requiresClimbingGear: true,
            requiresClimber: true,
            requiresGroundsman: true
        }
    ];
    currentContract = treeServices[Math.floor(Math.random() * treeServices.length)];
    document.getElementById('contractDetails').innerText = `Contract: ${currentContract.description} - Reward: £${currentContract.reward}, Fuel Cost: ${currentContract.fuelCost}%, Required Equipment: ${currentContract.requiredEquipment}`;
    document.getElementById('contracts').style.display = 'block';
    displayMessage('A new contract is available! ' + getJobTip(currentContract));
}

// Function to provide job-specific tips
function getJobTip(contract) {
    if (contract.requiredEquipment === 'Hedge Trimmer' && !hasHedgeTrimmer) {
        return 'Tip: Make sure you buy a hedge trimmer to complete hedge cutting jobs.';
    }
    if (contract.requiredEquipment === 'Stump Grinder' && !hasStumpGrinder) {
        return 'Tip: You need a stump grinder for stump grinding jobs.';
    }
    if (contract.requiresClimbingGear && !hasClimbingGear) {
        return 'Tip: You need climbing gear for this job.';
    }
    return '';
}

// Function to accept a contract
document.getElementById('acceptContractButton').addEventListener('click', function() {
    if (isContractActive) {
        displayMessage('You are already working on a contract!');
        return;
    }
    if (fuel < currentContract.fuelCost) {
        displayMessage('Not enough fuel to accept this contract.');
        return;
    }
    if (!hasRequiredEquipment(currentContract)) {
        return;
    }
    isContractActive = true;
    displayMessage('You accepted a contract: ' + currentContract.description);
});

// Function to update awards
function updateAwards() {
    document.getElementById('awardsList').innerText = awards.length > 0 ? awards.join(', ') : 'No awards earned yet.';
}

// Function to check for awards
function checkForAwards() {
    if (areaLevel === 3 && !awards.includes('Regional Arborist Award')) {
        awards.push('Regional Arborist Award');
        displayMessage('Congratulations! You earned the Regional Arborist Award for unlocking 3 cities!');
    }
    if (prestigeLevel === 1 && !awards.includes('Prestige Pioneer')) {
        awards.push('Prestige Pioneer');
        displayMessage('Congratulations! You earned the Prestige Pioneer award for your first prestige!');
    }
}

// Function to update boss challenge information
function updateBossChallenge() {
    if (areaLevel >= 3) {
        document.getElementById('bossChallengeInfo').innerText = 'You are ready for the boss challenge! Take on the Giant Oak in the central park!';
    } else {
        document.getElementById('bossChallengeInfo').innerText = 'Next boss challenge unlocks when you reach 3 cities unlocked!';
    }
}

// Initial status update
updateStatus();
