/* =========================================================
   CLOUDADMIN PREP — CURRICULUM INDEX
   Merges every track's data into the flat LESSONS, QUESTIONS,
   and LABS arrays app.js consumes. Loaded after every
   individual data/*.js file and before app.js (see
   index.html). Order here also sets the Study screen's
   sidebar order: Networking Fundamentals, then Azure
   Foundations + the 5 AZ-104 domains, then Automation & IaC.
   ========================================================= */

const LESSONS = [
  ...NETWORKING_FUNDAMENTALS_LESSONS,
  ...AZ104_TRACK_LESSONS,
  ...AUTOMATION_LESSONS,
];

const QUESTIONS = [
  ...NETWORKING_FUNDAMENTALS_QUESTIONS,
  ...AZ104_TRACK_QUESTIONS,
  ...AUTOMATION_QUESTIONS,
];

const LABS = [
  ...NETWORKING_FUNDAMENTALS_LABS,
  ...AZ104_TRACK_LABS,
  ...AUTOMATION_LABS,
];
