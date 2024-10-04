let money = 0;
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
let contractTimer = 300;
let contractsAvailable = 0;
let awards = [];
let baseContractTime = 300; // Starting timer for contracts
let messageQueue = [];
let isDisplayingMessage = false;
let currentContract = null;
let isContractActive = false;

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
            areaBox.innerText = 'Area ' + i;
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
        let earnings = 50 * crewCount; // Base earning per crew
        if (hasHedgeTrimmer) earnings += 75 * crewCount;
        if (hasStumpGrinder) earnings += 150 * crewCount;
        let bonus = (prestigeLevel * 25) + (areaLevel * 50);
        money += earnings + bonus;
        fuel -= 10 * crewCount; // Use fuel per crew
        if (fuel < 0) fuel = 0;
        updateStatus();
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
            displayMessage('Do you want to buy a Stump Grinder for £700?');
            // Implement purchase logic if desired
        }
        if (item === 'Hedge Trimmer') {
            displayMessage('Do you want to buy a Hedge Trimmer for £300?');
            // Implement purchase logic if desired
        }
        if (item === 'Climbing Gear') {
            displayMessage('Do you want to buy Climbing Gear for £500?');
            // Implement purchase logic if desired
        }
        if (item === 'Climber') {
            displayMessage('Do you want to hire a Climber for £800?');
            // Implement purchase logic if desired
        }
        if (item === 'Groundsman') {
            displayMessage('Do you want to hire a Groundsman for £600?');
            // Implement purchase logic if desired
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
    if (chainsawCount > climberCount + groundsmanCount) {
        climberCount = buyItem(800, climberCount, 'climberCount', 'You hired a climber!');
    } else {
        displayMessage('You need to buy a chainsaw for this staff member.');
    }
});

// Hire Groundsman
document.getElementById('hireGroundsman').addEventListener('click', function() {
    if (chainsawCount > climberCount + groundsmanCount) {
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

// Unlock Area
document.getElementById('unlockArea').addEventListener('click', function() {
    if (money >= 1000 && areaLevel < maxAreas) {
        money -= 1000;
        areaLevel += 1;
        updateStatus('You unlocked a new area!');
        displayMessage('You unlocked a new area!');
        checkForAwards();
    } else if (areaLevel >= maxAreas) {
        displayMessage('All areas are already unlocked.');
    } else {
        displayMessage('Not enough money to unlock a new area.');
    }
});

// Prestige
document.getElementById('prestige').addEventListener('click', function() {
    if (money >= 5000) {
        prestigeLevel += 1;
        money = 0;
        truckCount = 1;
        chipperCount = 1;
        chainsawCount = 1;
        hasClimbingGear = false;
        hasStumpGrinder = false;
        hasHedgeTrimmer = false;
        climberCount = 0;
        groundsmanCount = 0;
        fuel = 100;
        areaLevel = 1;
        updateStatus('Business restarted! Prestige Level: ' + prestigeLevel);
        displayMessage('Business restarted! You now earn more per job.');
        baseContractTime += 60; // Increase timer duration as player progresses
    } else {
        displayMessage('You need at least £5000 to prestige.');
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
            reward: 700,
            fuelCost: 40,
            requiredEquipment: 'Chainsaw',
            requiresClimbingGear: true,
            requiresClimber: true,
            requiresGroundsman: true
        },
        {
            description: 'Crown Reduction of Beech Tree',
            reward: 500,
            fuelCost: 25,
            requiredEquipment: 'Chainsaw',
            requiresClimbingGear: true,
            requiresClimber: true,
            requiresGroundsman: true
        },
        {
            description: 'Stump Grinding',
            reward: 300,
            fuelCost: 20,
            requiredEquipment: 'Stump Grinder',
            requiresClimbingGear: false,
            requiresClimber: false,
            requiresGroundsman: true
        },
        {
            description: 'Hedge Cutting',
            reward: 250,
            fuelCost: 15,
            requiredEquipment: 'Hedge Trimmer',
            requiresClimbingGear: false,
            requiresClimber: false,
            requiresGroundsman: true
        },
        {
            description: 'Sycamore Tree Pruning',
            reward: 600,
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
        return 'Tip: Do you need climbing gear for this job?';
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
        displayMessage('Congratulations! You earned the Regional Arborist Award for unlocking 3 areas!');
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
        document.getElementById('bossChallengeInfo').innerText = 'Next boss challenge unlocks when you reach 3 areas unlocked!';
    }
}

// Initial status update
updateStatus();
