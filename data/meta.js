/* =========================================================
   CLOUDADMIN PREP — CURRICULUM METADATA
   Shared lookups used by lessons.js, questions.js, labs.js,
   and app.js. Loaded before those files (see index.html).
   Aligned to the Microsoft AZ-104 "Skills measured as of
   April 17, 2026" outline.
   ========================================================= */

const TOPIC_NAMES = {
  mixed: "Mixed AZ-104",
  foundations: "Azure Foundations",
  identity: "Identity & Governance",
  storage: "Storage",
  compute: "Compute",
  networking: "Virtual Networking",
  monitoring: "Monitoring & Recovery",
};

// The five graded AZ-104 domains. "foundations" is deliberately excluded:
// it is AZ-900-level scaffolding, not a scored AZ-104 exam domain.
const EXAM_TOPICS = ["identity", "storage", "compute", "networking", "monitoring"];

// Current official exam weights (midpoint of each published range) used to
// build the weighted mixed exam simulation.
const EXAM_WEIGHTS = {
  identity: 0.23,
  storage: 0.17,
  compute: 0.23,
  networking: 0.19,
  monitoring: 0.18,
};

const EXAM_LEVELS = {
  az900: "AZ-900 foundation",
  az104: "AZ-104 objective",
};
