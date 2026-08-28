# CloudAdmin Prep v2

CloudAdmin Prep is a browser-based AZ-104 Azure Administrator study trainer designed to teach the exam from a beginner-friendly starting point without watering down the administrator-level objectives.

## What's new in v2

- 36 guided lessons across Azure foundations and all five AZ-104 skill domains
- 90 original practice questions with explanations, wrong-answer coaching, and exam clues
- 15 interactive local Azure Portal Simulator labs
- A 3-question mastery quiz after every simulator lab
- Lesson checks that require 80% or better before a lesson is marked mastered
- Mixed 50-question exam simulation weighted across the five AZ-104 domains
- Weak-area tracking down to specific lessons/subtopics
- Readiness scoring based on study mastery, labs, practice volume, and accuracy
- Existing dark Azure-focused design retained and expanded for desktop and mobile
- Local browser storage for progress; no backend or Azure subscription required

## Files

- `index.html` — application screens and UI structure
- `style.css` — complete application styling including mock Azure Portal UI
- `script.js` — lessons, questions, simulator labs, validation, quizzes, progress, and navigation
- `AZ104-COVERAGE.md` — mapping of the app curriculum to the current AZ-104 skill areas

## Run it

This is a static web app. Keep `index.html`, `style.css`, and `script.js` in the same folder, then open `index.html` in a browser or deploy the folder to any static web host such as GitHub Pages.

No npm install, build step, Azure account, Azure subscription, or paid Azure resources are required for the simulator labs.

## Progress storage

Progress is stored in the browser with the key `cloudAdminPrepV2`. The v2 code also attempts to preserve compatible practice history from the original `cloudAdminPrepV1` data.

## Important note

CloudAdmin Prep is an independent study tool and is not affiliated with Microsoft. The curriculum is aligned to Microsoft's AZ-104 skills measured as of April 17, 2026. Passing a certification exam can never be guaranteed; the app is designed to build understanding, hands-on reasoning, and exam readiness.
