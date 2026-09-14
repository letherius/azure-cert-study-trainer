# AZ-104 Curriculum Coverage

This curriculum is aligned to the official Microsoft Learn study guide for Exam AZ-104: Microsoft Azure Administrator — **"Skills measured as of April 17, 2026"** (`learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104`), verified directly against that page during the v3 curriculum revamp. If Microsoft publishes a new skills outline, this file and the corresponding lessons in `data/lessons.js` should be revisited together.

Every lesson lives in `data/lessons.js` and carries an `examLevel` of either `az900` (foundational scaffolding) or `az104` (a directly examinable objective). Every lesson can include real Azure Portal steps, Azure CLI commands, and Azure PowerShell cmdlets where an administrator would realistically use them — not for every lesson, only where the tool adds teaching value.

## Foundations — 6 lessons (`examLevel: az900`, except the last)

These lessons are intentionally short and exist only to make the administrator material understandable to a new learner. They are not scored AZ-104 objectives themselves.

1. How Azure Is Organized
2. Azure Resource Manager and the Portal
3. Portal, Cloud Shell, Azure CLI, and PowerShell
4. Networking Words You Must Know
5. Availability, Security, and Shared Responsibility
6. How to Decode AZ-104 Questions — `examLevel: az104` (an exam-taking meta-skill lesson, not AZ-900 content; it teaches the least-privilege, permission-type-vs-scope comparison method used throughout the practice bank)

## Manage Azure identities and governance — 20–25%

### Lessons
- Microsoft Entra Users and Groups — *lab: Create an Entra User and Group Assignment*
- Licenses, External Users, and SSPR
- Azure RBAC: Who Can Do What, and Where — *lab: Assign RBAC at Least Privilege* — explicitly teaches that **role assignments are additive across scopes**
- Azure Policy, Resource Locks, and Tags — *lab: Enforce Tags and Protect Production*
- Subscriptions, Management Groups, and Cost Control

### Objective coverage
- Create and manage Microsoft Entra users and groups
- Manage licenses, external users, and SSPR
- Manage built-in Azure roles; assign roles at different scopes; interpret access assignments — **including additive RBAC across scopes** (e.g., Reader at a subscription plus Contributor on one resource group)
- Implement and manage Azure Policy; configure resource locks; apply and manage tags
- Manage resource groups and subscriptions
- Manage costs using alerts, budgets, and Azure Advisor recommendations; configure management groups

## Implement and manage storage — 15–20%

### Lessons
- Creating and Configuring Storage Accounts — *lab: Create and Configure a Storage Account* — covers **account creation decisions**: StorageV2 vs. legacy kinds, Standard vs. Premium performance, naming rules, then redundancy/encryption
- Access Keys, SAS, and Stored Access Policies — *lab: Create a Safe SAS*
- Storage Firewalls, Private Access, and Data-Plane Permissions — explicitly teaches **management-plane vs. data-plane permissions** and roles such as Storage Blob Data Reader
- Blob Containers, Access Tiers, and Soft Delete — explicitly teaches **soft delete for both blobs and containers** as two independent settings — *lab: Configure Blob Lifecycle and Recovery*
- Azure Files: Shares, Snapshots, and Soft Delete — Azure Files' own, separate soft-delete and snapshot feature
- AzCopy, Storage Explorer, Lifecycle, Versioning, and Replication

### Objective coverage
- Configure storage firewalls and virtual networks
- Create and use SAS tokens; configure stored access policies; manage access keys; configure identity-based access for Azure Files
- **Create and configure storage accounts** (account kind, performance tier, naming); configure redundancy, object replication, and encryption
- Manage data using Azure Storage Explorer and AzCopy
- Create/configure a file share and a blob container; configure storage tiers
- **Configure soft delete for blobs and containers** (two independent settings)
- Configure snapshots and soft delete for Azure Files
- Configure blob lifecycle management; configure blob versioning

## Deploy and manage Azure compute resources — 20–25%

### Lessons
- ARM Templates and Bicep
- Create and Size Virtual Machines — *lab: Deploy a Resilient Azure VM*
- VM Disks, Encryption at Host, and Moving VMs — distinguishes a **resource-group/subscription move** from a **region move**
- Availability Sets, Zones, and VM Scale Sets — *lab: Configure VM Scale Set Autoscale*
- Azure Container Registry
- Container Instances and Container Apps
- App Service Plans and Scaling
- App Service TLS, Domains, Networking, Backup, and Slots — *lab: Release an App Service Safely*

### Objective coverage
- Interpret, modify, deploy, export, and convert ARM/Bicep templates
- Create a virtual machine; configure encryption at host; **move a VM to another resource group, subscription, or region**; manage VM sizes and disks; deploy to availability zones/sets; deploy and configure VM Scale Sets
- Create and manage Azure Container Registry; provision containers via ACI and Container Apps; manage sizing/scaling
- Provision an App Service plan; configure scaling; create an App Service app; configure TLS certificates; map a custom domain; configure backup; configure networking; configure deployment slots

## Implement and manage virtual networking — 15–20%

### Lessons
- VNets, Subnets, and Address Spaces — *lab: Build a VNet and Subnets*
- VNet Peering, Public IPs, and User-Defined Routes
- Troubleshoot Azure Network Connectivity — *lab: Secure and Route an App Subnet*
- NSGs, ASGs, and Effective Security Rules
- Bastion, Service Endpoints, and Private Endpoints — *lab: Private PaaS Access and Load Balancing*
- Azure DNS and Load Balancer

### Objective coverage
- Create and configure virtual networks and subnets
- Create and configure VNet peering; configure public IP addresses; configure user-defined routes; troubleshoot network connectivity
- Create and configure NSGs and application security groups; evaluate effective security rules; implement Azure Bastion; configure service endpoints and private endpoints for Azure PaaS
- Configure Azure DNS; configure an internal or public load balancer; troubleshoot load balancing

## Monitor and maintain Azure resources — 10–15%

### Lessons
- Azure Monitor Metrics, Logs, Diagnostic Settings, and KQL — *lab: Route Logs and Build an Alert*
- Alerts, Action Groups, and Alert Processing Rules
- Insights, Network Watcher, and Connection Monitor — *lab: Troubleshoot with Network Watcher*
- Recovery Services Vaults, Backup Vaults, Policies, and Restore — explicitly distinguishes a **Recovery Services vault** from the newer **Backup vault** — *lab: Protect a VM with Backup and Site Recovery*
- Azure Site Recovery, Failover, and Failback — explicitly distinguishes **planned vs. unplanned failover**, plus **failback**

### Objective coverage
- Interpret metrics; configure log settings; query and analyze logs
- Set up alert rules, action groups, and alert processing rules
- Configure/interpret monitoring of VMs, storage accounts, and networks with Azure Monitor Insights; use Network Watcher and Connection Monitor
- **Create a Recovery Services vault; create an Azure Backup vault** (two distinct resource types); create/configure a backup policy; perform backup and restore operations
- Configure Azure Site Recovery for Azure resources; **perform a failover to a secondary region** (planned vs. unplanned) and failback; configure/interpret backup reports and alerts

## Learning model

The app uses a five-step flow per lesson:

1. **Understand** — plain-English explanation, "why this exists," terminology, analogy, and a real-world example
2. **Recognize** — exam traps, common mistakes, "don't confuse these" distinctions, and AZ-104 exam tips
3. **Check** — a short, ungraded knowledge check (1–3 questions) with immediate feedback, separate from the graded question bank
4. **Configure** — the related interactive mock Azure Portal lab, where one exists, with its own 3-question mastery quiz
5. **Prove** — the graded lesson check, mixed practice, and the weighted exam simulation, each with a full answer breakdown (why every option is right or wrong, not just the correct one)

This design preserves every AZ-104 objective while building genuine understanding before testing it.
