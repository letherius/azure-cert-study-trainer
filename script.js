
document.addEventListener("DOMContentLoaded", () => {
  console.log("CloudAdmin Prep v2.0 loaded.");

  const APP = {
  "topicNames": {
    "mixed": "Mixed AZ-104",
    "foundations": "Azure Foundations",
    "identity": "Identity & Governance",
    "storage": "Storage",
    "compute": "Compute",
    "networking": "Virtual Networking",
    "monitoring": "Monitoring & Recovery"
  },
  "examTopics": [
    "identity",
    "storage",
    "compute",
    "networking",
    "monitoring"
  ],
  "examWeights": {
    "identity": 0.23,
    "storage": 0.17,
    "compute": 0.23,
    "networking": 0.19,
    "monitoring": 0.18
  },
  "studyTopics": [
    {
      "id": "foundation-hierarchy",
      "topic": "foundations",
      "domain": "Azure Foundations",
      "title": "How Azure Is Organized",
      "summary": "Learn the containers Azure uses so every later service has a place in your head.",
      "plain": "Azure is organized from broad control down to individual resources: management groups, subscriptions, resource groups, then resources.",
      "analogy": "Think of a school district. The district is like a management group, each school is a subscription, classrooms are resource groups, and the desks/computers are resources.",
      "points": [
        "A management group can organize multiple subscriptions for governance.",
        "A subscription is a management, access, and billing boundary.",
        "A resource group is a logical container for related resources.",
        "A resource can belong to only one resource group at a time.",
        "Deleting a resource group deletes the resources inside it."
      ],
      "traps": [
        "Do not confuse a resource group with a billing account.",
        "Resources in one resource group do not have to be in the same region.",
        "A resource group is not a security boundary by itself; RBAC assignments create access boundaries."
      ],
      "scenario": "You inherit three Azure subscriptions after a company merger. You want one governance layer above all three without moving resources. A management group is the right level.",
      "remember": "When a question asks 'where should this rule apply?', first identify the correct scope in the hierarchy.",
      "portalPath": "Azure portal → Management groups / Subscriptions / Resource groups"
    },
    {
      "id": "foundation-arm",
      "topic": "foundations",
      "domain": "Azure Foundations",
      "title": "Azure Resource Manager and the Portal",
      "summary": "Understand the management layer behind portal, CLI, PowerShell, ARM templates, and Bicep.",
      "plain": "Azure Resource Manager (ARM) is the management layer. The portal, CLI, PowerShell, templates, and Bicep all ultimately send requests through Azure's management plane.",
      "analogy": "The portal is the steering wheel. ARM is the engine that actually carries out the management action.",
      "points": [
        "ARM provides a consistent management layer for Azure resources.",
        "Declarative deployment means you describe the desired end state instead of scripting every click.",
        "ARM templates use JSON; Bicep is a simpler Azure-focused language that compiles to ARM.",
        "Deployments can be repeated and reviewed, which reduces configuration drift.",
        "The Activity Log records subscription-level management-plane events."
      ],
      "traps": [
        "ARM is not the same thing as a virtual machine image.",
        "A template deployment can create many resources in one operation.",
        "Do not confuse management-plane operations with data-plane access such as reading blobs."
      ],
      "scenario": "A team needs the same network and VM configuration in test and production. A Bicep or ARM deployment is more repeatable than clicking through the portal twice.",
      "remember": "Portal, CLI, PowerShell, ARM templates, and Bicep are different interfaces to the same Azure management platform.",
      "portalPath": "Azure portal → Deploy a custom template"
    },
    {
      "id": "foundation-admin-tools",
      "topic": "foundations",
      "domain": "Azure Foundations",
      "title": "Portal, Cloud Shell, Azure CLI, and PowerShell",
      "summary": "Recognize the administrator tools Microsoft expects you to be comfortable using.",
      "plain": "The Azure portal is the visual interface. Cloud Shell gives you a browser-based command environment. Azure CLI commands usually start with az. Azure PowerShell uses Az module cmdlets such as Get-AzResource.",
      "analogy": "The portal is clicking through menus, CLI is giving short commands, PowerShell is using administrator cmdlets, and Cloud Shell is the ready-to-use terminal Microsoft hosts for you.",
      "points": [
        "Azure CLI uses commands such as az group, az vm, and az network.",
        "Azure PowerShell uses Verb-AzNoun cmdlets and PowerShell objects/pipelines.",
        "Azure Cloud Shell can provide Bash or PowerShell in the browser with Azure tooling available.",
        "The portal, CLI, and PowerShell are management interfaces; the underlying Azure resource remains the same.",
        "For the exam, recognize what a command is trying to configure even if you do not memorize every parameter."
      ],
      "traps": [
        "Do not confuse Azure CLI with PowerShell syntax.",
        "AzCopy is a storage transfer tool, not the general Azure CLI.",
        "KQL queries monitoring logs; Bicep declares infrastructure; neither replaces Azure CLI/PowerShell for every admin task."
      ],
      "scenario": "You see a command beginning with az network nsg rule create. Even without memorizing every switch, recognize that Azure CLI is creating an NSG rule.",
      "remember": "az = Azure CLI. Verb-AzNoun = Azure PowerShell. KQL = logs. Bicep = infrastructure as code.",
      "portalPath": "Azure portal → Cloud Shell"
    },
    {
      "id": "foundation-networking",
      "topic": "foundations",
      "domain": "Azure Foundations",
      "title": "Networking Words You Must Know",
      "summary": "Get comfortable with IP addresses, CIDR, VNets, subnets, DNS, routes, and ports before the networking domain.",
      "plain": "A VNet is your private Azure network. Subnets divide it. Routes decide where traffic goes. NSGs decide whether traffic is allowed. DNS turns names into IP addresses.",
      "analogy": "Imagine a neighborhood: the VNet is the neighborhood, subnets are streets, routes are directions, NSGs are security gates, and DNS is the address book.",
      "points": [
        "CIDR such as /24 describes the size of an IP address range.",
        "Subnets must use non-overlapping ranges inside the VNet address space.",
        "TCP/UDP ports identify services, such as 443 for HTTPS.",
        "A route answers 'where does traffic go?'; an NSG answers 'is traffic allowed?'",
        "DNS provides name resolution and does not itself permit network traffic."
      ],
      "traps": [
        "A route can be correct while an NSG still blocks traffic.",
        "A DNS record can resolve correctly while the application is still unreachable.",
        "Do not assign overlapping address spaces to VNets you plan to peer."
      ],
      "scenario": "A VM resolves a server name to the right IP but cannot connect on TCP 443. Name resolution works, so check NSG rules, routes, and the destination service next.",
      "remember": "Keep routing, security, and name resolution as three separate questions in your head.",
      "portalPath": "Azure portal → Virtual networks"
    },
    {
      "id": "foundation-resiliency",
      "topic": "foundations",
      "domain": "Azure Foundations",
      "title": "Availability, Security, and Shared Responsibility",
      "summary": "Learn the beginner ideas behind resiliency, least privilege, and choosing how much Azure manages for you.",
      "plain": "Azure gives you multiple ways to reduce outages and reduce how much infrastructure you manage. Your job is to match the service to the requirement.",
      "analogy": "Think of IaaS as renting an empty apartment, PaaS as a serviced apartment, and SaaS as a hotel. The more the provider manages, the less you maintain.",
      "points": [
        "Availability zones are physically separate datacenter locations within supported regions.",
        "Availability sets spread VMs across fault and update domains.",
        "Least privilege means grant only the access needed, at the smallest useful scope.",
        "IaaS gives you more control and more management responsibility than PaaS.",
        "Backups protect recoverable data; high availability keeps a service running through certain failures."
      ],
      "traps": [
        "High availability is not the same thing as backup.",
        "An availability set does not protect against an entire regional outage.",
        "More permissions are not safer just because they are easier to administer."
      ],
      "scenario": "A web team only needs to host an app and does not want to patch operating systems. App Service is usually a better fit than a manually managed VM.",
      "remember": "Ask two questions: what failure must we survive, and how much infrastructure do we want to manage?",
      "portalPath": "Azure portal → Create a resource"
    },
    {
      "id": "foundation-question-decoder",
      "topic": "foundations",
      "domain": "Azure Foundations",
      "title": "How to Decode AZ-104 Questions",
      "summary": "Turn long scenarios into a small set of requirements before looking at the answer choices.",
      "plain": "AZ-104 questions often include extra details. Your job is to identify the required outcome, the scope, the failure/security condition, and the least-complex Azure feature that satisfies all of it.",
      "analogy": "Treat each scenario like a troubleshooting ticket: circle what must happen, cross out background noise, then choose the tool whose job matches the ticket.",
      "points": [
        "Watch for words such as only, minimum, least privilege, private, automatic, zone, region, restore, and failover.",
        "Separate identity, networking, compute, storage, and monitoring requirements before choosing a service.",
        "Eliminate answers that solve a different layer, even if the Azure service name sounds familiar.",
        "If two answers work, the exam often favors the one that meets all requirements with less unnecessary access or administration.",
        "After answering, explain why the other choices do not satisfy the exact requirement."
      ],
      "traps": [
        "Do not choose the most powerful role when a smaller role/scope works.",
        "Do not choose backup when the requirement is active disaster-recovery failover.",
        "Do not choose a service endpoint when the requirement explicitly says private IP.",
        "Do not choose a route when the requirement is to allow/deny traffic."
      ],
      "scenario": "A question says a PaaS service must be reachable by private IP and must not rely on its public endpoint. The phrase private IP points directly toward a private endpoint.",
      "remember": "Requirement first, Azure service second. Match the service's job to the exact clue.",
      "portalPath": "Use this method in every Practice and Exam Simulation question"
    },
    {
      "id": "identity-users-groups",
      "topic": "identity",
      "domain": "AZ-104 · Identity & Governance",
      "title": "Microsoft Entra Users and Groups",
      "summary": "Create and manage the identities that administrators and applications depend on.",
      "plain": "Microsoft Entra ID stores cloud identities. Users represent people; groups let you manage many users together instead of assigning everything one person at a time.",
      "analogy": "A user is one student. A group is a class roster. Assigning access to the class is easier than repeating it for every student.",
      "points": [
        "Create cloud users and manage properties such as display name, usage location, and account state.",
        "Use security groups for access and Microsoft 365 groups for collaboration scenarios.",
        "Dynamic membership can add or remove users based on rules when licensing supports it.",
        "Group-based assignments reduce repeated administration.",
        "Deleting or disabling an identity can affect its access immediately depending on token/session behavior."
      ],
      "traps": [
        "A resource group is an Azure resource container, not an Entra security group.",
        "Do not use a distribution list when the requirement is Azure resource permissions.",
        "Changing a user property is different from changing Azure RBAC access."
      ],
      "scenario": "Fifty employees in the Operations department all need the same Azure Reader access. Put them in a security group and assign the group instead of fifty separate users.",
      "remember": "When many users need the same access, think group first.",
      "portalPath": "Microsoft Entra ID → Users / Groups"
    },
    {
      "id": "identity-licenses-external-sspr",
      "topic": "identity",
      "domain": "AZ-104 · Identity & Governance",
      "title": "Licenses, External Users, and SSPR",
      "summary": "Handle common identity administration tasks beyond basic user creation.",
      "plain": "Licenses turn cloud features on for users, external identities let outside people collaborate, and SSPR lets users reset their own passwords under configured rules.",
      "analogy": "A license is a feature pass, an external user is a guest badge, and SSPR is a secure self-service help desk.",
      "points": [
        "Usage location may need to be set before assigning certain licenses.",
        "External users can be invited into the tenant and governed like other identities.",
        "Self-service password reset can be enabled for selected users or groups.",
        "SSPR registration methods and authentication requirements matter.",
        "Group-based licensing can simplify assignments when available."
      ],
      "traps": [
        "An external guest is not automatically an Azure subscription owner.",
        "SSPR is not the same as MFA, even though authentication methods can overlap.",
        "A license assignment does not grant Azure resource permissions."
      ],
      "scenario": "A contractor needs access to one Azure app but should remain an employee of another company. Invite the person as an external user and then grant only required access.",
      "remember": "Identity existence, licensing, authentication, and Azure authorization are separate layers.",
      "portalPath": "Microsoft Entra ID → Users / Password reset / Licenses"
    },
    {
      "id": "identity-rbac",
      "topic": "identity",
      "domain": "AZ-104 · Identity & Governance",
      "title": "Azure RBAC: Who Can Do What?",
      "summary": "Master the role, principal, and scope pattern that appears constantly on AZ-104.",
      "plain": "Azure RBAC is authorization. It combines who needs access, what role they get, and where that role applies.",
      "analogy": "Think of a keycard: the person is the security principal, the doors it opens are the role permissions, and the building/floor is the scope.",
      "points": [
        "A role assignment combines security principal + role definition + scope.",
        "Built-in roles include Reader, Contributor, Owner, and many service-specific roles.",
        "Owner can manage resources and role assignments; Contributor manages resources but normally cannot assign RBAC roles.",
        "Scopes can be management group, subscription, resource group, or individual resource.",
        "Assignments inherit downward to child scopes."
      ],
      "traps": [
        "Contributor is powerful but is not the same as Owner.",
        "Reader can view configuration but cannot modify resources.",
        "A broad subscription assignment may violate least privilege if access is needed to one resource."
      ],
      "scenario": "An app only needs to read blobs in one storage account. Give its managed identity a storage data-reader role at that storage account, not Contributor on the subscription.",
      "remember": "RBAC questions: WHO + ROLE + SCOPE.",
      "portalPath": "Resource → Access control (IAM)"
    },
    {
      "id": "identity-policy-locks-tags",
      "topic": "identity",
      "domain": "AZ-104 · Identity & Governance",
      "title": "Policy, Locks, and Tags",
      "summary": "Learn three governance tools that sound similar but solve different problems.",
      "plain": "Policy evaluates or enforces rules, locks protect resources from changes/deletion, and tags add searchable business metadata.",
      "analogy": "Policy is the rulebook, a lock is a protective cover over a button, and tags are sticky-note labels.",
      "points": [
        "Azure Policy can audit, deny, modify, or deploy settings depending on the policy effect.",
        "Policy assignments apply at a scope and can inherit downward.",
        "CanNotDelete allows authorized changes but blocks deletion.",
        "ReadOnly blocks update and deletion operations at the protected scope.",
        "Tags are name-value pairs useful for organization, reporting, and cost analysis."
      ],
      "traps": [
        "A lock does not replace RBAC.",
        "Tags do not automatically inherit from a resource group to resources unless you implement a mechanism such as Policy.",
        "Policy is for compliance/governance, not for granting a user access."
      ],
      "scenario": "Management wants every new resource to include a CostCenter tag. Use Azure Policy rather than relying on every admin to remember.",
      "remember": "Policy = rules. RBAC = permissions. Locks = protection. Tags = labels.",
      "portalPath": "Azure Policy / Resource → Locks / Tags"
    },
    {
      "id": "identity-subscriptions-cost",
      "topic": "identity",
      "domain": "AZ-104 · Identity & Governance",
      "title": "Subscriptions, Management Groups, and Cost Control",
      "summary": "Organize Azure at scale and control spending without mixing cost tools with permission tools.",
      "plain": "Management groups organize subscriptions. Subscriptions contain resource groups and resources. Cost Management, budgets, alerts, and Advisor help you understand and control spend.",
      "analogy": "Think corporate structure: management group = division, subscription = department budget, resource group = project folder.",
      "points": [
        "Management groups provide governance above subscriptions.",
        "Subscriptions are common boundaries for billing, quotas, access, and policy.",
        "Budgets track spending against a threshold and can trigger notifications or actions.",
        "Cost alerts warn when spending or budget thresholds are reached.",
        "Azure Advisor can recommend cost optimizations such as resizing or removing underused resources."
      ],
      "traps": [
        "A budget notification does not automatically stop all Azure resources.",
        "Moving a resource between resource groups does not necessarily change its region.",
        "Management groups do not directly contain VMs; they contain subscriptions."
      ],
      "scenario": "Finance wants a warning when monthly Azure spend reaches 80% of a target. Create a Cost Management budget and alert instead of an NSG or Azure Policy assignment.",
      "remember": "Cost questions usually point to Cost Management, budgets, alerts, or Advisor—not RBAC.",
      "portalPath": "Cost Management + Billing / Management groups"
    },
    {
      "id": "storage-accounts-redundancy",
      "topic": "storage",
      "domain": "AZ-104 · Storage",
      "title": "Storage Accounts, Redundancy, and Encryption",
      "summary": "Choose the right storage account behavior for availability, geography, and security.",
      "plain": "A storage account is the top-level Azure resource that can expose services such as blobs, files, queues, and tables. Redundancy controls where copies live.",
      "analogy": "Your storage account is a warehouse. LRS keeps spare copies in one facility, ZRS spreads them across facilities in one region, and geo options also copy to another region.",
      "points": [
        "LRS keeps multiple copies in one physical location; ZRS spreads copies across availability zones in a region.",
        "GRS adds asynchronous replication to a paired secondary region.",
        "RA-GRS adds read access to the secondary endpoint; GZRS combines zone and geo resiliency.",
        "Storage Service Encryption protects data at rest by default.",
        "Customer-managed keys can be used when the requirement calls for control of encryption keys."
      ],
      "traps": [
        "ZRS is not cross-region replication.",
        "GRS does not normally mean you can read from the secondary before failover; read-access variants provide that.",
        "Encryption at rest and network encryption are different requirements."
      ],
      "scenario": "A workload must remain available after a single availability-zone failure but does not require cross-region replication. ZRS is a strong match.",
      "remember": "Match the redundancy option to the exact failure the question says you must survive.",
      "portalPath": "Storage account → Redundancy / Encryption"
    },
    {
      "id": "storage-sas-keys",
      "topic": "storage",
      "domain": "AZ-104 · Storage",
      "title": "Access Keys, SAS, and Stored Access Policies",
      "summary": "Delegate storage access without giving away more power than necessary.",
      "plain": "Storage account keys are extremely powerful. SAS tokens delegate limited permissions for a limited scope and time. Stored access policies can give service SAS permissions a server-side policy to manage.",
      "analogy": "An account key is a master key. A SAS is a temporary visitor badge with selected doors and an expiration time.",
      "points": [
        "Account keys grant broad access and should be protected and rotated.",
        "A SAS can restrict resource scope, permissions, start/expiry time, protocol, and sometimes IP range.",
        "User delegation SAS uses Microsoft Entra credentials for Blob Storage and avoids signing with the account key.",
        "Stored access policies can centralize constraints for supported service SAS scenarios.",
        "Regenerating an account key can invalidate clients that still use the old key."
      ],
      "traps": [
        "Do not share the account key when a limited SAS meets the requirement.",
        "A SAS does not automatically make a private endpoint.",
        "Stored access policies are not Azure Policy."
      ],
      "scenario": "A vendor needs read-only access to one blob container for four hours. Give a tightly scoped SAS rather than the storage account key.",
      "remember": "If the clue says temporary or delegated storage access, think SAS.",
      "portalPath": "Storage account → Shared access signature / Access keys"
    },
    {
      "id": "storage-network-identity",
      "topic": "storage",
      "domain": "AZ-104 · Storage",
      "title": "Storage Firewalls, VNets, and Identity-Based Azure Files",
      "summary": "Control which networks can reach storage and which identities can use file shares.",
      "plain": "Storage security has two separate questions: can the network reach the account, and is the identity authorized to the data?",
      "analogy": "The firewall is the gate to the property. Identity authorization is the key to the building. Passing one does not guarantee the other.",
      "points": [
        "Storage firewalls can restrict access to selected networks.",
        "Service endpoints extend VNet identity to supported PaaS services over Azure networking.",
        "Private endpoints give the service a private IP in your VNet.",
        "Azure Files can use identity-based authentication in supported configurations.",
        "Data-plane roles such as Storage Blob Data Reader differ from management-plane roles."
      ],
      "traps": [
        "A private endpoint does not automatically grant data permissions.",
        "RBAC Contributor on the storage account management plane does not necessarily grant blob data access.",
        "A firewall rule cannot replace authentication."
      ],
      "scenario": "A storage account should be reachable from a private subnet without using its public endpoint. Configure a private endpoint and make sure DNS resolves the service name privately.",
      "remember": "Network path and authorization are two separate checks.",
      "portalPath": "Storage account → Networking / Access control (IAM)"
    },
    {
      "id": "storage-blob-tiers",
      "topic": "storage",
      "domain": "AZ-104 · Storage",
      "title": "Blob Containers and Access Tiers",
      "summary": "Store object data and choose the right cost/access tradeoff.",
      "plain": "Blob Storage is for object data. Containers organize blobs. Access tiers trade storage cost against retrieval frequency and cost.",
      "analogy": "Hot is the desk drawer, cool/cold is the filing room, and archive is long-term offsite storage.",
      "points": [
        "Blob containers organize blobs inside a storage account.",
        "Private access is the safe default unless anonymous public access is explicitly required.",
        "Hot is optimized for frequently accessed data.",
        "Cool/cold tiers reduce storage cost for less frequently accessed data but can increase access costs.",
        "Archive is offline and must be rehydrated before normal reading."
      ],
      "traps": [
        "Archive is not for data that must be read instantly.",
        "A container is not the same thing as a storage account.",
        "Changing a blob tier is a data-management decision, not a redundancy setting."
      ],
      "scenario": "Compliance data is rarely read and can tolerate hours before retrieval. Archive may fit better than Hot.",
      "remember": "Tier questions are about access frequency, retrieval time, and cost tradeoffs.",
      "portalPath": "Storage account → Containers"
    },
    {
      "id": "storage-files-recovery",
      "topic": "storage",
      "domain": "AZ-104 · Storage",
      "title": "Azure Files, Snapshots, and Soft Delete",
      "summary": "Work with managed file shares and the recovery options around them.",
      "plain": "Azure Files provides SMB/NFS file shares. Snapshots capture share state. Soft delete protects against accidental deletion for a retention period.",
      "analogy": "A file share is a network drive in Azure. A snapshot is a frozen picture. Soft delete is the recycle bin.",
      "points": [
        "Azure Files exposes managed file shares over supported protocols.",
        "Share quotas can limit capacity.",
        "Snapshots provide point-in-time copies of file-share state.",
        "Soft delete helps recover accidentally deleted file shares.",
        "Identity-based access can be combined with share-level and file/directory permissions in supported designs."
      ],
      "traps": [
        "A snapshot is not the same as geo-redundancy.",
        "Soft delete is not a full substitute for a broader backup strategy.",
        "Azure Files is different from Blob Storage even though both can live in a storage account."
      ],
      "scenario": "An admin deletes an Azure file share by mistake and soft delete is enabled. Recover the deleted share within the retention window.",
      "remember": "For accidental deletion, look for soft delete. For point-in-time state, think snapshot or backup.",
      "portalPath": "Storage account → File shares"
    },
    {
      "id": "storage-data-management",
      "topic": "storage",
      "domain": "AZ-104 · Storage",
      "title": "AzCopy, Storage Explorer, Lifecycle, Versioning, and Replication",
      "summary": "Manage storage data at scale and automate common retention or replication tasks.",
      "plain": "Storage Explorer is a GUI tool, AzCopy is a command-line transfer utility, lifecycle rules automate tiering/deletion, versioning retains previous blob versions, and object replication copies block blobs between accounts.",
      "analogy": "Storage Explorer is the file manager, AzCopy is the moving truck, lifecycle is the automatic filing rule, versioning is edit history, and object replication is the copy machine.",
      "points": [
        "AzCopy is optimized for copying data to, from, and between Azure Storage.",
        "Storage Explorer provides a graphical way to work with storage data.",
        "Lifecycle rules can move blobs to cooler tiers or delete them based on age/conditions.",
        "Blob versioning keeps prior versions after writes/deletes depending on configuration.",
        "Object replication asynchronously copies supported block blobs between source and destination storage accounts."
      ],
      "traps": [
        "Lifecycle management is not the same as backup.",
        "Object replication is different from the storage account redundancy option.",
        "AzCopy transfers data; it does not configure an NSG."
      ],
      "scenario": "You need blobs older than 90 days moved to a cheaper tier automatically. Configure a lifecycle management rule.",
      "remember": "Tool clue: GUI = Storage Explorer; bulk copy command = AzCopy; age-based automation = lifecycle.",
      "portalPath": "Storage account → Lifecycle management / Object replication"
    },
    {
      "id": "compute-arm-bicep",
      "topic": "compute",
      "domain": "AZ-104 · Compute",
      "title": "ARM Templates and Bicep",
      "summary": "Read, modify, deploy, and export infrastructure-as-code configurations.",
      "plain": "ARM templates and Bicep describe the Azure resources you want. Azure compares that desired state with deployment operations and creates or updates resources.",
      "analogy": "Instead of telling a builder every hammer swing, you hand over a blueprint of the finished house.",
      "points": [
        "ARM templates are JSON; Bicep is a concise language that compiles to ARM.",
        "Parameters make templates reusable; variables simplify repeated expressions; resources declare what to deploy.",
        "Outputs return useful values after deployment.",
        "Template deployments can target resource groups, subscriptions, management groups, or tenants depending on the template.",
        "Existing deployments can be exported as ARM templates, and ARM JSON can be decompiled to Bicep with tooling."
      ],
      "traps": [
        "Declarative IaC describes the end state rather than an ordered list of clicks.",
        "A parameter is an input; an output is a value returned after deployment.",
        "Exported templates often need cleanup before they become ideal reusable IaC."
      ],
      "scenario": "You need identical storage and network resources in dev and test. Parameterize a Bicep file instead of manually recreating both environments.",
      "remember": "Bicep is easier to read, but ARM is still the underlying deployment engine.",
      "portalPath": "Azure portal → Deploy a custom template"
    },
    {
      "id": "compute-vm-basics",
      "topic": "compute",
      "domain": "AZ-104 · Compute",
      "title": "Create and Size Virtual Machines",
      "summary": "Choose VM image, size, region, authentication, and management settings.",
      "plain": "A VM gives you an Azure-hosted computer where you manage the guest operating system. Size controls CPU/memory; image controls the starting OS/software.",
      "analogy": "Choosing a VM is like ordering a computer: image is the operating system, size is the hardware class, and disks are the storage.",
      "points": [
        "VM size determines vCPU, memory, temporary storage, and supported capabilities.",
        "Resizing may require a restart and depends on capacity/series availability.",
        "Images provide operating-system and sometimes application configurations.",
        "Use SSH keys for Linux or strong secure authentication methods as appropriate.",
        "A VM is IaaS, so you are responsible for the guest OS configuration and patching."
      ],
      "traps": [
        "Stopping a VM inside the OS may not deallocate compute billing.",
        "A larger VM is not always the correct answer; requirements drive sizing.",
        "The VM resource, NIC, disks, and public IP are separate Azure resources."
      ],
      "scenario": "A workload needs more RAM but no architecture change. Resize the VM to a supported size rather than deploying an App Service plan.",
      "remember": "VM questions often hide the answer in CPU, memory, disk, availability, or management responsibility.",
      "portalPath": "Azure portal → Virtual machines"
    },
    {
      "id": "compute-vm-disks-move",
      "topic": "compute",
      "domain": "AZ-104 · Compute",
      "title": "VM Disks, Encryption at Host, and Moves",
      "summary": "Manage OS/data disks, host-side encryption, and resource relocation.",
      "plain": "Managed disks are separate Azure resources attached to VMs. Encryption at host protects data on the host path. Moving a VM can involve dependencies and different procedures depending on the target.",
      "analogy": "A VM is a laptop, disks are its drives, and moving it means packing every dependent part that must travel with it.",
      "points": [
        "VMs use an OS disk and can have one or more data disks within size limits.",
        "Managed disk SKUs trade performance and cost.",
        "Encryption at host encrypts data on the VM host, including temp disks/cache in supported configurations.",
        "Resources can often move between resource groups or subscriptions when move requirements are met.",
        "Moving to another region is a different process than a resource-group move and may use Azure Resource Mover or replication-based approaches."
      ],
      "traps": [
        "A resource-group move does not physically move a VM to another region.",
        "Snapshots and disks are different resources.",
        "Encryption at host is distinct from Storage Service Encryption."
      ],
      "scenario": "A VM must remain in the same region but belong to another resource group. Use an Azure resource move after checking dependencies, not Site Recovery failover.",
      "remember": "Always distinguish logical move (resource group/subscription) from geographic move (region).",
      "portalPath": "Virtual machine → Disks / Move"
    },
    {
      "id": "compute-availability-vmss",
      "topic": "compute",
      "domain": "AZ-104 · Compute",
      "title": "Availability Sets, Zones, and VM Scale Sets",
      "summary": "Keep VM workloads available and scale them when demand changes.",
      "plain": "Availability sets spread VMs across fault/update domains, zones place them in separate datacenter locations, and VM Scale Sets manage a group of similar VMs that can scale.",
      "analogy": "Availability set = different racks, zones = different buildings, VMSS = a fleet of matching servers you can grow or shrink.",
      "points": [
        "Availability sets protect against certain host/rack maintenance and failure scenarios.",
        "Availability zones provide stronger datacenter-level separation within a region.",
        "VM Scale Sets can automatically increase or decrease instance count.",
        "Scale sets are useful for stateless or similarly configured workloads behind load balancing.",
        "Autoscale rules commonly use metrics such as CPU percentage."
      ],
      "traps": [
        "Availability sets and availability zones are not the same feature.",
        "VMSS is not simply a backup solution.",
        "A scale-out action adds instances; scale-up changes instance size."
      ],
      "scenario": "Traffic spikes every weekday morning and the app tier is stateless. Use a VM Scale Set with autoscale rather than manually resizing one VM every day.",
      "remember": "Scale out = more instances. Scale up = bigger instance.",
      "portalPath": "Azure portal → Virtual machine scale sets"
    },
    {
      "id": "compute-acr",
      "topic": "compute",
      "domain": "AZ-104 · Compute",
      "title": "Azure Container Registry",
      "summary": "Store and manage container images before deploying them.",
      "plain": "Azure Container Registry (ACR) is a private registry for container images and related artifacts.",
      "analogy": "ACR is the warehouse where packaged container images sit before a service pulls and runs them.",
      "points": [
        "ACR stores container images in repositories.",
        "Authentication options include managed identities/service principals and registry credentials depending on scenario.",
        "Registry SKU affects features and scale.",
        "Geo-replication is available with supported ACR tiers.",
        "Image tags identify versions, but immutable deployment practices should avoid relying only on a moving 'latest' tag."
      ],
      "traps": [
        "ACR stores images; it does not itself run the application container.",
        "A repository is inside a registry.",
        "Container Instances and Container Apps can pull images from ACR but are separate services."
      ],
      "scenario": "Your company builds a private web API image and needs Azure services to pull it securely. Store it in ACR and grant the runtime identity pull access.",
      "remember": "Registry stores. Runtime runs.",
      "portalPath": "Azure portal → Container registries"
    },
    {
      "id": "compute-containers",
      "topic": "compute",
      "domain": "AZ-104 · Compute",
      "title": "Container Instances and Container Apps",
      "summary": "Choose the right serverless container service and understand sizing/scaling.",
      "plain": "ACI runs containers with minimal orchestration. Container Apps adds app-oriented features such as revisions, ingress, and event/HTTP-driven scaling.",
      "analogy": "ACI is renting a single food truck spot. Container Apps is a managed food-court platform that handles more traffic patterns and versions for you.",
      "points": [
        "Azure Container Instances is good for simple isolated container workloads and jobs.",
        "Azure Container Apps supports revisions, ingress, environment configuration, and scaling.",
        "Both reduce VM management compared with running containers directly on VMs.",
        "CPU/memory settings affect container capacity and cost.",
        "Managed identities can help containers access Azure resources without embedded secrets."
      ],
      "traps": [
        "ACI is not a full Kubernetes cluster.",
        "Container Apps is not the same as App Service.",
        "ACR stores images; ACI/Container Apps execute them."
      ],
      "scenario": "A short-lived batch task needs one container and no cluster administration. ACI is usually simpler than building a VM or AKS cluster.",
      "remember": "Ask whether the requirement is just 'run this container' or 'run an app with managed revisions/scaling/ingress.'",
      "portalPath": "Azure portal → Container instances / Container Apps"
    },
    {
      "id": "compute-appservice-plan",
      "topic": "compute",
      "domain": "AZ-104 · Compute",
      "title": "App Service Plans and Scaling",
      "summary": "Understand the compute underneath Azure App Service.",
      "plain": "An App Service plan defines the region, operating-system family, compute resources, and pricing tier available to one or more App Service apps.",
      "analogy": "The app is the restaurant. The App Service plan is the building, kitchen capacity, and number of workers available to host it.",
      "points": [
        "Multiple App Service apps can share one plan's compute capacity.",
        "Scale up changes the plan's pricing/compute tier.",
        "Scale out changes the number of instances.",
        "Autoscale is supported on appropriate tiers and can use metrics/schedules.",
        "Plan features such as deployment slots, custom domains, and scaling depend on tier."
      ],
      "traps": [
        "Scaling the app usually means scaling the App Service plan resources.",
        "Scale up and scale out are different actions.",
        "Creating a new app does not always require a new plan."
      ],
      "scenario": "Two low-traffic apps can share an App Service plan if isolation and capacity requirements allow it.",
      "remember": "App Service plan = the compute pool. App = the hosted website/API.",
      "portalPath": "Azure portal → App Service plans"
    },
    {
      "id": "compute-appservice-config",
      "topic": "compute",
      "domain": "AZ-104 · Compute",
      "title": "App Service TLS, Domains, Networking, Backup, and Slots",
      "summary": "Configure the features that turn a basic web app into a production-ready service.",
      "plain": "App Service can terminate TLS, map custom DNS names, integrate with networks, create backups, and use deployment slots for safer releases.",
      "analogy": "Deployment slots are like a rehearsal stage: deploy to staging, test, then swap it into production.",
      "points": [
        "Custom domains require DNS validation/mapping.",
        "TLS certificates secure HTTPS bindings for custom host names.",
        "VNet integration lets an app make outbound connections into a VNet; private endpoints can provide private inbound access in supported scenarios.",
        "Backups protect app content/configuration according to supported App Service capabilities.",
        "Deployment slots provide separate environments and can swap content/configuration with production."
      ],
      "traps": [
        "VNet integration is primarily about outbound access from the app; it is not the same as a private endpoint for inbound access.",
        "A deployment slot is not a separate App Service plan by default.",
        "DNS proves the name mapping; TLS secures the connection."
      ],
      "scenario": "You want to deploy a new version, validate it, then switch users with minimal disruption. Deploy to a staging slot and perform a slot swap.",
      "remember": "Custom name = DNS. Secure name = TLS. Safe release = slot.",
      "portalPath": "App Service → Custom domains / TLS / Networking / Deployment slots"
    },
    {
      "id": "network-vnet-subnet",
      "topic": "networking",
      "domain": "AZ-104 · Virtual Networking",
      "title": "VNets, Subnets, and Address Spaces",
      "summary": "Design the private IP layout that every Azure network scenario builds on.",
      "plain": "A VNet is a private IP network in Azure. Its address space is divided into non-overlapping subnets where resources connect.",
      "analogy": "The VNet is a city map; subnets are neighborhoods cut out from the city's address range.",
      "points": [
        "VNet address spaces use CIDR notation such as 10.10.0.0/16.",
        "Subnet ranges must fit inside the VNet address space and cannot overlap each other.",
        "Azure reserves several addresses in each subnet.",
        "Resources connect to subnets through network interfaces or service-specific integrations.",
        "Design address ranges to avoid overlap with networks you may connect later."
      ],
      "traps": [
        "A /24 is smaller than a /16.",
        "You cannot peer overlapping VNet address spaces.",
        "An NSG does not create a subnet; it filters traffic associated with a subnet or NIC."
      ],
      "scenario": "You plan to peer a new VNet with an on-premises network using 10.0.0.0/8. Choose a non-overlapping Azure range rather than another 10.x range.",
      "remember": "Addressing mistakes become connectivity problems later. Check overlap first.",
      "portalPath": "Virtual network → Address space / Subnets"
    },
    {
      "id": "network-peering-public-route",
      "topic": "networking",
      "domain": "AZ-104 · Virtual Networking",
      "title": "VNet Peering, Public IPs, and User-Defined Routes",
      "summary": "Control how Azure resources reach other networks and the internet.",
      "plain": "Peering connects VNets over Microsoft's backbone. Public IPs expose reachable IP addresses. User-defined routes override or supplement Azure's default route choices.",
      "analogy": "Peering is a private bridge, a public IP is a street-facing address, and a route table is a set of road signs.",
      "points": [
        "VNet peering provides low-latency private connectivity between VNets.",
        "Peering is not transitive by default; A↔B and B↔C does not automatically mean A↔C.",
        "Public IP SKUs and allocation behavior affect supported scenarios.",
        "User-defined routes can send traffic through a network virtual appliance.",
        "Route tables are associated with subnets."
      ],
      "traps": [
        "Peering does not automatically route traffic through a third VNet.",
        "A route controls path, not permission.",
        "A public IP is not required when Azure Bastion provides VM admin access."
      ],
      "scenario": "All outbound traffic from an app subnet must pass through a firewall appliance. Associate a route table whose default route points to the virtual appliance.",
      "remember": "Route = path. NSG = permission.",
      "portalPath": "Virtual network → Peerings / Route tables / Public IP addresses"
    },
    {
      "id": "network-troubleshooting",
      "topic": "networking",
      "domain": "AZ-104 · Virtual Networking",
      "title": "Troubleshoot Azure Network Connectivity",
      "summary": "Use a repeatable process instead of guessing when traffic fails.",
      "plain": "Connectivity problems usually come from name resolution, routes, security rules, service configuration, or the destination itself.",
      "analogy": "Troubleshooting is checking the trip in order: address book, road map, security gate, then destination building.",
      "points": [
        "Verify source and destination IP/DNS resolution first.",
        "Review effective routes to see the path Azure will use.",
        "Review effective NSG rules to see whether traffic is allowed.",
        "Network Watcher tools can test IP flow and connectivity.",
        "Confirm the destination service is listening on the expected protocol/port."
      ],
      "traps": [
        "Do not change several controls at once; identify which layer fails.",
        "Successful DNS resolution does not prove network connectivity.",
        "An allowed NSG rule does not fix a bad route."
      ],
      "scenario": "A VM cannot reach another VM. DNS resolves correctly. Effective routes point to the right subnet. Next review effective NSG rules and the destination listener.",
      "remember": "DNS → route → security → destination. Use that order.",
      "portalPath": "Network Watcher / NIC → Effective routes / Effective security rules"
    },
    {
      "id": "network-nsg-asg",
      "topic": "networking",
      "domain": "AZ-104 · Virtual Networking",
      "title": "NSGs, ASGs, and Effective Security Rules",
      "summary": "Build security rules correctly and understand which rule actually wins.",
      "plain": "NSGs filter inbound and outbound traffic using priority-ordered rules. ASGs let you refer to groups of VM NICs by application role instead of IP addresses.",
      "analogy": "An NSG is a security checkpoint with numbered rules. The lowest priority number is checked first.",
      "points": [
        "NSG rules specify source, destination, service/port, protocol, action, direction, and priority.",
        "Lower numeric priority is evaluated before higher numeric priority.",
        "NSGs have default security rules that cannot be deleted.",
        "ASGs simplify rules by grouping NICs by application role.",
        "Effective security rules combine applicable subnet and NIC NSG behavior."
      ],
      "traps": [
        "Priority 100 is evaluated before priority 200.",
        "If both subnet and NIC NSGs apply, traffic must be allowed through the combined path.",
        "ASGs do not contain arbitrary Azure resources; they group supported NIC configurations."
      ],
      "scenario": "Web servers should accept HTTPS from an app tier but not from everywhere. Use ASGs and an NSG rule scoped to the needed source/destination/port.",
      "remember": "In NSGs, smaller priority number = earlier rule.",
      "portalPath": "Network security group → Inbound/Outbound security rules"
    },
    {
      "id": "network-secure-access",
      "topic": "networking",
      "domain": "AZ-104 · Virtual Networking",
      "title": "Bastion, Service Endpoints, and Private Endpoints",
      "summary": "Recognize three secure-access technologies that are commonly confused.",
      "plain": "Bastion gives admins RDP/SSH access without public IPs on target VMs. Service endpoints secure supported PaaS access from selected VNets. Private endpoints place a private IP for a PaaS resource inside your VNet.",
      "analogy": "Bastion is a guarded admin doorway, service endpoint is a trusted lane to a public service, private endpoint is giving that service a private address in your neighborhood.",
      "points": [
        "Azure Bastion is managed RDP/SSH connectivity through the Azure portal/client features without a public IP on the VM.",
        "Service endpoints keep the PaaS service on its public endpoint while extending VNet identity to it.",
        "Private endpoints use Azure Private Link and a private IP from your VNet.",
        "Private DNS often matters so service names resolve to private endpoint addresses.",
        "Network controls still need correct authorization at the target service."
      ],
      "traps": [
        "Service endpoint and private endpoint are not the same.",
        "Bastion is for administration access, not general application load balancing.",
        "A private endpoint does not itself grant RBAC/data permissions."
      ],
      "scenario": "A storage account must be reached only through a private IP from your VNet. Choose a private endpoint, then configure DNS and storage access appropriately.",
      "remember": "Private endpoint = private IP. Service endpoint = secured VNet path to public service endpoint.",
      "portalPath": "Azure Bastion / Private endpoints / Service endpoints"
    },
    {
      "id": "network-dns-loadbalancer",
      "topic": "networking",
      "domain": "AZ-104 · Virtual Networking",
      "title": "Azure DNS and Load Balancer",
      "summary": "Resolve names and distribute Layer 4 traffic without mixing the two jobs.",
      "plain": "Azure DNS hosts DNS zones and records. Azure Load Balancer distributes TCP/UDP flows using frontend IPs, backend pools, health probes, and load-balancing rules.",
      "analogy": "DNS tells customers which building to visit. The load balancer decides which available service desk inside handles them.",
      "points": [
        "Azure DNS hosts public DNS zones; Azure Private DNS provides private name resolution in linked VNets.",
        "Load Balancer can be public or internal.",
        "Backend pools contain the resources that receive traffic.",
        "Health probes determine which backend instances are healthy enough to receive new flows.",
        "Load-balancing rules connect frontend IP/port/protocol to backend configuration."
      ],
      "traps": [
        "DNS does not load-balance application traffic by itself.",
        "A health probe failure can remove a backend from rotation even when its VM is running.",
        "Azure Load Balancer is Layer 4; Application Gateway provides Layer 7 web routing features."
      ],
      "scenario": "Users reach the load balancer but one backend never receives traffic. Check the backend pool and health probe before changing DNS.",
      "remember": "Name resolution gets you to an IP. The load balancer distributes the traffic after that.",
      "portalPath": "Azure DNS / Load balancers"
    },
    {
      "id": "monitor-metrics-logs",
      "topic": "monitoring",
      "domain": "AZ-104 · Monitoring & Recovery",
      "title": "Azure Monitor Metrics, Logs, and Diagnostic Settings",
      "summary": "Know what monitoring data exists, where it goes, and when to use metrics versus logs.",
      "plain": "Metrics are numeric time-series values. Logs are detailed records you query. Diagnostic settings route supported platform logs/metrics to destinations such as Log Analytics.",
      "analogy": "Metrics are the dashboard gauges. Logs are the detailed flight recorder.",
      "points": [
        "Metrics are efficient for near-real-time numeric monitoring and charting.",
        "Logs provide richer records for investigation and analysis.",
        "Log Analytics workspaces store/query Azure Monitor Logs.",
        "Kusto Query Language (KQL) is used to query logs.",
        "Diagnostic settings route supported resource logs and metrics to destinations such as Log Analytics, Storage, or Event Hubs."
      ],
      "traps": [
        "The Activity Log is a subscription-level control-plane log and is different from resource logs.",
        "Metrics are not the best choice when you need detailed event records.",
        "Creating a Log Analytics workspace does not automatically send every resource log to it."
      ],
      "scenario": "You need to investigate every failed request with detailed fields. Send the resource logs to Log Analytics and query them with KQL rather than relying only on a CPU metric.",
      "remember": "Numbers over time = metrics. Detailed searchable records = logs.",
      "portalPath": "Azure Monitor → Metrics / Logs / Diagnostic settings"
    },
    {
      "id": "monitor-alerts",
      "topic": "monitoring",
      "domain": "AZ-104 · Monitoring & Recovery",
      "title": "Alerts, Action Groups, and Alert Processing Rules",
      "summary": "Turn monitoring signals into useful notifications and automation.",
      "plain": "An alert rule decides when something is wrong. An action group decides who or what responds. Alert processing rules can suppress or alter actions for matching alerts.",
      "analogy": "The smoke detector is the alert rule. The emergency contact list is the action group. A processing rule is the temporary instruction such as 'do not page during maintenance.'",
      "points": [
        "Alert rules define scope, condition, evaluation, and severity.",
        "Action groups can notify people or trigger automation/webhooks/functions depending on configuration.",
        "One action group can be reused by multiple alerts.",
        "Alert processing rules can suppress or apply action groups under conditions/schedules.",
        "Metric alerts and log alerts use different signal types."
      ],
      "traps": [
        "An action group does not define the threshold condition.",
        "A budget alert is a Cost Management feature, not an Azure Monitor metric alert.",
        "Silencing notifications with a processing rule does not necessarily stop the underlying alert condition from being evaluated."
      ],
      "scenario": "A VM CPU alert should email the operations team and run automation. Put those responses in an action group referenced by the alert rule.",
      "remember": "Alert rule = WHEN. Action group = WHAT HAPPENS.",
      "portalPath": "Azure Monitor → Alerts"
    },
    {
      "id": "monitor-insights-networkwatcher",
      "topic": "monitoring",
      "domain": "AZ-104 · Monitoring & Recovery",
      "title": "Insights, Network Watcher, and Connection Monitor",
      "summary": "Use Azure's built-in monitoring views and network troubleshooting tools.",
      "plain": "Azure Monitor Insights provides curated monitoring experiences for resource types. Network Watcher focuses on network diagnostics. Connection Monitor continuously tests connectivity paths.",
      "analogy": "Insights is the dashboard, Network Watcher is the network toolbox, and Connection Monitor is the repeating route tester.",
      "points": [
        "VM Insights helps monitor VM performance and dependencies in supported configurations.",
        "Storage and network resources expose resource-specific monitoring experiences.",
        "Network Watcher includes tools such as IP flow verify, next hop, packet capture, and connection troubleshoot.",
        "Connection Monitor can monitor connectivity between endpoints over time.",
        "Effective routes/security rules help explain actual network behavior."
      ],
      "traps": [
        "Network Watcher does not replace an NSG; it helps inspect/troubleshoot networking.",
        "A one-time connectivity test and continuous Connection Monitor serve different purposes.",
        "Insights depends on data collection/configuration being present."
      ],
      "scenario": "An app intermittently loses connectivity to a database endpoint. Configure Connection Monitor to observe the path over time instead of relying only on one manual ping test.",
      "remember": "Troubleshoot now = Network Watcher tools. Watch the path over time = Connection Monitor.",
      "portalPath": "Network Watcher / Azure Monitor → Insights"
    },
    {
      "id": "monitor-backup",
      "topic": "monitoring",
      "domain": "AZ-104 · Monitoring & Recovery",
      "title": "Recovery Services Vaults, Backup Vaults, Policies, and Restore",
      "summary": "Protect workloads with the correct vault, schedule, retention, and restore process.",
      "plain": "Azure Backup uses vaults and policies to protect supported workloads. Policies define schedule and retention; restore operations recover data or resources.",
      "analogy": "The vault is the safe. The policy is the calendar telling Azure when to make copies and how long to keep them.",
      "points": [
        "Recovery Services vaults protect supported workloads such as Azure VMs and support Site Recovery scenarios.",
        "Backup vaults support newer Azure Backup workloads depending on service.",
        "Backup policies define frequency/schedule and retention.",
        "Backup jobs and reports help administrators verify protection.",
        "Restore operations may recover files, disks, or entire resources depending on workload."
      ],
      "traps": [
        "Backup is not the same as high availability.",
        "A vault existing by itself does not mean a VM is protected; protection must be configured.",
        "Retention requirements drive policy design."
      ],
      "scenario": "A VM must be backed up daily and retained for 30 days. Create/select the appropriate vault, configure a policy with those requirements, and enable protection for the VM.",
      "remember": "Vault holds protection. Policy defines schedule + retention. Restore proves recovery.",
      "portalPath": "Recovery Services vault / Backup vault"
    },
    {
      "id": "monitor-site-recovery",
      "topic": "monitoring",
      "domain": "AZ-104 · Monitoring & Recovery",
      "title": "Azure Site Recovery and Regional Failover",
      "summary": "Understand disaster recovery when the requirement is to replicate workloads and fail over.",
      "plain": "Azure Site Recovery (ASR) replicates supported workloads to a recovery location and orchestrates failover/failback. It is disaster recovery, not ordinary backup.",
      "analogy": "Backup is a spare copy in storage. Site Recovery is preparing a second operating location and a plan for switching over.",
      "points": [
        "ASR replicates supported machines/workloads for disaster recovery.",
        "Recovery plans can orchestrate failover order and actions in supported scenarios.",
        "Test failover validates recovery without committing to a disaster event.",
        "Planned/unplanned failover choices depend on the state of the primary environment.",
        "Monitoring, reports, and alerts help verify replication health and recovery readiness."
      ],
      "traps": [
        "ASR is not a replacement for every backup requirement.",
        "A failover changes where the workload runs; a restore recovers protected data.",
        "A test failover should be isolated appropriately to avoid production conflicts."
      ],
      "scenario": "A regional outage must be survivable with replicated Azure VMs and an orchestrated switch to another region. Use Site Recovery rather than only snapshots.",
      "remember": "Backup answers 'can I restore it?' ASR answers 'can I run it somewhere else after disaster?'",
      "portalPath": "Recovery Services vault → Site Recovery"
    }
  ],
  "questionBank": [
    {
      "id": "q001",
      "topic": "foundations",
      "lessonId": "foundation-hierarchy",
      "difficulty": "Fundamental",
      "question": "Which Azure object is the logical container that directly holds related Azure resources?",
      "options": [
        "Resource group",
        "Management group",
        "Availability zone",
        "Tenant"
      ],
      "answer": "Resource group",
      "explanation": "A resource group is the logical container used to manage related Azure resources.",
      "clue": "The clue is 'directly holds related resources.'"
    },
    {
      "id": "q002",
      "topic": "foundations",
      "lessonId": "foundation-hierarchy",
      "difficulty": "Scenario",
      "question": "A company wants one governance scope above three Azure subscriptions. What should it use?",
      "options": [
        "Management group",
        "Resource group",
        "Availability set",
        "Network security group"
      ],
      "answer": "Management group",
      "explanation": "Management groups organize subscriptions and allow governance above the subscription level.",
      "clue": "The clue is 'above multiple subscriptions.'"
    },
    {
      "id": "q003",
      "topic": "foundations",
      "lessonId": "foundation-hierarchy",
      "difficulty": "Intermediate",
      "question": "Which statement about resource groups is correct?",
      "options": [
        "A resource can belong to only one resource group at a time.",
        "Every resource in a resource group must be in the same region.",
        "Resource groups are the Azure billing account.",
        "A resource group can contain subscriptions."
      ],
      "answer": "A resource can belong to only one resource group at a time.",
      "explanation": "Azure resources are assigned to one resource group at a time; the group is a logical management container.",
      "clue": "Separate management containers from regions and billing."
    },
    {
      "id": "q004",
      "topic": "foundations",
      "lessonId": "foundation-arm",
      "difficulty": "Fundamental",
      "question": "Which Azure component is the management layer used when you deploy and manage Azure resources?",
      "options": [
        "Azure Resource Manager",
        "Azure DNS",
        "Azure Bastion",
        "Azure Load Balancer"
      ],
      "answer": "Azure Resource Manager",
      "explanation": "Azure Resource Manager is Azure's management and deployment layer.",
      "clue": "Think management plane, not networking."
    },
    {
      "id": "q005",
      "topic": "foundations",
      "lessonId": "foundation-arm",
      "difficulty": "Scenario",
      "question": "You must deploy the same VNet and VM configuration repeatedly with only a few input values changed. What is the best approach?",
      "options": [
        "Use a parameterized Bicep or ARM template",
        "Recreate everything manually in the portal",
        "Use an NSG for the deployment",
        "Create a new tenant each time"
      ],
      "answer": "Use a parameterized Bicep or ARM template",
      "explanation": "Infrastructure as code gives a repeatable declarative deployment and parameters allow reusable inputs.",
      "clue": "The clue is repeatable deployment."
    },
    {
      "id": "q006",
      "topic": "foundations",
      "lessonId": "foundation-networking",
      "difficulty": "Fundamental",
      "question": "What is the main job of an NSG?",
      "options": [
        "Allow or deny network traffic",
        "Choose where traffic is routed",
        "Resolve names to IP addresses",
        "Create a subscription"
      ],
      "answer": "Allow or deny network traffic",
      "explanation": "Network security groups filter inbound and outbound network traffic.",
      "clue": "Security rule versus route versus DNS."
    },
    {
      "id": "q007",
      "topic": "foundations",
      "lessonId": "foundation-networking",
      "difficulty": "Intermediate",
      "question": "A server name resolves to the correct IP, but HTTPS still fails. Which statement is best?",
      "options": [
        "DNS can be working even when an NSG, route, or service blocks connectivity.",
        "DNS resolution proves port 443 is allowed.",
        "The VNet must be deleted.",
        "A resource group is blocking the traffic."
      ],
      "answer": "DNS can be working even when an NSG, route, or service blocks connectivity.",
      "explanation": "Name resolution and network reachability are different layers.",
      "clue": "The question tells you DNS already worked."
    },
    {
      "id": "q008",
      "topic": "foundations",
      "lessonId": "foundation-resiliency",
      "difficulty": "Fundamental",
      "question": "Which Azure feature provides physically separate datacenter locations within a supported region?",
      "options": [
        "Availability zones",
        "Resource groups",
        "Management groups",
        "Tags"
      ],
      "answer": "Availability zones",
      "explanation": "Availability zones are physically separate locations in a region designed to improve resiliency.",
      "clue": "Look for physically separate locations inside one region."
    },
    {
      "id": "q009",
      "topic": "foundations",
      "lessonId": "foundation-resiliency",
      "difficulty": "Scenario",
      "question": "A team wants to host a web app but does not want to patch or manage the guest operating system. Which service model is the better fit?",
      "options": [
        "A managed PaaS service such as Azure App Service",
        "A self-managed Azure VM",
        "A route table",
        "A storage account access key"
      ],
      "answer": "A managed PaaS service such as Azure App Service",
      "explanation": "App Service is a PaaS offering where Microsoft manages the underlying server infrastructure.",
      "clue": "The clue is reducing OS management."
    },
    {
      "id": "q010",
      "topic": "foundations",
      "lessonId": "foundation-resiliency",
      "difficulty": "Intermediate",
      "question": "Which statement is correct?",
      "options": [
        "High availability and backup solve different problems.",
        "A backup automatically keeps an application running during every outage.",
        "An availability set is a cross-region disaster recovery service.",
        "Least privilege means granting subscription Owner whenever possible."
      ],
      "answer": "High availability and backup solve different problems.",
      "explanation": "High availability focuses on keeping services available; backup focuses on recoverable copies.",
      "clue": "Do not treat resiliency, backup, and permissions as the same thing."
    },
    {
      "id": "q011",
      "topic": "identity",
      "lessonId": "identity-users-groups",
      "difficulty": "Fundamental",
      "question": "Fifty employees need the same Azure Reader assignment. What is the simplest administration approach?",
      "options": [
        "Put the users in a security group and assign the group",
        "Create fifty separate subscriptions",
        "Create an NSG for the users",
        "Use a distribution list as an Azure resource container"
      ],
      "answer": "Put the users in a security group and assign the group",
      "explanation": "Group-based access reduces repeated role assignments and is easier to maintain.",
      "clue": "Many users, same access = group."
    },
    {
      "id": "q012",
      "topic": "identity",
      "lessonId": "identity-users-groups",
      "difficulty": "Intermediate",
      "question": "Which object is designed to represent a collection of Microsoft Entra identities for access management?",
      "options": [
        "Security group",
        "Resource group",
        "Availability set",
        "Route table"
      ],
      "answer": "Security group",
      "explanation": "A Microsoft Entra security group groups identities for access and security administration.",
      "clue": "Do not confuse Entra groups with Azure resource groups."
    },
    {
      "id": "q013",
      "topic": "identity",
      "lessonId": "identity-users-groups",
      "difficulty": "Scenario",
      "question": "An employee changes departments. You want access to follow group membership rather than individual role assignments. What design helps most?",
      "options": [
        "Assign roles to department security groups",
        "Assign every role directly to the user forever",
        "Create a public IP for the user",
        "Use blob lifecycle management"
      ],
      "answer": "Assign roles to department security groups",
      "explanation": "Group-based assignments let access change when group membership changes.",
      "clue": "The question is about reducing individual access administration."
    },
    {
      "id": "q014",
      "topic": "identity",
      "lessonId": "identity-licenses-external-sspr",
      "difficulty": "Fundamental",
      "question": "A contractor from another company needs access to an Azure application. Which identity approach is designed for this?",
      "options": [
        "Invite the contractor as an external user",
        "Create an availability zone",
        "Give the contractor a storage account key",
        "Create a route table"
      ],
      "answer": "Invite the contractor as an external user",
      "explanation": "Microsoft Entra external identities support collaboration with users outside the organization.",
      "clue": "Look for outside organization/guest access."
    },
    {
      "id": "q015",
      "topic": "identity",
      "lessonId": "identity-licenses-external-sspr",
      "difficulty": "Intermediate",
      "question": "Which feature lets users reset their own password after satisfying configured verification requirements?",
      "options": [
        "Self-service password reset (SSPR)",
        "Azure Policy",
        "Azure Site Recovery",
        "Blob soft delete"
      ],
      "answer": "Self-service password reset (SSPR)",
      "explanation": "SSPR lets enabled users reset passwords without a help desk reset when requirements are met.",
      "clue": "The clue is self-service password reset."
    },
    {
      "id": "q016",
      "topic": "identity",
      "lessonId": "identity-licenses-external-sspr",
      "difficulty": "Scenario",
      "question": "You assigned a cloud service license to a user and Azure resource access still fails. Why can that happen?",
      "options": [
        "Licensing and Azure RBAC authorization are separate controls",
        "A license automatically makes the user Owner",
        "SSPR blocks every licensed user",
        "A tag is required before RBAC works"
      ],
      "answer": "Licensing and Azure RBAC authorization are separate controls",
      "explanation": "A product license enables service capabilities; Azure RBAC controls authorization to Azure resources.",
      "clue": "License does not equal permission."
    },
    {
      "id": "q017",
      "topic": "identity",
      "lessonId": "identity-rbac",
      "difficulty": "Fundamental",
      "question": "Which three pieces make up an Azure RBAC role assignment?",
      "options": [
        "Security principal, role definition, and scope",
        "VNet, subnet, and route table",
        "Budget, tag, and lock",
        "Metric, log, and action group"
      ],
      "answer": "Security principal, role definition, and scope",
      "explanation": "RBAC combines who receives access, what permissions the role contains, and where it applies.",
      "clue": "Remember WHO + ROLE + SCOPE."
    },
    {
      "id": "q018",
      "topic": "identity",
      "lessonId": "identity-rbac",
      "difficulty": "Intermediate",
      "question": "A user has Contributor on a resource group. What can the user generally NOT do with that role alone?",
      "options": [
        "Assign Azure RBAC roles to other users",
        "Create a VM in the resource group",
        "Modify resources in the resource group",
        "Delete resources when no lock blocks it"
      ],
      "answer": "Assign Azure RBAC roles to other users",
      "explanation": "Contributor can manage resources but does not include permission to grant RBAC access.",
      "clue": "Contributor is not Owner."
    },
    {
      "id": "q019",
      "topic": "identity",
      "lessonId": "identity-rbac",
      "difficulty": "Scenario",
      "question": "An application needs read access to one storage account only. Which scope best follows least privilege?",
      "options": [
        "The individual storage account",
        "The entire subscription",
        "The management group",
        "Every resource group in the tenant"
      ],
      "answer": "The individual storage account",
      "explanation": "Use the smallest practical scope that satisfies the access requirement.",
      "clue": "One resource needed = resource scope."
    },
    {
      "id": "q020",
      "topic": "identity",
      "lessonId": "identity-policy-locks-tags",
      "difficulty": "Fundamental",
      "question": "Which Azure service evaluates resources against organizational governance rules?",
      "options": [
        "Azure Policy",
        "Azure Bastion",
        "Azure DNS",
        "Azure Load Balancer"
      ],
      "answer": "Azure Policy",
      "explanation": "Azure Policy evaluates and can enforce compliance rules on Azure resources.",
      "clue": "Rules/compliance = Policy."
    },
    {
      "id": "q021",
      "topic": "identity",
      "lessonId": "identity-policy-locks-tags",
      "difficulty": "Intermediate",
      "question": "Which lock lets authorized users modify a resource but prevents deletion?",
      "options": [
        "CanNotDelete",
        "ReadOnly",
        "Contributor",
        "DenyAll"
      ],
      "answer": "CanNotDelete",
      "explanation": "CanNotDelete allows updates but blocks delete operations.",
      "clue": "The requirement still allows modifications."
    },
    {
      "id": "q022",
      "topic": "identity",
      "lessonId": "identity-policy-locks-tags",
      "difficulty": "Scenario",
      "question": "Every new resource must include a CostCenter tag. What should you use to enforce this at scale?",
      "options": [
        "Azure Policy",
        "An NSG",
        "Azure Bastion",
        "A VM size rule"
      ],
      "answer": "Azure Policy",
      "explanation": "Azure Policy can audit, deny, or modify resources based on governance requirements such as required tags.",
      "clue": "The clue is enforce a governance standard."
    },
    {
      "id": "q023",
      "topic": "identity",
      "lessonId": "identity-subscriptions-cost",
      "difficulty": "Fundamental",
      "question": "What contains resource groups and commonly acts as an Azure management and billing boundary?",
      "options": [
        "Subscription",
        "Subnet",
        "Availability set",
        "Action group"
      ],
      "answer": "Subscription",
      "explanation": "Subscriptions contain resource groups/resources and form common management and billing boundaries.",
      "clue": "Billing boundary + resource groups = subscription."
    },
    {
      "id": "q024",
      "topic": "identity",
      "lessonId": "identity-subscriptions-cost",
      "difficulty": "Intermediate",
      "question": "Which tool should you configure to notify stakeholders when cloud spending reaches a planned threshold?",
      "options": [
        "Cost Management budget and alert",
        "Network security group",
        "Azure DNS zone",
        "Recovery Services vault"
      ],
      "answer": "Cost Management budget and alert",
      "explanation": "Budgets track spend against thresholds and can send alerts.",
      "clue": "Spending threshold = budget."
    },
    {
      "id": "q025",
      "topic": "identity",
      "lessonId": "identity-subscriptions-cost",
      "difficulty": "Scenario",
      "question": "Azure Advisor recommends resizing an underused VM. Which governance goal is this most directly supporting?",
      "options": [
        "Cost optimization",
        "DNS resolution",
        "RBAC inheritance",
        "Blob versioning"
      ],
      "answer": "Cost optimization",
      "explanation": "Advisor can identify resource-efficiency opportunities that reduce cost.",
      "clue": "Underused resources and resizing point to cost optimization."
    },
    {
      "id": "q026",
      "topic": "storage",
      "lessonId": "storage-accounts-redundancy",
      "difficulty": "Fundamental",
      "question": "Which storage redundancy option spreads copies across availability zones in one region?",
      "options": [
        "ZRS",
        "LRS",
        "GRS",
        "RA-GRS"
      ],
      "answer": "ZRS",
      "explanation": "Zone-redundant storage replicates across availability zones in the primary region.",
      "clue": "Zone = ZRS."
    },
    {
      "id": "q027",
      "topic": "storage",
      "lessonId": "storage-accounts-redundancy",
      "difficulty": "Intermediate",
      "question": "Which option provides geo-replication plus read access to the secondary region before failover?",
      "options": [
        "RA-GRS",
        "GRS",
        "ZRS",
        "LRS"
      ],
      "answer": "RA-GRS",
      "explanation": "RA-GRS adds readable secondary access to geo-redundant replication.",
      "clue": "Read access to secondary = RA."
    },
    {
      "id": "q028",
      "topic": "storage",
      "lessonId": "storage-accounts-redundancy",
      "difficulty": "Scenario",
      "question": "A workload must survive one availability-zone failure but does not require another region. Which choice best fits?",
      "options": [
        "ZRS",
        "LRS",
        "GRS only because every workload needs two regions",
        "A storage access key"
      ],
      "answer": "ZRS",
      "explanation": "ZRS is designed for zone-level resiliency in the primary region.",
      "clue": "Exact failure requirement is one zone."
    },
    {
      "id": "q029",
      "topic": "storage",
      "lessonId": "storage-sas-keys",
      "difficulty": "Fundamental",
      "question": "What is the safer way to give a partner temporary read-only access to one blob container?",
      "options": [
        "Create a limited SAS token",
        "Share the storage account key",
        "Assign subscription Owner",
        "Make the entire account anonymous"
      ],
      "answer": "Create a limited SAS token",
      "explanation": "A SAS can be limited by scope, permission, and expiration without exposing the account key.",
      "clue": "Temporary delegated access = SAS."
    },
    {
      "id": "q030",
      "topic": "storage",
      "lessonId": "storage-sas-keys",
      "difficulty": "Intermediate",
      "question": "Why are storage account keys considered highly sensitive?",
      "options": [
        "They provide broad access and should be protected and rotated",
        "They only allow DNS lookups",
        "They are used only for VM sizing",
        "They cannot access storage data"
      ],
      "answer": "They provide broad access and should be protected and rotated",
      "explanation": "Account keys can authorize broad storage operations, so limited identity/SAS methods are preferable when possible.",
      "clue": "Master-key style credential."
    },
    {
      "id": "q031",
      "topic": "storage",
      "lessonId": "storage-sas-keys",
      "difficulty": "Scenario",
      "question": "You want to centrally change the expiry/permissions behavior for a supported service SAS without issuing an account key. What can help?",
      "options": [
        "Stored access policy",
        "Availability set",
        "Management group",
        "Route table"
      ],
      "answer": "Stored access policy",
      "explanation": "Stored access policies provide server-side policy control for supported service SAS scenarios.",
      "clue": "Do not confuse stored access policy with Azure Policy."
    },
    {
      "id": "q032",
      "topic": "storage",
      "lessonId": "storage-network-identity",
      "difficulty": "Fundamental",
      "question": "Which feature gives a supported Azure PaaS resource a private IP address inside your VNet?",
      "options": [
        "Private endpoint",
        "Service endpoint",
        "Public IP",
        "Management lock"
      ],
      "answer": "Private endpoint",
      "explanation": "Private endpoints use Private Link and place a private IP for the service in your VNet.",
      "clue": "Private IP for PaaS = private endpoint."
    },
    {
      "id": "q033",
      "topic": "storage",
      "lessonId": "storage-network-identity",
      "difficulty": "Intermediate",
      "question": "A private endpoint exists, but a user still cannot read blobs. What is the best explanation?",
      "options": [
        "Network reachability and data authorization are separate requirements",
        "Private endpoints automatically grant Storage Blob Data Owner",
        "DNS replaces RBAC",
        "A subnet is a license boundary"
      ],
      "answer": "Network reachability and data authorization are separate requirements",
      "explanation": "Private networking controls the path; the identity still needs appropriate storage data access.",
      "clue": "Private path does not equal permission."
    },
    {
      "id": "q034",
      "topic": "storage",
      "lessonId": "storage-network-identity",
      "difficulty": "Scenario",
      "question": "You need to restrict a storage account so only selected networks can reach its public endpoint. What should you configure?",
      "options": [
        "Storage firewall and virtual network rules",
        "A VM availability set",
        "A Cost Management budget",
        "An App Service deployment slot"
      ],
      "answer": "Storage firewall and virtual network rules",
      "explanation": "Storage networking settings can restrict public network access to selected networks.",
      "clue": "This is storage network access control."
    },
    {
      "id": "q035",
      "topic": "storage",
      "lessonId": "storage-blob-tiers",
      "difficulty": "Fundamental",
      "question": "Which Blob Storage tier is intended for data that is rarely accessed and can tolerate rehydration before use?",
      "options": [
        "Archive",
        "Hot",
        "Premium file share",
        "RA-GRS"
      ],
      "answer": "Archive",
      "explanation": "Archive is offline and optimized for long-term, rarely accessed blob data.",
      "clue": "Rare access + rehydration = Archive."
    },
    {
      "id": "q036",
      "topic": "storage",
      "lessonId": "storage-blob-tiers",
      "difficulty": "Intermediate",
      "question": "What directly organizes blobs inside a storage account?",
      "options": [
        "Blob container",
        "Management group",
        "VNet peering",
        "Action group"
      ],
      "answer": "Blob container",
      "explanation": "Blob containers organize blob objects in a storage account.",
      "clue": "Blob hierarchy question."
    },
    {
      "id": "q037",
      "topic": "storage",
      "lessonId": "storage-files-recovery",
      "difficulty": "Scenario",
      "question": "An Azure file share was accidentally deleted and soft delete is enabled. What should you do?",
      "options": [
        "Recover the deleted file share within the retention period",
        "Change the VNet CIDR",
        "Create a new management group",
        "Use Azure Bastion"
      ],
      "answer": "Recover the deleted file share within the retention period",
      "explanation": "Azure Files soft delete retains deleted shares for recovery during the configured period.",
      "clue": "Accidental deletion + retention window = soft delete."
    },
    {
      "id": "q038",
      "topic": "storage",
      "lessonId": "storage-data-management",
      "difficulty": "Fundamental",
      "question": "Which tool is optimized for command-line bulk data transfer to and from Azure Storage?",
      "options": [
        "AzCopy",
        "Azure Policy",
        "Network Watcher",
        "Azure Bastion"
      ],
      "answer": "AzCopy",
      "explanation": "AzCopy is a command-line utility for high-performance Azure Storage data transfer.",
      "clue": "Command-line copy utility = AzCopy."
    },
    {
      "id": "q039",
      "topic": "storage",
      "lessonId": "storage-data-management",
      "difficulty": "Intermediate",
      "question": "Which feature can automatically move older blobs to a cheaper tier based on age?",
      "options": [
        "Blob lifecycle management",
        "Resource lock",
        "VNet peering",
        "Action group"
      ],
      "answer": "Blob lifecycle management",
      "explanation": "Lifecycle management applies rules to tier or delete blobs based on conditions such as age.",
      "clue": "Age-based tiering = lifecycle."
    },
    {
      "id": "q040",
      "topic": "storage",
      "lessonId": "storage-data-management",
      "difficulty": "Scenario",
      "question": "You need previous versions of a block blob preserved when content changes. Which feature should you enable?",
      "options": [
        "Blob versioning",
        "Network security group",
        "Availability set",
        "Azure DNS"
      ],
      "answer": "Blob versioning",
      "explanation": "Blob versioning keeps prior versions of supported blobs as they change.",
      "clue": "Previous blob versions = versioning."
    },
    {
      "id": "q041",
      "topic": "compute",
      "lessonId": "compute-arm-bicep",
      "difficulty": "Fundamental",
      "question": "Which language is a concise Azure-specific way to declare resources and compiles to ARM?",
      "options": [
        "Bicep",
        "KQL",
        "AzCopy",
        "DNS"
      ],
      "answer": "Bicep",
      "explanation": "Bicep is a declarative Azure IaC language that compiles to ARM templates.",
      "clue": "IaC language = Bicep."
    },
    {
      "id": "q042",
      "topic": "compute",
      "lessonId": "compute-arm-bicep",
      "difficulty": "Intermediate",
      "question": "In an ARM/Bicep deployment, what is a parameter primarily used for?",
      "options": [
        "Provide reusable input values to a deployment",
        "Store Azure Monitor logs",
        "Filter NSG traffic",
        "Perform a VM failover"
      ],
      "answer": "Provide reusable input values to a deployment",
      "explanation": "Parameters let the same template accept different values for different deployments.",
      "clue": "Input to template = parameter."
    },
    {
      "id": "q043",
      "topic": "compute",
      "lessonId": "compute-arm-bicep",
      "difficulty": "Scenario",
      "question": "You need identical infrastructure in dev and test with different resource names. What should you do?",
      "options": [
        "Use one parameterized Bicep or ARM definition",
        "Rebuild manually twice",
        "Create separate tenants",
        "Use a storage SAS token"
      ],
      "answer": "Use one parameterized Bicep or ARM definition",
      "explanation": "Parameterized infrastructure as code improves consistency and repeatability.",
      "clue": "Same shape, different values = parameters."
    },
    {
      "id": "q044",
      "topic": "compute",
      "lessonId": "compute-vm-basics",
      "difficulty": "Fundamental",
      "question": "What does an Azure VM size primarily determine?",
      "options": [
        "Compute capacity such as vCPU and memory",
        "The Entra tenant name",
        "The DNS zone records",
        "The blob lifecycle policy"
      ],
      "answer": "Compute capacity such as vCPU and memory",
      "explanation": "VM size selects a hardware profile including compute and memory characteristics.",
      "clue": "Size = hardware capacity."
    },
    {
      "id": "q045",
      "topic": "compute",
      "lessonId": "compute-vm-basics",
      "difficulty": "Scenario",
      "question": "A VM workload needs more RAM and CPU but should remain a VM. What is the most direct action?",
      "options": [
        "Resize the VM to a supported size",
        "Create an SSPR policy",
        "Change the resource group tag",
        "Enable blob versioning"
      ],
      "answer": "Resize the VM to a supported size",
      "explanation": "Resizing changes the VM compute profile when a supported size is available.",
      "clue": "Need more VM resources = resize."
    },
    {
      "id": "q046",
      "topic": "compute",
      "lessonId": "compute-vm-disks-move",
      "difficulty": "Intermediate",
      "question": "Moving a VM to another resource group in the same region is best described as what kind of change?",
      "options": [
        "A logical resource move, not a regional relocation",
        "A Site Recovery failover",
        "A DNS migration only",
        "A blob replication operation"
      ],
      "answer": "A logical resource move, not a regional relocation",
      "explanation": "Resource-group moves change management organization; they do not inherently move the VM to another region.",
      "clue": "Resource group versus region."
    },
    {
      "id": "q047",
      "topic": "compute",
      "lessonId": "compute-vm-disks-move",
      "difficulty": "Scenario",
      "question": "Which feature protects supported VM data on the host path, including temporary disk/cache scenarios?",
      "options": [
        "Encryption at host",
        "Azure DNS",
        "VNet peering",
        "Stored access policy"
      ],
      "answer": "Encryption at host",
      "explanation": "Encryption at host extends VM encryption protection to data handled on the host in supported configurations.",
      "clue": "The clue is encryption on the VM host path."
    },
    {
      "id": "q048",
      "topic": "compute",
      "lessonId": "compute-availability-vmss",
      "difficulty": "Fundamental",
      "question": "What does scaling out a VM Scale Set do?",
      "options": [
        "Adds more VM instances",
        "Makes one VM larger",
        "Creates a DNS zone",
        "Moves a VM to another subscription"
      ],
      "answer": "Adds more VM instances",
      "explanation": "Scale out changes instance count; scale up changes instance size.",
      "clue": "Out = more instances."
    },
    {
      "id": "q049",
      "topic": "compute",
      "lessonId": "compute-availability-vmss",
      "difficulty": "Scenario",
      "question": "A stateless web tier must automatically add servers when CPU stays high. What should you use?",
      "options": [
        "VM Scale Set autoscale",
        "Blob soft delete",
        "Management group",
        "Storage account key"
      ],
      "answer": "VM Scale Set autoscale",
      "explanation": "VMSS autoscale can change instance count based on metrics such as CPU.",
      "clue": "Stateless + add instances automatically = VMSS autoscale."
    },
    {
      "id": "q050",
      "topic": "compute",
      "lessonId": "compute-acr",
      "difficulty": "Fundamental",
      "question": "What is Azure Container Registry used for?",
      "options": [
        "Store private container images and artifacts",
        "Run every container workload directly",
        "Provide VM RDP access",
        "Host Azure DNS zones"
      ],
      "answer": "Store private container images and artifacts",
      "explanation": "ACR is a managed registry for container images and related artifacts.",
      "clue": "Registry stores images."
    },
    {
      "id": "q051",
      "topic": "compute",
      "lessonId": "compute-containers",
      "difficulty": "Scenario",
      "question": "A short-lived job needs to run one container without managing servers or a cluster. Which service is a simple fit?",
      "options": [
        "Azure Container Instances",
        "Recovery Services vault",
        "Azure Policy",
        "VNet peering"
      ],
      "answer": "Azure Container Instances",
      "explanation": "ACI can run containers directly without VM or cluster administration.",
      "clue": "Simple container execution = ACI."
    },
    {
      "id": "q052",
      "topic": "compute",
      "lessonId": "compute-containers",
      "difficulty": "Intermediate",
      "question": "Which service adds managed revisions, ingress, and app-oriented scaling for containerized apps?",
      "options": [
        "Azure Container Apps",
        "Azure Container Registry",
        "Azure Files",
        "Azure Bastion"
      ],
      "answer": "Azure Container Apps",
      "explanation": "Container Apps provides application platform capabilities beyond simply storing or launching an image.",
      "clue": "Revisions/ingress = Container Apps."
    },
    {
      "id": "q053",
      "topic": "compute",
      "lessonId": "compute-appservice-plan",
      "difficulty": "Fundamental",
      "question": "What does an App Service plan provide?",
      "options": [
        "The compute resources and pricing tier used by App Service apps",
        "A DNS record only",
        "An Azure RBAC role assignment",
        "A storage SAS token"
      ],
      "answer": "The compute resources and pricing tier used by App Service apps",
      "explanation": "The plan is the underlying compute pool for one or more App Service apps.",
      "clue": "Plan = compute pool."
    },
    {
      "id": "q054",
      "topic": "compute",
      "lessonId": "compute-appservice-plan",
      "difficulty": "Intermediate",
      "question": "What is the difference between App Service scale up and scale out?",
      "options": [
        "Scale up changes the plan tier/size; scale out changes instance count",
        "Scale up adds tags; scale out removes tags",
        "They are the same action",
        "Scale up configures DNS; scale out configures TLS"
      ],
      "answer": "Scale up changes the plan tier/size; scale out changes instance count",
      "explanation": "Vertical scaling changes the instance capability; horizontal scaling changes how many instances run.",
      "clue": "Up = bigger, out = more."
    },
    {
      "id": "q055",
      "topic": "compute",
      "lessonId": "compute-appservice-config",
      "difficulty": "Scenario",
      "question": "You want to deploy a new web app version, test it, then switch production traffic with minimal disruption. What should you use?",
      "options": [
        "App Service deployment slot and swap",
        "Storage account key rotation",
        "VNet peering",
        "Recovery Services vault restore"
      ],
      "answer": "App Service deployment slot and swap",
      "explanation": "Deployment slots provide separate app environments and support controlled swaps.",
      "clue": "Staging then swap = deployment slot."
    },
    {
      "id": "q056",
      "topic": "networking",
      "lessonId": "network-vnet-subnet",
      "difficulty": "Fundamental",
      "question": "What divides an Azure VNet address space into smaller network segments?",
      "options": [
        "Subnets",
        "Management groups",
        "Action groups",
        "Blob containers"
      ],
      "answer": "Subnets",
      "explanation": "Subnets carve a VNet address space into smaller ranges.",
      "clue": "VNet segmentation = subnets."
    },
    {
      "id": "q057",
      "topic": "networking",
      "lessonId": "network-vnet-subnet",
      "difficulty": "Intermediate",
      "question": "Why should address spaces avoid overlap when VNets may be connected later?",
      "options": [
        "Overlapping ranges can prevent or complicate routing and peering",
        "Overlap is required for peering",
        "Overlap improves DNS security",
        "Overlap grants RBAC access"
      ],
      "answer": "Overlapping ranges can prevent or complicate routing and peering",
      "explanation": "Connected networks need unambiguous address ranges for routing.",
      "clue": "Future connectivity = avoid overlap."
    },
    {
      "id": "q058",
      "topic": "networking",
      "lessonId": "network-peering-public-route",
      "difficulty": "Fundamental",
      "question": "What does VNet peering provide?",
      "options": [
        "Private connectivity between Azure VNets over Microsoft's backbone",
        "Automatic RBAC role assignment",
        "Blob backup",
        "Password reset"
      ],
      "answer": "Private connectivity between Azure VNets over Microsoft's backbone",
      "explanation": "VNet peering connects VNets privately and with low latency.",
      "clue": "Connect VNets = peering."
    },
    {
      "id": "q059",
      "topic": "networking",
      "lessonId": "network-peering-public-route",
      "difficulty": "Intermediate",
      "question": "You peer VNet A with B and B with C. Which statement is correct by default?",
      "options": [
        "A does not automatically have transitive peering connectivity to C",
        "A automatically reaches C through B with no other configuration",
        "Peering deletes all NSGs",
        "B becomes a management group"
      ],
      "answer": "A does not automatically have transitive peering connectivity to C",
      "explanation": "VNet peering is not transitive by default.",
      "clue": "Peering is pair-by-pair."
    },
    {
      "id": "q060",
      "topic": "networking",
      "lessonId": "network-peering-public-route",
      "difficulty": "Scenario",
      "question": "All outbound traffic from a subnet must pass through a firewall appliance. What should you configure?",
      "options": [
        "A user-defined route with the virtual appliance as next hop",
        "An SSPR policy",
        "A storage lifecycle rule",
        "An App Service slot"
      ],
      "answer": "A user-defined route with the virtual appliance as next hop",
      "explanation": "A route table/UDR can direct subnet traffic to a network virtual appliance.",
      "clue": "Force path through appliance = route."
    },
    {
      "id": "q061",
      "topic": "networking",
      "lessonId": "network-troubleshooting",
      "difficulty": "Scenario",
      "question": "DNS resolves and effective routes are correct, but a VM still cannot reach TCP 443 on another VM. What should you check next?",
      "options": [
        "Effective NSG rules and the destination listener",
        "Cost Management budget",
        "Blob versioning",
        "Management group hierarchy"
      ],
      "answer": "Effective NSG rules and the destination listener",
      "explanation": "After DNS and routing, security rules and the destination service/port are key checks.",
      "clue": "Troubleshoot layer by layer."
    },
    {
      "id": "q062",
      "topic": "networking",
      "lessonId": "network-troubleshooting",
      "difficulty": "Intermediate",
      "question": "Which Network Watcher capability can help determine whether an NSG would allow or deny a specific flow?",
      "options": [
        "IP flow verify",
        "Azure Advisor",
        "SSPR",
        "Blob lifecycle management"
      ],
      "answer": "IP flow verify",
      "explanation": "IP flow verify evaluates whether traffic is allowed or denied based on applicable NSG rules.",
      "clue": "Flow allowed/denied = IP flow verify."
    },
    {
      "id": "q063",
      "topic": "networking",
      "lessonId": "network-nsg-asg",
      "difficulty": "Fundamental",
      "question": "In an NSG, which rule priority is evaluated first?",
      "options": [
        "The lower numeric priority",
        "The higher numeric priority",
        "The newest rule regardless of priority",
        "The rule with the longest description"
      ],
      "answer": "The lower numeric priority",
      "explanation": "NSG rules are processed from lower priority number to higher until a match is found.",
      "clue": "100 before 200."
    },
    {
      "id": "q064",
      "topic": "networking",
      "lessonId": "network-nsg-asg",
      "difficulty": "Intermediate",
      "question": "What is the purpose of an Application Security Group (ASG)?",
      "options": [
        "Group supported VM NICs by application role for NSG rules",
        "Host DNS zones",
        "Store container images",
        "Create Azure budgets"
      ],
      "answer": "Group supported VM NICs by application role for NSG rules",
      "explanation": "ASGs let NSG rules refer to application groups rather than maintaining IP lists.",
      "clue": "ASG is for network rule grouping."
    },
    {
      "id": "q065",
      "topic": "networking",
      "lessonId": "network-secure-access",
      "difficulty": "Fundamental",
      "question": "Which service provides managed RDP/SSH access to Azure VMs without requiring public IPs on the target VMs?",
      "options": [
        "Azure Bastion",
        "Azure DNS",
        "Azure Policy",
        "AzCopy"
      ],
      "answer": "Azure Bastion",
      "explanation": "Azure Bastion provides managed administrative connectivity to VMs.",
      "clue": "RDP/SSH without VM public IP = Bastion."
    },
    {
      "id": "q066",
      "topic": "networking",
      "lessonId": "network-secure-access",
      "difficulty": "Intermediate",
      "question": "What is the key difference between a service endpoint and a private endpoint?",
      "options": [
        "A private endpoint gives the PaaS resource a private IP in the VNet; a service endpoint does not",
        "A service endpoint grants Owner RBAC automatically",
        "A private endpoint is only for DNS hosting",
        "There is no difference"
      ],
      "answer": "A private endpoint gives the PaaS resource a private IP in the VNet; a service endpoint does not",
      "explanation": "Private endpoints use Private Link and private IP addresses; service endpoints secure access to the service's public endpoint from selected VNets.",
      "clue": "Private IP is the giveaway."
    },
    {
      "id": "q067",
      "topic": "networking",
      "lessonId": "network-secure-access",
      "difficulty": "Scenario",
      "question": "A storage service must be accessed through a private IP from the application VNet. What should you configure?",
      "options": [
        "Private endpoint and appropriate private DNS",
        "Public IP on every VM",
        "Management group",
        "Budget alert"
      ],
      "answer": "Private endpoint and appropriate private DNS",
      "explanation": "Private endpoint plus correct name resolution allows clients to use a private service IP.",
      "clue": "Private IP + service name resolution."
    },
    {
      "id": "q068",
      "topic": "networking",
      "lessonId": "network-dns-loadbalancer",
      "difficulty": "Fundamental",
      "question": "What is the job of a load balancer health probe?",
      "options": [
        "Determine which backend instances are healthy enough to receive new traffic",
        "Assign Azure RBAC roles",
        "Create blob versions",
        "Reset passwords"
      ],
      "answer": "Determine which backend instances are healthy enough to receive new traffic",
      "explanation": "Health probes test backend health so unhealthy instances can be removed from distribution.",
      "clue": "Probe = backend health."
    },
    {
      "id": "q069",
      "topic": "networking",
      "lessonId": "network-dns-loadbalancer",
      "difficulty": "Intermediate",
      "question": "Which load balancer type uses a private frontend IP for traffic inside a VNet?",
      "options": [
        "Internal load balancer",
        "Public load balancer",
        "Azure DNS public zone",
        "Management group"
      ],
      "answer": "Internal load balancer",
      "explanation": "An internal load balancer distributes traffic using a private frontend IP.",
      "clue": "Private frontend = internal."
    },
    {
      "id": "q070",
      "topic": "networking",
      "lessonId": "network-dns-loadbalancer",
      "difficulty": "Scenario",
      "question": "Clients reach the load balancer frontend, but one VM never receives new connections. What should you check first?",
      "options": [
        "Backend pool membership and health probe status",
        "Entra SSPR settings",
        "Blob lifecycle rules",
        "Cost budget"
      ],
      "answer": "Backend pool membership and health probe status",
      "explanation": "If the frontend is reachable, backend membership/health are common reasons one instance gets no new traffic.",
      "clue": "Frontend works; inspect backend health."
    },
    {
      "id": "q071",
      "topic": "monitoring",
      "lessonId": "monitor-metrics-logs",
      "difficulty": "Fundamental",
      "question": "Which Azure Monitor data type is best for numeric values over time such as CPU percentage?",
      "options": [
        "Metrics",
        "Blob snapshots",
        "Management groups",
        "SAS tokens"
      ],
      "answer": "Metrics",
      "explanation": "Metrics are numerical time-series data ideal for charting and alerting.",
      "clue": "Number over time = metric."
    },
    {
      "id": "q072",
      "topic": "monitoring",
      "lessonId": "monitor-metrics-logs",
      "difficulty": "Intermediate",
      "question": "Where are Azure Monitor Logs commonly queried using KQL?",
      "options": [
        "Log Analytics",
        "Azure Bastion",
        "App Service deployment slots",
        "Storage access keys"
      ],
      "answer": "Log Analytics",
      "explanation": "Log Analytics workspaces are used to query Azure Monitor Logs with KQL.",
      "clue": "KQL + logs = Log Analytics."
    },
    {
      "id": "q073",
      "topic": "monitoring",
      "lessonId": "monitor-metrics-logs",
      "difficulty": "Scenario",
      "question": "You created a Log Analytics workspace, but a resource's detailed platform logs are not appearing. What may still be required?",
      "options": [
        "Configure the resource's diagnostic settings/data collection to send the logs",
        "Resize the VM",
        "Create a management group",
        "Enable SSPR"
      ],
      "answer": "Configure the resource's diagnostic settings/data collection to send the logs",
      "explanation": "A workspace alone does not automatically collect every resource log; supported diagnostic/data collection settings must route the data.",
      "clue": "Destination exists, but source must send data."
    },
    {
      "id": "q074",
      "topic": "monitoring",
      "lessonId": "monitor-alerts",
      "difficulty": "Fundamental",
      "question": "In Azure Monitor, what defines who should be notified or what automation should run when an alert fires?",
      "options": [
        "Action group",
        "Availability set",
        "Management group",
        "Network interface"
      ],
      "answer": "Action group",
      "explanation": "Action groups contain alert notification and action targets.",
      "clue": "Alert response = action group."
    },
    {
      "id": "q075",
      "topic": "monitoring",
      "lessonId": "monitor-alerts",
      "difficulty": "Intermediate",
      "question": "What is the primary job of an alert rule?",
      "options": [
        "Define the scope and condition that should trigger an alert",
        "Store VM backups",
        "Create a VNet",
        "Issue storage account keys"
      ],
      "answer": "Define the scope and condition that should trigger an alert",
      "explanation": "Alert rules evaluate signals/conditions and create alerts when criteria are met.",
      "clue": "Rule = when/condition."
    },
    {
      "id": "q076",
      "topic": "monitoring",
      "lessonId": "monitor-alerts",
      "difficulty": "Scenario",
      "question": "During planned maintenance you want to suppress notifications for matching alerts without deleting all alert rules. What can help?",
      "options": [
        "Alert processing rule",
        "Blob versioning",
        "Availability zone",
        "VNet peering"
      ],
      "answer": "Alert processing rule",
      "explanation": "Alert processing rules can suppress or modify action handling for matching alerts, including scheduled periods.",
      "clue": "Maintenance suppression = processing rule."
    },
    {
      "id": "q077",
      "topic": "monitoring",
      "lessonId": "monitor-insights-networkwatcher",
      "difficulty": "Fundamental",
      "question": "Which Azure service provides network diagnostic tools such as IP flow verify and next hop?",
      "options": [
        "Network Watcher",
        "Azure Policy",
        "Cost Management",
        "Container Registry"
      ],
      "answer": "Network Watcher",
      "explanation": "Network Watcher provides Azure network monitoring and troubleshooting tools.",
      "clue": "Network diagnostics = Network Watcher."
    },
    {
      "id": "q078",
      "topic": "monitoring",
      "lessonId": "monitor-insights-networkwatcher",
      "difficulty": "Scenario",
      "question": "You need to observe connectivity between two endpoints continuously and detect failures over time. What should you configure?",
      "options": [
        "Connection Monitor",
        "One-time VM resize",
        "Stored access policy",
        "Management group"
      ],
      "answer": "Connection Monitor",
      "explanation": "Connection Monitor monitors connectivity paths over time rather than only testing once.",
      "clue": "Continuous path monitoring."
    },
    {
      "id": "q079",
      "topic": "monitoring",
      "lessonId": "monitor-insights-networkwatcher",
      "difficulty": "Intermediate",
      "question": "What do Azure Monitor Insights generally provide?",
      "options": [
        "Curated monitoring views for supported resource types",
        "Azure RBAC role assignments",
        "Storage account keys",
        "DNS registration only"
      ],
      "answer": "Curated monitoring views for supported resource types",
      "explanation": "Insights provide resource-focused monitoring experiences built on Azure Monitor data.",
      "clue": "Insights = curated monitoring experience."
    },
    {
      "id": "q080",
      "topic": "monitoring",
      "lessonId": "monitor-backup",
      "difficulty": "Fundamental",
      "question": "What does an Azure Backup policy define?",
      "options": [
        "Backup schedule/frequency and retention",
        "NSG priority",
        "DNS record TTL only",
        "RBAC scope"
      ],
      "answer": "Backup schedule/frequency and retention",
      "explanation": "Backup policies define when backups occur and how long recovery points are retained.",
      "clue": "Backup calendar + retention."
    },
    {
      "id": "q081",
      "topic": "monitoring",
      "lessonId": "monitor-backup",
      "difficulty": "Scenario",
      "question": "A VM must be backed up daily and retained for 30 days. What is the correct approach?",
      "options": [
        "Configure the appropriate vault, create/select a backup policy, and enable protection for the VM",
        "Create a public IP only",
        "Use VNet peering",
        "Assign Reader role"
      ],
      "answer": "Configure the appropriate vault, create/select a backup policy, and enable protection for the VM",
      "explanation": "Backup protection requires a vault, policy, and protected workload configuration.",
      "clue": "Vault + policy + enable protection."
    },
    {
      "id": "q082",
      "topic": "monitoring",
      "lessonId": "monitor-backup",
      "difficulty": "Intermediate",
      "question": "Which statement is correct?",
      "options": [
        "Having a vault does not automatically mean every VM is backed up",
        "Every VM is backed up as soon as a vault exists",
        "Backup and high availability are identical",
        "A restore operation is the same as VNet peering"
      ],
      "answer": "Having a vault does not automatically mean every VM is backed up",
      "explanation": "Workloads must be explicitly protected with appropriate policy/configuration.",
      "clue": "Vault exists ≠ protected workload."
    },
    {
      "id": "q083",
      "topic": "monitoring",
      "lessonId": "monitor-site-recovery",
      "difficulty": "Fundamental",
      "question": "Which service is designed to replicate supported workloads and orchestrate disaster-recovery failover?",
      "options": [
        "Azure Site Recovery",
        "Azure DNS",
        "Azure Policy",
        "Azure Container Registry"
      ],
      "answer": "Azure Site Recovery",
      "explanation": "Azure Site Recovery provides workload replication and failover orchestration for supported scenarios.",
      "clue": "Replication + failover = Site Recovery."
    },
    {
      "id": "q084",
      "topic": "monitoring",
      "lessonId": "monitor-site-recovery",
      "difficulty": "Intermediate",
      "question": "What is the purpose of a Site Recovery test failover?",
      "options": [
        "Validate recovery behavior without treating it as the real disaster failover",
        "Rotate storage account keys",
        "Change NSG priority",
        "Assign a license"
      ],
      "answer": "Validate recovery behavior without treating it as the real disaster failover",
      "explanation": "Test failover lets administrators exercise the recovery process in a controlled way.",
      "clue": "Test recovery before disaster."
    },
    {
      "id": "q085",
      "topic": "monitoring",
      "lessonId": "monitor-site-recovery",
      "difficulty": "Scenario",
      "question": "A regional outage must be survivable by running replicated Azure VMs in another region. Which solution best fits?",
      "options": [
        "Azure Site Recovery",
        "Blob lifecycle management",
        "Self-service password reset",
        "Azure DNS zone only"
      ],
      "answer": "Azure Site Recovery",
      "explanation": "ASR is designed for disaster recovery through replication and orchestrated failover.",
      "clue": "Need workload running elsewhere after disaster."
    },
    {
      "id": "q086",
      "topic": "foundations",
      "lessonId": "foundation-admin-tools",
      "difficulty": "Fundamental",
      "question": "Which command style most clearly indicates Azure CLI?",
      "options": [
        "A command beginning with az",
        "A cmdlet such as Get-AzResource",
        "A KQL query",
        "A Bicep resource declaration"
      ],
      "answer": "A command beginning with az",
      "explanation": "Azure CLI commands use the az command group.",
      "clue": "Recognize the tool by its syntax."
    },
    {
      "id": "q087",
      "topic": "foundations",
      "lessonId": "foundation-admin-tools",
      "difficulty": "Fundamental",
      "question": "Which syntax most clearly indicates Azure PowerShell?",
      "options": [
        "A cmdlet such as Get-AzResource",
        "az network vnet list",
        "SELECT * FROM AzureResources",
        "resource vnet 'Microsoft.Network/virtualNetworks@...'"
      ],
      "answer": "A cmdlet such as Get-AzResource",
      "explanation": "Azure PowerShell uses Az module cmdlets with PowerShell Verb-Noun style names.",
      "clue": "Verb-AzNoun points to Azure PowerShell."
    },
    {
      "id": "q088",
      "topic": "foundations",
      "lessonId": "foundation-admin-tools",
      "difficulty": "Intermediate",
      "question": "What is Azure Cloud Shell?",
      "options": [
        "A browser-accessible shell environment with Azure administration tools",
        "A VM backup vault",
        "A private DNS zone",
        "A storage redundancy option"
      ],
      "answer": "A browser-accessible shell environment with Azure administration tools",
      "explanation": "Cloud Shell provides a managed command environment in the browser for Azure administration.",
      "clue": "Browser terminal for Azure administration."
    },
    {
      "id": "q089",
      "topic": "foundations",
      "lessonId": "foundation-question-decoder",
      "difficulty": "Scenario",
      "question": "A question says a PaaS resource must be reachable through a private IP in your VNet. Which phrase is the strongest clue?",
      "options": [
        "Private IP",
        "Resource group",
        "Subscription",
        "Tag"
      ],
      "answer": "Private IP",
      "explanation": "The private-IP requirement points directly toward private endpoint behavior.",
      "clue": "Identify the exact technical requirement before the service name."
    },
    {
      "id": "q090",
      "topic": "foundations",
      "lessonId": "foundation-question-decoder",
      "difficulty": "Intermediate",
      "question": "When two answers both appear to work, which choice is usually stronger for an AZ-104 least-privilege scenario?",
      "options": [
        "The option that meets all requirements with the smallest necessary access and scope",
        "The option that grants Owner at subscription scope",
        "The option with the most Azure services",
        "The option that ignores the stated scope"
      ],
      "answer": "The option that meets all requirements with the smallest necessary access and scope",
      "explanation": "Least privilege favors only the permissions and scope required.",
      "clue": "Minimum necessary access is a common exam clue."
    }
  ],
  "labs": [
    {
      "id": "lab-entra-user",
      "topic": "identity",
      "domain": "Identity & Governance",
      "title": "Create an Entra User and Group Assignment",
      "duration": "8–12 min",
      "description": "Practice the identity objects behind many AZ-104 access scenarios.",
      "mission": "Operations is onboarding Jordan, who should receive access through the Operations security group instead of a one-off assignment.",
      "fields": [
        {
          "id": "userType",
          "label": "User type",
          "options": [
            "Member",
            "Guest"
          ],
          "answer": "Member",
          "help": "Jordan is an employee inside the organization."
        },
        {
          "id": "groupType",
          "label": "Group type",
          "options": [
            "Security",
            "Microsoft 365"
          ],
          "answer": "Security",
          "help": "The requirement is access/security, not collaboration."
        },
        {
          "id": "assignment",
          "label": "Access method",
          "options": [
            "Assign Jordan directly",
            "Assign the Operations group"
          ],
          "answer": "Assign the Operations group",
          "help": "Group-based access is easier to maintain."
        }
      ],
      "success": "Jordan is a member identity, placed in a security group, and access is assigned to the group.",
      "quiz": [
        {
          "question": "Why use the group for access?",
          "answer": "It reduces repeated individual administration",
          "options": [
            "It reduces repeated individual administration",
            "It creates a new subscription",
            "It replaces authentication",
            "It turns the group into a resource group"
          ],
          "explanation": "Groups make common access easier to manage as membership changes."
        },
        {
          "question": "Which Azure concept still controls the actual resource permission?",
          "answer": "Azure RBAC",
          "options": [
            "Azure RBAC",
            "Blob lifecycle",
            "Site Recovery",
            "DNS"
          ],
          "explanation": "The group is the principal; RBAC determines its Azure permissions."
        },
        {
          "question": "A resource group and an Entra security group are what?",
          "answer": "Different objects with different jobs",
          "options": [
            "Different objects with different jobs",
            "The same object",
            "Both billing accounts",
            "Both DNS zones"
          ],
          "explanation": "Resource groups organize Azure resources; Entra groups organize identities."
        }
      ]
    },
    {
      "id": "lab-rbac",
      "topic": "identity",
      "domain": "Identity & Governance",
      "title": "Assign RBAC at Least Privilege",
      "duration": "10–15 min",
      "description": "Build a correct role assignment from principal, role, and scope.",
      "mission": "The app identity ReportingApp only needs to read one storage account named reportsstore.",
      "fields": [
        {
          "id": "principal",
          "label": "Security principal",
          "options": [
            "ReportingApp managed identity",
            "All users",
            "Subscription owner"
          ],
          "answer": "ReportingApp managed identity",
          "help": "Grant the app itself, not everyone."
        },
        {
          "id": "role",
          "label": "Role",
          "options": [
            "Reader",
            "Contributor",
            "Owner"
          ],
          "answer": "Reader",
          "help": "The mission only requires read access at the management level."
        },
        {
          "id": "scope",
          "label": "Scope",
          "options": [
            "reportsstore storage account",
            "Resource group",
            "Subscription"
          ],
          "answer": "reportsstore storage account",
          "help": "Use the smallest scope that satisfies the requirement."
        }
      ],
      "success": "The assignment follows WHO + ROLE + SCOPE and least privilege.",
      "quiz": [
        {
          "question": "Which RBAC component answers 'where does this permission apply?'",
          "answer": "Scope",
          "options": [
            "Scope",
            "Principal",
            "Role definition",
            "Tag"
          ],
          "explanation": "Scope defines the boundary of the role assignment."
        },
        {
          "question": "Which built-in role can manage resources but normally cannot grant RBAC roles?",
          "answer": "Contributor",
          "options": [
            "Contributor",
            "Owner",
            "Reader",
            "User Access Administrator"
          ],
          "explanation": "Contributor manages resources but does not include role-assignment authority."
        },
        {
          "question": "Why not assign at subscription scope here?",
          "answer": "It grants access more broadly than required",
          "options": [
            "It grants access more broadly than required",
            "Subscriptions cannot have RBAC",
            "Storage accounts ignore RBAC",
            "Reader works only on VMs"
          ],
          "explanation": "Least privilege uses the smallest useful scope."
        }
      ]
    },
    {
      "id": "lab-governance",
      "topic": "identity",
      "domain": "Identity & Governance",
      "title": "Enforce Tags and Protect Production",
      "duration": "10–15 min",
      "description": "Use Policy, tags, locks, and budgets for different governance needs.",
      "mission": "Production resources must have a CostCenter tag, the production resource group must not be accidentally deleted, and Finance wants an 80% spend warning.",
      "fields": [
        {
          "id": "tagControl",
          "label": "Require CostCenter",
          "options": [
            "Azure Policy",
            "NSG",
            "Azure DNS"
          ],
          "answer": "Azure Policy",
          "help": "Policy is designed to audit/enforce governance rules."
        },
        {
          "id": "lock",
          "label": "Production protection",
          "options": [
            "CanNotDelete",
            "ReadOnly",
            "No lock"
          ],
          "answer": "CanNotDelete",
          "help": "Changes remain allowed, but deletion is blocked."
        },
        {
          "id": "cost",
          "label": "Spend warning",
          "options": [
            "Cost Management budget alert",
            "Action group only",
            "Route table"
          ],
          "answer": "Cost Management budget alert",
          "help": "Budget thresholds are the direct cost-control tool."
        }
      ],
      "success": "You used Policy for rules, a lock for protection, and Cost Management for spend awareness.",
      "quiz": [
        {
          "question": "Which tool grants user permissions?",
          "answer": "Azure RBAC",
          "options": [
            "Azure RBAC",
            "Azure Policy",
            "Tags",
            "Resource locks"
          ],
          "explanation": "RBAC controls authorization; Policy evaluates governance rules."
        },
        {
          "question": "CanNotDelete allows what?",
          "answer": "Authorized modifications but blocks deletion",
          "options": [
            "Authorized modifications but blocks deletion",
            "No reads",
            "No changes of any kind",
            "Only DNS changes"
          ],
          "explanation": "CanNotDelete is less restrictive than ReadOnly."
        },
        {
          "question": "Does a budget normally shut down all resources automatically?",
          "answer": "No, a budget primarily tracks spend and triggers notifications/actions",
          "options": [
            "No, a budget primarily tracks spend and triggers notifications/actions",
            "Yes, always",
            "Only for VMs",
            "Only if an NSG exists"
          ],
          "explanation": "Budget alerts provide spending awareness; stopping workloads requires separate automation/design."
        }
      ]
    },
    {
      "id": "lab-storage-account",
      "topic": "storage",
      "domain": "Storage",
      "title": "Choose Storage Redundancy and Encryption",
      "duration": "8–12 min",
      "description": "Match resilience and encryption requirements to storage settings.",
      "mission": "A workload must survive an availability-zone failure in one region. Cross-region copies are not required. Data must be encrypted at rest.",
      "fields": [
        {
          "id": "redundancy",
          "label": "Redundancy",
          "options": [
            "LRS",
            "ZRS",
            "GRS",
            "RA-GRS"
          ],
          "answer": "ZRS",
          "help": "ZRS spreads copies across zones in the primary region."
        },
        {
          "id": "encryption",
          "label": "Encryption at rest",
          "options": [
            "Storage Service Encryption",
            "Disable encryption",
            "NSG encryption"
          ],
          "answer": "Storage Service Encryption",
          "help": "Azure Storage encrypts data at rest using Storage Service Encryption."
        },
        {
          "id": "publicAccess",
          "label": "Blob public access",
          "options": [
            "Disabled",
            "Enabled for all containers"
          ],
          "answer": "Disabled",
          "help": "No public-access requirement was given."
        }
      ],
      "success": "The storage account is zone-resilient, encrypted, and not unnecessarily public.",
      "quiz": [
        {
          "question": "Which redundancy adds a secondary region and readable secondary endpoint?",
          "answer": "RA-GRS",
          "options": [
            "RA-GRS",
            "LRS",
            "ZRS",
            "GRS without read access"
          ],
          "explanation": "RA-GRS provides read access to the geo-replicated secondary."
        },
        {
          "question": "Why is ZRS better than LRS for this mission?",
          "answer": "It spreads copies across availability zones",
          "options": [
            "It spreads copies across availability zones",
            "It grants RBAC",
            "It creates a backup vault",
            "It hosts DNS"
          ],
          "explanation": "ZRS addresses zone-level failure."
        },
        {
          "question": "Is storage redundancy the same as backup?",
          "answer": "No",
          "options": [
            "No",
            "Yes",
            "Only for blobs",
            "Only when using ZRS"
          ],
          "explanation": "Redundancy improves data durability/availability; backup provides recoverable protection points."
        }
      ]
    },
    {
      "id": "lab-storage-sas",
      "topic": "storage",
      "domain": "Storage",
      "title": "Create a Safe SAS",
      "duration": "10–15 min",
      "description": "Practice delegated storage access without exposing the account key.",
      "mission": "VendorCo needs read-only access to one blob container for four hours over HTTPS.",
      "fields": [
        {
          "id": "credential",
          "label": "Credential method",
          "options": [
            "SAS token",
            "Storage account key",
            "Subscription Owner role"
          ],
          "answer": "SAS token",
          "help": "A limited SAS avoids sharing the master account key."
        },
        {
          "id": "permission",
          "label": "Permission",
          "options": [
            "Read",
            "Read + Write + Delete",
            "Full control"
          ],
          "answer": "Read",
          "help": "Grant only what the vendor needs."
        },
        {
          "id": "protocol",
          "label": "Allowed protocol",
          "options": [
            "HTTPS only",
            "HTTP and HTTPS"
          ],
          "answer": "HTTPS only",
          "help": "Use encrypted transport."
        },
        {
          "id": "expiry",
          "label": "Expiration",
          "options": [
            "4 hours",
            "30 days",
            "No expiration"
          ],
          "answer": "4 hours",
          "help": "Match the requested access window."
        }
      ],
      "success": "The vendor receives tightly scoped, time-limited, read-only HTTPS access.",
      "quiz": [
        {
          "question": "Why avoid sharing the account key?",
          "answer": "It provides much broader storage access",
          "options": [
            "It provides much broader storage access",
            "It cannot access storage",
            "It expires every minute",
            "It only works with DNS"
          ],
          "explanation": "Account keys are broad credentials and should be protected."
        },
        {
          "question": "Which feature can centrally constrain supported service SAS behavior?",
          "answer": "Stored access policy",
          "options": [
            "Stored access policy",
            "Availability set",
            "Route table",
            "Management group"
          ],
          "explanation": "Stored access policies can provide server-side constraints for supported service SAS scenarios."
        },
        {
          "question": "A SAS primarily controls what?",
          "answer": "Delegated storage access",
          "options": [
            "Delegated storage access",
            "VNet routes",
            "VM sizing",
            "Password reset"
          ],
          "explanation": "SAS is a storage access delegation mechanism."
        }
      ]
    },
    {
      "id": "lab-blob-lifecycle",
      "topic": "storage",
      "domain": "Storage",
      "title": "Configure Blob Lifecycle and Recovery",
      "duration": "10–15 min",
      "description": "Use lifecycle management, versioning, and soft delete together.",
      "mission": "Project logs should move to Cool after 30 days, older versions should be recoverable, and accidental deletion should have a recovery window.",
      "fields": [
        {
          "id": "tierRule",
          "label": "30-day action",
          "options": [
            "Move blobs to Cool",
            "Move blobs to Hot",
            "Create an NSG"
          ],
          "answer": "Move blobs to Cool",
          "help": "Lifecycle rules can change tiers based on age."
        },
        {
          "id": "versions",
          "label": "Keep previous blob versions",
          "options": [
            "Enable blob versioning",
            "Enable VNet peering",
            "Create an App Service slot"
          ],
          "answer": "Enable blob versioning",
          "help": "Versioning preserves prior blob versions."
        },
        {
          "id": "deleteProtection",
          "label": "Accidental deletion protection",
          "options": [
            "Enable blob soft delete",
            "Use Azure Bastion",
            "Use a budget"
          ],
          "answer": "Enable blob soft delete",
          "help": "Soft delete retains deleted blobs for recovery."
        }
      ],
      "success": "The account now automates tiering and has two complementary recovery features.",
      "quiz": [
        {
          "question": "Which feature performs age-based tier moves?",
          "answer": "Lifecycle management",
          "options": [
            "Lifecycle management",
            "Object replication",
            "RBAC",
            "DNS"
          ],
          "explanation": "Lifecycle rules automate tiering/deletion based on conditions."
        },
        {
          "question": "What does blob versioning preserve?",
          "answer": "Previous blob versions",
          "options": [
            "Previous blob versions",
            "NSG rules",
            "VM images only",
            "Subscriptions"
          ],
          "explanation": "Versioning keeps older versions after changes."
        },
        {
          "question": "Which tool is best for command-line bulk storage copy?",
          "answer": "AzCopy",
          "options": [
            "AzCopy",
            "Azure Policy",
            "Bastion",
            "Cost Management"
          ],
          "explanation": "AzCopy is the Azure Storage command-line transfer utility."
        }
      ]
    },
    {
      "id": "lab-vm",
      "topic": "compute",
      "domain": "Compute",
      "title": "Deploy a Resilient Azure VM",
      "duration": "12–18 min",
      "description": "Choose the important VM settings without paying for Azure resources.",
      "mission": "A production VM needs zone-level separation, a managed OS disk, and secure admin access without a public IP on the VM.",
      "fields": [
        {
          "id": "availability",
          "label": "Availability option",
          "options": [
            "Availability zone",
            "Availability set",
            "No infrastructure redundancy"
          ],
          "answer": "Availability zone",
          "help": "The mission explicitly calls for zone-level separation."
        },
        {
          "id": "disk",
          "label": "OS disk",
          "options": [
            "Managed disk",
            "Unmanaged disk"
          ],
          "answer": "Managed disk",
          "help": "Managed disks are the standard Azure VM disk model."
        },
        {
          "id": "publicIp",
          "label": "VM public IP",
          "options": [
            "None",
            "Create public IP"
          ],
          "answer": "None",
          "help": "The mission says no public IP on the target VM."
        },
        {
          "id": "admin",
          "label": "Admin connectivity",
          "options": [
            "Azure Bastion",
            "Open RDP/SSH to Internet",
            "Blob SAS"
          ],
          "answer": "Azure Bastion",
          "help": "Bastion provides managed RDP/SSH without a VM public IP."
        }
      ],
      "success": "The simulated VM uses a zone, managed disk, no public IP, and Bastion for administration.",
      "quiz": [
        {
          "question": "What does VM size primarily control?",
          "answer": "vCPU, memory, and related compute capacity",
          "options": [
            "vCPU, memory, and related compute capacity",
            "Subscription hierarchy",
            "Blob version count",
            "DNS records"
          ],
          "explanation": "VM size is the compute hardware profile."
        },
        {
          "question": "What is scale up?",
          "answer": "Change to a larger/smaller VM size",
          "options": [
            "Change to a larger/smaller VM size",
            "Add more instances",
            "Create a backup",
            "Assign RBAC"
          ],
          "explanation": "Scale up is vertical scaling."
        },
        {
          "question": "Moving a VM to another resource group in the same region does what?",
          "answer": "Changes logical organization, not the VM's region",
          "options": [
            "Changes logical organization, not the VM's region",
            "Performs regional failover",
            "Creates a replica region",
            "Changes DNS automatically"
          ],
          "explanation": "Resource-group moves are management-plane moves."
        }
      ]
    },
    {
      "id": "lab-vmss",
      "topic": "compute",
      "domain": "Compute",
      "title": "Configure VM Scale Set Autoscale",
      "duration": "10–15 min",
      "description": "Practice scale-out logic for a stateless workload.",
      "mission": "A stateless web tier should run at least 2 instances and add instances when average CPU exceeds 70%.",
      "fields": [
        {
          "id": "service",
          "label": "Compute service",
          "options": [
            "Virtual Machine Scale Set",
            "Single VM only",
            "Storage account"
          ],
          "answer": "Virtual Machine Scale Set",
          "help": "VMSS manages a fleet of similar VMs."
        },
        {
          "id": "minimum",
          "label": "Minimum instances",
          "options": [
            "1",
            "2",
            "5"
          ],
          "answer": "2",
          "help": "The mission requires at least two."
        },
        {
          "id": "scaleRule",
          "label": "Scale rule",
          "options": [
            "Add instance when CPU > 70%",
            "Resize disk when CPU > 70%",
            "Delete an instance when CPU > 70%"
          ],
          "answer": "Add instance when CPU > 70%",
          "help": "High load should scale out."
        }
      ],
      "success": "The scale set maintains at least two instances and scales out under sustained CPU load.",
      "quiz": [
        {
          "question": "Scale out means what?",
          "answer": "Add instances",
          "options": [
            "Add instances",
            "Increase one VM's size",
            "Add tags",
            "Increase backup retention"
          ],
          "explanation": "Horizontal scaling changes instance count."
        },
        {
          "question": "What do availability zones protect against?",
          "answer": "Datacenter/zone-level failure within a region",
          "options": [
            "Datacenter/zone-level failure within a region",
            "Every regional disaster",
            "Deleted passwords",
            "Storage SAS expiration"
          ],
          "explanation": "Zones are physically separate locations within a region."
        },
        {
          "question": "Is VMSS a backup service?",
          "answer": "No",
          "options": [
            "No",
            "Yes",
            "Only for Linux",
            "Only with ZRS"
          ],
          "explanation": "VMSS improves scalable compute availability; backup is separate."
        }
      ]
    },
    {
      "id": "lab-appservice",
      "topic": "compute",
      "domain": "Compute",
      "title": "Release an App Service Safely",
      "duration": "12–18 min",
      "description": "Configure a production web app with the right App Service features.",
      "mission": "The app needs HTTPS on a custom name, outbound access into a VNet, and a safe staging-to-production release.",
      "fields": [
        {
          "id": "tls",
          "label": "Custom-name security",
          "options": [
            "Bind a TLS certificate",
            "Use HTTP only",
            "Create an NSG on the DNS zone"
          ],
          "answer": "Bind a TLS certificate",
          "help": "TLS secures HTTPS for the custom hostname."
        },
        {
          "id": "network",
          "label": "Outbound private network access",
          "options": [
            "VNet integration",
            "Public DNS only",
            "Blob soft delete"
          ],
          "answer": "VNet integration",
          "help": "VNet integration supports outbound connections from the app into a VNet."
        },
        {
          "id": "release",
          "label": "Deployment method",
          "options": [
            "Staging slot then swap",
            "Edit production files directly",
            "Move the subscription"
          ],
          "answer": "Staging slot then swap",
          "help": "Slots support validation before swapping into production."
        }
      ],
      "success": "The app uses TLS, VNet integration, and a staging-slot deployment workflow.",
      "quiz": [
        {
          "question": "What provides App Service compute capacity?",
          "answer": "App Service plan",
          "options": [
            "App Service plan",
            "Resource lock",
            "DNS record",
            "SAS token"
          ],
          "explanation": "The plan is the compute pool and pricing tier."
        },
        {
          "question": "Scale out an App Service plan means what?",
          "answer": "Increase instance count",
          "options": [
            "Increase instance count",
            "Change DNS name",
            "Rotate storage keys",
            "Add an Entra guest"
          ],
          "explanation": "Scale out is horizontal scaling."
        },
        {
          "question": "Private inbound access to App Service can use what in supported designs?",
          "answer": "Private endpoint",
          "options": [
            "Private endpoint",
            "Availability set",
            "Management group",
            "AzCopy"
          ],
          "explanation": "Private endpoints can provide private inbound connectivity; VNet integration is primarily outbound."
        }
      ]
    },
    {
      "id": "lab-vnet",
      "topic": "networking",
      "domain": "Virtual Networking",
      "title": "Build a VNet and Subnets",
      "duration": "10–15 min",
      "description": "Practice address planning before security and routing.",
      "mission": "Create a VNet with address space 10.20.0.0/16. The web subnet should be 10.20.1.0/24 and the data subnet 10.20.2.0/24.",
      "fields": [
        {
          "id": "vnet",
          "label": "VNet address space",
          "options": [
            "10.20.0.0/16",
            "10.20.1.0/24",
            "10.30.0.0/8"
          ],
          "answer": "10.20.0.0/16",
          "help": "The VNet must contain both requested subnets."
        },
        {
          "id": "web",
          "label": "Web subnet",
          "options": [
            "10.20.1.0/24",
            "10.20.0.0/15",
            "10.20.2.0/24"
          ],
          "answer": "10.20.1.0/24",
          "help": "Use the web range from the mission."
        },
        {
          "id": "data",
          "label": "Data subnet",
          "options": [
            "10.20.2.0/24",
            "10.20.1.0/24",
            "192.168.1.0/24"
          ],
          "answer": "10.20.2.0/24",
          "help": "Use a separate non-overlapping subnet inside the VNet."
        }
      ],
      "success": "The simulated VNet contains two valid, non-overlapping subnets.",
      "quiz": [
        {
          "question": "Can overlapping VNets be peered normally?",
          "answer": "No",
          "options": [
            "No",
            "Yes, always",
            "Only if they share a resource group",
            "Only after adding a tag"
          ],
          "explanation": "Peering requires non-overlapping address spaces."
        },
        {
          "question": "What is a subnet?",
          "answer": "A smaller address range inside a VNet",
          "options": [
            "A smaller address range inside a VNet",
            "A billing account",
            "A backup policy",
            "An Entra license"
          ],
          "explanation": "Subnets segment the VNet address space."
        },
        {
          "question": "Which is larger?",
          "answer": "A /16 address space",
          "options": [
            "A /16 address space",
            "A /24 address space",
            "They are always equal",
            "CIDR size is unrelated"
          ],
          "explanation": "A lower CIDR prefix such as /16 contains more addresses than /24."
        }
      ]
    },
    {
      "id": "lab-nsg-route",
      "topic": "networking",
      "domain": "Virtual Networking",
      "title": "Secure and Route an App Subnet",
      "duration": "12–18 min",
      "description": "Separate traffic filtering from traffic routing.",
      "mission": "Allow HTTPS to the web tier, deny unnecessary inbound traffic, and send outbound 0.0.0.0/0 through a firewall appliance at 10.20.2.4.",
      "fields": [
        {
          "id": "nsg",
          "label": "Inbound app rule",
          "options": [
            "Allow TCP 443",
            "Allow Any Any",
            "Allow UDP 53 only"
          ],
          "answer": "Allow TCP 443",
          "help": "Only HTTPS is required."
        },
        {
          "id": "priority",
          "label": "HTTPS rule priority",
          "options": [
            "100",
            "500",
            "65000"
          ],
          "answer": "100",
          "help": "A low custom priority ensures the intended rule is evaluated before broader later rules."
        },
        {
          "id": "route",
          "label": "Default route next hop",
          "options": [
            "Virtual appliance 10.20.2.4",
            "Internet",
            "None"
          ],
          "answer": "Virtual appliance 10.20.2.4",
          "help": "The mission requires outbound traffic through the firewall appliance."
        }
      ],
      "success": "The NSG controls permission while the route table controls the path through the firewall.",
      "quiz": [
        {
          "question": "In NSGs, priority 100 is evaluated before what?",
          "answer": "Priority 200",
          "options": [
            "Priority 200",
            "Priority 50",
            "Every default rule regardless",
            "DNS"
          ],
          "explanation": "Lower numeric priority is processed first."
        },
        {
          "question": "What does a UDR control?",
          "answer": "Where traffic goes",
          "options": [
            "Where traffic goes",
            "Who can reset passwords",
            "Blob retention",
            "VM backup frequency"
          ],
          "explanation": "User-defined routes influence network paths."
        },
        {
          "question": "What does an NSG control?",
          "answer": "Whether matching network traffic is allowed or denied",
          "options": [
            "Whether matching network traffic is allowed or denied",
            "Billing",
            "Subscription hierarchy",
            "Container image storage"
          ],
          "explanation": "NSGs are Layer 3/4 traffic filters."
        }
      ]
    },
    {
      "id": "lab-private-loadbalancer",
      "topic": "networking",
      "domain": "Virtual Networking",
      "title": "Private PaaS Access and Load Balancing",
      "duration": "12–18 min",
      "description": "Choose private endpoints, DNS, and load-balancer health correctly.",
      "mission": "A storage account must use a private IP in the VNet. An internal app tier should use a private load balancer, and unhealthy backends must stop receiving new traffic.",
      "fields": [
        {
          "id": "storage",
          "label": "Storage connectivity",
          "options": [
            "Private endpoint",
            "Service endpoint only",
            "Public IP on storage"
          ],
          "answer": "Private endpoint",
          "help": "The mission explicitly requires a private IP."
        },
        {
          "id": "lb",
          "label": "Load balancer",
          "options": [
            "Internal load balancer",
            "Public load balancer"
          ],
          "answer": "Internal load balancer",
          "help": "The app tier is internal/private."
        },
        {
          "id": "health",
          "label": "Backend health",
          "options": [
            "Configure a health probe",
            "Use an Entra group",
            "Use a Cost budget"
          ],
          "answer": "Configure a health probe",
          "help": "Health probes decide whether backends receive new traffic."
        }
      ],
      "success": "The PaaS service is privately addressed and the internal load balancer can remove unhealthy backends.",
      "quiz": [
        {
          "question": "What often must be updated for private endpoint name resolution?",
          "answer": "Private DNS configuration",
          "options": [
            "Private DNS configuration",
            "VM size",
            "Budget threshold",
            "SSPR"
          ],
          "explanation": "Clients need the service name to resolve to the private endpoint IP."
        },
        {
          "question": "What does Azure DNS do?",
          "answer": "Host DNS zones and records for name resolution",
          "options": [
            "Host DNS zones and records for name resolution",
            "Grant RBAC",
            "Run containers",
            "Back up VMs"
          ],
          "explanation": "DNS maps names to values such as IP addresses."
        },
        {
          "question": "What Layer does Azure Load Balancer primarily operate at?",
          "answer": "Layer 4",
          "options": [
            "Layer 4",
            "Layer 7 only",
            "Identity layer",
            "Storage layer"
          ],
          "explanation": "Azure Load Balancer distributes TCP/UDP flows at Layer 4."
        }
      ]
    },
    {
      "id": "lab-monitor",
      "topic": "monitoring",
      "domain": "Monitoring & Recovery",
      "title": "Route Logs and Build an Alert",
      "duration": "12–18 min",
      "description": "Connect logs, metrics, alert rules, and action groups.",
      "mission": "Send a VM's supported logs to Log Analytics and alert Operations when CPU is above 80%.",
      "fields": [
        {
          "id": "logs",
          "label": "Log destination",
          "options": [
            "Log Analytics workspace",
            "Azure DNS zone",
            "Management group"
          ],
          "answer": "Log Analytics workspace",
          "help": "Logs are queried in Log Analytics."
        },
        {
          "id": "signal",
          "label": "CPU signal",
          "options": [
            "Metric",
            "Blob version",
            "SAS token"
          ],
          "answer": "Metric",
          "help": "CPU percentage is numeric time-series data."
        },
        {
          "id": "response",
          "label": "Notification/automation target",
          "options": [
            "Action group",
            "Availability set",
            "Route table"
          ],
          "answer": "Action group",
          "help": "Action groups define what happens when the alert fires."
        }
      ],
      "success": "The VM's logs have a query destination and its CPU metric can trigger an action group.",
      "quiz": [
        {
          "question": "What language queries Azure Monitor Logs?",
          "answer": "KQL",
          "options": [
            "KQL",
            "Bicep",
            "HTML",
            "CIDR"
          ],
          "explanation": "Kusto Query Language is used for log queries."
        },
        {
          "question": "What defines the threshold itself?",
          "answer": "Alert rule",
          "options": [
            "Alert rule",
            "Action group",
            "Resource group",
            "Storage key"
          ],
          "explanation": "The alert rule contains the scope and condition."
        },
        {
          "question": "Can a Log Analytics workspace collect every resource log automatically just by existing?",
          "answer": "No",
          "options": [
            "No",
            "Yes",
            "Only if the VM has a public IP",
            "Only on weekends"
          ],
          "explanation": "Supported diagnostic/data collection settings must send data."
        }
      ]
    },
    {
      "id": "lab-networkwatcher",
      "topic": "monitoring",
      "domain": "Monitoring & Recovery",
      "title": "Troubleshoot with Network Watcher",
      "duration": "10–15 min",
      "description": "Practice choosing the right network diagnostic tool.",
      "mission": "VM-App cannot reach VM-DB on TCP 1433. You need to test NSG flow, identify the next hop, and then monitor the path over time.",
      "fields": [
        {
          "id": "flow",
          "label": "Check allow/deny",
          "options": [
            "IP flow verify",
            "Cost Analysis",
            "SSPR"
          ],
          "answer": "IP flow verify",
          "help": "IP flow verify evaluates NSG behavior for a flow."
        },
        {
          "id": "hop",
          "label": "Check routing next hop",
          "options": [
            "Next hop",
            "Blob lifecycle",
            "Backup policy"
          ],
          "answer": "Next hop",
          "help": "The Network Watcher next-hop tool identifies route behavior."
        },
        {
          "id": "continuous",
          "label": "Ongoing path monitoring",
          "options": [
            "Connection Monitor",
            "One-time screenshot",
            "Resource lock"
          ],
          "answer": "Connection Monitor",
          "help": "Connection Monitor observes connectivity over time."
        }
      ],
      "success": "You used the correct Network Watcher tools for security, routing, and continuous connectivity.",
      "quiz": [
        {
          "question": "Effective security rules help you understand what?",
          "answer": "Combined NSG behavior applied to a NIC",
          "options": [
            "Combined NSG behavior applied to a NIC",
            "Backup retention",
            "App Service TLS",
            "Entra licensing"
          ],
          "explanation": "Effective rules show the security rules actually affecting the interface."
        },
        {
          "question": "A correct DNS result proves what?",
          "answer": "Name resolution worked, not that the port is reachable",
          "options": [
            "Name resolution worked, not that the port is reachable",
            "The NSG allows every port",
            "The route is correct",
            "The VM is healthy"
          ],
          "explanation": "DNS is only one connectivity layer."
        },
        {
          "question": "Which tool is for continuous connectivity observation?",
          "answer": "Connection Monitor",
          "options": [
            "Connection Monitor",
            "AzCopy",
            "Azure Policy",
            "Cost budget"
          ],
          "explanation": "Connection Monitor watches connectivity paths over time."
        }
      ]
    },
    {
      "id": "lab-backup-asr",
      "topic": "monitoring",
      "domain": "Monitoring & Recovery",
      "title": "Protect a VM with Backup and Site Recovery",
      "duration": "15–20 min",
      "description": "Differentiate backup protection from disaster-recovery replication.",
      "mission": "VM1 needs daily backups retained 30 days and regional disaster recovery to a secondary region.",
      "fields": [
        {
          "id": "backup",
          "label": "Daily protection",
          "options": [
            "Backup policy in an appropriate vault",
            "NSG rule",
            "DNS record"
          ],
          "answer": "Backup policy in an appropriate vault",
          "help": "Backup policies define schedule and retention."
        },
        {
          "id": "retention",
          "label": "Retention",
          "options": [
            "30 days",
            "1 day",
            "No retention"
          ],
          "answer": "30 days",
          "help": "Match the mission."
        },
        {
          "id": "dr",
          "label": "Regional disaster recovery",
          "options": [
            "Azure Site Recovery",
            "Blob soft delete only",
            "SSPR"
          ],
          "answer": "Azure Site Recovery",
          "help": "ASR replicates supported workloads and orchestrates failover."
        }
      ],
      "success": "The VM has a recovery-point strategy and a separate regional disaster-recovery plan.",
      "quiz": [
        {
          "question": "Backup and Site Recovery are what?",
          "answer": "Complementary but different protection tools",
          "options": [
            "Complementary but different protection tools",
            "The same feature",
            "Both DNS services",
            "Both RBAC roles"
          ],
          "explanation": "Backup protects recoverable copies; ASR focuses on workload replication/failover."
        },
        {
          "question": "What is a test failover for?",
          "answer": "Validate Site Recovery without treating it as the real disaster",
          "options": [
            "Validate Site Recovery without treating it as the real disaster",
            "Delete all backups",
            "Change NSG priority",
            "Rotate account keys"
          ],
          "explanation": "Test failover exercises recovery in a controlled manner."
        },
        {
          "question": "What must happen before a restore can be useful?",
          "answer": "The workload must have valid backup protection/recovery points",
          "options": [
            "The workload must have valid backup protection/recovery points",
            "A public IP must exist",
            "A management group must be deleted",
            "SSPR must be disabled"
          ],
          "explanation": "Restore depends on successful protection and available recovery points."
        }
      ]
    }
  ]
};
  const TOPIC_NAMES = APP.topicNames;
  const EXAM_TOPICS = APP.examTopics;
  const EXAM_WEIGHTS = APP.examWeights;
  const STUDY_TOPICS = APP.studyTopics;
  const QUESTION_BANK = APP.questionBank;
  const LABS = APP.labs;

  const STORAGE_KEY = "cloudAdminPrepV2";
  const LEGACY_KEY = "cloudAdminPrepV1";

  const emptyTopicStats = () =>
    Object.fromEntries(
      ["foundations", ...EXAM_TOPICS].map((topic) => [
        topic,
        { answered: 0, correct: 0 },
      ]),
    );

  const emptyLessonStats = () =>
    Object.fromEntries(
      STUDY_TOPICS.map((lesson) => [
        lesson.id,
        { answered: 0, correct: 0 },
      ]),
    );

  const DEFAULT_PROGRESS = {
    questionsAnswered: 0,
    correctAnswers: 0,
    completedLessons: [],
    completedLabs: [],
    lastStudyLesson: "foundation-hierarchy",
    topicStats: emptyTopicStats(),
    lessonStats: emptyLessonStats(),
    labScores: {},
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function loadProgress() {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) {
        const parsed = JSON.parse(current);
        return {
          ...clone(DEFAULT_PROGRESS),
          ...parsed,
          topicStats: {
            ...emptyTopicStats(),
            ...(parsed.topicStats || {}),
          },
          lessonStats: {
            ...emptyLessonStats(),
            ...(parsed.lessonStats || {}),
          },
          labScores: { ...(parsed.labScores || {}) },
          completedLessons: Array.isArray(parsed.completedLessons)
            ? parsed.completedLessons
            : [],
          completedLabs: Array.isArray(parsed.completedLabs)
            ? parsed.completedLabs
            : [],
        };
      }

      // Carry forward practice history from v1 without falsely marking the
      // new detailed v2 lessons complete.
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const old = JSON.parse(legacy);
        return {
          ...clone(DEFAULT_PROGRESS),
          questionsAnswered: old.questionsAnswered || 0,
          correctAnswers: old.correctAnswers || 0,
          topicStats: {
            ...emptyTopicStats(),
            ...(old.topicStats || {}),
          },
          completedLabs: Array.isArray(old.completedLabs)
            ? old.completedLabs.filter((id) => LABS.some((lab) => lab.id === id))
            : [],
        };
      }
    } catch (error) {
      console.warn("CloudAdmin Prep could not load progress.", error);
    }
    return clone(DEFAULT_PROGRESS);
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn("CloudAdmin Prep could not save progress.", error);
    }
  }

  let progress = loadProgress();

  const get = (id) => document.getElementById(id);
  const elements = {
    screens: Array.from(document.querySelectorAll(".screen")),
    navButtons: Array.from(document.querySelectorAll(".nav-button")),
    pathCards: Array.from(document.querySelectorAll(".path-card")),
    brandButton: get("brand-button"),
    continueLearningButton: get("continue-learning-button"),
    quickPracticeButton: get("quick-practice-button"),
    readinessRing: get("readiness-ring"),
    readinessPercent: get("readiness-percent"),
    progressStatus: get("progress-status"),
    recommendedTopic: get("recommended-topic"),
    recommendedNote: get("recommended-note"),
    questionsAnswered: get("questions-answered"),
    overallAccuracy: get("overall-accuracy"),
    topicsCompleted: get("topics-completed"),
    identityProgress: get("identity-progress"),
    storageProgress: get("storage-progress"),
    computeProgress: get("compute-progress"),
    networkingProgress: get("networking-progress"),
    monitoringProgress: get("monitoring-progress"),
    studyTopicList: get("study-topic-list"),
    lessonDomain: get("lesson-domain"),
    lessonProgressLabel: get("lesson-progress-label"),
    lessonTitle: get("lesson-title"),
    lessonSummary: get("lesson-summary"),
    lessonPoints: get("lesson-points"),
    lessonExampleText: get("lesson-example-text"),
    lessonRemember: get("lesson-remember"),
    previousLessonButton: get("previous-lesson-button"),
    lessonCheckButton: get("lesson-check-button"),
    practiceTopicOptions: get("practice-topic-options"),
    practiceModeOptions: get("practice-mode-options"),
    questionCountOptions: get("question-count-options"),
    practiceSummary: get("practice-summary"),
    startPracticeButton: get("start-practice-button"),
    quizTopic: get("quiz-topic"),
    quizMode: get("quiz-mode"),
    quitQuizButton: get("quit-quiz-button"),
    questionCount: get("question-count"),
    liveCorrect: get("live-correct"),
    liveAccuracy: get("live-accuracy"),
    timerCard: get("timer-card"),
    timer: get("timer"),
    quizProgressLabel: get("quiz-progress-label"),
    quizProgressBar: get("quiz-progress-bar"),
    questionNumber: get("question-number"),
    questionOverline: get("question-overline"),
    questionText: get("question-text"),
    answerOptions: get("answer-options"),
    answerFeedback: get("answer-feedback"),
    feedbackIcon: get("feedback-icon"),
    feedbackTitle: get("feedback-title"),
    feedbackText: get("feedback-text"),
    nextQuestionButton: get("next-question-button"),
    resultsTitle: get("results-title"),
    resultsMessage: get("results-message"),
    resultsAccuracy: get("results-accuracy"),
    resultsCorrect: get("results-correct"),
    resultsTopic: get("results-topic"),
    resultsMode: get("results-mode"),
    resultsReviewCount: get("results-review-count"),
    missedReviewCard: get("missed-review-card"),
    missedReviewToggle: get("missed-review-toggle"),
    missedReviewLabel: get("missed-review-label"),
    missedReviewList: get("missed-review-list"),
    reviewToggleIcon: get("review-toggle-icon"),
    practiceAgainButton: get("practice-again-button"),
    studyWeakButton: get("study-weak-button"),
    resultsHomeButton: get("results-home-button"),
    labList: get("lab-list"),
    weakestTopic: get("weakest-topic"),
    weakestTopicNote: get("weakest-topic-note"),
    practiceWeakAreaButton: get("practice-weak-area-button"),
    weakAreaList: get("weak-area-list"),
    toast: get("toast"),
  };

  const state = {
    currentStudyLesson:
      STUDY_TOPICS.some((lesson) => lesson.id === progress.lastStudyLesson)
        ? progress.lastStudyLesson
        : STUDY_TOPICS[0].id,
    practiceSettings: { topic: "mixed", mode: "practice", count: 10 },
    sessionSettings: { topic: "mixed", mode: "practice", count: 10 },
    questions: [],
    currentIndex: 0,
    correct: 0,
    answered: false,
    answers: [],
    timerId: null,
    timeLeft: 0,
    fromLesson: false,
    lessonCheckId: null,
    currentLab: null,
    labAttempts: 0,
    labConfigPassed: false,
    lastAccuracy: 0,
  };

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function calculateAccuracy(correct, answered) {
    return answered ? Math.round((correct / answered) * 100) : 0;
  }

  function getTopicQuestions(topic) {
    if (topic === "mixed") {
      return QUESTION_BANK.filter((question) => question.topic !== "foundations");
    }
    return QUESTION_BANK.filter((question) => question.topic === topic);
  }

  function getTopicAccuracy(topic) {
    const stats = progress.topicStats[topic];
    return stats?.answered ? calculateAccuracy(stats.correct, stats.answered) : 0;
  }

  function getDomainLessonProgress(topic) {
    const domainLessons = STUDY_TOPICS.filter((lesson) => lesson.topic === topic);
    if (!domainLessons.length) return 0;
    const done = domainLessons.filter((lesson) =>
      progress.completedLessons.includes(lesson.id),
    ).length;
    return Math.round((done / domainLessons.length) * 100);
  }

  function getDomainMastery(topic) {
    const lessonPart = getDomainLessonProgress(topic);
    const stats = progress.topicStats[topic];
    if (!stats?.answered) return Math.round(lessonPart * 0.55);
    return Math.round(lessonPart * 0.45 + getTopicAccuracy(topic) * 0.55);
  }

  function getReadinessScore() {
    const lessonPart =
      (progress.completedLessons.length / STUDY_TOPICS.length) * 30;
    const labPart = (progress.completedLabs.length / LABS.length) * 25;
    const volumePart = (Math.min(progress.questionsAnswered, 120) / 120) * 20;
    const accuracy = calculateAccuracy(
      progress.correctAnswers,
      progress.questionsAnswered,
    );
    const accuracyPart = progress.questionsAnswered >= 10 ? (accuracy / 100) * 25 : 0;
    return Math.min(100, Math.round(lessonPart + labPart + volumePart + accuracyPart));
  }

  function getWeakestTopic() {
    const attempted = EXAM_TOPICS.map((topic) => ({
      topic,
      ...progress.topicStats[topic],
      accuracy: getTopicAccuracy(topic),
    })).filter((item) => item.answered > 0);

    if (!attempted.length) return null;
    attempted.sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered);
    return attempted[0];
  }

  function getWeakestLesson(topic = null) {
    const pool = STUDY_TOPICS.filter(
      (lesson) => lesson.topic !== "foundations" && (!topic || lesson.topic === topic),
    )
      .map((lesson) => {
        const stats = progress.lessonStats[lesson.id] || { answered: 0, correct: 0 };
        return {
          lesson,
          answered: stats.answered,
          accuracy: calculateAccuracy(stats.correct, stats.answered),
        };
      })
      .filter((item) => item.answered > 0);

    if (!pool.length) return null;
    pool.sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered);
    return pool[0];
  }

  function getRecommendedLesson() {
    const incomplete = STUDY_TOPICS.find(
      (lesson) => !progress.completedLessons.includes(lesson.id),
    );
    if (incomplete) return incomplete;
    const weak = getWeakestLesson();
    return weak?.lesson || STUDY_TOPICS.find((lesson) => lesson.topic === "identity");
  }

  let toastTimer = null;
  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
  }

  function showScreen(screenId, navScreenId = screenId) {
    clearInterval(state.timerId);
    elements.screens.forEach((screen) => screen.classList.add("hide"));
    const target = get(screenId);
    if (!target) return;
    target.classList.remove("hide");
    elements.navButtons.forEach((button) =>
      button.classList.toggle("active", button.dataset.screen === navScreenId),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateHomeProgress() {
    const accuracy = calculateAccuracy(
      progress.correctAnswers,
      progress.questionsAnswered,
    );
    const readiness = getReadinessScore();
    elements.readinessRing.style.setProperty("--progress", readiness);
    elements.readinessPercent.textContent = `${readiness}%`;

    if (readiness < 25) elements.progressStatus.textContent = "Building foundation";
    else if (readiness < 50) elements.progressStatus.textContent = "Learning the job";
    else if (readiness < 75) elements.progressStatus.textContent = "Building exam skill";
    else if (readiness < 90) elements.progressStatus.textContent = "Near exam-ready";
    else elements.progressStatus.textContent = "Strong study readiness";

    elements.questionsAnswered.textContent = progress.questionsAnswered;
    elements.overallAccuracy.textContent = `${accuracy}%`;
    elements.topicsCompleted.textContent =
      `${progress.completedLessons.length} / ${STUDY_TOPICS.length}`;

    const recommended = getRecommendedLesson();
    elements.recommendedTopic.textContent = recommended.title;
    elements.recommendedNote.textContent =
      progress.completedLessons.length === STUDY_TOPICS.length
        ? "All lessons are complete. Keep drilling weak subtopics and simulator labs. Readiness is a study-progress indicator, not a guaranteed exam score."
        : recommended.summary;

    elements.identityProgress.style.width = `${getDomainMastery("identity")}%`;
    elements.storageProgress.style.width = `${getDomainMastery("storage")}%`;
    elements.computeProgress.style.width = `${getDomainMastery("compute")}%`;
    elements.networkingProgress.style.width = `${getDomainMastery("networking")}%`;
    elements.monitoringProgress.style.width = `${getDomainMastery("monitoring")}%`;
  }

  function renderStudyTopicList() {
    elements.studyTopicList.innerHTML = "";
    let lastTopic = null;

    STUDY_TOPICS.forEach((lesson, index) => {
      if (lesson.topic !== lastTopic) {
        const group = document.createElement("div");
        group.className = "topic-group-label";
        group.textContent = TOPIC_NAMES[lesson.topic];
        elements.studyTopicList.appendChild(group);
        lastTopic = lesson.topic;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "topic-button";
      button.dataset.lesson = lesson.id;
      button.innerHTML = `
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${lesson.title}</strong>
      `;
      button.classList.toggle("active", lesson.id === state.currentStudyLesson);
      button.classList.toggle(
        "complete",
        progress.completedLessons.includes(lesson.id),
      );
      button.addEventListener("click", () => selectStudyLesson(lesson.id));
      elements.studyTopicList.appendChild(button);
    });
  }

  function selectStudyLesson(lessonId) {
    if (!STUDY_TOPICS.some((lesson) => lesson.id === lessonId)) return;
    state.currentStudyLesson = lessonId;
    progress.lastStudyLesson = lessonId;
    saveProgress();
    renderStudyTopicList();
    renderLesson();
  }

  function renderLesson() {
    const index = STUDY_TOPICS.findIndex(
      (lesson) => lesson.id === state.currentStudyLesson,
    );
    const lesson = STUDY_TOPICS[index];
    if (!lesson) return;

    elements.lessonDomain.textContent = lesson.domain;
    elements.lessonProgressLabel.textContent =
      `Lesson ${index + 1} of ${STUDY_TOPICS.length}`;
    elements.lessonTitle.textContent = lesson.title;
    elements.lessonSummary.textContent = lesson.summary;

    elements.lessonPoints.innerHTML = `
      <div class="lesson-teach-card plain-card">
        <span class="teach-label">Plain-English version</span>
        <p>${lesson.plain}</p>
      </div>
      <div class="lesson-teach-card analogy-card">
        <span class="teach-label">Mental model</span>
        <p>${lesson.analogy}</p>
      </div>
      <div class="lesson-key-list">
        ${lesson.points
          .map(
            (point) => `
              <div class="lesson-point">
                <span>✓</span>
                <p>${point}</p>
              </div>`,
          )
          .join("")}
      </div>
      <div class="exam-trap-card">
        <span class="teach-label">Common exam traps</span>
        <ul>${lesson.traps.map((trap) => `<li>${trap}</li>`).join("")}</ul>
      </div>
      ${
        lesson.portalPath
          ? `<div class="portal-path"><strong>Where you would find it in Azure:</strong> ${lesson.portalPath}</div>`
          : ""
      }
    `;

    elements.lessonExampleText.textContent = lesson.scenario;
    elements.lessonRemember.textContent = lesson.remember;
    elements.previousLessonButton.disabled = index === 0;
    elements.previousLessonButton.style.opacity = index === 0 ? "0.4" : "1";
    elements.lessonCheckButton.textContent = progress.completedLessons.includes(
      lesson.id,
    )
      ? "Practice This Lesson Again →"
      : "Check What I Learned →";
  }

  function openStudy(lessonId) {
    selectStudyLesson(lessonId);
    showScreen("study-screen");
  }

  function syncPracticeButtons() {
    elements.practiceTopicOptions
      .querySelectorAll(".selection-card")
      .forEach((button) =>
        button.classList.toggle(
          "selected",
          button.dataset.topic === state.practiceSettings.topic,
        ),
      );

    elements.practiceModeOptions
      .querySelectorAll(".mode-option")
      .forEach((button) =>
        button.classList.toggle(
          "selected",
          button.dataset.mode === state.practiceSettings.mode,
        ),
      );

    updateCountAvailability();

    elements.questionCountOptions
      .querySelectorAll("button")
      .forEach((button) =>
        button.classList.toggle(
          "selected",
          Number(button.dataset.count) === state.practiceSettings.count,
        ),
      );

    updatePracticeSummary();
  }

  function updateCountAvailability() {
    const available = getTopicQuestions(state.practiceSettings.topic).length;
    const buttons = Array.from(
      elements.questionCountOptions.querySelectorAll("button"),
    );

    buttons.forEach((button) => {
      const count = Number(button.dataset.count);
      const disabled = count > available;
      button.disabled = disabled;
      button.style.opacity = disabled ? "0.35" : "1";
      button.style.cursor = disabled ? "not-allowed" : "pointer";
      if (count === 50 && state.practiceSettings.topic !== "mixed") {
        button.title = "50-question simulation is available for Mixed AZ-104.";
      } else {
        button.title = "";
      }
    });

    if (state.practiceSettings.count > available) {
      const valid = buttons
        .map((button) => Number(button.dataset.count))
        .filter((count) => count <= available);
      state.practiceSettings.count = Math.max(...valid);
    }
  }

  function updatePracticeSummary() {
    const mode =
      state.practiceSettings.mode === "exam" ? "Exam Simulation" : "Practice";
    elements.practiceSummary.textContent =
      `${state.practiceSettings.count} ${TOPIC_NAMES[state.practiceSettings.topic]} · ${mode}`;
  }

  function buildWeightedMixedExam(count) {
    const selected = [];
    let used = 0;
    const allocations = {};

    EXAM_TOPICS.forEach((topic) => {
      allocations[topic] = Math.floor(count * EXAM_WEIGHTS[topic]);
      used += allocations[topic];
    });

    let remaining = count - used;
    const byWeight = [...EXAM_TOPICS].sort(
      (a, b) => EXAM_WEIGHTS[b] - EXAM_WEIGHTS[a],
    );
    let cursor = 0;
    while (remaining > 0) {
      allocations[byWeight[cursor % byWeight.length]] += 1;
      remaining -= 1;
      cursor += 1;
    }

    EXAM_TOPICS.forEach((topic) => {
      selected.push(
        ...shuffle(getTopicQuestions(topic)).slice(0, allocations[topic]),
      );
    });

    if (selected.length < count) {
      const ids = new Set(selected.map((item) => item.id));
      const extras = shuffle(getTopicQuestions("mixed")).filter(
        (item) => !ids.has(item.id),
      );
      selected.push(...extras.slice(0, count - selected.length));
    }

    return shuffle(selected).slice(0, count);
  }

  function prepareQuestions(lessonId = null) {
    let pool;

    if (lessonId) {
      const lesson = STUDY_TOPICS.find((item) => item.id === lessonId);
      const direct = shuffle(
        QUESTION_BANK.filter((item) => item.lessonId === lessonId),
      );
      const fill = shuffle(
        QUESTION_BANK.filter(
          (item) => item.topic === lesson.topic && item.lessonId !== lessonId,
        ),
      );
      pool = [...direct, ...fill].slice(0, 5);
    } else if (
      state.practiceSettings.mode === "exam" &&
      state.practiceSettings.topic === "mixed"
    ) {
      pool = buildWeightedMixedExam(state.practiceSettings.count);
    } else {
      pool = shuffle(getTopicQuestions(state.practiceSettings.topic)).slice(
        0,
        state.practiceSettings.count,
      );
    }

    return pool.map((question) => ({
      ...question,
      options: shuffle(question.options),
    }));
  }

  function startPractice(fromLesson = false, lessonId = null) {
    clearInterval(state.timerId);

    const lesson = lessonId
      ? STUDY_TOPICS.find((item) => item.id === lessonId)
      : null;

    state.sessionSettings = lesson
      ? { topic: lesson.topic, mode: "practice", count: 5 }
      : { ...state.practiceSettings };

    state.questions = prepareQuestions(lessonId);
    if (!state.questions.length) {
      showToast("No questions are available for that selection.");
      return;
    }

    state.currentIndex = 0;
    state.correct = 0;
    state.answered = false;
    state.answers = [];
    state.fromLesson = fromLesson;
    state.lessonCheckId = lessonId;

    showScreen("quiz-screen", fromLesson ? "study-screen" : "practice-screen");
    displayQuestion();
  }

  function startQuestionTimer() {
    clearInterval(state.timerId);
    state.timeLeft = 75;
    elements.timer.textContent = state.timeLeft;
    state.timerId = setInterval(() => {
      state.timeLeft -= 1;
      elements.timer.textContent = state.timeLeft;
      if (state.timeLeft <= 0) {
        clearInterval(state.timerId);
        handleTimeout();
      }
    }, 1000);
  }

  function displayQuestion() {
    clearInterval(state.timerId);
    state.answered = false;
    elements.nextQuestionButton.disabled = true;
    elements.answerFeedback.className = "feedback-panel hide";

    const question = state.questions[state.currentIndex];
    const position = state.currentIndex + 1;
    const total = state.questions.length;
    const progressPercent = Math.round((position / total) * 100);

    elements.quizTopic.textContent = TOPIC_NAMES[question.topic];
    elements.quizMode.textContent =
      state.sessionSettings.mode === "exam"
        ? "Exam Simulation"
        : state.fromLesson
          ? "Lesson Check"
          : "Practice";

    elements.questionCount.textContent = `${position} / ${total}`;
    elements.liveCorrect.textContent = state.correct;
    elements.liveAccuracy.textContent =
      `${calculateAccuracy(state.correct, state.currentIndex)}%`;
    elements.quizProgressLabel.textContent = `${progressPercent}%`;
    elements.quizProgressBar.style.width = `${progressPercent}%`;
    elements.questionNumber.textContent = String(position).padStart(2, "0");
    elements.questionOverline.textContent =
      `${TOPIC_NAMES[question.topic].toUpperCase()} · ${question.difficulty.toUpperCase()}`;
    elements.questionText.textContent = question.question;
    elements.answerOptions.innerHTML = "";

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.dataset.answer = option;
      button.innerHTML = `
        <span>${index + 1}</span>
        <strong>${option}</strong>
      `;
      elements.answerOptions.appendChild(button);
    });

    const examMode = state.sessionSettings.mode === "exam";
    elements.timerCard.classList.toggle("hide", !examMode);
    if (examMode) startQuestionTimer();
  }

  function answerQuestion(selectedAnswer, selectedButton) {
    if (state.answered) return;
    clearInterval(state.timerId);
    state.answered = true;

    const question = state.questions[state.currentIndex];
    const correct = selectedAnswer === question.answer;
    if (correct) state.correct += 1;

    state.answers.push({
      ...question,
      selected: selectedAnswer,
      correct,
      timedOut: false,
    });

    const buttons = elements.answerOptions.querySelectorAll(".answer-button");
    buttons.forEach((button) => {
      button.disabled = true;
      if (state.sessionSettings.mode === "practice") {
        if (button.dataset.answer === question.answer) button.classList.add("correct");
        else if (button === selectedButton && !correct) button.classList.add("wrong");
        else button.classList.add("dimmed");
      }
    });

    if (state.sessionSettings.mode === "exam") {
      selectedButton.classList.add("exam-selected");
    } else {
      showPracticeFeedback(question, selectedAnswer, correct);
    }

    elements.liveCorrect.textContent = state.correct;
    elements.liveAccuracy.textContent =
      `${calculateAccuracy(state.correct, state.currentIndex + 1)}%`;
    elements.nextQuestionButton.disabled = false;
  }

  function showPracticeFeedback(question, selectedAnswer, correct) {
    elements.answerFeedback.className = correct
      ? "feedback-panel"
      : "feedback-panel wrong";
    elements.feedbackIcon.textContent = correct ? "✓" : "!";
    elements.feedbackTitle.textContent = correct
      ? "Correct — now lock in why."
      : "Not this one — use the clue.";

    elements.feedbackText.textContent = correct
      ? `${question.explanation} Exam clue: ${question.clue}`
      : `${selectedAnswer} does not satisfy the requirement. ${question.clue} Correct answer: ${question.answer}. ${question.explanation}`;
  }

  function handleTimeout() {
    if (state.answered) return;
    state.answered = true;
    const question = state.questions[state.currentIndex];
    elements.answerOptions
      .querySelectorAll(".answer-button")
      .forEach((button) => (button.disabled = true));

    state.answers.push({
      ...question,
      selected: "Time expired",
      correct: false,
      timedOut: true,
    });

    elements.nextQuestionButton.disabled = false;
    showToast("Time expired. Move to the next question.");
  }

  function nextQuestion() {
    if (!state.answered) return;
    state.currentIndex += 1;
    if (state.currentIndex < state.questions.length) displayQuestion();
    else finishSession();
  }

  function saveSessionProgress() {
    progress.questionsAnswered += state.answers.length;
    progress.correctAnswers += state.answers.filter((answer) => answer.correct).length;

    state.answers.forEach((answer) => {
      const topicData = progress.topicStats[answer.topic];
      topicData.answered += 1;
      if (answer.correct) topicData.correct += 1;

      if (answer.lessonId && progress.lessonStats[answer.lessonId]) {
        progress.lessonStats[answer.lessonId].answered += 1;
        if (answer.correct) progress.lessonStats[answer.lessonId].correct += 1;
      }
    });

    saveProgress();
  }

  function finishSession() {
    clearInterval(state.timerId);
    const accuracy = calculateAccuracy(state.correct, state.questions.length);
    state.lastAccuracy = accuracy;
    saveSessionProgress();

    if (state.fromLesson && state.lessonCheckId && accuracy >= 80) {
      if (!progress.completedLessons.includes(state.lessonCheckId)) {
        progress.completedLessons.push(state.lessonCheckId);
        saveProgress();
        showToast("Lesson mastered and marked complete.");
      }
    }

    updateHomeProgress();
    renderStudyTopicList();
    renderWeakAreas();
    displayResults(accuracy);
    showScreen("results-screen", state.fromLesson ? "study-screen" : "practice-screen");
  }

  function displayResults(accuracy) {
    const missed = state.answers.filter((answer) => !answer.correct);

    if (accuracy >= 90) {
      elements.resultsTitle.textContent = "Strong mastery.";
      elements.resultsMessage.textContent =
        "You are recognizing both the concept and the exam clue. Review any miss before moving on.";
    } else if (accuracy >= 80) {
      elements.resultsTitle.textContent = "Passed the mastery check.";
      elements.resultsMessage.textContent =
        "The idea is there. Review the misses until you can explain why every distractor is wrong.";
    } else if (accuracy >= 70) {
      elements.resultsTitle.textContent = "Close, but do another pass.";
      elements.resultsMessage.textContent =
        "You are near the target. Revisit the explanation and retry before calling this area mastered.";
    } else {
      elements.resultsTitle.textContent = "This needs another lesson pass.";
      elements.resultsMessage.textContent =
        "That is useful data. Relearn the weak subtopic, then retry with the exam clue in mind.";
    }

    if (state.fromLesson) {
      elements.resultsMessage.textContent +=
        accuracy >= 80
          ? " This lesson is now marked complete."
          : " Lesson checks require 80% to mark the lesson complete.";
    }

    elements.resultsAccuracy.textContent = `${accuracy}%`;
    elements.resultsCorrect.textContent =
      `${state.correct} of ${state.questions.length} correct`;
    elements.resultsTopic.textContent = TOPIC_NAMES[state.sessionSettings.topic];
    elements.resultsMode.textContent =
      state.sessionSettings.mode === "exam"
        ? "Exam Simulation"
        : state.fromLesson
          ? "Lesson Check"
          : "Practice";

    if (state.fromLesson) {
      elements.studyWeakButton.textContent =
        accuracy >= 80 ? "Next Lesson" : "Review This Lesson";
    } else {
      elements.studyWeakButton.textContent = "Study Weak Areas";
    }

    elements.resultsReviewCount.textContent = missed.length;
    renderMissedReview(missed);
  }

  function renderMissedReview(missed) {
    elements.missedReviewList.innerHTML = "";
    elements.missedReviewList.classList.add("hide");
    elements.missedReviewToggle.setAttribute("aria-expanded", "false");
    elements.reviewToggleIcon.textContent = "+";
    elements.missedReviewLabel.textContent =
      `${missed.length} ${missed.length === 1 ? "question" : "questions"} to review`;
    elements.missedReviewCard.classList.toggle("hide", missed.length === 0);

    missed.forEach((item, index) => {
      const lesson = STUDY_TOPICS.find((entry) => entry.id === item.lessonId);
      const card = document.createElement("div");
      card.className = "review-item";
      card.innerHTML = `
        <span>Review ${index + 1} · ${lesson?.title || TOPIC_NAMES[item.topic]}</span>
        <strong>${item.question}</strong>
        <p>Your answer: ${item.selected}</p>
        <p><b>Exam clue:</b> ${item.clue}</p>
        <p class="review-correct">Correct answer: ${item.answer}</p>
        <p>${item.explanation}</p>
      `;
      elements.missedReviewList.appendChild(card);
    });
  }

  function toggleMissedReview() {
    const open =
      elements.missedReviewToggle.getAttribute("aria-expanded") === "true";
    elements.missedReviewToggle.setAttribute("aria-expanded", String(!open));
    elements.missedReviewList.classList.toggle("hide", open);
    elements.reviewToggleIcon.textContent = open ? "+" : "−";
  }

  function renderLabs() {
    state.currentLab = null;
    elements.labList.className = "lab-list-shell";

    const completed = progress.completedLabs.length;
    elements.labList.innerHTML = `
      <section class="lab-dashboard">
        <div>
          <span class="section-kicker">Local simulator</span>
          <h2>${completed} of ${LABS.length} labs mastered</h2>
          <p>Every simulator checks your configuration first, then quizzes the decisions you made. Nothing here creates Azure resources or charges.</p>
        </div>
        <div class="lab-dashboard-score">
          <strong>${Math.round((completed / LABS.length) * 100)}%</strong>
          <span>LAB MASTERY</span>
        </div>
      </section>
      <div class="lab-grid">
        ${LABS.map((lab) => {
          const done = progress.completedLabs.includes(lab.id);
          return `
            <article class="lab-card ${done ? "mastered" : ""}">
              <div class="lab-card-top">
                <span>${lab.domain}</span>
                <strong>${done ? "Mastered ✓" : lab.duration}</strong>
              </div>
              <h3>${lab.title}</h3>
              <p>${lab.description}</p>
              <div class="lab-card-footer">
                <span>${lab.fields.length} configuration decisions · ${lab.quiz.length} quiz questions</span>
                <button class="secondary-button" data-lab-action="launch" data-lab="${lab.id}" type="button">
                  ${done ? "Practice Again" : "Launch Simulator"} →
                </button>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function launchLab(labId) {
    const lab = LABS.find((item) => item.id === labId);
    if (!lab) return;
    state.currentLab = labId;
    state.labAttempts = 0;
    state.labConfigPassed = false;
    renderLabSimulator();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderLabSimulator() {
    const lab = LABS.find((item) => item.id === state.currentLab);
    if (!lab) return;

    elements.labList.className = "lab-simulator-shell";
    elements.labList.innerHTML = `
      <div class="simulator-toolbar">
        <button class="text-button" data-lab-action="back" type="button">← All labs</button>
        <div>
          <span>${lab.domain}</span>
          <strong>${lab.title}</strong>
        </div>
        <span class="simulator-local-badge">LOCAL SIMULATION</span>
      </div>

      <section class="mission-card">
        <span class="section-kicker">Your admin mission</span>
        <h2>${lab.title}</h2>
        <p>${lab.mission}</p>
      </section>

      <section class="fake-portal">
        <div class="fake-portal-topbar">
          <div class="fake-azure-mark">A</div>
          <strong>Microsoft Azure</strong>
          <span>CloudAdmin Training Tenant</span>
          <b>Simulator</b>
        </div>

        <div class="fake-portal-body">
          <aside class="fake-portal-nav">
            <strong>Configuration</strong>
            <span class="active">Basics</span>
            <span>Networking</span>
            <span>Security</span>
            <span>Review + create</span>
          </aside>

          <div class="fake-portal-content">
            <div class="fake-breadcrumb">Home › ${lab.domain} › ${lab.title}</div>
            <h3>Configure the resource</h3>
            <p class="portal-instruction">Use only the mission requirements. AZ-104 often gives extra-looking choices to test whether you can identify the minimum correct configuration.</p>

            <div class="sim-form">
              ${lab.fields.map((field, index) => `
                <label class="sim-field" data-sim-field="${field.id}">
                  <span><b>${index + 1}.</b> ${field.label}</span>
                  <select data-lab-field="${field.id}">
                    <option value="">Choose a setting...</option>
                    ${field.options.map((option) => `<option value="${option}">${option}</option>`).join("")}
                  </select>
                  <small class="field-help">${field.help}</small>
                  <div class="field-feedback"></div>
                </label>
              `).join("")}
            </div>

            <div id="lab-config-result" class="lab-config-result hide"></div>

            <div class="sim-actions">
              <button class="primary-button" data-lab-action="validate" type="button">Review + Create</button>
              <button class="ghost-button" data-lab-action="reset" type="button">Reset</button>
            </div>
          </div>
        </div>
      </section>

      <div id="lab-quiz-area"></div>
    `;
  }

  function validateLabConfiguration() {
    const lab = LABS.find((item) => item.id === state.currentLab);
    if (!lab) return;
    state.labAttempts += 1;

    let correctCount = 0;
    lab.fields.forEach((field) => {
      const select = elements.labList.querySelector(
        `[data-lab-field="${field.id}"]`,
      );
      const wrapper = elements.labList.querySelector(
        `[data-sim-field="${field.id}"]`,
      );
      const feedback = wrapper.querySelector(".field-feedback");
      const correct = select.value === field.answer;

      wrapper.classList.remove("field-correct", "field-wrong");
      wrapper.classList.add(correct ? "field-correct" : "field-wrong");

      if (correct) {
        correctCount += 1;
        feedback.textContent = "Correct choice.";
      } else {
        feedback.textContent =
          state.labAttempts >= 2
            ? `${field.help} Recommended choice: ${field.answer}.`
            : field.help;
      }
    });

    const result = get("lab-config-result");
    result.classList.remove("hide", "wrong");

    if (correctCount === lab.fields.length) {
      state.labConfigPassed = true;
      result.innerHTML = `
        <strong>Configuration validated ✓</strong>
        <p>${lab.success}</p>
        <span>Now prove you understand why these settings are correct.</span>
      `;
      renderLabQuiz();
      setTimeout(() => get("lab-quiz-area")?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      result.classList.add("wrong");
      result.innerHTML = `
        <strong>${correctCount} of ${lab.fields.length} configuration decisions are correct.</strong>
        <p>Use the coaching under the highlighted fields and try Review + Create again.</p>
        <span>${state.labAttempts >= 2 ? "The recommended choices are now shown so you can learn the pattern instead of getting stuck." : "One retry unlocks stronger hints."}</span>
      `;
    }
  }

  function renderLabQuiz() {
    const lab = LABS.find((item) => item.id === state.currentLab);
    if (!lab || !state.labConfigPassed) return;
    const area = get("lab-quiz-area");

    area.innerHTML = `
      <section class="lab-quiz-card">
        <span class="section-kicker">Lab knowledge check</span>
        <h2>Can you explain what you just configured?</h2>
        <p>All three must be correct to mark this lab mastered. If you miss one, the explanation stays in the app and you can retry immediately.</p>

        <div class="lab-quiz-list">
          ${lab.quiz.map((item, index) => `
            <fieldset class="lab-quiz-question">
              <legend><span>${index + 1}</span>${item.question}</legend>
              ${shuffle(item.options).map((option) => `
                <label>
                  <input type="radio" name="lab-q-${index}" value="${option}" />
                  <span>${option}</span>
                </label>
              `).join("")}
              <div class="lab-quiz-feedback" data-lab-quiz-feedback="${index}"></div>
            </fieldset>
          `).join("")}
        </div>

        <button class="primary-button" data-lab-action="quiz-submit" type="button">
          Grade Lab Quiz →
        </button>
        <div id="lab-quiz-result" class="lab-quiz-result hide"></div>
      </section>
    `;
  }

  function submitLabQuiz() {
    const lab = LABS.find((item) => item.id === state.currentLab);
    if (!lab) return;

    const selections = lab.quiz.map((_, index) =>
      elements.labList.querySelector(`input[name="lab-q-${index}"]:checked`),
    );

    if (selections.some((input) => !input)) {
      showToast("Answer every lab quiz question first.");
      return;
    }

    let score = 0;
    lab.quiz.forEach((item, index) => {
      const selected = selections[index].value;
      const correct = selected === item.answer;
      if (correct) score += 1;

      const feedback = elements.labList.querySelector(
        `[data-lab-quiz-feedback="${index}"]`,
      );
      feedback.className = `lab-quiz-feedback ${correct ? "correct" : "wrong"}`;
      feedback.innerHTML = correct
        ? `<strong>Correct.</strong> ${item.explanation}`
        : `<strong>Review:</strong> Correct answer: ${item.answer}. ${item.explanation}`;
    });

    const percent = calculateAccuracy(score, lab.quiz.length);
    progress.labScores[lab.id] = Math.max(progress.labScores[lab.id] || 0, percent);

    const result = get("lab-quiz-result");
    result.classList.remove("hide", "wrong");

    if (score === lab.quiz.length) {
      if (!progress.completedLabs.includes(lab.id)) {
        progress.completedLabs.push(lab.id);
      }
      saveProgress();
      updateHomeProgress();
      result.innerHTML = `
        <strong>Lab mastered — ${percent}% ✓</strong>
        <p>You configured the mock resource correctly and explained the key decisions. This lab now counts toward your readiness score.</p>
        <button class="secondary-button" data-lab-action="back" type="button">Back to Labs</button>
      `;
    } else {
      saveProgress();
      result.classList.add("wrong");
      result.innerHTML = `
        <strong>${score} of ${lab.quiz.length} correct.</strong>
        <p>Review the explanations above, then retry. Lab mastery requires all answers correct so the concept is not left half-learned.</p>
        <button class="secondary-button" data-lab-action="quiz-retry" type="button">Retry Lab Quiz</button>
      `;
    }
  }

  function resetCurrentLab() {
    renderLabSimulator();
  }

  function renderWeakAreas() {
    const weakest = getWeakestTopic();
    const weakestLesson = getWeakestLesson(weakest?.topic || null);

    if (!weakest) {
      elements.weakestTopic.textContent = "Complete a practice session first";
      elements.weakestTopicNote.textContent =
        "Once you answer AZ-104 questions, this page will identify the domain and exact lesson that needs the most attention.";
      elements.practiceWeakAreaButton.disabled = true;
      delete elements.practiceWeakAreaButton.dataset.topic;
    } else {
      elements.weakestTopic.textContent = TOPIC_NAMES[weakest.topic];
      elements.weakestTopicNote.textContent = weakestLesson
        ? `Current weak subtopic: ${weakestLesson.lesson.title} (${weakestLesson.accuracy}% on ${weakestLesson.answered} question${weakestLesson.answered === 1 ? "" : "s"}).`
        : `Current accuracy: ${weakest.accuracy}%. Keep practicing this domain to expose the exact subtopic pattern.`;
      elements.practiceWeakAreaButton.disabled = false;
      elements.practiceWeakAreaButton.dataset.topic = weakest.topic;
    }

    elements.weakAreaList.innerHTML = "";

    EXAM_TOPICS.forEach((topic) => {
      const stats = progress.topicStats[topic];
      const accuracy = getTopicAccuracy(topic);
      const weakLesson = getWeakestLesson(topic);
      const card = document.createElement("article");
      card.className = "weak-area-card";
      card.innerHTML = `
        <div class="weak-area-heading">
          <div>
            <span>${TOPIC_NAMES[topic]}</span>
            <strong>${stats.answered ? `${accuracy}% accuracy` : "Not tested yet"}</strong>
          </div>
          <b>${stats.answered} answered</b>
        </div>
        <div class="weak-progress-track">
          <span style="width:${stats.answered ? accuracy : 0}%"></span>
        </div>
        <p>${
          weakLesson
            ? `Focus lesson: <strong>${weakLesson.lesson.title}</strong> · ${weakLesson.accuracy}%`
            : "Take a few questions in this domain to identify a specific weak subtopic."
        }</p>
        <button class="ghost-button weak-practice-button" data-weak-topic="${topic}" type="button">
          Practice ${TOPIC_NAMES[topic]}
        </button>
      `;
      elements.weakAreaList.appendChild(card);
    });
  }

  // Navigation
  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.screen === "labs-screen") renderLabs();
      if (button.dataset.screen === "weak-screen") renderWeakAreas();
      showScreen(button.dataset.screen);
    });
  });

  elements.brandButton.addEventListener("click", () => {
    updateHomeProgress();
    showScreen("home-screen");
  });

  elements.pathCards.forEach((card) => {
    card.addEventListener("click", () => {
      const action = card.dataset.action;
      if (action === "foundations") openStudy("foundation-hierarchy");
      if (action === "az104-study") openStudy("identity-users-groups");
      if (action === "practice") showScreen("practice-screen");
      if (action === "exam") {
        state.practiceSettings = { topic: "mixed", mode: "exam", count: 50 };
        syncPracticeButtons();
        showScreen("practice-screen");
      }
      if (action === "labs") {
        renderLabs();
        showScreen("labs-screen");
      }
      if (action === "weak") {
        renderWeakAreas();
        showScreen("weak-screen");
      }
    });
  });

  elements.continueLearningButton.addEventListener("click", () => {
    openStudy(getRecommendedLesson().id);
  });

  elements.quickPracticeButton.addEventListener("click", () => {
    state.practiceSettings = { topic: "mixed", mode: "practice", count: 10 };
    syncPracticeButtons();
    showScreen("practice-screen");
  });

  elements.previousLessonButton.addEventListener("click", () => {
    const index = STUDY_TOPICS.findIndex(
      (lesson) => lesson.id === state.currentStudyLesson,
    );
    if (index > 0) selectStudyLesson(STUDY_TOPICS[index - 1].id);
  });

  elements.lessonCheckButton.addEventListener("click", () => {
    startPractice(true, state.currentStudyLesson);
  });

  elements.practiceTopicOptions.addEventListener("click", (event) => {
    const button = event.target.closest(".selection-card");
    if (!button) return;
    state.practiceSettings.topic = button.dataset.topic;
    syncPracticeButtons();
  });

  elements.practiceModeOptions.addEventListener("click", (event) => {
    const button = event.target.closest(".mode-option");
    if (!button) return;
    state.practiceSettings.mode = button.dataset.mode;
    syncPracticeButtons();
  });

  elements.questionCountOptions.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    state.practiceSettings.count = Number(button.dataset.count);
    syncPracticeButtons();
  });

  elements.startPracticeButton.addEventListener("click", () => startPractice());

  elements.answerOptions.addEventListener("click", (event) => {
    const button = event.target.closest(".answer-button");
    if (!button || button.disabled) return;
    answerQuestion(button.dataset.answer, button);
  });

  elements.nextQuestionButton.addEventListener("click", nextQuestion);

  elements.quitQuizButton.addEventListener("click", () => {
    clearInterval(state.timerId);
    showScreen(state.fromLesson ? "study-screen" : "practice-screen");
  });

  elements.missedReviewToggle.addEventListener("click", toggleMissedReview);

  elements.practiceAgainButton.addEventListener("click", () => {
    if (state.fromLesson && state.lessonCheckId) {
      startPractice(true, state.lessonCheckId);
    } else {
      startPractice();
    }
  });

  elements.studyWeakButton.addEventListener("click", () => {
    if (state.fromLesson && state.lessonCheckId) {
      const currentIndex = STUDY_TOPICS.findIndex(
        (lesson) => lesson.id === state.lessonCheckId,
      );

      if (state.lastAccuracy >= 80 && currentIndex < STUDY_TOPICS.length - 1) {
        openStudy(STUDY_TOPICS[currentIndex + 1].id);
      } else if (state.lastAccuracy < 80) {
        openStudy(state.lessonCheckId);
      } else {
        const weakAfterCourse = getWeakestLesson();
        openStudy(weakAfterCourse?.lesson.id || getRecommendedLesson().id);
      }
      return;
    }

    const weak = getWeakestLesson();
    if (weak) openStudy(weak.lesson.id);
    else openStudy(getRecommendedLesson().id);
  });

  elements.resultsHomeButton.addEventListener("click", () => {
    updateHomeProgress();
    showScreen("home-screen");
  });

  elements.labList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lab-action]");
    if (!button) return;
    const action = button.dataset.labAction;
    if (action === "launch") launchLab(button.dataset.lab);
    if (action === "back") renderLabs();
    if (action === "validate") validateLabConfiguration();
    if (action === "reset") resetCurrentLab();
    if (action === "quiz-submit") submitLabQuiz();
    if (action === "quiz-retry") renderLabQuiz();
  });

  elements.practiceWeakAreaButton.addEventListener("click", () => {
    const topic = elements.practiceWeakAreaButton.dataset.topic;
    if (!topic) return;
    state.practiceSettings = { topic, mode: "practice", count: 10 };
    syncPracticeButtons();
    showScreen("practice-screen");
  });

  elements.weakAreaList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-weak-topic]");
    if (!button) return;
    state.practiceSettings = {
      topic: button.dataset.weakTopic,
      mode: "practice",
      count: 10,
    };
    syncPracticeButtons();
    showScreen("practice-screen");
  });

  document.addEventListener("keydown", (event) => {
    if (get("quiz-screen").classList.contains("hide")) return;
    if (!state.answered && ["1", "2", "3", "4"].includes(event.key)) {
      const button = elements.answerOptions.querySelectorAll(".answer-button")[
        Number(event.key) - 1
      ];
      if (button && !button.disabled) button.click();
    }
    if (
      state.answered &&
      event.key === "Enter" &&
      !elements.nextQuestionButton.disabled
    ) {
      elements.nextQuestionButton.click();
    }
  });

  updateHomeProgress();
  renderStudyTopicList();
  renderLesson();
  syncPracticeButtons();
  renderLabs();
  renderWeakAreas();
  showScreen("home-screen");

  console.log(
    `CloudAdmin Prep v2.0 initialized: ${STUDY_TOPICS.length} lessons, ${QUESTION_BANK.length} questions, ${LABS.length} simulator labs.`,
  );
});
