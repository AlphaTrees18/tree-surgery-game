let availableCrews = 1; // Number of available crews (trucks)
let jobInProgress = false;
let jobsCompleted = 0;
let chainsawCount = 1; // Start with 1 chainsaw
let hedgeTrimmerCount = 0;
let stumpGrinderCount = 0;
let fuelCount = 100; // Fuel starts at 100%
let money = 5000; // Player starts with £5000
let progressBarElement = document.getElementById("progress-bar");

// Function to update the player's status
function updateStatus(message) {
    document.getElementById('truckCount').innerText = availableCrews;
    document.getElementById('chainsawCount').innerText = chainsawCount;
    document.getElementById('hedgeTrimmerCount').innerText = hedgeTrimmerCount;
    document.getElementById('stumpGrinderCount').innerText = stumpGrinderCount;
    document.getElementById('fuelCount').innerText = fuelCount + "%";
    if (message) alert(message);
}

// Function to buy equipment
function buyTool(tool) {
    let cost = 0;
    if (tool === 'chainsaw' && money >= 500) {
        cost = 500;
        chainsawCount++;
        document.getElementById('chainsawCount').innerText = chainsawCount;
    } else if (tool === 'hedgeTrimmer' && money >= 300) {
        cost = 300;
        hedgeTrimmerCount++;
        document.getElementById('hedgeTrimmerCount').innerText = hedgeTrimmerCount;
    } else if (tool === 'stumpGrinder' && money >= 400) {
        cost = 400;
        stumpGrinderCount++;
        document.getElementById('stumpGrinderCount').innerText = stumpGrinderCount;
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
        document.getElementById('fuelCount').innerText = fuelCount + "%";
        updateStatus("You refueled your trucks!");
    } else {
        alert("Not enough money to buy fuel.");
    }
}

// Function to start a job
function startJob(jobId) {
    if (jobInProgress || availableCrews <= 0) {
        alert("You don't have enough crews available or a job is already in progress!");
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

    jobInProgress = true;
    availableCrews--;
    
    let jobTime = 10; // Time in seconds for job completion (can adjust based on job type)
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
    jobInProgress = false;
    availableCrews++;
    jobsCompleted++;
    progressBarElement.style.width = "0%";
    
    let earnings = 0;
    if (jobId === 1) earnings = 500;
    else if (jobId === 2) earnings = 300;
    else if (jobId === 3) earnings = 400;
    
    money += earnings;
    fuelCount -= 20; // Deduct fuel per job
    if (fuelCount < 0) fuelCount = 0;
    
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
