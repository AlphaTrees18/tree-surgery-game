let money = 5000; // Starting balance set to £5000
let truckCount = 1;
let chipperCount = 1;
let chainsawCount = 2; // Updated to 2 to match the starting staff
let climbingGearCount = 0;
let stumpGrinderCount = 0;
let hedgeTrimmerCount = 0;
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
let contractProgressTimer = null;
let day = 1;
let maxDay = 7; // One week
let dayTimer = 30; // Each day lasts 30 seconds
let weeklyJobs = [];
let weeklyJobProgressTimers = {};

function updateStatus(extraMessage = '') {
    document.getElementById('status').innerText = 'You have £' + money.toFixed(2) + '. ' + extraMessage;
    document.getElementById('fuelStatus').innerText = 'Fuel: ' + fuel + '%';
    document.getElementById('truckCount').innerText = truckCount;
    document.getElementById('chipperCount').innerText = chipperCount;
    document.getElementById('chainsawCount').innerText = chainsawCount;
    document.getElementById('climbingGearCount').innerText = climbingGearCount;
    document.getElementById('stumpGrinderCount').innerText = stumpGrinderCount;
    document.getElementById('hedgeTrimmerCount').innerText = hedgeTrimmerCount;
    document.getElementById('climberCount').innerText = climberCount;
    document.getElementById('groundsmanCount').innerText = groundsmanCount;
    document.getElementById('areaStatus').innerText = areaLevel;
    document.getElementById('prestigeStatus').innerText = prestigeLevel;
    document.getElementById('dayTimer').innerText = 'Day: ' + day;
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
        displayMessage('You are already working on a contract!');
        return;
    }
    let earnings = 500; // Base job earnings
    if (hedgeTrimmerCount > 0) earnings += 150;
    if (stumpGrinderCount > 0) earnings += 300;
    let bonus = areaLevel * 100;
    let prestigeBonus = earnings * (prestigeLevel * 0.1);
    money += earnings + bonus + prestigeBonus;
    fuel -= 10; // Fuel consumption per job
    if (fuel < 0) fuel = 0;
    updateStatus();
    displayMessage('You earned £' + (earnings + bonus + prestigeBonus).toFixed(2) + ' from doing a job.');
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

setInterval(function() {
    if (contractTimer > 0) {
        contractTimer--;
        document.getElementById('contractTimer').innerText = contractTimer;
    } else {
        generateContract();
        contractTimer = 60 + (areaLevel * 10);
    }
}, 1000);

// Day timer for weekly jobs
setInterval(function() {
    if (dayTimer > 0) {
        dayTimer--;
    } else {
        day++;
        if (day > maxDay) {
            day = 1;
            generateWeeklyJobs();
        }
        dayTimer = 30; // Reset day timer
        document.getElementById('dayTimer').innerText = 'Day: ' + day;
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
    if (currentContract.requiredEquipment === 'Stump Grinder' && stumpGrinderCount === 0) {
        displayMessage('You need a Stump Grinder to accept this contract.');
        return;
    }
    if (currentContract.requiredEquipment === 'Hedge Trimmer' && hedgeTrimmerCount === 0) {
        displayMessage('You need a Hedge Trimmer to accept this contract.');
        return;
    }
    isContractActive = true;
    displayMessage('You accepted a contract: ' + currentContract.description);
    startContractCountdown();
});

function startContractCountdown() {
    let countdown = 60; // Contract completion timer in seconds
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = '0%'; // Reset progress bar
    document.getElementById('contractProgress').style.display = 'block';

    if (contractProgressTimer) {
        clearInterval(contractProgressTimer);
    }

    contractProgressTimer = setInterval(() => {
        if (countdown > 0) {
            countdown--;
            let progressPercent = ((60 - countdown) / 60) * 100;
            progressFill.style.width = progressPercent + '%';
        } else {
            clearInterval(contractProgressTimer);
            isContractActive = false;
            completeContract();
        }
    }, 1000);
}

function completeContract() {
    let earnings = currentContract.reward * (1 + prestigeLevel * 0.1);
    money += earnings;
    fuel -= currentContract.fuelCost;
    if (fuel < 0) fuel = 0;
    updateStatus('Contract completed!');
    displayMessage('You completed the contract and earned £' + earnings.toFixed(2) + '!');
    document.getElementById('contracts').style.display = 'none';
    document.getElementById('contractProgress').style.display = 'none';
}

// Function to generate weekly jobs
function generateWeeklyJobs() {
    weeklyJobs = [];
    for (let i = 0; i < 5; i++) {
        const job = {
            id: i,
            description: 'Weekly Job ' + (i + 1),
            reward: 2000 + i * 500,
            requiredEquipment: i % 2 === 0 ? 'Chainsaw' : 'Stump Grinder',
            isCompleted: false
        };
        weeklyJobs.push(job);
    }
    displayWeeklyJobs();
}

function displayWeeklyJobs() {
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = '';
    weeklyJobs.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.classList.add('jobItem');
        jobDiv.innerText = `${job.description} - Reward: £${job.reward}`;
        const acceptButton = document.createElement('button');
        acceptButton.innerText = 'Accept Job';
        acceptButton.addEventListener('click', () => acceptWeeklyJob(job));
        jobDiv.appendChild(acceptButton);
        jobsList.appendChild(jobDiv);
    });
}

function acceptWeeklyJob(job) {
    if (weeklyJobProgressTimers[job.id]) {
        displayMessage('You are already working on this job!');
        return;
    }
    if (fuel < 20) {
        displayMessage('Not enough fuel to accept this job.');
        return;
    }
    if (job.requiredEquipment === 'Stump Grinder' && stumpGrinderCount === 0) {
        displayMessage('You need a Stump Grinder to accept this job.');
        return;
    }
    displayMessage('You accepted ' + job.description);
    startWeeklyJobCountdown(job);
}

function startWeeklyJobCountdown(job) {
    let countdown = 30; // Job completion timer in seconds
    weeklyJobProgressTimers[job.id] = setInterval(() => {
        if (countdown > 0) {
            countdown--;
        } else {
            clearInterval(weeklyJobProgressTimers[job.id]);
            delete weeklyJobProgressTimers[job.id];
            completeWeeklyJob(job);
        }
    }, 1000);
}

function completeWeeklyJob(job) {
    let earnings = job.reward * (1 + prestigeLevel * 0.1);
    money += earnings;
    fuel -= 20;
    if (fuel < 0) fuel = 0;
    updateStatus('Weekly job completed!');
    displayMessage('You completed ' + job.description + ' and earned £' + earnings.toFixed(2) + '!');
    job.isCompleted = true;
    displayWeeklyJobs(); // Refresh the job list
}

// Initialize the game
generateWeeklyJobs();
updateStatus();
