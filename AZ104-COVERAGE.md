# AZ-104 Curriculum Coverage

This curriculum follows the Microsoft AZ-104 skills measured as of April 17, 2026.

## Foundations — 6 lessons

These lessons are intentionally short and exist only to make the administrator material understandable to a new learner.

1. How Azure Is Organized
2. Azure Resource Manager and the Portal
3. Portal, Cloud Shell, Azure CLI, and PowerShell
4. Networking Words You Must Know
5. Availability, Security, and Shared Responsibility
6. How to Decode AZ-104 Questions

## Manage Azure identities and governance — 20–25%

### Lessons
- Microsoft Entra Users and Groups
- Licenses, External Users, and Self-Service Password Reset
- Azure RBAC: Who Can Do What and Where
- Azure Policy, Resource Locks, and Tags
- Subscriptions, Management Groups, and Cost Governance

### Simulator labs
- Create Entra User and Group Assignment
- Assign RBAC at Least Privilege
- Enforce Tags and Protect Production

### Objective coverage
- Create and manage Microsoft Entra users and groups
- Manage licenses, external users, and SSPR
- Built-in Azure roles, scope, role assignment, and access interpretation
- Azure Policy, resource locks, and tags
- Resource groups and subscriptions
- Cost alerts, budgets, Azure Advisor recommendations, and management groups

## Implement and manage storage — 15–20%

### Lessons
- Storage Accounts, Redundancy, and Encryption
- Access Keys, SAS, and Stored Access Policies
- Storage Firewalls, Private Access, and Identity-Based Azure Files
- Blob Containers and Access Tiers
- Azure Files, Snapshots, and Soft Delete
- AzCopy, Storage Explorer, Lifecycle, Versioning, and Replication

### Simulator labs
- Choose Storage Redundancy and Encryption
- Create a Safe SAS
- Configure Blob Lifecycle and Recovery

### Objective coverage
- Storage firewalls and virtual networks
- SAS, stored access policies, access keys, and identity-based Azure Files
- Storage account configuration and redundancy
- Object replication and encryption
- Storage Explorer and AzCopy
- Azure Files and Blob Storage
- Access tiers, soft delete, snapshots, lifecycle management, and versioning

## Deploy and manage Azure compute resources — 20–25%

### Lessons
- ARM Templates and Bicep
- Create and Size Azure Virtual Machines
- VM Disks, Encryption at Host, and Resource Moves
- Availability Sets, Zones, and Virtual Machine Scale Sets
- Azure Container Registry
- Azure Container Instances and Azure Container Apps
- App Service Plans and Scaling
- App Service TLS, Domains, Networking, Backup, and Slots

### Simulator labs
- Deploy a Resilient Azure VM
- Configure VM Scale Set Autoscale
- Release an App Service Safely

### Objective coverage
- Interpret, modify, deploy, export, and convert ARM/Bicep templates
- Create and configure VMs
- Encryption at host, VM moves, sizes, disks, and availability options
- VM Scale Sets
- Azure Container Registry
- Azure Container Instances and Azure Container Apps
- App Service plans, scaling, TLS, custom DNS, backup, networking, and deployment slots

## Implement and manage virtual networking — 15–20%

### Lessons
- VNets, Address Spaces, and Subnets
- VNet Peering, Public IPs, and User-Defined Routes
- Troubleshoot Network Connectivity
- NSGs, ASGs, and Effective Security Rules
- Bastion, Service Endpoints, and Private Endpoints
- Azure DNS and Load Balancer

### Simulator labs
- Build a VNet and Subnets
- Secure and Route an App Subnet
- Private PaaS Access and Load Balancing

### Objective coverage
- VNets and subnets
- VNet peering, public IPs, and user-defined routes
- Network connectivity troubleshooting
- NSGs, ASGs, and effective security rules
- Azure Bastion
- Service endpoints and private endpoints
- Azure DNS
- Internal/public Azure Load Balancer and troubleshooting

## Monitor and maintain Azure resources — 10–15%

### Lessons
- Azure Monitor Metrics, Logs, Diagnostic Settings, and KQL
- Alerts, Action Groups, and Alert Processing Rules
- Insights, Network Watcher, and Connection Monitor
- Azure Backup Vaults, Policies, and Restore
- Azure Site Recovery and Failover

### Simulator labs
- Route Logs and Build an Alert
- Troubleshoot with Network Watcher
- Protect a VM with Backup and Site Recovery

### Objective coverage
- Metrics and logs
- Diagnostic settings and log queries
- Alert rules, action groups, and alert processing rules
- VM, Storage, and Network Insights
- Network Watcher and Connection Monitor
- Recovery Services vaults and Backup vaults
- Backup policies, backup operations, and restore
- Azure Site Recovery, failover, reports, and alerts

## Learning model

The app intentionally uses four layers:

1. **Understand** — beginner-friendly explanation and mental model
2. **Recognize** — exam traps, wording clues, and scenarios
3. **Configure** — interactive mock Azure Portal lab with validated choices
4. **Prove** — lesson checks, lab quizzes, mixed practice, and weak-area review

This design preserves the AZ-104 objectives while reducing unnecessary jargon during initial learning.
