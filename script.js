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
let contractTimeLeft = 60; // Timer for contracts

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
    if (jobInProgress[jobId] || availableCrews <= 0) {
        alert("You don't have enough crews available or this job is already in progress!");
        return;
    }

    // Check if the job requires specific equipment
    if (jobId === 1 && hedgeTrimmerCount <= 0) {
        alert("You need a hedge trimmer for this job!");
        return;
    }
    if (jobId === 2 && stumpGrinderCount <= 0) {
        alert("You need a stump grinder for this job!");
        return;
    }
    if (jobId === 3 && chainsawCount <= 0) {
        alert("You need a chainsaw for this job!");
        return;
    }

    jobInProgress[jobId] = true;
    availableCrews--;
    
    let jobElement = document.getElementById("job" + jobId);
    jobElement.classList.add("in-progress");

    let jobTime = 60; // Time in seconds for job completion
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
    updateStatus("Job completed! You earned £" + earnings);
}

// Function to bid for an additional job
function bidForJob() {
    if (money >= 100) {
        money -= 100;
        if (Math.random() <= 0.3) {
            let newJobId = Object.keys(jobInProgress).length + 1;
            let newJob = document.createElement("div");
            newJob.className = "job";
            newJob.id = "job" + newJobId;
            newJob.innerHTML = `<span>Additional Job - £500</span> <button onclick="startJob(${newJobId})">Start</button>`;
            document.getElementById("jobsList").appendChild(newJob);
            updateStatus("You won the bid and got an additional job!");
        } else {
            updateStatus("You lost the bid. Better luck next time!");
        }
    } else {
        alert("Not enough money to bid for a job.");
    }
}

// Function to unlock a new area
function unlockArea() {
    if (areaLevel < areas.length && money >= areas[areaLevel].cost) {
        money -= areas[areaLevel].cost;
        currentArea = areas[areaLevel];
        areaLevel++;
        let newBox = document.getElementById("box" + areaLevel);
        newBox.classList.remove("locked");
        newBox.innerHTML = `<p>${currentArea.name}</p><p>Ready</p>`;
        updateStatus(`You unlocked ${currentArea.name}!`);
    } else {
        alert("Not enough money to unlock a new area or all areas are already unlocked.");
    }
}

// Function for the contracts timer
setInterval(function() {
    if (contractTimeLeft > 0) {
        contractTimeLeft--;
        document.getElementById('contractTimeLeft').innerText = contractTimeLeft;
    } else {
        contractTimeLeft = 60; // Reset timer to 60 seconds
        updateStatus("A new contract is available!");
    }
}, 1000); // Run every second

// Initial status update
updateStatus();
