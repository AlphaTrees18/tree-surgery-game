let availableCrews = 1; // Number of available crews (trucks)
let jobInProgress = {};
let jobsCompleted = 0;
let chainsawCount = 1; // Start with 1 chainsaw
let hedgeTrimmerCount = 0;
let stumpGrinderCount = 0;
let woodChipperCount = 0;
let climberCount = 0;
let groundsmanCount = 0;
let fuelCount = 100; // Fuel starts at 100%
let money = 5000; // Player starts with £5000
let progressBarElement = document.getElementById("progress-bar");
let areaLevel = 1; // Starting area level
let areas = [
    { name: "London", cost: 0 },
    { name: "Birmingham", cost: 50000 },
    { name: "Manchester", cost: 100000 },
    { name: "Glasgow", cost: 275000 }
];
let currentArea = areas[0]; // Start with London

// Prompt user for their tree surgery business name
let businessName = prompt("Enter your tree surgery business name:", "Your Tree Surgery Business");
document.title = businessName + " - Arborist Ascend";
document.getElementById('businessNameDisplay').innerText = businessName;

// Function to update the player's status
function updateStatus(message) {
    document.getElementById('truckCount').innerText = availableCrews;
    document.getElementById('chainsawCount').innerText = chainsawCount;
    document.getElementById('hedgeTrimmerCount').innerText = hedgeTrimmerCount;
    document.getElementById('stumpGrinderCount').innerText = stumpGrinderCount;
    document.getElementById('woodChipperCount').innerText = woodChipperCount;
    document.getElementById('climberCount').innerText = climberCount;
    document.getElementById('groundsmanCount').innerText = groundsmanCount;
    document.getElementById('fuelCount').innerText = fuelCount + "%";
    document.getElementById('moneyDisplay').innerText = "Money: £" + money.toFixed(2);
    document.getElementById('currentAreaDisplay').innerText = "Current Area: " + currentArea.name;
    if (message) alert(message);
}

// Function to buy equipment
function buyTool(tool) {
    let cost = 0;
    if (tool === 'chainsaw' && money >= 500) {
        cost = 500;
        chainsawCount++;
    } else if (tool === 'hedgeTrimmer' && money >= 300) {
        cost = 300;
        hedgeTrimmerCount++;
    } else if (tool === 'stumpGrinder' && money >= 3000) {
        cost = 3000;
        stumpGrinderCount++;
    } else if (tool === 'woodChipper' && money >= 5000) {
        cost = 5000;
        woodChipperCount++;
    } else {
        alert("Not enough money to buy " + tool);
        return;
    }
    money -= cost;
    updateStatus("You bought a " + tool + "!");
}

// Function to buy fuel
function buyFuel() {
    if (money >= 100) {
        fuelCount = 100;
        money -= 100;
        updateStatus("You refueled your trucks!");
    } else {
        alert("Not enough money to buy fuel.");
    }
}

// Function to hire staff members
function hireStaff(type) {
    let cost = 0;
    if (type === 'climber' && money >= 2000) {
        cost = 2000;
        climberCount++;
    } else if (type === 'groundsman' && money >= 1500) {
        cost = 1500;
        groundsmanCount++;
    } else {
        alert("Not enough money to hire a " + type);
        return;
    }
    money -= cost;
    updateStatus("You hired a " + type + "!");
}

// Function to start a job
function startJob(jobId) {
    if (jobInProgress[jobId] || availableCrews <= 0 || climberCount < availableCrews || groundsmanCount < availableCrews) {
        alert("You don't have enough crews available or this job is already in progress, or you lack enough staff!");
        return;
    }

    // Check if the job requires specific equipment
    if (jobId === 2 && hedgeTrimmerCount <= 0) { // Hedge trimming requires a hedge trimmer
        alert("You need a hedge trimmer for this job!");
        return;
    }
    if (jobId === 3 && stumpGrinderCount <= 0) { // Stump grinding requires a stump grinder
        alert("You need a stump grinder for this job!");
        return;
    }

    jobInProgress[jobId] = true;
    availableCrews--;
    
    let jobElement = document.getElementById("job" + jobId);
    jobElement.classList.add("in-progress");

    let jobTime = 60; // Time in seconds for job completion (represents a day)
    let width = 0;
    let progressInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressInterval);
            completeJob(jobId);
        } else {
            width += 100 / jobTime;
            progressBarElement.style.width = width + "%";
        }
    }, 1000);
}

// Function to complete the job
function completeJob(jobId) {
    jobInProgress[jobId] = false;
    availableCrews++;
    jobsCompleted++;
    progressBarElement.style.width = "0%";

    let earnings = 0;
    if (jobId === 1) earnings = 500;
    else if (jobId === 2) earnings = 300;
    else if (jobId === 3) earnings = 700;

    money += earnings;
    fuelCount -= 20; // Deduct fuel per job
    if (fuelCount < 0) fuelCount = 0;

    let jobElement = document.getElementById("job" + jobId);
    jobElement.classList.remove("in-progress");
    jobElement.classList.add("completed");
    updateStatus("Job " + jobId + " completed! You've earned £" + earnings + ".");

    // Unlock new boxes as progress is made
    if (jobsCompleted >= 3 && document.getElementById("box2").classList.contains("locked")) {
        unlockBox(2);
    }
    if (jobsCompleted >= 6 && document.getElementById("box3").classList.contains("locked")) {
        unlockBox(3);
    }
}

// Function to unlock a new box (area)
function unlockBox(boxId) {
    let box = document.getElementById("box" + boxId);
    box.classList.remove("locked");
    box.innerHTML = "<p>Truck " + boxId + "</p><p>Ready</p>";
}

// Function to unlock a new area (city)
function unlockArea() {
    if (areaLevel < areas.length - 1) {
        let nextArea = areas[areaLevel + 1];
        if (money >= nextArea.cost) {
            money -= nextArea.cost;
            areaLevel++;
            currentArea = areas[areaLevel];
            updateStatus("You unlocked " + currentArea.name + "!");
        } else {
            alert("Not enough money to unlock " + nextArea.name + ". You need £" + nextArea.cost.toLocaleString() + ".");
        }
    } else {
        alert("All areas have been unlocked!");
    }
}

// Function to bid for additional jobs
function bidForJob() {
    if (money >= 100) {
        money -= 100;
        let chance = Math.random();
        if (chance > 0.5) {
            alert("Bid successful! You got an additional job!");
            let newJobId = document.querySelectorAll('.job').length + 1;
            let jobDiv = document.createElement('div');
            jobDiv.classList.add('job');
            jobDiv.setAttribute('id', 'job' + newJobId);
            jobDiv.innerHTML = `<span>Additional Job - £600</span> <button onclick="startJob(${newJobId})">Start</button>`;
            document.getElementById('jobsList').appendChild(jobDiv);
        } else {
            alert("Bid failed. Better luck next time!");
        }
        updateStatus();
    } else {
        alert("Not enough money to place a bid.");
    }
}
