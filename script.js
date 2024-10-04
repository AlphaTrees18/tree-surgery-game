let money = 0;
let hasChainsaw = true;
let hasTruck = true;
let hasChipper = true;
let hasStumpGrinder = false;
let hasHedgeTrimmer = false;
let fuel = 100;
let prestigeLevel = 0;
let areaLevel = 1;
let staffHired = false;
let contractTimer = 300;
let contractsAvailable = 0;
let awards = [];
let baseContractTime = 300; // Starting timer for contracts
let messageQueue = [];
let isDisplayingMessage = false;
let currentContract = null;
let isContractActive = false;

// Function to display messages with queue
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
    document.getElementById('chainsawStatus').innerText = hasChainsaw ? 'Owned' : 'Not owned';
    document.getElementById('truckStatus').innerText = hasTruck ? 'Owned' : 'Not owned';
    document.getElementById('chipperStatus').innerText = hasChipper ? 'Owned' : 'Not owned';
    document.getElementById('stumpGrinderStatus').innerText = hasStumpGrinder ? 'Owned' : 'Not owned';
    document.getElementById('hedgeTrimmerStatus').innerText = hasHedgeTrimmer ? 'Owned' : 'Not owned';
    document.getElementById('staffStatus').innerText = staffHired ? 'Yes' : 'No';
    document.getElementById('areaStatus').innerText = areaLevel;
    document.getElementById('prestigeStatus').innerText = prestigeLevel;
    updateAwards();
    updateBossChallenge();
}

// Function to handle working
document.getElementById('workButton').addEventListener('click', function() {
    if (fuel <= 0) {
        displayMessage('No fuel! Buy more to continue working.');
        return;
    }
    if (isContractActive) {
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
        let earnings = 50; // Base earning
        if (hasChainsaw) earnings += 50;
        if (hasTruck) earnings += 100;
        if (hasChipper) earnings += 150;
        if (hasStumpGrinder) earnings += 150;
        if (hasHedgeTrimmer) earnings += 75;
        if (staffHired) earnings *= 1.5; // Staff increases earnings
        let bonus = (prestigeLevel * 25) + (areaLevel * 50);
        money += earnings + bonus;
        fuel -= 10; // Use 10% fuel per job
        if (fuel < 0) fuel = 0;
        updateStatus();
    }
});

// Function to handle buying items
function buyItem(cost, statusVariable, statusElement, successMessage) {
    if (money >= cost && !statusVariable) {
        money -= cost;
        statusVariable = true;
        document.getElementById(statusElement).innerText = 'Owned';
        updateStatus(successMessage);
        displayMessage(successMessage);
        return true;
    } else if (statusVariable) {
        displayMessage('You already own this item!');
    } else {
        displayMessage('Not enough money to buy this item.');
    }
    return false;
}

document.getElementById('buyStumpGrinder').addEventListener('click', function() {
    hasStumpGrinder = buyItem(700, hasStumpGrinder, 'stumpGrinderStatus', 'You bought a stump grinder!');
});

document.getElementById('buyHedgeTrimmer').addEventListener('click', function() {
    hasHedgeTrimmer = buyItem(300, hasHedgeTrimmer, 'hedgeTrimmerStatus', 'You bought a hedge trimmer!');
});

// Function to handle buying fuel
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

// Function to unlock new area
document.getElementById('unlockArea').addEventListener('click', function() {
    if (money >= 1000) {
        money -= 1000;
        areaLevel += 1;
        updateStatus('You unlocked a new area!');
        displayMessage('You unlocked a new area!');
        checkForAwards();
    } else {
        displayMessage('Not enough money to unlock a new area.');
    }
});

// Function to hire staff
document.getElementById('hireStaff').addEventListener('click', function() {
    if (money >= 1500 && !staffHired) {
        money -= 1500;
        staffHired = true;
        updateStatus('You hired staff!');
        displayMessage('You hired staff!');
        automateWork();
    } else if (staffHired) {
        displayMessage('Staff already hired.');
    } else {
        displayMessage('Not enough money to hire staff.');
    }
});

// Function to handle prestige (reset)
document.getElementById('prestige').addEventListener('click', function() {
    if (money >= 5000) {
        prestigeLevel += 1;
        money = 0;
        hasChainsaw = true;
        hasTruck = true;
        hasChipper = true;
        hasStumpGrinder = false;
        hasHedgeTrimmer = false;
        fuel = 100;
        staffHired = false;
        areaLevel = 1;
        updateStatus('Business restarted! Prestige Level: ' + prestigeLevel);
        displayMessage('Business restarted! You now earn more per job.');
        baseContractTime += 60; // Increase timer duration as player progresses
    } else {
        displayMessage('You need at least £5000 to prestige.');
    }
});

// Function to automate work
function automateWork() {
    setInterval(function() {
        if (fuel <= 0) return;
        let earnings = 50;
        if (hasChainsaw) earnings += 50;
        if (hasTruck) earnings += 100;
        if (hasChipper) earnings += 150;
        if (hasStumpGrinder) earnings += 150;
        if (hasHedgeTrimmer) earnings += 75;
        if (staffHired) earnings *= 1.5;
        let bonus = (prestigeLevel * 25) + (areaLevel * 50);
        money += earnings + bonus;
        fuel -= 10;
        if (fuel < 0) fuel = 0;
        updateStatus();
    }, 5000); // Staff works every 5 seconds
}

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
        { description: 'Oak Tree Removal', reward: 700, fuelCost: 40 },
        { description: 'Crown Reduction of Beech Tree', reward: 500, fuelCost: 25 },
        { description: 'Stump Grinding', reward: 300, fuelCost: 20 },
        { description: 'Hedge Cutting', reward: 250, fuelCost: 15 },
        { description: 'Sycamore Tree Pruning', reward: 600, fuelCost: 30 }
    ];
    currentContract = treeServices[Math.floor(Math.random() * treeServices.length)];
    document.getElementById('contractDetails').innerText = `Contract: ${currentContract.description} - Reward: £${currentContract.reward}, Fuel Cost: ${currentContract.fuelCost}%`;
    document.getElementById('contracts').style.display = 'block';
    displayMessage('A new contract is available!');
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
