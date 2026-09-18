/* =========================================================
   AUTOMATION & INFRASTRUCTURE AS CODE TRACK
   7 lessons giving a Cloud Engineer just enough PowerShell,
   Azure CLI, Python, IaC, JSON/YAML, Git, and CI/CD to
   automate real infrastructure work — not a full programming
   course. examLevel: "career" throughout, since AZ-104 expects
   familiarity with these tools but does not test scripting
   syntax directly.

   Reuses the lesson schema from data/lessons.js. Code samples
   use the existing { command, explanation } shape under
   whichever field name fits the lesson (cli, powershell,
   python, yaml, json, git) — app.js renders each with
   renderCommandBlock() under an appropriate label.
   ========================================================= */

const AUTOMATION_LESSONS = [
  {
    id: "automation-powershell-fundamentals",
    topic: "automation",
    domain: "Automation & IaC",
    title: "PowerShell Fundamentals for Cloud Engineers",
    examLevel: "career",
    summary: "Learn enough PowerShell to read, understand, and write simple Azure administration scripts.",
    plain: "PowerShell is a command-line shell and scripting language built around objects, not plain text. You give it commands (cmdlets), it hands you back structured data you can filter, loop over, and reuse — which is exactly what repetitive Azure administration needs.",
    why: "AZ-104 explicitly expects PowerShell familiarity, and in the real world, any task you do more than twice in the Azure portal is a task worth scripting. PowerShell (via the Az module) is one of the two primary ways Cloud Engineers automate Azure.",
    analogy: "Think of a traditional command-line tool as handing you a single printed receipt — you have to read it as text. PowerShell instead hands you the actual itemized shopping cart as data, so you can sort it, filter it, or total it up programmatically instead of parsing text by hand.",
    terminology: [
      { term: "Cmdlet", definition: "A PowerShell command, always named Verb-Noun (like Get-Process or New-AzVM)." },
      { term: "Variable", definition: "A named container for a value, written with a $ prefix, e.g. $name = \"Jordan\"." },
      { term: "Object", definition: "A structured piece of data with named properties — PowerShell cmdlets return objects, not plain text." },
      { term: "Pipeline", definition: "The | symbol, used to pass the output of one cmdlet as input to the next." },
      { term: "Property", definition: "A named piece of data on an object, accessed with dot notation, e.g. $vm.Name." },
    ],
    points: [
      "Cmdlets follow a predictable Verb-Noun pattern: Get- retrieves, New- creates, Set- modifies, Remove- deletes.",
      "The pipeline (|) lets you chain cmdlets together, passing objects from one to the next.",
      "Where-Object filters a collection of objects based on a condition.",
      "ForEach-Object runs a block of code once for every object passed into it.",
      "Functions let you package a block of PowerShell into a reusable, named unit you can call repeatedly.",
      "try/catch lets a script handle an error gracefully instead of crashing partway through a batch of changes.",
    ],
    distinctions: [
      { a: "PowerShell", b: "Azure CLI", note: "Both can do the same Azure tasks. PowerShell works with structured .NET objects and favors Verb-Noun cmdlets; Azure CLI works more like a traditional command-line tool with text/JSON output and az verb-noun-style flags. Many Cloud Engineers use both, picking whichever fits the task or team convention." },
    ],
    scenario: "You need to list every VM in a resource group that is currently stopped, so you can decide whether to deallocate them and save cost.",
    realWorldExample:
      "Get-AzVM -ResourceGroupName \"rg-app-prod\" | Where-Object { $_.PowerState -eq \"VM stopped\" } | Select-Object Name, PowerState\n" +
      "This one line retrieves every VM in the resource group (an array of objects), filters it down to only the ones whose PowerState property equals \"VM stopped\", then shows just the Name and PowerState columns — no text-parsing required.",
    powershell: [
      { command: "$vms = Get-AzVM -ResourceGroupName \"rg-app-prod\"", explanation: "Stores the collection of VM objects in a variable for reuse." },
      { command: "$vms | Where-Object { $_.Name -like \"web-*\" }", explanation: "Filters the collection to only VMs whose name starts with \"web-\"." },
      { command: "foreach ($vm in $vms) { Write-Output $vm.Name }", explanation: "Loops over each VM object and prints its Name property." },
      { command: "function Get-StoppedVMs {\n  param([string]$ResourceGroupName)\n  Get-AzVM -ResourceGroupName $ResourceGroupName -Status |\n    Where-Object { $_.PowerState -eq \"VM stopped\" }\n}", explanation: "Defines a reusable function that takes a resource group name as a parameter and returns its stopped VMs." },
      { command: "try {\n  Remove-AzVM -ResourceGroupName \"rg-app-prod\" -Name \"vm-old\" -Force\n} catch {\n  Write-Warning \"Could not remove VM: $_\"\n}", explanation: "Attempts to delete a VM, catching and reporting any error instead of letting the whole script crash." },
    ],
    commonMistakes: [
      "Treating PowerShell output as plain text and trying to parse it with string functions, instead of using its structured objects directly.",
      "Forgetting the $ prefix on variables, or forgetting the $_ symbol (the \"current object\") inside Where-Object/ForEach-Object blocks.",
      "Writing a long script with no error handling, so one failed step (like a resource that no longer exists) stops the entire batch.",
    ],
    traps: [
      "Get-AzVM without -Status returns basic VM info but not power state — you must explicitly request -Status to see whether a VM is running or stopped.",
      "A cmdlet name being similar to another (Remove-AzVM vs Stop-AzVM) can have very different real-world consequences — always double check before running a destructive cmdlet.",
    ],
    examTips: [
      "Recognize Verb-AzNoun as Azure PowerShell on sight — AZ-104 sometimes shows a cmdlet and asks what it does, not asking you to write one from scratch.",
      "You don't need to memorize every cmdlet — you need to recognize the pattern (Get/New/Set/Remove) and reason out what an unfamiliar one probably does.",
    ],
    remember: "PowerShell hands you objects, not text. Get- reads, New- creates, Set- changes, Remove- deletes. Where-Object filters, ForEach-Object repeats, try/catch protects against a mid-script failure.",
    relatedLab: "automation-lab-read-the-script",
    knowledgeCheck: [
      {
        question: "Which cmdlet verb would you expect to retrieve existing data without changing anything?",
        options: ["Get-", "Set-", "Remove-", "New-"],
        answer: "Get-",
        explanation: "Get- cmdlets retrieve information; they don't create, modify, or delete resources.",
      },
      {
        question: "What does the pipeline symbol (|) do?",
        options: ["Passes the output of one cmdlet as input to the next", "Comments out a line of code", "Declares a new variable", "Starts a loop"],
        answer: "Passes the output of one cmdlet as input to the next",
        explanation: "The pipeline chains cmdlets together, passing objects from one to the next.",
      },
    ],
  },
  {
    id: "automation-cli-fundamentals",
    topic: "automation",
    domain: "Automation & IaC",
    title: "Azure CLI Fundamentals and Discovering Commands",
    examLevel: "career",
    summary: "Learn the structure every Azure CLI command shares, and how to discover the right command instead of memorizing all of them.",
    plain: "Azure CLI commands almost always follow the same shape: az <service> <resource> <action> --flags. Once that pattern clicks, you can guess most commands correctly before ever looking them up — and the CLI itself has built-in tools to help you find and shape commands you don't already know.",
    why: "You will never memorize every Azure CLI command, and you shouldn't try. What actually matters is knowing the pattern well enough to guess correctly, and knowing how to discover and shape commands using the tool's own built-in help.",
    analogy: "Learning the az <service> <resource> <action> pattern is like learning a language's grammar instead of memorizing every possible sentence — once you know the grammar, you can construct (or at least recognize) sentences you've never seen before.",
    terminology: [
      { term: "az", definition: "The Azure CLI's base command; everything starts with it." },
      { term: "--help / -h", definition: "A flag available on every command and command group that shows its usage, required parameters, and examples." },
      { term: "--query", definition: "A flag that filters and reshapes JSON output using JMESPath, so you only see the fields you actually need." },
      { term: "--output / -o", definition: "A flag controlling how results are displayed: table, json (default), tsv, and others." },
      { term: "az find", definition: "A command that searches Microsoft's examples for a topic, useful when you don't know the exact command you need." },
    ],
    points: [
      "Almost every command follows: az <service> <resource> <action>, e.g. az vm create, az group list, az network vnet show.",
      "Appending --help (or -h) to any partial command shows what comes next, including required and optional parameters.",
      "--query lets you pull just the fields you want out of a large JSON response, instead of scrolling through everything.",
      "-o table turns JSON output into a readable table — extremely useful when eyeballing results during troubleshooting.",
      "az find <search term> and az <service> <resource> --help are your two best tools for discovering commands you don't already know.",
    ],
    scenario: "You need to see just the name and power state of every VM in a subscription, in a readable format, without memorizing the exact query syntax from scratch.",
    realWorldExample:
      "az vm list -d --query \"[].{Name:name, State:powerState}\" -o table\n" +
      "This lists every VM (-d includes extra details like power state), reshapes the JSON with --query to just Name and State, and displays it as a readable table with -o table — built entirely by combining three flags you can reuse on almost any az ... list command.",
    cli: [
      { command: "az vm --help", explanation: "Shows every action available under the vm command group (create, list, show, delete, and more)." },
      { command: "az group list -o table", explanation: "Lists resource groups as a readable table instead of raw JSON." },
      { command: "az vm list --query \"[].name\" -o tsv", explanation: "Extracts just the VM names as plain text lines, useful for feeding into a script loop." },
      { command: "az find \"create a storage account\"", explanation: "Searches Microsoft's own examples for commands related to a topic you're not sure how to phrase." },
      { command: "az storage account create --help", explanation: "Shows every parameter (required and optional) for creating a storage account, with usage examples." },
    ],
    commonMistakes: [
      "Trying to memorize every command instead of learning the az <service> <resource> <action> pattern and using --help to fill in the gaps.",
      "Ignoring --query and scrolling through huge raw JSON output by eye instead of shaping the output to what's actually needed.",
      "Forgetting that --output json is the default — always add -o table when you want a quick, human-readable view during troubleshooting.",
    ],
    traps: [
      "A command that looks almost right (az vm show vs az vm list) can behave completely differently — show expects one specific resource, list returns a collection.",
      "--query syntax (JMESPath) has its own small learning curve — start with the simple [].fieldName pattern shown above before attempting more complex queries.",
    ],
    examTips: [
      "AZ-104 more often tests whether you recognize what a CLI command is trying to do than whether you can write one from memory — focus on reading fluency over memorization.",
    ],
    remember: "az <service> <resource> <action> is the pattern behind almost every command. --help teaches you the next part. --query reshapes output. -o table makes it readable. az find helps when you don't know where to start.",
    relatedLab: "automation-lab-read-the-script",
    knowledgeCheck: [
      {
        question: "What does appending --help to a partial Azure CLI command do?",
        options: ["Shows the available next steps and parameters", "Runs the command in test mode", "Deletes the resource being referenced", "Switches to PowerShell syntax"],
        answer: "Shows the available next steps and parameters",
        explanation: "--help is available at every level of an Azure CLI command and shows what comes next.",
      },
      {
        question: "Which flag turns JSON output into a readable table?",
        options: ["-o table", "--query", "--help", "-o tsv"],
        answer: "-o table",
        explanation: "The --output (-o) flag controls the display format; table is the human-readable option.",
      },
    ],
  },
  {
    id: "automation-python-fundamentals",
    topic: "automation",
    domain: "Automation & IaC",
    title: "Python Fundamentals for Cloud Automation",
    examLevel: "career",
    summary: "Learn just enough Python — variables, conditionals, loops, functions, JSON, and files — to write small automation scripts, not to become a software developer.",
    plain: "Python is a general-purpose language that's become a default choice for cloud automation scripts, especially anything that needs to call an API, process JSON, or run on a schedule outside of PowerShell/CLI's comfort zone. You don't need to be a software engineer to use it productively as a Cloud Engineer.",
    why: "Many real-world automation tasks (calling Azure's REST API directly, processing exported data, building a small custom tool) are easiest in Python. This lesson intentionally stops at the basics that make you productive, not a full programming course.",
    analogy: "If PowerShell and Azure CLI are like using pre-built kitchen appliances (a blender, a toaster) for their specific jobs, Python is like a full kitchen you can use to build a completely custom recipe when the appliances alone don't do exactly what you need.",
    terminology: [
      { term: "Variable", definition: "A named value, e.g. name = \"Jordan\" (no special prefix symbol, unlike PowerShell's $)." },
      { term: "Conditional (if/elif/else)", definition: "A block of code that runs only when a condition is true." },
      { term: "Loop (for/while)", definition: "A block of code that repeats, either over a collection (for) or until a condition changes (while)." },
      { term: "Function", definition: "A reusable, named block of code defined with def, which can accept parameters and return a value." },
      { term: "JSON", definition: "A text format for structured data that Python can convert directly into native dictionaries and lists with the json module." },
      { term: "API (Application Programming Interface)", definition: "A defined way for one program to ask another program for data or to perform an action — Azure's REST API is what tools like the CLI and PowerShell ultimately call under the hood." },
    ],
    points: [
      "Python uses indentation (spaces), not curly braces, to define code blocks — this is a strict part of the language's syntax, not just a style choice.",
      "The json module converts between JSON text and native Python data structures (dictionaries and lists) with one function call each way.",
      "Reading and writing files is simple: open a file, read or write, then close it (often handled automatically with a with block).",
      "Calling a REST API from Python (commonly with the requests library) is the same idea as az or PowerShell issuing a command — all three ultimately talk to the same Azure REST API underneath.",
      "You do not need advanced programming skills to be effective — most real automation scripts are variables, a loop, a conditional, and a bit of JSON handling.",
    ],
    scenario: "You have a JSON export of 200 VM names and their regions, and need a quick script to print only the VMs located in \"eastus2\".",
    realWorldExample:
      "import json\n\n" +
      "with open(\"vms.json\") as f:\n" +
      "    vms = json.load(f)\n\n" +
      "for vm in vms:\n" +
      "    if vm[\"region\"] == \"eastus2\":\n" +
      "        print(vm[\"name\"])\n\n" +
      "This opens the JSON file, loads it into a Python list of dictionaries, loops over every VM, and prints the name of any VM whose region matches — the same for/if/print pattern shows up in the majority of small automation scripts.",
    python: [
      { command: "name = \"Jordan\"\nregion = \"eastus2\"", explanation: "Assigns two variables — no special prefix symbol is needed, unlike PowerShell." },
      { command: "if region == \"eastus2\":\n    print(\"Matches!\")\nelse:\n    print(\"No match\")", explanation: "A conditional block — note the colon and the indentation, both required by Python's syntax." },
      { command: "vm_names = [\"web-01\", \"web-02\", \"db-01\"]\nfor name in vm_names:\n    print(name)", explanation: "Loops over a list, printing each item." },
      { command: "def is_web_server(name):\n    return name.startswith(\"web-\")", explanation: "Defines a reusable function that returns True or False based on a VM's name." },
      { command: "import json\ndata = json.dumps({\"name\": \"vm-01\", \"region\": \"eastus2\"})", explanation: "Converts a Python dictionary into a JSON-formatted string." },
    ],
    commonMistakes: [
      "Mixing tabs and spaces for indentation, which Python treats as an error since indentation defines code blocks.",
      "Forgetting the colon (:) at the end of if/for/def/while lines.",
      "Trying to learn Python as a full computer-science course before writing any real automation — start small and practical instead.",
    ],
    traps: [
      "Python's == compares values for equality; a single = assigns a value — mixing them up is one of the most common beginner mistakes in any language, including Python.",
      "JSON's true/false/null are lowercase; Python's equivalents (True/False/None) are capitalized — the json module handles this conversion for you automatically, but hand-writing Python data literally requires the capitalized versions.",
    ],
    remember: "You need variables, if/else, loops, functions, and JSON handling to be productive — not a computer science degree. Python talks to the same Azure REST API that CLI and PowerShell use under the hood.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "What defines a block of code in Python (instead of curly braces)?",
        options: ["Indentation", "Semicolons", "Curly braces, just like other languages", "Parentheses"],
        answer: "Indentation",
        explanation: "Python uses consistent indentation to define code blocks, and it's enforced by the language, not just a style preference.",
      },
      {
        question: "Which Python module converts between JSON text and native Python data structures?",
        options: ["json", "requests", "os", "sys"],
        answer: "json",
        explanation: "The json module provides json.load()/json.loads() and json.dump()/json.dumps() for exactly this conversion.",
      },
    ],
  },
  {
    id: "automation-iac-concepts",
    topic: "automation",
    domain: "Automation & IaC",
    title: "Infrastructure as Code Concepts",
    examLevel: "career",
    summary: "Understand the ideas behind Terraform, Bicep, and ARM before worrying about the syntax of any one of them.",
    plain: "Infrastructure as Code (IaC) means describing the infrastructure you want in a file, instead of clicking through a portal or running one-off commands — and letting a tool figure out how to make reality match that description.",
    why: "Every real Cloud Engineering team manages production infrastructure with code, not manual portal clicks, because it's repeatable, reviewable, and auditable. Understanding the concepts here — even before deep syntax in any one tool — is what lets you read, review, and reason about any IaC codebase you're handed.",
    analogy: "Manually clicking through a portal to build infrastructure is like building furniture from memory every time, slightly differently each time. IaC is like having a detailed, written blueprint: anyone can build the exact same result, review the blueprint before construction starts, and reuse it for the next matching project.",
    terminology: [
      { term: "Declarative", definition: "Describing the desired end state (\"I want 3 VMs of this size\"), letting the tool figure out how to get there — the model Terraform, Bicep, and ARM all use." },
      { term: "Imperative", definition: "Describing the exact steps to take (\"create this, then that, then this\") — the model a plain script (like a sequence of CLI commands) typically follows." },
      { term: "State", definition: "A record (kept by Terraform, or inferred by Azure itself for Bicep/ARM) of what infrastructure currently exists, used to figure out what needs to change." },
      { term: "Parameter / Variable", definition: "A named input value that lets the same IaC definition be reused with different values for different environments." },
      { term: "Output", definition: "A value returned after a deployment completes, such as a newly created resource's connection string or ID." },
      { term: "Resource dependency", definition: "A relationship where one resource must exist before another can be created (e.g., a VNet before a subnet) — IaC tools detect and order these automatically in most cases." },
    ],
    points: [
      "IaC tools are declarative: you describe the desired end state, and the tool calculates the difference between that and what currently exists.",
      "Terraform is a multi-cloud, open-source IaC tool with its own HCL language and its own state file tracking what it has created.",
      "Bicep is Azure-specific, compiles down to ARM JSON, and doesn't need a separately managed state file — Azure itself is the source of truth.",
      "ARM templates are the original, verbose JSON format that both the Azure portal's 'Export template' feature and Bicep ultimately produce or compile to.",
      "Parameters/variables and outputs are what make a template reusable across environments instead of being a one-time, hardcoded script.",
      "IaC tools generally detect resource dependencies automatically (a subnet needs its VNet to exist first) and order operations accordingly.",
    ],
    distinctions: [
      { a: "Terraform", b: "Bicep/ARM", note: "Terraform works across multiple cloud providers using its own state file to track what it manages. Bicep and ARM are Azure-specific, and rely on Azure's own resource state rather than a separately managed state file — a meaningful operational difference even though both are declarative IaC." },
      { a: "Declarative", b: "Imperative", note: "Declarative describes the desired end state and leaves the 'how' to the tool. Imperative describes the exact sequence of steps to run. A plain script of az commands run in order is imperative; a Bicep/Terraform file is declarative." },
    ],
    scenario: "A team needs the exact same three-tier application infrastructure (VNet, subnets, VMs, load balancer) built in both a test and a production subscription, with only names and sizes differing.",
    realWorldExample: "An engineer writes one parameterized Bicep file describing a VNet, two subnets, a VM scale set, and a load balancer. They deploy it to the test subscription with test-sized parameters, review it works correctly, then deploy the exact same file to production with production-sized parameters — guaranteeing structural consistency between the two environments instead of hoping two manually-built environments match.",
    commonMistakes: [
      "Treating an IaC file as a one-time script instead of a reusable definition — hardcoding values that should be parameters defeats much of the purpose.",
      "Not understanding that Terraform's state file is critical — deleting or losing it can make Terraform lose track of what it's actually managing.",
      "Assuming IaC removes the need to understand the underlying resources — it still requires knowing what a VNet, subnet, or VM actually needs to be configured correctly.",
    ],
    traps: [
      "Manually changing a resource that IaC manages (through the portal, for example) creates \"drift\" — the real infrastructure no longer matches the code, which can cause confusing behavior on the next deployment.",
      "Bicep files are never deployed directly by Azure — they are always compiled to ARM JSON first, even though you never have to see that JSON yourself.",
    ],
    remember: "IaC describes desired end state (declarative), not steps (imperative). Terraform tracks state itself, across any cloud. Bicep/ARM are Azure-specific and rely on Azure's own state. Parameters make templates reusable; outputs return useful values after deployment.",
    relatedLab: "automation-lab-order-the-pipeline",
    knowledgeCheck: [
      {
        question: "What does \"declarative\" mean in the context of Infrastructure as Code?",
        options: ["You describe the desired end state, not the steps to get there", "You write out every individual command in exact order", "You must manually configure every resource in the portal", "You cannot reuse the same definition across environments"],
        answer: "You describe the desired end state, not the steps to get there",
        explanation: "Declarative IaC describes the target state and leaves the how to the tool.",
      },
      {
        question: "What is a key operational difference between Terraform and Bicep?",
        options: ["Terraform manages its own state file; Bicep relies on Azure's own resource state", "Bicep works across multiple cloud providers; Terraform does not", "Terraform cannot use parameters; Bicep cannot either", "There is no meaningful difference between them"],
        answer: "Terraform manages its own state file; Bicep relies on Azure's own resource state",
        explanation: "This state-management difference is one of the most practically important distinctions between the two tools.",
      },
    ],
  },
  {
    id: "automation-json-yaml",
    topic: "automation",
    domain: "Automation & IaC",
    title: "JSON and YAML for Cloud Engineers",
    examLevel: "career",
    summary: "Learn to read and write the two data formats that show up constantly in ARM templates, Azure CLI output, and CI/CD pipeline definitions.",
    plain: "JSON and YAML are both ways of writing structured data (like a list of settings, or a configuration file) as plain text. JSON uses braces and brackets; YAML uses indentation and is generally easier for humans to read and write by hand.",
    why: "ARM templates are JSON. Azure CLI's default output is JSON. Most CI/CD pipeline definitions (including Azure Pipelines and GitHub Actions) are written in YAML. You'll read and edit both formats constantly as a Cloud Engineer, even without writing a full program.",
    analogy: "JSON is like a strictly formatted legal document — every brace, bracket, and comma placement matters, and a missing comma can invalidate the whole thing. YAML is like a neatly organized outline — indentation alone shows the structure, which is easier to read but just as easy to break if the indentation is inconsistent.",
    terminology: [
      { term: "JSON (JavaScript Object Notation)", definition: "A structured text format using {} for objects, [] for lists, and \"key\": value pairs." },
      { term: "YAML (YAML Ain't Markup Language)", definition: "A structured text format using indentation (not braces) to show nesting, and a more minimal, human-friendly syntax." },
      { term: "Key-value pair", definition: "The basic building block of both formats: a name (key) paired with a value." },
      { term: "Array / list", definition: "An ordered collection of values — [] in JSON, or a dash-prefixed list in YAML." },
    ],
    points: [
      "JSON requires exact matching braces/brackets and commas between items — a single missing comma can make an entire file invalid.",
      "YAML uses indentation (consistently, with spaces, not tabs) to show nesting instead of braces.",
      "Both formats represent the same basic ideas: objects (grouped key-value pairs) and arrays (ordered lists of values).",
      "ARM templates are always JSON; Bicep is not JSON itself but compiles to it.",
      "Most CI/CD pipeline definitions (Azure Pipelines YAML, GitHub Actions workflows) are written in YAML because of its readability for configuration-style files.",
    ],
    scenario: "You need to define two storage account names as a parameter list, once in JSON (for an ARM template) and once in YAML (for a pipeline configuration file).",
    realWorldExample:
      "The same list of two account names, in both formats:\n\n" +
      "JSON:\n" +
      "{\n" +
      "  \"accountNames\": [\"stappprod01\", \"stappprod02\"]\n" +
      "}\n\n" +
      "YAML:\n" +
      "accountNames:\n" +
      "  - stappprod01\n" +
      "  - stappprod02\n\n" +
      "Both describe identical data — the difference is purely syntax: braces/brackets/commas versus indentation and dashes.",
    json: [
      { command: "{\n  \"name\": \"rg-app-prod\",\n  \"location\": \"eastus2\",\n  \"tags\": {\n    \"environment\": \"production\"\n  }\n}", explanation: "A JSON object with a nested object (tags) inside it — this is the same basic shape as an ARM template resource definition." },
    ],
    yaml: [
      { command: "name: rg-app-prod\nlocation: eastus2\ntags:\n  environment: production", explanation: "The exact same data as the JSON example above, written in YAML — no braces or commas needed." },
    ],
    commonMistakes: [
      "Mixing tabs and spaces in YAML indentation, which breaks the file's structure in ways that can be hard to spot visually.",
      "Leaving a trailing comma after the last item in a JSON array or object, which most JSON parsers reject as invalid.",
      "Assuming YAML's flexibility means indentation doesn't matter — it matters just as much as JSON's braces, just expressed differently.",
    ],
    traps: [
      "A JSON file that \"looks right\" but has one missing comma or bracket will fail to parse entirely — always validate with a linter/formatter before relying on it.",
      "YAML treats tabs as invalid for indentation in most implementations — always use spaces.",
    ],
    remember: "JSON: braces, brackets, commas, exact syntax. YAML: indentation, dashes for lists, more human-readable. Same underlying ideas (objects and arrays) in both.",
    relatedLab: null,
    knowledgeCheck: [
      {
        question: "Which format uses indentation instead of braces to show structure?",
        options: ["YAML", "JSON"],
        answer: "YAML",
        explanation: "YAML relies on consistent indentation; JSON relies on braces, brackets, and commas.",
      },
      {
        question: "What format are ARM templates always written in?",
        options: ["JSON", "YAML", "Plain text", "XML"],
        answer: "JSON",
        explanation: "ARM templates are JSON; Bicep compiles down to this same JSON format before deployment.",
      },
    ],
  },
  {
    id: "automation-git-fundamentals",
    topic: "automation",
    domain: "Automation & IaC",
    title: "Git and Version Control for Infrastructure",
    examLevel: "career",
    summary: "Learn the Git workflow every infrastructure-as-code team relies on: tracking changes, branching, and proposing changes for review.",
    plain: "Git tracks every change made to a set of files over time, letting multiple people work on the same codebase (including infrastructure code) without overwriting each other, and letting anyone see exactly what changed, when, and why.",
    why: "Once infrastructure lives in code (Bicep, Terraform, pipeline YAML), it needs the same version control discipline as any other codebase. Git is the near-universal standard, and pull requests are how infrastructure changes typically get reviewed before they touch production.",
    analogy: "Git is like a very detailed \"track changes\" history for an entire folder of documents, but far more powerful: it lets several people work on separate copies (branches) at once, then merge their changes back together, and it keeps a permanent, searchable record of exactly what every single change was and who made it.",
    terminology: [
      { term: "Repository (repo)", definition: "A folder tracked by Git, containing the full history of every tracked change." },
      { term: "Commit", definition: "A saved snapshot of changes, with a message describing what changed and why." },
      { term: "Branch", definition: "An independent line of work, allowing changes to be made without affecting the main codebase until merged." },
      { term: "Clone", definition: "Downloading a full copy of a remote repository (including its history) to your own machine." },
      { term: "Push / Pull", definition: "Sending your local commits to a remote repository (push), or fetching and merging others' commits into your local copy (pull)." },
      { term: "Merge", definition: "Combining changes from one branch into another." },
      { term: "Pull request (PR)", definition: "A request to merge one branch's changes into another, typically reviewed and approved by teammates before merging." },
      { term: ".gitignore", definition: "A file listing patterns Git should never track, such as secrets, credentials, or local temporary files." },
    ],
    points: [
      "A commit is a snapshot plus a message — a good commit message explains why a change was made, not just what changed.",
      "Branches let you work on a change in isolation before it affects the shared main codebase.",
      "A pull request is where teammates review a proposed change before it's merged — this is the standard review gate for infrastructure code changes.",
      "Push sends your commits to the shared remote repository; pull brings others' commits down to your local copy.",
      ".gitignore prevents sensitive files (like credentials or local state files) from accidentally being committed and shared.",
    ],
    scenario: "You need to add a new subnet to a shared Bicep file without disrupting your teammates' in-progress work, and want your change reviewed before it merges into the main branch.",
    realWorldExample:
      "A typical workflow: git checkout -b add-data-subnet creates a new branch. You edit the Bicep file, then git add and git commit -m \"Add data subnet to app VNet\" to save the change with a clear message. git push publishes the branch to the shared remote. Finally, you open a pull request so a teammate can review the Bicep change before it merges into main and potentially triggers a deployment.",
    git: [
      { command: "git clone https://github.com/contoso/infra.git", explanation: "Downloads a full local copy of a remote repository, including its history." },
      { command: "git checkout -b add-data-subnet", explanation: "Creates and switches to a new branch for an isolated change." },
      { command: "git add main.bicep", explanation: "Stages a changed file to be included in the next commit." },
      { command: "git commit -m \"Add data subnet to app VNet\"", explanation: "Saves a snapshot of the staged changes with a descriptive message." },
      { command: "git push -u origin add-data-subnet", explanation: "Publishes the local branch to the shared remote repository." },
      { command: "git pull", explanation: "Fetches and merges the latest changes from the remote into your local branch." },
    ],
    commonMistakes: [
      "Writing vague commit messages like \"updated files\" instead of describing why the change was made (e.g., \"Configured hub-and-spoke VNet connectivity and validated routing\").",
      "Committing secrets, credentials, or connection strings directly into a repository instead of using .gitignore and a proper secrets-management approach.",
      "Working directly on the main branch instead of a feature branch, making it harder to review changes before they affect everyone.",
    ],
    traps: [
      "A merge conflict isn't a Git failure — it just means two people changed the same lines, and Git needs a human decision about which change (or both) should win.",
      "git push does not automatically mean your change has been approved or deployed — it typically still needs to go through a pull request and review process for infrastructure code.",
    ],
    remember: "Branch to isolate work. Commit with a message explaining why. Push to share. Pull request to get review before merging into main. .gitignore to keep secrets out of the repository entirely.",
    relatedLab: "automation-lab-order-the-pipeline",
    knowledgeCheck: [
      {
        question: "Which of these is the better commit message?",
        options: [
          "Configured hub-and-spoke VNet connectivity and validated routing",
          "updated files",
        ],
        answer: "Configured hub-and-spoke VNet connectivity and validated routing",
        explanation: "A good commit message explains what changed and why, not a vague placeholder.",
      },
      {
        question: "What is a pull request primarily used for?",
        options: ["Requesting review of a proposed change before merging it", "Downloading a repository for the first time", "Deleting a branch permanently", "Ignoring specific files from version control"],
        answer: "Requesting review of a proposed change before merging it",
        explanation: "A pull request is the standard review gate before changes merge into a shared branch.",
      },
    ],
  },
  {
    id: "automation-cicd-concepts",
    topic: "automation",
    domain: "Automation & IaC",
    title: "CI/CD Concepts for Cloud Infrastructure",
    examLevel: "career",
    summary: "Understand how automated pipelines build, test, and deploy infrastructure changes safely and repeatably.",
    plain: "CI/CD is the practice of automatically running steps — validating, testing, deploying — every time infrastructure code changes, instead of a person manually running commands by hand each time.",
    why: "Modern Cloud Engineering teams deploy infrastructure changes through pipelines, not by someone manually typing deployment commands into a terminal. Understanding the concepts (even before you build a pipeline yourself) is essential to working on any real infrastructure team.",
    analogy: "Think of CI/CD like an assembly line with built-in quality checks: every time a part (a code change) enters the line, it automatically goes through inspection stations (build, test) before being allowed to reach the final installation stage (deployment) — instead of a person manually inspecting and installing every single part by hand.",
    terminology: [
      { term: "CI (Continuous Integration)", definition: "Automatically building and validating code changes as soon as they're proposed, catching problems early." },
      { term: "CD (Continuous Delivery/Deployment)", definition: "Automatically deploying validated changes to an environment, often through a series of stages." },
      { term: "Pipeline", definition: "The defined sequence of automated steps a change goes through, from validation to deployment." },
      { term: "Stage / Environment", definition: "A distinct step in a pipeline, often mapping to an environment like dev, test, or production." },
      { term: "Environment variable", definition: "A configuration value provided to a pipeline at run time, rather than hardcoded into the pipeline definition." },
      { term: "Secret", definition: "A sensitive value (like a password or key) stored securely by the pipeline platform and injected at run time, never written directly into code." },
      { term: "Approval gate", definition: "A manual checkpoint requiring a person to explicitly approve before a pipeline proceeds to a sensitive stage, like production deployment." },
    ],
    points: [
      "CI catches problems early by automatically validating every proposed change (e.g., does this Bicep file even compile?) before it's merged.",
      "CD automates the deployment itself, often through progressive stages (dev, then test, then production).",
      "Secrets should always be injected securely by the pipeline platform at run time, never hardcoded directly into pipeline definitions or source code.",
      "Approval gates add a deliberate human checkpoint before a pipeline is allowed to touch a sensitive environment like production.",
      "A pipeline for infrastructure code typically validates syntax, runs a 'what-if'/plan step showing what would change, requires approval, then deploys.",
    ],
    scenario: "A team wants every Bicep change to be automatically validated when proposed, automatically deployed to a test environment, and only deployed to production after a manager explicitly approves it.",
    realWorldExample: "A pull request triggers a pipeline: Stage 1 validates the Bicep file compiles correctly. Stage 2 deploys it to the test environment and runs a smoke test. Stage 3 requires a manual approval gate. Once approved, Stage 4 deploys the exact same validated template to production — the same file that was already proven to work in test, not a hand-retyped version.",
    yaml: [
      { command: "stages:\n  - stage: Validate\n    jobs:\n      - job: BicepBuild\n  - stage: DeployTest\n    dependsOn: Validate\n  - stage: DeployProd\n    dependsOn: DeployTest\n    condition: succeeded()", explanation: "A simplified pipeline-stage outline showing validation before test deployment before production deployment, each depending on the previous stage succeeding." },
    ],
    commonMistakes: [
      "Hardcoding secrets or credentials directly into a pipeline definition file instead of using the platform's secret-management features.",
      "Deploying straight to production without first validating in a lower environment, skipping the safety net CI/CD is meant to provide.",
      "Treating an approval gate as a formality rather than an actual review checkpoint before a sensitive deployment.",
    ],
    traps: [
      "A pipeline that successfully deploys to test does not automatically mean production deployment is risk-free — differences in configuration or scale between environments can still cause issues.",
      "\"Continuous Deployment\" (fully automatic, no manual gate) and \"Continuous Delivery\" (validated and ready, but requiring a manual trigger/approval) are related but distinct — many infrastructure teams intentionally choose delivery with an approval gate for production.",
    ],
    remember: "CI validates changes early. CD automates deployment through stages. Secrets are injected securely, never hardcoded. Approval gates add a deliberate human checkpoint before sensitive environments.",
    relatedLab: "automation-lab-order-the-pipeline",
    knowledgeCheck: [
      {
        question: "What is the purpose of an approval gate in a CI/CD pipeline?",
        options: ["Requiring a person to explicitly approve before a sensitive stage proceeds", "Automatically deleting failed deployments", "Encrypting all pipeline logs", "Merging two Git branches automatically"],
        answer: "Requiring a person to explicitly approve before a sensitive stage proceeds",
        explanation: "Approval gates add a deliberate human checkpoint, commonly before production deployment.",
      },
      {
        question: "Where should secrets used by a pipeline be stored?",
        options: ["In the pipeline platform's secure secret storage, injected at run time", "Hardcoded directly in the pipeline YAML file", "In a plain text file committed to the repository", "In a code comment for visibility"],
        answer: "In the pipeline platform's secure secret storage, injected at run time",
        explanation: "Secrets should never be hardcoded into pipeline definitions or source code.",
      },
    ],
  },
];
