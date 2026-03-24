const STORAGE_KEY = "moodEntries" // localStorage key name (where our entries are stored)
const THEME_KEY = "MoodTheme" 

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] // Load saved entries OR start empty

const moodPicker = document.getElementById("moodPicker") 
const moodButtons = document.querySelectorAll(".mood-picker button")
const activitiesInput = document.getElementById("activities") // Textarea input
const saveBtn = document.getElementById("save-btn")
const filterBar = document.getElementById("filter")
const entriesList = document.getElementById("entries-list")
const statsDiv = document.getElementById("stats")// stats render area

const searchInput = document.getElementById("searchInput")
const clearAllBtn = document.getElementById("clearAllBtn")
const darkModeBtn = document.getElementById("darkModeBtn")
const weeklyDiv = document.getElementById("weekly") 

let selectedMood = "" // Current selected mood (example: "happy")
let activeFilter = "" // Current active filter ("" means All)
let searchQuery = "" // Current search query

function saveToStorage() { // Save entries array to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function setActiveFilterButton() { // Highlight which filter button is active, begin active button
  const buttons = filterBar.querySelectorAll("button") // Get all filter buttons


  buttons.forEach((btn) => { // Loop through buttons
    const mood = btn.dataset.filter // Read data-filter from button
    btn.classList.toggle("active", mood === activeFilter) // Add/remove active class
  }) // End loop
} // End setActiveFilterButton

function applyThemeFromStorage() { // Apply saved theme on page load
  const theme = localStorage.getItem(THEME_KEY) || "light" // Get saved theme or default to light

  if (theme === "dark") { // If stored theme is dark
    document.body.classList.add("dark") // Apply dark class to body
    darkModeBtn.textContent = "Light mode"  // Update button text
  } else { // If stored theme is light
    document.body.classList.remove("dark") // Ensure dark class is removed
    darkModeBtn.textContent = "Dark mode" // Update button text
  } // End theme check
} // End applyThemeFromStorage


moodPicker.addEventListener("click", (event) => { // One listener handles ALL mood buttons
  const btn = event.target.closest("button") // Find clicked button
  if (!btn) return // If click not on a button, stop

  moodButtons.forEach((b) => b.classList.remove("selected")) // Clear previous selection
  btn.classList.add("selected") // Highlight clicked mood
  selectedMood = btn.dataset.mood // Store mood string from data-mood
}) // End mood click handler

saveBtn.addEventListener("click", () => { // When Save button is clicked
 const rawText = activitiesInput.value // Get textarea text

 const activities = rawText // Start cleaning + splitting text
    .trim() // Remove outer whitespace
    .split(/\r?\n/) // Split lines (works Windows + Mac)
    .map((line)=> line.trim()) // Trim each line
    .filter(Boolean) // Remove empty lines
    .slice(0, 3) // Keep only first 3 activities

  if (!selectedMood) { // Validation: mood required
    alert("Please select a mood first.") // Show message
    return // Stop save
  } // End mood validation

  if (activities.length === 0) { // Validation: at least one activity required
    alert("Please write at least one activity.") // Show message
    return // Stop save
  } // End activity validation

  const entry = { // Create one entry object to store
    id: Date.now(), // Unique ID (timestamp)
    date: new Date().toLocaleDateString(), // Human-friendly date
    mood: selectedMood, // Mood string
    activities: activities, // Activities array
  } // End entry object

  entries.push(entry) // Add entry to array

  saveToStorage() // Save updated array

  activitiesInput.value = "" // Clear textarea
  moodButtons.forEach((b) => b.classList.remove("selected")) // Clear selection highlight
  selectedMood = "" // Reset selectedMood

  renderEntries(activeFilter, searchQuery) // Re-render list using current filter
  updateStats() // Recompute stats
  updateWeeklyAverage() // Update weekly average
}) // End Save handler

filterBar.addEventListener("click", (event) => { // One listener for filter buttons
  const btn = event.target.closest("button") // Find clicked button
  if (!btn) return // If not a button, stop

  activeFilter = btn.dataset.filter // Read filter mood ("") means All
  setActiveFilterButton() // Highlight active filter
  renderEntries(activeFilter, searchQuery) // Re-render with filter
}) // End filter handler

entriesList.addEventListener("click", (event) => { // Event delegation for delete buttons
  const btn = event.target.closest("button[data-action='delete']") // Find delete button
  if (!btn) return // If click not on delete, stop

  const id = Number(btn.dataset.id) // Convert id string to number
  const ok = confirm("Delete this entry?") // Confirm deletion
  if (!ok) return // If cancelled, stop

  entries = entries.filter((e) => e.id !== id) // Remove entry by id
  saveToStorage() // Save updated list

  renderEntries(activeFilter, searchQuery) // Re-render list
  updateStats() // Update stats
  updateWeeklyAverage() // Update weekly average
}) // End delete handler

searchInput.addEventListener("input", () => { // When user types in search box
  searchQuery = searchInput.value.trim().toLowerCase() // Update search query
  renderEntries(activeFilter, searchQuery) // Re-render with updated search query
}) // End search listener

clearAllBtn.addEventListener("click", () => { // When Clear All button is clicked
  if (entries.length === 0) { // If no entries to clear
    alert("There are no entries to clear.") // Show message
    return // Stop
  } // End empty check

  const ok = confirm("clear all etries") // Confirm clear all
  if (!ok) return // If cancelled, stop

  entries = [] // Clear entries
  saveToStorage() // Save empty list

  renderEntries(activeFilter, searchQuery) // Refresh list
  updateStats() // Update stats
  updateWeeklyAverage() // Update weekly average
} ) // End clear all handler

darkModeBtn.addEventListener("click", () => { // extension 3 dark mode toggle
  const isDark = document.body.classList.contains("dark") // check current mode

  if (isDark) { // if dark is on
    document.body.classList.remove("dark") // turn dark off
    localStorage.setItem(THEME_KEY, "light") // store preference
    darkModeBtn.textContent = "Dark mode" // button label
  } else { // if dark is off
    document.body.classList.add("dark") // turn dark on
    localStorage.setItem(THEME_KEY, "dark") // store preference
    darkModeBtn.textContent = "Light mode" // button label
  } // end toggle
}) // end dark mode 

function renderEntries(filterMood, query) { // Render entries to the page (optionally filtered + searched)
  entriesList.innerHTML = "" // Clear old content

  let filtered = entries // Start with all entries

  if (filterMood) { // If a filter is active
    filtered = filtered.filter((e) => e.mood === filterMood) // Apply mood filter
  } // End  mood filter check


  if (query) { // If there is a search query
    filtered = filtered.filter((e) => {// Apply search filter
      const joined = e.activities.join(" ").toLowerCase() // Join activities into one string
      return joined.includes(query) // Check if query is in activities
  }) // End of filter callback
} // End search filter check

  const sorted = [...filtered].sort((a, b) => b.id - a.id) // Sort newest first

if (sorted.length === 0) { // If nothing to show  
  entriesList.innerHTML = "<p>No entries match your filter or search</p>"
  return // Stop
} // End empty state

sorted.forEach((entry) => { // Create HTML for each entry
  const div = document.createElement("div") // Make a new div
  div.className = "entry" // Apply CSS class

  const activityHtml = entry.activities.map((a) => `• ${a}`).join("<br>") // Convert activities to HTML lines

  div.innerHTML = `
    <div>
      <strong>${entry.date} ;  ${entry.mood.toUpperCase()}</strong><br>
      ${activityHtml}
    </div>

    <button type="button" data-action="delete" data-id="${entry.id}">Delete</button>
  ` // Build entry row HTML

  entriesList.appendChild(div) // Add entry row to the page
  }) // End loop
} // End renderEntries

function updateStats() { // Compute + render basic statistics
  if (entries.length === 0) { // If no entries exist
    statsDiv.innerHTML = "<p>No entries yet. Add your first mood!</p>" // Show message
    return // Stop
  } // End empty check

  const moodCount = {} // Object to count moods

  entries.forEach((e) => { // Count each entry’s mood
    moodCount[e.mood] = (moodCount[e.mood] || 0) + 1 // Increment mood counter
  }) // End loop

  let mostCommon = "" // Will store the mood with highest count
  let highest = 0 // Will store the highest number

  for (const mood in moodCount) { // Loop through counted moods
    if (moodCount[mood] > highest) { // If this mood is more frequent
      highest = moodCount[mood] // Update highest
      mostCommon = mood // Update mostCommon mood
    } // End if
  } // End loop

  statsDiv.innerHTML = `
    <p>Total entries: ${entries.length}</p>
    <p>Most common mood: ${mostCommon} (${highest} times)</p>
  ` // Render stats HTML
} // End updateStats

function moodScore(mood) { // Helper to assign a numeric score to each mood
  if (mood === "happy") return 5 //
  if (mood === "good") return 4
  if (mood === "neutral") return 3
  if (mood === "sad") return 2
  if (mood === "stressed") return 1 //Lower score for sad mood
  return 0 // Default score for unknown moods
} // End moodScore

function updateWeeklyAverage() { // extension 4 weekly average for last 7 days
  if (entries.length === 0) { // If no entries exist
    weeklyDiv.innerHTML = "<p>Weekly average will appear after you add  entries.</p>" // Show message
    return // Stop
  } // End empty check

  const now = new Date() // Current date
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000 // Milliseconds in 7 days
  const cutoff = now.getTime() - sevenDaysMs // Timestamp for 7 days ago

  const resent = entries.filter((e) => e.id >= cutoff) // Filter entries from last 7 days

  if (resent.length === 0) { // If no recent entries
    weeklyDiv.innerHTML = "<p>No entries in the last 7 days </p>" // Show message
    return // Stop
  } // End recent check

  const totalScore = resent.reduce((sum, e) => sum + moodScore(e.mood), 0) // Sum mood scores

  const avg = totalScore / resent.length // Calculate average
  const avgRounded = Math.round(avg * 10) / 10 // Round to 1 decimal place

  let message = "Weekly mood look balanced."

  if (avgRounded >= 4.2)  message = "Weekly mood is very positive"
  if (avgRounded >= 3.4 && avgRounded < 4.2) message = "Weekly mood is mostly good"
  if (avgRounded >= 2.6 && avgRounded < 3.4) message = "Weekly mood is mixed"
  if (avgRounded < 2.6) message = "Weekly mood is low or stressful"

  weeklyDiv.innerHTML = `
    <p><strong>Weekly average</strong>: based on last 7 days entries: ${avgRounded} out of 5</p>
    <p>Entries counted: ${resent.length}</p>
    <p>Summary: ${message}</p>
  ` // Render weekly average HTML
} // End updateWeeklyAverage

applyThemeFromStorage() // Apply saved theme on page load
setActiveFilterButton() // Highlight “All” at start
renderEntries(activeFilter, searchQuery) // Render saved entries on load
updateStats() // Render stats on load
updateWeeklyAverage() // Render weekly average on load
