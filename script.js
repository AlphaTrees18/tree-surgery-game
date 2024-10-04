let money = 0;
let hasChainsaw = false;
let hasVan = false;
let fuel = 100;
let prestigeLevel = 0;
let areaLevel = 1;
let staffHired = false;
let contractTimer = 10;
let contractsAvailable = 0;
let awards = [];
let baseContractTime = 10; // Starting timer for contracts

// Function to display messages without pop-ups
function displayMessage(message) {
    const messageText = document.getElementById('messageText');
    messageText.innerText = message;
    // Clear message after 5 seconds
    setTimeout(() => {
        messageText.innerText = '';
    }, 5000);
}

// Update the status of the game
function updateStatus(extraMessage = '') {
    document.getElementById('status').innerText = 'You have £' + money + '. ' + extraMessage;
    document.getElementById('fuelStatus').innerText = 'Fuel: ' + fuel + '%';
    document.getElementById('chainsawStatus').innerText = hasChainsaw ? 'Owned' : 'Not owned';
    document.getElementById('vanStatus').innerText = hasVan ? 'Owned' : 'Not owned';
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
    let earnings = 50; // Base earning
    if (hasChainsaw) earnings += 50;
    if (hasVan) earnings += 100;
    let bonus = (prestigeLevel * 25) + (areaLevel * 50);
    money += earnings + bonus;
    fuel -= 10; // Use 10% fuel per job
    if (fuel < 0) fuel = 0;
    updateStatus();
});

// Function to handle buying a chainsaw
document.getElementById('buyChainsaw').addEventListener('click', function() {
    if (money >= 200 && !hasChainsaw) {
        money -= 200;
        hasChainsaw = true;
        updateStatus('You bought a chainsaw!');
        displayMessage('You bought a chainsaw!');
    } else if (hasChainsaw) {
        displayMessage('You already own a chainsaw!');
    } else {
        displayMessage('Not enough money to buy a chainsaw.');
    }
});

// Function to handle buying a van
document.getElementById('buyVan').addEventListener('click', function() {
    if (money >= 500 && !hasVan) {
        money -= 500;
        hasVan = true;
        updateStatus('You bought a van!');
        displayMessage('You bought a van!');
    } else if (hasVan) {
        displayMessage('You already own a van!');
    } else {
        displayMessage('Not enough money to buy a van.');
    }
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
        hasChainsaw = false;
        hasVan = false;
        fuel = 100;
        staffHired = false;
        areaLevel = 1;
        updateStatus('Business restarted! Prestige Level: ' + prestigeLevel);
        displayMessage('Business restarted! You now earn more per job.');
        baseContractTime += 5; // Increase timer duration as player progresses
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
        if (hasVan) earnings += 100;
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
        contractTimer = baseContractTime + (areaLevel * 5); // Increase timer with area level
        displayMessage('A new contract is available!');
        // Implement contract logic here if desired
    }
}, 1000); // Countdown every second

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
