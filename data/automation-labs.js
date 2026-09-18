/* =========================================================
   AUTOMATION & IAC TRACK — LABS
   2 non-Azure, conceptual labs: reading PowerShell/CLI/Python
   snippets for comprehension and spotting bugs, and ordering
   a realistic Git + CI/CD workflow. Uses `nonAzure: true` like
   the Networking Fundamentals labs.
   ========================================================= */

const AUTOMATION_LABS = [
  {
    id: "automation-lab-read-the-script",
    topic: "automation",
    domain: "Automation & IaC",
    nonAzure: true,
    lessonIds: ["automation-powershell-fundamentals", "automation-cli-fundamentals", "automation-python-fundamentals"],
    title: "Read the Script: PowerShell, CLI, and Python",
    duration: "10–15 min",
    description: "Practice reading real automation snippets for comprehension, and spot the bug in each one.",
    mission: "You're reviewing a teammate's automation snippets before they run them against production. Reason through what each one actually does.",
    fields: [
      {
        id: "psOutput",
        label: "What does `Get-AzVM | Where-Object { $_.PowerState -eq 'VM running' } | Measure-Object` return?",
        options: ["A count of running VMs", "A list of stopped VMs", "An error — this syntax is invalid", "The names of all VMs regardless of state"],
        answer: "A count of running VMs",
        help: "Where-Object filters to running VMs, then Measure-Object counts the objects passed to it.",
      },
      {
        id: "cliQuery",
        label: "What does `az vm list --query \"[?powerState=='VM running'].name\" -o tsv` do?",
        options: ["Prints the names of running VMs, one per line", "Prints all VM properties as JSON", "Deletes all running VMs", "Creates a new VM named \"running\""],
        answer: "Prints the names of running VMs, one per line",
        help: "The --query filters to running VMs and extracts just the name field; -o tsv prints plain lines instead of JSON.",
      },
      {
        id: "bugFix",
        label: "This PowerShell line has a bug: `if ($vm.PowerState = \"VM stopped\") { ... }`. What's wrong?",
        options: ["It uses assignment (=) instead of comparison (-eq)", "Nothing is wrong", "PowerShell doesn't support if statements", "PowerState can't be checked this way at all"],
        answer: "It uses assignment (=) instead of comparison (-eq)",
        help: "PowerShell comparison uses -eq, not =. A single = would assign a value, not compare one.",
      },
      {
        id: "pythonBug",
        label: "This Python snippet has a bug: `if region = \"eastus2\":`. What's wrong?",
        options: ["Python uses == for comparison, not =", "Python requires curly braces here", "The word \"region\" is reserved in Python", "Nothing is wrong"],
        answer: "Python uses == for comparison, not =",
        help: "A single = is assignment in Python too; comparison requires ==, and this line would actually raise a syntax error.",
      },
    ],
    success: "You correctly read what each snippet does and spotted the classic assignment-vs-comparison bug in two different languages.",
    quiz: [
      {
        question: "In both PowerShell and Python, what is the risk of using = instead of == (or -eq)?",
        answer: "It assigns a value instead of comparing one, which usually causes an error or unintended behavior",
        options: [
          "It assigns a value instead of comparing one, which usually causes an error or unintended behavior",
          "There is no difference between = and == in either language",
          "It only matters in PowerShell, not Python",
          "It only matters in Python, not PowerShell",
        ],
        explanation: "Both languages distinguish assignment from comparison, and mixing them up is one of the most common scripting mistakes.",
      },
      {
        question: "What does Azure CLI's --query flag do?",
        answer: "Filters and reshapes JSON output to just the fields you need",
        options: [
          "Filters and reshapes JSON output to just the fields you need",
          "Deletes resources matching a filter",
          "Switches the CLI to PowerShell syntax",
          "Encrypts the command's output",
        ],
        explanation: "--query uses JMESPath to filter and reshape the JSON response before it's displayed.",
      },
      {
        question: "What does PowerShell's Where-Object cmdlet do?",
        answer: "Filters a collection of objects based on a condition",
        options: [
          "Filters a collection of objects based on a condition",
          "Creates a new Azure resource",
          "Converts objects to JSON",
          "Deletes objects that fail a condition",
        ],
        explanation: "Where-Object filters objects passed through the pipeline based on the condition in its script block.",
      },
    ],
  },
  {
    id: "automation-lab-order-the-pipeline",
    topic: "automation",
    domain: "Automation & IaC",
    nonAzure: true,
    lessonIds: ["automation-git-fundamentals", "automation-cicd-concepts", "automation-iac-concepts"],
    title: "Order the Git and CI/CD Workflow",
    duration: "8–12 min",
    description: "Put a realistic infrastructure-change workflow in the correct order, from first edit to production deployment.",
    mission: "You need to add a new subnet to a shared Bicep file used by your whole team, and get it safely into production.",
    fields: [
      {
        id: "step1",
        label: "What should you do first, before editing anything?",
        options: ["Create a new branch for the change", "Push directly to the main branch", "Deploy directly to production", "Delete the existing VNet"],
        answer: "Create a new branch for the change",
        help: "Isolating your change on its own branch keeps the shared main branch stable while you work.",
      },
      {
        id: "step2",
        label: "You've edited the Bicep file on your branch. What's next?",
        options: ["Commit the change with a clear, descriptive message", "Immediately deploy to production", "Delete your branch", "Merge without any review"],
        answer: "Commit the change with a clear, descriptive message",
        help: "A commit saves a snapshot with a message explaining what changed and why.",
      },
      {
        id: "step3",
        label: "You've committed your change locally. What's next?",
        options: ["Push the branch and open a pull request for review", "Email your teammates the raw JSON file", "Skip review and merge directly into main", "Rewrite the entire repository's history"],
        answer: "Push the branch and open a pull request for review",
        help: "Pushing shares your branch, and a pull request is the standard review gate before merging.",
      },
      {
        id: "step4",
        label: "Your pull request is approved and merged. In a CI/CD pipeline, what should happen before production deployment?",
        options: ["Validation and deployment to a test environment first, then an approval gate", "Immediate production deployment with no validation", "Deletion of the test environment", "An automatic rollback regardless of outcome"],
        answer: "Validation and deployment to a test environment first, then an approval gate",
        help: "CI/CD pipelines typically validate and prove a change works in a lower environment before a gated production deployment.",
      },
    ],
    success: "You correctly ordered the full workflow: branch, commit, pull request, then validated test deployment with an approval gate before production.",
    quiz: [
      {
        question: "Why create a branch before editing shared infrastructure code?",
        answer: "It isolates your change so the shared main branch stays stable while you work",
        options: [
          "It isolates your change so the shared main branch stays stable while you work",
          "Branches are required by Git and serve no other purpose",
          "It automatically deploys your change to production",
          "It deletes the previous version of the file",
        ],
        explanation: "Branching lets you work without disrupting the shared codebase until your change is ready and reviewed.",
      },
      {
        question: "What is the purpose of a pull request in this workflow?",
        answer: "It lets teammates review the change before it merges into the shared branch",
        options: [
          "It lets teammates review the change before it merges into the shared branch",
          "It immediately deploys the change to every environment",
          "It permanently deletes the feature branch",
          "It converts the Bicep file into ARM JSON",
        ],
        explanation: "A pull request is the standard review checkpoint before a change is merged.",
      },
      {
        question: "Why deploy to a test environment before production in a CI/CD pipeline?",
        answer: "To validate the change works before it risks affecting production",
        options: [
          "To validate the change works before it risks affecting production",
          "Because production deployments are not allowed by Git",
          "Because test environments are required to have an approval gate",
          "Because Bicep files can only be deployed once",
        ],
        explanation: "Testing lower environments first is the safety net CI/CD pipelines are built around.",
      },
    ],
  },
];
