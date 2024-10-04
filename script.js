let money = 0;
let hasChainsaw = false;
let hasVan = false;
let fuel = 100;
let prestigeLevel = 0;
let areaLevel = 1;
let staffHired = false;
let contractTimer = 10;
let contractsAvailable = 0;

// Update the status of the game
function updateStatus(extraMessage = '') {
    document.getElementById('status').innerText = 'You have £' + money + '. ' + extraMessage;
    document.getElementById('fuelStatus').innerText = 'Fuel: ' + fuel + '%';
    document.getElementById('chainsawStatus').innerText = hasChainsaw ? 'Owned' : 'Not owned';
    document.getElementById('vanStatus').innerText = hasVan ? 'Owned' : 'Not owned';
    document.getElementById('staffStatus').innerText = staffHired ? 'Yes' : 'No';
    document.getElementById('areaStatus').innerText = areaLevel;
    document.getElementById('prestigeStatus').innerText = prestigeLevel;
}

// Function to handle working
document.getElementById('workButton').addEventListener('click', function() {
    if (fuel <= 0) {
        alert('No fuel! Buy more to continue working.');
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
    } else if (hasChainsaw) {
        alert('You already own a chainsaw!');
    } else {
        alert('Not enough money to buy a chainsaw.');
    }
});

// Function to handle buying a van
document.getElementById('buyVan').addEventListener('click', function() {
    if (money >= 500 && !hasVan) {
        money -= 500;
        hasVan = true;
        updateStatus('You bought a van!');
    } else if (hasVan) {
        alert('You already own a van!');
    } else {
        alert('Not enough money to buy a van.');
    }
});

// Function to handle buying fuel
document.getElementById('buyFuel').addEventListener('click', function() {
    if (money >= 50) {
        money -= 50;
        fuel = 100;
        updateStatus('You refueled your equipment.');
    } else {
        alert('Not enough money to buy fuel.');
    }
});

// Function to unlock new area
document.getElementById('unlockArea').addEventListener('click', function() {
    if (money >= 1000) {
        money -= 1000;
        areaLevel += 1;
        updateStatus('You unlocked a new area!');
    } else {
        alert('Not enough money to unlock a new area.');
    }
});

// Function to hire staff
document.getElementById('hireStaff').addEventListener('click', function() {
    if (money >= 1500 && !staffHired) {
        money -= 1500;
        staffHired = true;
        updateStatus('You hired staff!');
        automateWork();
    } else if (staffHired) {
        alert('Staff already hired.');
    } else {
        alert('Not enough money to hire staff.');
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
        alert('Business restarted! You now earn more per job.');
    } else {
        alert('You need at least £5000 to prestige.');
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

// Timer for contracts
setInterval(function() {
    if (contractTimer > 0) {
        contractTimer--;
        document.getElementById('contractTimer').innerText = contractTimer;
    } else {
        contractsAvailable++;
        contractTimer = 10; // Reset timer
        alert('A new contract is available!');
    }
}, 1000); // Countdown every second

// Initial status update
updateStatus();
