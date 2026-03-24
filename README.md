This is my mood-tracer project.

## **Mood & Activity Tracker**
A clean, single-page mood and activity tracker built with HTML, CSS, and JavaScript. This project was developed as part of the Web Applications course at Laurea University of Applied Sciences.

**Live Demo:** [Insert your GitHub Pages link here]

**Repository:** [Insert your GitHub repository link here]

Features
Mood Selection: Choose from five distinct moods (Happy, Good, Neutral, Sad, Stressed) using interactive buttons.

Activity Logging: Log 1–3 daily activities or highlights in a simple text format.

Data Persistence: All entries are saved to the browser's localStorage, ensuring data stays safe even after a page refresh.

History & Filtering: Browse your past entries and filter them by specific moods to see patterns.

Real-time Search: Instantly find specific entries by typing keywords in the search bar.

Smart Statistics: View the total number of entries and your most frequent mood at a glance.

Weekly Average: A dynamic calculator that analyzes the last 7 days of entries, provides a score from 1–5, and gives a written summary.

Dark Mode: A toggleable dark theme that remembers the user's preference using localStorage.

Data Management: Delete individual entries or clear the entire history with a confirmation prompt.

How to Run
Windows & macOS
Download the project files (index.html, style.css, script.js) into the same folder.

Open index.html directly in any modern web browser (Chrome, Edge, Safari, Firefox).

For Developers: It is recommended to use the Live Server extension in VS Code for the best experience.

Architecture
The project follows a simple separation of concerns with three main files:

index.html – Defines the semantic structure and accessibility (ARIA labels).

style.css – Handles the responsive layout, button states, and the .dark class for theming.

script.js – Manages the app logic, including event listeners, data validation, and DOM rendering.

Data Flow: User Input → Validation → localStorage Save → Re-rendering the DOM list and statistics.
