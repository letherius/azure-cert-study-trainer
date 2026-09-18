# CloudAdmin Prep

CloudAdmin Prep is a browser-based **Cloud Engineer training system**. It starts from zero networking knowledge, builds through Azure administration and real-world automation, and ends with AZ-104 (Microsoft Azure Administrator) exam preparation — all in one static web app, with a troubleshooting-ticket simulator and a journal for turning finished work into interview evidence.

It is a static site: plain HTML, CSS, and JavaScript, no framework, no backend, no build step, and no Azure subscription required to use it.

## Why this project exists

Most AZ-104 practice tools assume you already think like a network/cloud administrator and just need exam content. This project doesn't assume that. It's built for someone who works in IT but hasn't owned networking, and teaches that first — then maps every fundamental straight onto its Azure equivalent, so the AZ-104 material never feels like a new subject.

The learning flow, end to end:

**Networking fundamentals → Azure administration → Automation & IaC → Troubleshooting tickets → AZ-104 exam prep**

Within each lesson: **Lesson → Knowledge check → Simulated lab (where relevant) → Graded quiz → Full answer breakdown.** A learner reads a real lesson, checks their own understanding immediately, applies the concept in a local simulator, gets tested on it, and sees *why* every answer choice — not just the correct one — is right or wrong.

## Curriculum

| Track | Lessons | Questions | Labs | Scope |
|---|---|---|---|---|
| Networking Fundamentals | 14 | 31 | 3 | Vendor-neutral, pre-Azure — LANs, IP addressing, subnetting, routing, VLANs, firewalls, VPNs |
| AZ-104 (Foundations + 5 domains) | 36 | 90 | 15 | Graded AZ-104 objectives, aligned to Microsoft Learn's "Skills measured as of April 17, 2026" |
| Automation & IaC | 7 | 21 | 2 | PowerShell, Azure CLI, Python, Terraform/Bicep concepts, JSON/YAML, Git, CI/CD |
| **Total** | **57** | **142** | **20** | |

Plus a **12-ticket Cloud Engineer Work Simulator** (4 Beginner, 4 Intermediate, 4 Advanced) and an unlimited-entry **Cloud Engineer Journal** for portfolio evidence — see below.

Every lesson's `examLevel` field is tagged `az900`, `az104`, or `career` (real-world knowledge beyond what AZ-104 currently measures), so the app is always explicit about what's exam-scoped and what's professional depth. See [`AZ104-COVERAGE.md`](AZ104-COVERAGE.md) for the full AZ-104 objective-by-objective mapping.

Every question has balanced-length distractors (so the correct answer can't be spotted by how it reads) and a full explanation for *every* option, not just the correct one. Every lesson with real tooling relevance includes actual CLI/PowerShell/Python/Git command examples (verified against Microsoft/tool documentation, never invented syntax) alongside plain-English and technical explanations, terminology, analogies, real-world examples, common mistakes, and a short knowledge check.

## Cloud Engineer Work Simulator

Twelve realistic support tickets, each with a scenario, known evidence (VM state, IPs, NSG rules, recent changes — whatever's relevant), and a sequence of diagnostic decisions. Every choice gets immediate feedback — including *why* the tempting wrong answers are wrong — before the ticket reveals its full resolution, what skills it practiced, and why the road not taken would have gone wrong. Nothing here touches a real Azure environment.

## Cloud Engineer Journal

A simple Problem → Environment → Action → Validation → Lessons-learned form for capturing what a finished lab or ticket actually taught you. Entries are saved to the browser and can be copied as Markdown for a resume, portfolio, or interview prep notes — this is what turns "I did some labs" into a story you can tell in an interview.

## Architecture

Curriculum content and application logic are separated so either can change independently, and each content track lives in its own file so the codebase stays navigable as it grows:

```
index.html                              Screen markup for every screen (Home, Study, Practice, Quiz,
                                         Results, Labs, Simulator, Weak Areas, Journal)
style.css                               All styling, including the mock Azure Portal / neutral
                                         workspace UI, ticket simulator, and journal
app.js                                  All application logic: rendering, navigation, progress
                                         tracking, quiz/lab/ticket engines, journal — no content
data/
  meta.js                               Shared lookups: topic names, AZ-104 exam weights,
                                         exam-level labels, ticket difficulty labels
  networking-fundamentals-lessons.js    14 Networking Fundamentals lessons
  networking-fundamentals-questions.js  31 graded questions for that track
  networking-fundamentals-labs.js       3 non-Azure subnetting/troubleshooting labs
  lessons.js                            36 AZ-104 lessons (Foundations + 5 domains)
  questions.js                          90 graded AZ-104 questions
  labs.js                               15 AZ-104 Azure Portal Simulator labs
  automation-lessons.js                 7 Automation & IaC lessons
  automation-questions.js               21 graded questions for that track
  automation-labs.js                    2 non-Azure script-reading / workflow-ordering labs
  index.js                              Merges every track into the flat LESSONS/QUESTIONS/LABS
                                         arrays app.js consumes, in learning-path order
  tickets.js                            12 Work Simulator tickets
AZ104-COVERAGE.md                       AZ-104 curriculum-to-objective mapping
```

`index.html` loads every `data/*.js` file before `app.js` as plain (non-module) scripts — each track file simply declares its own top-level `const` array, `data/index.js` merges them, and `app.js` consumes the merged `LESSONS`, `QUESTIONS`, `LABS` (plus `TICKETS` from `data/tickets.js`) globals. No bundler, no module loader, no CORS restrictions when opening `index.html` directly from disk.

Lesson, question, lab, and ticket IDs are stable identifiers used for progress tracking, cross-referencing (a lesson's `relatedLab`, a lab's `lessonIds`, a question's `lessonId`, a ticket's `relatedLessons`), and localStorage keys — preserved across content revisions so a learner's saved progress keeps working.

**Keeping AZ-104 readiness honest:** Networking Fundamentals and Automation & IaC are real-world tracks, not graded AZ-104 domains. The app scopes the "AZ-104 readiness" score, and its Questions/Accuracy/Lessons stats, to AZ-104-relevant activity only (see `AZ104_SCOPE_TOPICS` in `app.js`) — completing a networking-fundamentals lab or an automation quiz will never inflate (or dilute) the AZ-104 number. Those two tracks get their own progress bars on the home screen instead.

## Learning flow and progress tracking

- **Learning path order**: Networking Fundamentals → Azure Foundations → the 5 AZ-104 domains → Automation & IaC, reflected in the Study screen's lesson order and in which lesson a brand-new learner is recommended first.
- **AZ-104 readiness score**: a blended score from AZ-104 lesson completion, AZ-104 lab completion, AZ-104 practice volume, and AZ-104 accuracy — a study-progress indicator, not a claimed predictor of exam outcome, and explicitly not calculated from lessons merely being opened.
- **Skill-track progress**: separate, honestly-labeled progress bars for Networking Fundamentals and Automation & IaC.
- **Weak-area tracking**: down to the specific lesson/subtopic level, not just the exam domain, driven by per-lesson accuracy stats.
- **Lesson checks**: a 5-question quiz per lesson requiring 80%+ to mark it mastered.
- **Mixed exam simulation**: up to 50 questions, weighted to match the official AZ-104 domain percentages — scoped to the 5 AZ-104 domains only.
- **Work Simulator progress**: tracked separately as tickets worked, not blended into AZ-104 readiness.
- All progress is stored client-side in `localStorage` — no account, backend, or network calls are required. Journal entries are stored under their own separate key so they're never lost by a curriculum data change.

## Technologies used

- Vanilla HTML5, CSS3 (custom properties, grid/flexbox, no framework), and ES2017+ JavaScript
- No build tooling, package manager, or external JS dependencies — only Google Fonts are loaded externally
- Designed for static hosting (GitHub Pages or any static file host)

## Run it

This is a static web app with no build step. Keep the folder structure intact (`index.html`, `style.css`, `app.js`, and the `data/` folder together), then either:

- Open `index.html` directly in a browser, or
- Deploy the folder as-is to any static host, such as GitHub Pages.

No `npm install`, build step, Azure account, Azure subscription, or paid Azure resources are required — including for every simulator lab and the Work Simulator, all of which are entirely local.

## Progress storage

Study/lab/ticket progress is stored in the browser under the key `cloudAdminPrepV2`. Journal entries are stored separately under `cloudAdminPrepJournalV1`. The app also attempts to carry forward compatible practice history from an older `cloudAdminPrepV1` key if present, without incorrectly marking the current, more detailed lessons as already mastered.

## Important note

CloudAdmin Prep is an independent training tool and is not affiliated with Microsoft. Its AZ-104 curriculum is aligned to the Microsoft Learn AZ-104 skills measured as of April 17, 2026 (verified against the official study guide); its Networking Fundamentals and Automation & IaC tracks are real-world Cloud Engineer content that intentionally goes beyond what AZ-104 currently measures. Passing a certification exam — or landing a specific job — can never be guaranteed; the app is designed to build genuine understanding, hands-on reasoning, and portfolio-worthy practice.
