// ==========================================
// CONFIGURATION
// ==========================================
let arduinoIP = localStorage.getItem('arduinoIP') || "";

// ==========================================
// PRESET COMMANDS DATA
// ==========================================
const COMMANDS = [
  { c_number: 1, category: "Oral Performance", command: "Faster", description: "Suck and bob head up and down at increased speed" },
  { c_number: 2, category: "Oral Performance", command: "Slower", description: "Slow, deliberate sucking and licking motions" },
  { c_number: 3, category: "Oral Performance", command: "Deeper", description: "Take the dildo significantly deeper into throat" },
  { c_number: 4, category: "Oral Performance", command: "Lick shaft", description: "Long, slow licks up and down the entire length" },
  { c_number: 5, category: "Oral Performance", command: "Lick tip", description: "Focus tongue on the head/tip only, swirling and teasing" },
  { c_number: 6, category: "Oral Performance", command: "Twirl", description: "Swirl tongue around the head in circles while lips sealed" },
  { c_number: 7, category: "Oral Performance", command: "Kiss tip", description: "Repeated soft kisses directly on the tip" },
  { c_number: 8, category: "Oral Performance", command: "Dildo slap", description: "Slap the dildo against cheeks, lips, and tongue" },
  { c_number: 9, category: "Oral Performance", command: "Deepthroat massage", description: "Hold deep and use throat muscles to squeeze/massage" },
  { c_number: 10, category: "Oral Performance", command: "Gag and hold", description: "Push to back of throat and hold while gagging" },
  { c_number: 11, category: "Oral Performance", command: "Tongue out", description: "Stick tongue out flat and slap/rub dildo on it" },
  { c_number: 12, category: "Oral Performance", command: "Suck balls", description: "Suck and lick the balls submissively (if applicable)" },
  { c_number: 13, category: "Oral Performance", command: "Throat fuck ready", description: "Open mouth wide, tongue out, hands behind back" },
  { c_number: 14, category: "Oral Performance", command: "Suck", description: "Perform steady, continuous sucking with sealed lips" },
  { c_number: 15, category: "Oral Performance", command: "Suck & Hold", description: "Seal lips tightly and apply strong continuous suction" },
  { c_number: 16, category: "Oral Performance", command: "Throat Pulse", description: "Hold dildo deep and rhythmically pulse throat muscles" },
  { c_number: 17, category: "Oral Performance", command: "Tip Torture", description: "Focus intense tongue flicking and sucking only on the head" },
  
  { c_number: 18, category: "Rhythm & Control", command: "Hold", description: "Freeze with dildo fully in mouth (or specific depth)" },
  { c_number: 19, category: "Rhythm & Control", command: "Freeze", description: "Complete freeze in current position — no movement" },
  { c_number: 20, category: "Rhythm & Control", command: "Stroke", description: "Use hand(s) to stroke shaft while mouth works tip" },
  { c_number: 21, category: "Rhythm & Control", command: "No hands", description: "Hands must stay behind back or on knees" },
  { c_number: 22, category: "Rhythm & Control", command: "Bob", description: "Bob head up and down at a steady, rhythmic pace" },

  { c_number: 23, category: "Visual & Feminine", command: "Bounce boobs", description: "Actively bounce and jiggle the big fake silicon breasts" },

  { c_number: 24, category: "Eye Contact", command: "Look up", description: "Eyes locked upward toward camera/your position" },
  { c_number: 25, category: "Eye Contact", command: "Close eyes", description: "Keep eyes closed or looking down in shame" },
  { c_number: 26, category: "Eye Contact", command: "Eye contact only", description: "Maintain unbroken eye contact with camera" },
  { c_number: 27, category: "Eye Contact", command: "Begging eyes", description: "Wide, pleading, watery eyes" },
  { c_number: 28, category: "Eye Contact", command: "Smile around cock", description: "Try to smile with mouth full of dildo" },

  { c_number: 29, category: "Posture & Full Body", command: "Hands behind head", description: "Fingers locked behind head, elbows out" },
  { c_number: 30, category: "Posture & Full Body", command: "Tilt head", description: "Tilt head to the side for different angle" },

  { c_number: 31, category: "Advanced / Endurance", command: "Vibrate Sync", description: "Match all movements to the rhythm of collar vibration" },
  { c_number: 32, category: "Advanced / Endurance", command: "Self Slap", description: "Lightly tap cheek while pressing tip to inside cheek" },
  { c_number: 33, category: "Advanced / Endurance", command: "Toy Freeze", description: "Become completely motionless like a mannequin" },

  { c_number: 34, category: "Bimbo Specific", command: "Idle Suck", description: "Gentle, mindless continuous sucking" },
  { c_number: 35, category: "Bimbo Specific", command: "Blank Stare", description: "Wide eyes, slack jaw, zero expression" }
];

// Staged items array
let stagedCommands = [];

// ==========================================
// DOM ELEMENTS
// ==========================================
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const navItems = document.querySelectorAll('.sidebar li');
const views = document.querySelectorAll('.view');

const categoryTabs = document.getElementById('category-tabs');
const paletteContent = document.getElementById('palette-content');
const stagingList = document.getElementById('staging-list');
const sendBtn = document.getElementById('send-btn');

const customCommandInput = document.getElementById('custom-command-input');
const addCustomBtn = document.getElementById('add-custom-btn');
const dictionaryList = document.getElementById('dictionary-list');

const ipInput = document.getElementById('ip-input');
const saveIpBtn = document.getElementById('save-ip-btn');

// ==========================================
// INITIALIZATION
// ==========================================
function init() {
  renderDictionary();
  renderPaletteTabs();
  
  // Load IP into configuration input
  if (arduinoIP) {
    ipInput.value = arduinoIP;
  }

  // Select first tab by default
  const categories = [...new Set(COMMANDS.map(c => c.category))];
  if(categories.length > 0) {
    renderPaletteCommands(categories[0]);
    document.querySelector(`.tab[data-cat="${categories[0]}"]`).classList.add('active');
  }
}

// ==========================================
// UI LOGIC (NAVIGATION & TABS)
// ==========================================
hamburger.addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.classList.add('active');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    // Update Active Nav Item
    navItems.forEach(nav => nav.classList.remove('active'));
    e.target.classList.add('active');

    // Switch Views
    const targetView = e.target.getAttribute('data-view');
    views.forEach(view => {
      if (view.id === targetView) {
        view.classList.add('active');
        view.classList.remove('hidden');
      } else {
        view.classList.remove('active');
        view.classList.add('hidden');
      }
    });

    // Close Sidebar
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
});

// ==========================================
// RENDERING
// ==========================================

// 1. Render Dictionary List
function renderDictionary() {
  dictionaryList.innerHTML = '';
  COMMANDS.forEach(cmd => {
    const card = document.createElement('div');
    card.className = 'def-card';
    card.innerHTML = `
      <div class="def-header">
        <span class="def-cmd">${cmd.command}</span>
        <span class="def-num">#${cmd.c_number}</span>
      </div>
      <span class="def-cat">${cmd.category}</span>
      <p class="def-desc">${cmd.description}</p>
    `;
    dictionaryList.appendChild(card);
  });
}

// 2. Render Tabs dynamically
function renderPaletteTabs() {
  const categories = [...new Set(COMMANDS.map(c => c.category))];
  categoryTabs.innerHTML = '';
  categories.forEach(cat => {
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.setAttribute('data-cat', cat);
    tab.innerText = cat;
    tab.addEventListener('click', () => {
      // Manage active state
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Render corresponding commands
      renderPaletteCommands(cat);
    });
    categoryTabs.appendChild(tab);
  });
}

// 3. Render Commands for a specific category
function renderPaletteCommands(category) {
  paletteContent.innerHTML = '';
  const filteredCmds = COMMANDS.filter(c => c.category === category);
  
  const grid = document.createElement('div');
  grid.className = 'palette-grid';

  filteredCmds.forEach(cmd => {
    const btn = document.createElement('button');
    btn.className = 'cmd-btn';
    btn.innerText = cmd.command;
    btn.addEventListener('click', () => {
      addCommandToStaging(cmd);
    });
    grid.appendChild(btn);
  });
  paletteContent.appendChild(grid);
}

// ==========================================
// STAGING AREA LOGIC
// ==========================================
function addCommandToStaging(cmdObj) {
  // Use a unique ID for the staging item to allow easy deletion
  const stagingItem = {
    ...cmdObj,
    _id: Date.now() + Math.random().toString(36).substr(2, 9)
  };
  stagedCommands.push(stagingItem);
  renderStagingArea();
}

function removeCommandFromStaging(id) {
  stagedCommands = stagedCommands.filter(item => item._id !== id);
  renderStagingArea();
}

function renderStagingArea() {
  stagingList.innerHTML = '';
  stagedCommands.forEach((cmd, index) => {
    const li = document.createElement('li');
    li.className = 'staged-item';
    li.innerHTML = `
      <span><strong style="color:var(--neon-yellow)">${index + 1}.</strong> ${cmd.command}</span>
      <button class="delete-btn" data-id="${cmd._id}">X</button>
    `;
    stagingList.appendChild(li);
  });

  // Attach delete event listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      removeCommandFromStaging(e.target.getAttribute('data-id'));
    });
  });
}

// Custom Command Button Logic
addCustomBtn.addEventListener('click', () => {
  const val = customCommandInput.value.trim();
  if (val) {
    addCommandToStaging({
      c_number: 40,
      category: 'custom bitch',
      command: val,
      description: 'time to shine slut'
    });
    customCommandInput.value = '';
  }
});

customCommandInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addCustomBtn.click();
  }
});

// ==========================================
// CONFIGURATION LOGIC
// ==========================================
saveIpBtn.addEventListener('click', () => {
  const val = ipInput.value.trim();
  if (val) {
    arduinoIP = val;
    localStorage.setItem('arduinoIP', arduinoIP);
    alert('Configuration saved successfully!');
  } else {
    alert('Please enter a valid IP address.');
  }
});

// ==========================================
// SEND DATA TO ARDUINO
// ==========================================
sendBtn.addEventListener('click', async () => {
  if (!arduinoIP) {
    alert("Please configure the Arduino IP address first in the Configuration view.");
    return;
  }

  if (stagedCommands.length === 0) {
    alert("Queue is empty. Add commands first.");
    return;
  }

  // Format payload as plain text string:
  // e.g. "1. [Category] Command: Description"
  let payloadText = stagedCommands.map((c, i) => {
    return `${i + 1}. [${c.category}] ${c.command} (#${c.c_number})\n   -> ${c.description}`;
  }).join('\n\n');

  // Change button text briefly to show action
  const originalText = sendBtn.innerText;
  sendBtn.innerText = "SENDING...";
  sendBtn.style.pointerEvents = "none";

  try {
    const url = `http://${arduinoIP}:80/`;
    // Sending raw text since Arduino reads requestBody directly
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: payloadText
    });
    
    if (response.ok) {
      console.log("Successfully sent to Arduino");
      // Optional: Clear the list after successful send?
      // stagedCommands = [];
      // renderStagingArea();
    } else {
      console.error("Arduino responded with error status:", response.status);
      alert("Error sending to Arduino. Status: " + response.status);
    }
  } catch (error) {
    console.error("Network error sending to Arduino:", error);
    alert(`Failed to send data to Arduino at ${arduinoIP}. Check IP, network, or CORS settings.\nError: ${error.message}`);
  } finally {
    sendBtn.innerText = originalText;
    sendBtn.style.pointerEvents = "auto";
  }
});

// Run Init
init();
