# CloudAdmin Prep

CloudAdmin Prep is a browser-based AZ-104 (Microsoft Azure Administrator) study trainer. It teaches the exam from a beginner-friendly starting point — a short AZ-900-level foundations track — without watering down the actual administrator-level objectives, then builds toward exam-style practice, an interactive Azure Portal simulator, and weak-area-driven review.

It is a static site: plain HTML, CSS, and JavaScript, no framework, no backend, no build step, and no Azure subscription required to use it.

## Why this project exists

Most AZ-104 practice tools are either a plain flashcard deck or a raw question bank with no teaching layer in between. CloudAdmin Prep is built around a specific learning flow instead:

**Lesson → Knowledge check → Simulated lab (where relevant) → Graded quiz → Full answer breakdown**

A learner reads a real lesson (not just a study card), checks their own understanding immediately, applies the concept in a local mock Azure Portal, gets tested on it, and then sees *why* every answer choice — not just the correct one — is right or wrong.

## Curriculum

- **36 lessons**: 6 AZ-900-level foundations lessons plus 30 lessons covering all five graded AZ-104 domains (Identity & Governance, Storage, Compute, Virtual Networking, Monitoring & Recovery), aligned to the official Microsoft Learn "Skills measured as of April 17, 2026" outline. See [`AZ104-COVERAGE.md`](AZ104-COVERAGE.md) for the full objective-by-objective mapping.
- **90 graded practice/exam questions**, each mapped to the specific lesson that teaches it, with a foundational/scenario/troubleshooting/configuration/least-privilege mix, balanced-length distractors (so the correct answer can't be spotted by how it reads), and a full explanation for *every* option.
- **15 interactive local Azure Portal Simulator labs** — mock configuration screens with validated decisions and their own 3-question mastery quiz. Nothing here creates real Azure resources or incurs charges.
- Every lesson that has real-world tooling relevance includes **actual Azure CLI and Azure PowerShell command examples** (not invented syntax) with an explanation of what each command does, alongside a step-by-step Azure Portal walkthrough.
- Every lesson includes a **1–3 question ungraded knowledge check** with immediate feedback, terminology definitions, "don't confuse these" comparisons between similar Azure services (e.g., service endpoint vs. private endpoint, Recovery Services vault vs. Backup vault, management-plane vs. data-plane permissions), common mistakes, and AZ-104 exam-taking tips.

## Architecture

Curriculum content and application logic are separated so either can change independently:

```
index.html          Screen markup for Home, Study, Practice setup, Quiz, Results, Labs, Weak Areas
style.css            All styling, including the mock Azure Portal UI
data/
  meta.js            Shared lookups: domain names, exam weights, exam-level labels
  lessons.js         All 36 lessons (content only — no rendering logic)
  questions.js        All 90 graded questions (content only)
  labs.js             All 15 simulator labs (content only)
app.js               All application logic: rendering, navigation, progress tracking,
                      quiz/lab engines, and event wiring — no curriculum content
AZ104-COVERAGE.md    Curriculum-to-objective mapping, kept in sync with data/lessons.js
```

`index.html` loads the `data/*.js` files before `app.js` as plain (non-module) scripts, so each simply declares a top-level `const` (`LESSONS`, `QUESTIONS`, `LABS`, `TOPIC_NAMES`, `EXAM_TOPICS`, `EXAM_WEIGHTS`, `EXAM_LEVELS`) that `app.js` consumes — no bundler, no module loader, and no CORS restrictions when opening `index.html` directly from disk.

Lesson, question, and lab IDs (`foundation-hierarchy`, `q001`, `lab-entra-user`, etc.) are stable identifiers used for progress tracking, cross-referencing (a lesson's `relatedLab`, a lab's `lessonIds`, a question's `lessonId`), and localStorage keys — they are preserved across content revisions so a learner's saved progress keeps working.

## Simulator labs

Each lab presents a short admin "mission," a mock Azure Portal configuration screen with a handful of decisions to make (validated against a stored correct configuration, with escalating hints on a second attempt), and a 3-question mastery quiz that must be answered perfectly to mark the lab complete. Labs are cross-linked to the lesson(s) that teach their concepts, and the lesson screen surfaces a "try the related simulator lab" call-out where one exists.

## Learning flow and progress tracking

- **Readiness score**: a blended score from lesson completion, lab completion, practice volume, and accuracy — a study-progress indicator, not a claimed predictor of exam outcome.
- **Weak-area tracking**: down to the specific lesson/subtopic level, not just the exam domain, driven by per-lesson accuracy stats.
- **Lesson checks**: a 5-question quiz per lesson requiring 80%+ to mark it mastered.
- **Mixed exam simulation**: up to 50 questions, weighted to match the official AZ-104 domain percentages.
- All progress is stored client-side in `localStorage` — no account, backend, or network calls are required.

## Technologies used

- Vanilla HTML5, CSS3 (custom properties, grid/flexbox, no framework), and ES2017+ JavaScript
- No build tooling, package manager, or external JS dependencies — only Google Fonts are loaded externally
- Designed for static hosting (GitHub Pages or any static file host)

## Run it

This is a static web app with no build step. Keep the folder structure intact (`index.html`, `style.css`, `app.js`, and the `data/` folder together), then either:

- Open `index.html` directly in a browser, or
- Deploy the folder as-is to any static host, such as GitHub Pages.

No `npm install`, build step, Azure account, Azure subscription, or paid Azure resources are required — including for the simulator labs, which are entirely local.

## Progress storage

Progress is stored in the browser under the key `cloudAdminPrepV2`. The app also attempts to carry forward compatible practice history from an older `cloudAdminPrepV1` key if present, without incorrectly marking the current, more detailed lessons as already mastered.

## Important note

CloudAdmin Prep is an independent study tool and is not affiliated with Microsoft. The curriculum is aligned to the Microsoft Learn AZ-104 skills measured as of April 17, 2026 (verified against the official study guide). Passing a certification exam can never be guaranteed; the app is designed to build understanding, hands-on reasoning, and exam readiness.
