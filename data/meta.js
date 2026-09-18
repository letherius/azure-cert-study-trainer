/* =========================================================
   CLOUDADMIN PREP — CURRICULUM METADATA
   Shared lookups used by every data/*.js file and app.js.
   Loaded before those files (see index.html).

   CloudAdmin Prep covers three kinds of content:
     - "netfund"    Networking Fundamentals (pre-Azure, vendor-neutral
                     networking — not itself an AZ-104 exam domain)
     - "automation" Automation & Infrastructure as Code (real-world
                     Cloud Engineer skill, not an AZ-104 exam domain)
     - the 5 graded AZ-104 domains (identity/storage/compute/
       networking/monitoring) plus "foundations" (AZ-900 scaffolding)

   AZ-104 content is aligned to the Microsoft "Skills measured as of
   April 17, 2026" outline. Networking Fundamentals and Automation
   content is real-world Cloud Engineer knowledge that intentionally
   goes beyond what AZ-104 measures — see examLevel below.
   ========================================================= */

const TOPIC_NAMES = {
  mixed: "Mixed AZ-104",
  netfund: "Networking Fundamentals",
  automation: "Automation & IaC",
  foundations: "Azure Foundations",
  identity: "Identity & Governance",
  storage: "Storage",
  compute: "Compute",
  networking: "Virtual Networking",
  monitoring: "Monitoring & Recovery",
};

// The five graded AZ-104 domains. "foundations", "netfund", and
// "automation" are deliberately excluded: they are prerequisite/
// real-world scaffolding, not scored AZ-104 exam domains, and must
// stay out of the weighted mixed-exam simulation below.
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
  career: "Real-world · beyond AZ-104",
};

// Ticket (Work Simulator) difficulty labels, used for filtering/display.
const TICKET_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
